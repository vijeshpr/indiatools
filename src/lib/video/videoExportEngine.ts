/**
 * In-browser client-side video export engine using MediaRecorder & Canvas.captureStream
 */

export interface ExportRecordingOptions {
  canvas: HTMLCanvasElement
  audioDestination: MediaStreamAudioDestinationNode
  fps?: number
  bitrate?: number // e.g. 6000000 for 6 Mbps
  onStart?: () => void
  onProgress?: (elapsedSec: number, percent?: number) => void
  onComplete?: (blob: Blob, fileExtension: string, mimeType: string) => void
  onError?: (error: Error) => void
}

/**
 * Detect the best video recording MIME type supported by this browser
 */
export function getSupportedVideoMimeType(): { mimeType: string; extension: string } {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', extension: 'webm' }
  }

  const preferredFormats = [
    { mime: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
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

  constructor(options: ExportRecordingOptions) {
    this.options = options
    this.detectedFormat = getSupportedVideoMimeType()
  }

  public start() {
    try {
      this.chunks = []
      const { canvas, audioDestination, fps = 60, bitrate = 6_000_000 } = this.options

      // 1. Capture stream from Canvas
      let canvasStream: MediaStream
      if (typeof (canvas as any).captureStream === 'function') {
        canvasStream = (canvas as any).captureStream(fps)
      } else {
        throw new Error('Canvas video capture is not supported in this browser.')
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

      // 3. Initialize MediaRecorder with high bitrate for crisp visuals
      const recorderOptions: MediaRecorderOptions = {
        mimeType: this.detectedFormat.mimeType,
        videoBitsPerSecond: bitrate,
        audioBitsPerSecond: 192_000,
      }

      try {
        this.recorder = new MediaRecorder(this.combinedStream, recorderOptions)
      } catch (e) {
        // Fallback without bitrate hints
        this.recorder = new MediaRecorder(this.combinedStream)
      }

      this.recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data)
        }
      }

      this.recorder.onstop = () => {
        this.isRecordingActive = false
        const blob = new Blob(this.chunks, { type: this.detectedFormat.mimeType })
        this.options.onComplete?.(blob, this.detectedFormat.extension, this.detectedFormat.mimeType)
        this.cleanup()
      }

      this.recorder.onerror = (event: any) => {
        this.isRecordingActive = false
        this.options.onError?.(new Error(event?.error?.message || 'Video recording failed.'))
        this.cleanup()
      }

      // Request data chunks every 1000ms
      this.recorder.start(1000)
      this.isRecordingActive = true
      this.options.onStart?.()
    } catch (err: any) {
      this.isRecordingActive = false
      this.options.onError?.(err)
      this.cleanup()
    }
  }

  public stop() {
    if (this.recorder && this.recorder.state !== 'inactive') {
      try {
        this.recorder.stop()
      } catch (err) {
        // ignore
      }
    }
    this.isRecordingActive = false
  }

  public isRecording(): boolean {
    return this.isRecordingActive
  }

  private cleanup() {
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
  }, 2000)
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
