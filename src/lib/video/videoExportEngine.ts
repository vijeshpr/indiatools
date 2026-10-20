/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Enterprise In-Browser Client-Side Video Export Engine
 * Canvas.captureStream + Web Audio MediaStream Routing + MediaRecorder.
 *
 * Implements:
 * - Triple-Guard completion: Audio completion, Wall-clock watchdog, Safe MediaRecorder finalization
 * - Deterministic state machine (idle -> recording -> finalizing -> completed / error / cancelled)
 * - Honest progress calculation & formatted telemetry (no 99.5% hang)
 * - Actual render-tick frame tracking
 * - Background tab rendering support & resource cleanup
 */

export type ExportState = 'idle' | 'recording' | 'finalizing' | 'completed' | 'error' | 'cancelled'

export interface ExportProgressInfo {
  state: ExportState
  percent: number // 0 - 100 clamped integer
  elapsedSec: number
  remainingSec: number
  currentFrame: number
  totalFrames: number
  fps: number
  phaseText: string
  audioCurrentTime: number
  duration: number
}

export interface ExportResultInfo {
  blob: Blob
  fileExtension: string
  mimeType: string
  fileSizeBytes: number
  formattedSize: string
  durationSec: number
  totalFrames: number
  fps: number
}

export interface ExportRecordingOptions {
  canvas: HTMLCanvasElement
  audioDestination: MediaStreamAudioDestinationNode
  fps?: number
  bitrate?: number // e.g. 7000000 for 7 Mbps
  duration?: number // total duration in seconds
  trimStart?: number
  trimEnd?: number
  onStart?: () => void
  onProgress?: (progress: ExportProgressInfo) => void
  onComplete?: (result: ExportResultInfo) => void
  onError?: (error: Error) => void
}

/**
 * Detect the best video recording MIME type supported by this browser.
 * Checks native MP4 first (Safari / Chromium modern builds), falls back to WebM VP9/VP8.
 */
export function getSupportedVideoMimeType(): { mimeType: string; extension: string; label: string } {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', extension: 'webm', label: 'WebM' }
  }

  // Prioritize formats with guaranteed audio track encoding (Opus / AAC).
  // Note: Never use video/mp4;codecs=avc1 without an audio codec, as Chromium drops the audio track!
  const preferredFormats = [
    // 1. WebM with Opus: Universally supported across Chromium (Chrome, Edge, Brave, Opera) & Firefox with full audio
    { mime: 'video/webm;codecs=vp9,opus', ext: 'webm', label: 'WebM (VP9 / Opus)' },
    { mime: 'video/webm;codecs=vp8,opus', ext: 'webm', label: 'WebM (VP8 / Opus)' },
    { mime: 'video/webm', ext: 'webm', label: 'WebM' },
    // 2. MP4 with AAC: Native Apple Safari (macOS / iOS)
    { mime: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4', label: 'MP4 (H.264 / AAC)' },
    { mime: 'video/mp4;codecs=avc1,opus', ext: 'mp4', label: 'MP4 (H.264 / Opus)' },
    { mime: 'video/mp4', ext: 'mp4', label: 'MP4' },
  ]

  for (const fmt of preferredFormats) {
    if (MediaRecorder.isTypeSupported(fmt.mime)) {
      return { mimeType: fmt.mime, extension: fmt.ext, label: fmt.label }
    }
  }

  return { mimeType: 'video/webm', extension: 'webm', label: 'WebM' }
}

/**
 * Format bytes into human readable string (e.g. 12.45 MB)
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  if (i <= 0) return `${Math.round(bytes)} B`
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
  return `${val} ${sizes[i]}`
}

/**
 * Reusable time formatter converting finite, non-negative seconds into MM:SS.
 * For durations exceeding one hour, uses HH:MM:SS.
 */
export function formatDurationDisplay(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  const totalSec = Math.floor(seconds)
  const hrs = Math.floor(totalSec / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format duration in seconds to "M:SS" or "MM:SS" (backward compatibility with existing suites)
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

/**
 * Trigger browser file download from Blob with pop-up detection and safe cleanup
 */
export function downloadBlob(blob: Blob, fileName: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a)
      }
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // ignore
        }
      }, 15000)
    }, 1000)
    return true
  } catch (err) {
    console.error('downloadBlob failed:', err)
    return false
  }
}

/**
 * High-reliability browser video recorder session with Triple Guard finalization
 */
export class VideoRecorderSession {
  private recorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private options: ExportRecordingOptions
  private detectedFormat: { mimeType: string; extension: string; label: string }
  private combinedStream: MediaStream | null = null
  private state: ExportState = 'idle'
  private startTime = 0
  private progressTimer: any = null
  private watchdogTimer: any = null
  private finalizationTimeout: any = null
  private renderedFrames = 0
  private lastAudioTime = 0
  private isFinalized = false

