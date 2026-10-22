/**
 * IndiaTools — Hybrid Video Studio Media Asset Manager
 * 100% Client-Side Asset Probing, Waveform Extraction, and Object URL Lifecycle
 */

import type { MediaAsset, MediaType } from './types.ts'

export async function probeMediaFile(file: File): Promise<MediaAsset> {
  const url = URL.createObjectURL(file)
  const mime = file.type.toLowerCase()
  const id = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  if (mime.startsWith('image/')) {
    return probeImageFile(id, file, url)
  } else if (mime.startsWith('video/')) {
    return probeVideoFile(id, file, url)
  } else if (mime.startsWith('audio/')) {
    return probeAudioFile(id, file, url)
  }

  // Fallback guess from file extension
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
    return probeImageFile(id, file, url)
  }
  if (['mp4', 'webm', 'mov', 'm4v', 'mkv'].includes(ext)) {
    return probeVideoFile(id, file, url)
  }
  if (['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac'].includes(ext)) {
    return probeAudioFile(id, file, url)
  }

  throw new Error(`Unsupported media format: ${file.name} (${file.type || 'unknown type'})`)
}

async function probeImageFile(id: string, file: File, url: string): Promise<MediaAsset> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Create lightweight thumbnail
      const canvas = document.createElement('canvas')
      const thumbMax = 160
      const scale = Math.min(thumbMax / img.naturalWidth, thumbMax / img.naturalHeight, 1)
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      const thumbUrl = canvas.toDataURL('image/jpeg', 0.7)

      resolve({
        id,
        name: file.name,
        type: 'image',
        url,
        file,
        durationSec: 5.0, // standard default 5s for still images
        naturalWidth: img.naturalWidth || 1920,
        naturalHeight: img.naturalHeight || 1080,
        thumbnailUrl: thumbUrl,
        sizeBytes: file.size,
        mimeType: file.type || 'image/jpeg',
        createdAt: Date.now(),
      })
    }
    img.onerror = () => reject(new Error(`Failed to decode image file: ${file.name}`))
    img.src = url
  })
}

async function probeVideoFile(id: string, file: File, url: string): Promise<MediaAsset> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    let resolved = false
    const timeout = setTimeout(() => {
      if (!resolved) {
        reject(new Error(`Timeout probing video file: ${file.name}`))
      }
    }, 15000)

    video.onloadedmetadata = () => {
      // Seek to 0.5s or 10% into video for representative thumbnail
      const seekTarget = Math.min(0.5, video.duration * 0.1)
      video.currentTime = seekTarget
    }

    video.onseeked = () => {
      if (resolved) return
      resolved = true
      clearTimeout(timeout)

      let thumbUrl = ''
      try {
        const canvas = document.createElement('canvas')
        const thumbMax = 160
        const scale = Math.min(thumbMax / (video.videoWidth || 160), thumbMax / (video.videoHeight || 90), 1)
        canvas.width = Math.max(1, Math.round((video.videoWidth || 160) * scale))
        canvas.height = Math.max(1, Math.round((video.videoHeight || 90) * scale))
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          thumbUrl = canvas.toDataURL('image/jpeg', 0.7)
        }
      } catch {
        // Ignore canvas CORS or security issues on thumbnail
      }

      resolve({
        id,
        name: file.name,
        type: 'video',
        url,
        file,
        durationSec: Math.max(0.1, video.duration || 5.0),
        naturalWidth: video.videoWidth || 1920,
        naturalHeight: video.videoHeight || 1080,
        thumbnailUrl: thumbUrl,
        sizeBytes: file.size,
        mimeType: file.type || 'video/mp4',
        createdAt: Date.now(),
      })
    }

    video.onerror = () => {
      clearTimeout(timeout)
      reject(new Error(`Browser cannot decode video file: ${file.name}. It may use an unsupported codec.`))
    }

    video.src = url
  })
}

async function probeAudioFile(id: string, file: File, url: string): Promise<MediaAsset> {
  return new Promise(async (resolve, reject) => {
    try {
      const audio = new Audio()
      audio.preload = 'metadata'

      audio.onloadedmetadata = async () => {
        const durationSec = Math.max(0.1, audio.duration || 5.0)

        // Generate audio waveform points using offline Web Audio API
        let waveformPoints: number[] = []
        try {
          const arrayBuffer = await file.arrayBuffer()
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          if (AudioContextClass) {
            const ctx = new AudioContextClass()
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
            ctx.close()

            const rawData = audioBuffer.getChannelData(0)
            const sampleCount = 48
            const blockSize = Math.floor(rawData.length / sampleCount)
            for (let i = 0; i < sampleCount; i++) {
              let sum = 0
              for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(rawData[i * blockSize + j])
              }
              waveformPoints.push(Math.min(1, (sum / blockSize) * 2.5))
            }
          }
        } catch {
          // If decoding fails, fallback to gentle pseudo waveform
          waveformPoints = Array.from({ length: 48 }, (_, i) => 0.2 + 0.3 * Math.sin(i * 0.4) ** 2)
        }

        resolve({
          id,
          name: file.name,
          type: 'audio',
          url,
          file,
          durationSec,
          naturalWidth: 0,
          naturalHeight: 0,
          waveformPoints,
          sizeBytes: file.size,
          mimeType: file.type || 'audio/mp3',
          createdAt: Date.now(),
        })
      }

      audio.onerror = () => reject(new Error(`Failed to load audio file: ${file.name}`))
      audio.src = url
    } catch (err) {
      reject(err)
    }
  })
}

export function revokeAssetUrls(assets: MediaAsset[]): void {
  for (const asset of assets) {
    if (asset.url && asset.url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(asset.url)
      } catch {
        // Ignore
      }
    }
  }
}
