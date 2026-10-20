/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Enterprise In-Browser Client-Side Video Export Engine
 * Canvas.captureStream + Web Audio MediaStream Routing + MediaRecorder.
 */

export interface ExportProgressInfo {
  percent: number // 0 - 100
  elapsedSec: number
  remainingSec: number
  currentFrame: number
  totalFrames: number
}

export interface ExportRecordingOptions {
  canvas: HTMLCanvasElement
  audioDestination: MediaStreamAudioDestinationNode
  fps?: number
  bitrate?: number // e.g. 6000000 for 6 Mbps
  duration?: number // total duration in seconds
  onStart?: () => void
  onProgress?: (progress: ExportProgressInfo) => void
  onComplete?: (blob: Blob, fileExtension: string, mimeType: string) => void
  onError?: (error: Error) => void
}

/**
 * Detect the best video recording MIME type supported by this browser.
 * Checks native MP4 first (Safari / Chromium modern builds), falls back to WebM VP9/VP8.
 */
export function getSupportedVideoMimeType(): { mimeType: string; extension: string } {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', extension: 'webm' }
  }

  const preferredFormats = [
    { mime: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
  ]

  for (const fmt of preferredFormats) {
    if (MediaRecorder.isTypeSupported(fmt.mime)) {
      return { mimeType: fmt.mime, extension: fmt.ext }
    }
  }

  return { mimeType: 'video/webm', extension: 'webm' }
}

export class VideoRecorderSession {
  private recorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private options: ExportRecordingOptions
  private detectedFormat: { mimeType: string; extension: string }
  private combinedStream: MediaStream | null = null
  private isRecordingActive = false
  private startTime = 0
  private progressTimer: any = null
  private isCancelled = false

  constructor(options: ExportRecordingOptions) {
    this.options = options
    this.detectedFormat = getSupportedVideoMimeType()
  }

  public start() {
    try {
      this.chunks = []
      this.isCancelled = false
      const { canvas, audioDestination, fps = 60, bitrate = 6_000_000, duration = 15 } = this.options

      // 1. Capture stream from Canvas
      let canvasStream: MediaStream
      if (typeof (canvas as any).captureStream === 'function') {
        canvasStream = (canvas as any).captureStream(fps)
      } else {
        throw new Error('Canvas video capture (captureStream) is not supported in this browser.')
      }

      const videoTrack = canvasStream.getVideoTracks()[0]
      if (!videoTrack) {
        throw new Error('Could not initialize Canvas video track.')
      }

      // 2. Combine Canvas video track + Web Audio destination audio track
      const audioTrack = audioDestination.stream.getAudioTracks()[0]
      const tracks: MediaStreamTrack[] = [videoTrack]
      if (audioTrack) {
        tracks.push(audioTrack)
      }

      this.combinedStream = new MediaStream(tracks)

      // 3. Initialize MediaRecorder with high bitrate for crisp 1080p output
      const recorderOptions: MediaRecorderOptions = {
        mimeType: this.detectedFormat.mimeType,
        videoBitsPerSecond: bitrate,
        audioBitsPerSecond: 192_000,
      }

      try {
        this.recorder = new MediaRecorder(this.combinedStream, recorderOptions)
      } catch {
        // Fallback without bitrate hints
        this.recorder = new MediaRecorder(this.combinedStream)
      }

      this.recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data)
        }
      }

      this.recorder.onstop = () => {
        this.stopProgressTracking()
        this.isRecordingActive = false

        if (this.isCancelled) {
          this.cleanup()
          return
        }

        const blob = new Blob(this.chunks, { type: this.detectedFormat.mimeType })
        this.options.onComplete?.(blob, this.detectedFormat.extension, this.detectedFormat.mimeType)
        this.cleanup()
      }

      this.recorder.onerror = (event: any) => {
        this.stopProgressTracking()
        this.isRecordingActive = false
        this.options.onError?.(new Error(event?.error?.message || 'Video recording failed.'))
        this.cleanup()
      }

      // Request data slice every 500ms
      this.recorder.start(500)
      this.isRecordingActive = true
      this.startTime = performance.now()
      this.options.onStart?.()

      // Start progress tracking loop
      const totalFrames = Math.max(1, Math.round(duration * fps))
      this.progressTimer = setInterval(() => {
        if (!this.isRecordingActive || this.isCancelled) return

        const elapsedMs = performance.now() - this.startTime
        const elapsedSec = elapsedMs / 1000
        const percent = Math.min(99.5, (elapsedSec / Math.max(0.1, duration)) * 100)
        const currentFrame = Math.min(totalFrames, Math.round(elapsedSec * fps))
        const remainingSec = Math.max(0, duration - elapsedSec)

        this.options.onProgress?.({
          percent,
          elapsedSec,
          remainingSec,
          currentFrame,
          totalFrames,
        })
      }, 100)
    } catch (err: any) {
      this.isRecordingActive = false
      this.options.onError?.(err)
      this.cleanup()
    }
  }

  public stop() {
    this.stopProgressTracking()
    if (this.recorder && this.recorder.state !== 'inactive') {
      try {
        this.recorder.stop()
      } catch {
        // ignore
      }
    }
    this.isRecordingActive = false
  }

  public cancel() {
    this.isCancelled = true
    this.stop()
    this.chunks = []
    this.cleanup()
  }

  public isRecording(): boolean {
    return this.isRecordingActive
  }

  private stopProgressTracking() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
  }

  private cleanup() {
    this.stopProgressTracking()
    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach((t) => t.stop())
      this.combinedStream = null
    }
    this.recorder = null
  }
}

/**
 * Trigger browser file download from Blob
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 2500)
}

/**
 * Format duration in seconds to "MM:SS"
 */
export function formatTimeDisplay(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format time to video timecode "MM:SS:FF"
 */
export function formatTimecode(seconds: number, fps = 30): string {
  if (isNaN(seconds) || seconds < 0) return '00:00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * fps)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
}