  constructor(options: ExportRecordingOptions) {
    this.options = options
    this.detectedFormat = getSupportedVideoMimeType()
  }

  public start() {
    if (this.state === 'recording' || this.state === 'finalizing') return

    try {
      this.chunks = []
      this.state = 'recording'
      this.isFinalized = false
      this.renderedFrames = 0
      this.lastAudioTime = this.options.trimStart || 0

      const {
        canvas,
        audioDestination,
        fps = 60,
        bitrate = 7_000_000,
        duration = 15,
        trimStart = 0,
        trimEnd = duration,
      } = this.options

      const exportDuration = Math.max(0.5, duration)
      const totalFrames = Math.max(1, Math.round(exportDuration * fps))

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
      const audioTracks = audioDestination.stream.getAudioTracks()
      const tracks: MediaStreamTrack[] = [videoTrack]
      if (audioTracks.length > 0) {
        for (const track of audioTracks) {
          track.enabled = true
          tracks.push(track)
        }
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
        if (this.finalizationTimeout) {
          clearTimeout(this.finalizationTimeout)
          this.finalizationTimeout = null
        }

        if (this.state === 'cancelled') {
          this.cleanup()
          return
        }

        const validChunks = this.chunks.filter((c) => c && c.size > 0)
        if (validChunks.length === 0) {
          this.state = 'error'
          this.cleanup()
          this.options.onError?.(
            new Error(
              'Recorded video file was empty (0 bytes). Please ensure audio playback is active and canvas has rendered frames.'
            )
          )
          return
        }

        const blob = new Blob(validChunks, { type: this.detectedFormat.mimeType })
        if (blob.size === 0) {
          this.state = 'error'
          this.cleanup()
          this.options.onError?.(new Error('Exported video container could not be assembled.'))
          return
        }

        this.state = 'completed'
        const formatted = formatBytes(blob.size)

        this.options.onProgress?.({
          state: 'completed',
          percent: 100,
          elapsedSec: (performance.now() - this.startTime) / 1000,
          remainingSec: 0,
          currentFrame: totalFrames,
          totalFrames,
          fps,
          phaseText: 'Export Complete!',
          audioCurrentTime: trimEnd,
          duration: exportDuration,
        })

        this.options.onComplete?.({
          blob,
          fileExtension: this.detectedFormat.extension,
          mimeType: this.detectedFormat.mimeType,
          fileSizeBytes: blob.size,
          formattedSize: formatted,
          durationSec: exportDuration,
          totalFrames: this.renderedFrames || totalFrames,
          fps,
        })

        this.cleanup()
      }

      this.recorder.onerror = (event: any) => {
        this.state = 'error'
        this.options.onError?.(new Error(event?.error?.message || 'Video recording pipeline encountered an error.'))
        this.cleanup()
      }

      // Request data slice every 500ms
      this.recorder.start(500)
      this.startTime = performance.now()
      this.options.onStart?.()

      // GUARD B: Wall-clock watchdog (+1500ms buffer)
      const watchdogMs = Math.round((exportDuration + 1.5) * 1000)
      this.watchdogTimer = setTimeout(() => {
        if (this.state !== 'recording') return

        const hasSomeMedia = this.chunks.length > 0 || this.renderedFrames > 5
        if (!hasSomeMedia) {
          this.state = 'error'
          this.cleanup()
          this.options.onError?.(
            new Error('Watchdog timeout: export stalled before video or audio frames could be recorded.')
          )
        } else {
          this.finishExport('watchdog-timeout')
        }
      }, watchdogMs)

      // Start Telemetry progress loop (runs every 100ms)
      this.progressTimer = setInterval(() => {
        if (this.state !== 'recording') return

        const elapsedSec = (performance.now() - this.startTime) / 1000
        const audioPos = Math.max(trimStart, this.lastAudioTime)
        const audioElapsed = Math.max(0, audioPos - trimStart)

        // Honest progress calculation from actual audio position
        const rawPercent = (audioElapsed / exportDuration) * 100
        const clampedPercent = Math.max(0, Math.min(99, Math.floor(rawPercent)))
        const estRemaining = Math.max(0, Math.ceil(trimEnd - audioPos))
        const currentFrame = Math.min(totalFrames, this.renderedFrames || Math.round(audioElapsed * fps))

        this.options.onProgress?.({
          state: 'recording',
          percent: clampedPercent,
          elapsedSec,
          remainingSec: estRemaining,
          currentFrame,
          totalFrames,
          fps,
          phaseText: `Recording Audio & Video (${formatDurationDisplay(audioElapsed)} / ${formatDurationDisplay(exportDuration)})`,
          audioCurrentTime: audioPos,
          duration: exportDuration,
        })
      }, 100)
    } catch (err: any) {
      this.state = 'error'
      this.options.onError?.(err)
      this.cleanup()
    }
  }

