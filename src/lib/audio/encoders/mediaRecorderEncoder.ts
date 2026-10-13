/**
 * Browser-native MediaRecorder encoder for WebM (Opus), OGG, and AAC (MP4)
 */

export interface MediaRecorderEncodeOptions {
  mimeType: string
  bitrate?: number
  onProgress?: (percent: number) => void
  isCancelled?: () => boolean
}

export async function encodeAudioBufferWithMediaRecorder(
  audioBuffer: AudioBuffer,
  options: MediaRecorderEncodeOptions
): Promise<Blob> {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder is not supported in this browser environment.')
  }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    throw new Error(`The format "${options.mimeType}" is not supported by your browser's encoder.`)
  }

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: audioBuffer.sampleRate,
  })

  try {
    const destination = audioCtx.createMediaStreamDestination()
    const sourceNode = audioCtx.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.connect(destination)

    const recorderOptions: MediaRecorderOptions = {
      mimeType: options.mimeType,
    }
    if (options.bitrate) {
      recorderOptions.audioBitsPerSecond = options.bitrate * 1000
    }

    const recorder = new MediaRecorder(destination.stream, recorderOptions)
    const recordedChunks: Blob[] = []

    return await new Promise<Blob>((resolve, reject) => {
      let progressTimer: any = null
      const startTime = Date.now()
      const totalDurationMs = audioBuffer.duration * 1000

      const cleanup = () => {
        if (progressTimer) clearInterval(progressTimer)
        try {
          audioCtx.close()
        } catch {
          // ignore
        }
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        cleanup()
        if (options.isCancelled?.()) {
          reject(new Error('Conversion cancelled by user.'))
          return
        }
        const finalBlob = new Blob(recordedChunks, { type: options.mimeType })
        resolve(finalBlob)
      }

      recorder.onerror = (e) => {
        cleanup()
        reject(e)
      }

      progressTimer = setInterval(() => {
        if (options.isCancelled?.()) {
          cleanup()
          recorder.stop()
          reject(new Error('Conversion cancelled by user.'))
          return
        }
        const elapsed = Date.now() - startTime
        const pct = Math.min(99, Math.round((elapsed / totalDurationMs) * 100))
        options.onProgress?.(pct)
      }, 250)

      sourceNode.onended = () => {
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop()
          }
        }, 100)
      }

      recorder.start(100)
      sourceNode.start(0)
    })
  } catch (err) {
    try {
      audioCtx.close()
    } catch {
      // ignore
    }
    throw err
  }
}