  /**
   * Idempotent completion function implementing Guard A, Guard B, and Guard C.
   */
  public finishExport(reason: string = 'normal') {
    if (this.isFinalized || this.state !== 'recording') {
      return
    }

    this.isFinalized = true
    this.state = 'finalizing'

    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer)
      this.watchdogTimer = null
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }

    const { fps = 60, duration = 15, trimStart = 0, trimEnd = duration } = this.options
    const exportDuration = Math.max(0.5, duration)
    const totalFrames = Math.max(1, Math.round(exportDuration * fps))

    // Telemetry: enter finalization phase
    this.options.onProgress?.({
      state: 'finalizing',
      percent: 99,
      elapsedSec: (performance.now() - this.startTime) / 1000,
      remainingSec: 0,
      currentFrame: this.renderedFrames || totalFrames,
      totalFrames,
      fps,
      phaseText: 'Finalizing & Packaging Video Container...',
      audioCurrentTime: trimEnd,
      duration: exportDuration,
    })

    // GUARD C: Safe MediaRecorder finalization
    if (this.recorder && this.recorder.state === 'recording') {
      try {
        if (typeof this.recorder.requestData === 'function') {
          this.recorder.requestData()
        }
      } catch {
        // requestData may fail in some internal states
      }

      try {
        this.recorder.stop()
      } catch {
        // recorder stop error
      }

      // Safety finalization timeout in case onstop does not fire
      this.finalizationTimeout = setTimeout(() => {
        if (this.state === 'finalizing') {
          const validChunks = this.chunks.filter((c) => c && c.size > 0)
          if (validChunks.length > 0) {
            const blob = new Blob(validChunks, { type: this.detectedFormat.mimeType })
            this.state = 'completed'
            this.options.onComplete?.({
              blob,
              fileExtension: this.detectedFormat.extension,
              mimeType: this.detectedFormat.mimeType,
              fileSizeBytes: blob.size,
              formattedSize: formatBytes(blob.size),
              durationSec: exportDuration,
              totalFrames: this.renderedFrames || totalFrames,
              fps,
            })
          } else {
            this.state = 'error'
            this.options.onError?.(new Error('Export timed out waiting for media container to finalize.'))
          }
          this.cleanup()
        }
      }, 3500)
    } else {
      // Recorder already stopped or uninitialized
      if (this.chunks.length > 0) {
        const blob = new Blob(this.chunks, { type: this.detectedFormat.mimeType })
        this.state = 'completed'
        this.options.onComplete?.({
          blob,
          fileExtension: this.detectedFormat.extension,
          mimeType: this.detectedFormat.mimeType,
          fileSizeBytes: blob.size,
          formattedSize: formatBytes(blob.size),
          durationSec: exportDuration,
          totalFrames: this.renderedFrames || totalFrames,
          fps,
        })
      } else {
        this.state = 'error'
        this.options.onError?.(new Error('Recorder inactive with no data.'))
      }
      this.cleanup()
    }
  }

  /**
   * Notify session of an actual render tick on the canvas
   */
  public notifyFrameRendered() {
    if (this.state === 'recording') {
      this.renderedFrames++
    }
  }

  /**
   * Update audio playback position and trigger Guard A if target time is reached
   */
  public updateAudioPosition(currentAudioTime: number) {
    if (this.state !== 'recording') return
    this.lastAudioTime = currentAudioTime

    const targetEndTime = this.options.trimEnd ?? this.options.duration ?? 15
    // GUARD A: Audio completion (non-strict float check)
    if (currentAudioTime >= targetEndTime - 0.08) {
      this.finishExport('audio-boundary-reached')
    }
  }

  public stop() {
    this.finishExport('manual-stop')
  }

  public cancel() {
    this.state = 'cancelled'
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer)
      this.watchdogTimer = null
    }
    if (this.finalizationTimeout) {
      clearTimeout(this.finalizationTimeout)
      this.finalizationTimeout = null
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }

    if (this.recorder && this.recorder.state !== 'inactive') {
      try {
        this.recorder.stop()
      } catch {
        // ignore
      }
    }

    this.chunks = []
    this.cleanup()
  }

  public getState(): ExportState {
    return this.state
  }

  public isRecording(): boolean {
    return this.state === 'recording'
  }

  public isFinalizing(): boolean {
    return this.state === 'finalizing'
  }

  private cleanup() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer)
      this.watchdogTimer = null
    }
    if (this.finalizationTimeout) {
      clearTimeout(this.finalizationTimeout)
      this.finalizationTimeout = null
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach((t) => {
        try {
          t.stop()
        } catch {
          // ignore
        }
      })
      this.combinedStream = null
    }
    this.recorder = null
  }
}
