/**
 * Pure client-side 16-bit Linear PCM RIFF WAV encoder
 * Zero external dependencies, async chunked execution for zero UI freezing
 */

export interface WavEncodeOptions {
  onProgress?: (percent: number) => void
  isCancelled?: () => boolean
}

export async function encodeAudioBufferToWav(
  audioBuffer: AudioBuffer,
  options?: WavEncodeOptions
): Promise<Blob> {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const numSamples = audioBuffer.length

  const bytesPerSample = 2 // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numSamples * blockAlign
  const headerSize = 44
  const totalSize = headerSize + dataSize

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  // Write RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')

  // Write fmt sub-chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true) // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true) // BitsPerSample (16-bit)

  // Write data sub-chunk header
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Retrieve channel data buffers
  const channelsData: Float32Array[] = []
  for (let ch = 0; ch < numChannels; ch++) {
    channelsData.push(audioBuffer.getChannelData(ch))
  }

  // Interleave and write 16-bit PCM samples
  let offset = 44
  const chunkSize = 16384 // Process in batches to yield execution
  let sampleIndex = 0

  while (sampleIndex < numSamples) {
    if (options?.isCancelled?.()) {
      throw new Error('Conversion cancelled by user.')
    }

    const end = Math.min(sampleIndex + chunkSize, numSamples)

    for (let i = sampleIndex; i < end; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        // Clamp sample to [-1, 1] range and quantize to 16-bit int
        const s = Math.max(-1, Math.min(1, channelsData[ch][i]))
        const int16 = s < 0 ? s * 0x8000 : s * 0x7fff
        view.setInt16(offset, int16, true)
        offset += 2
      }
    }

    sampleIndex = end

    if (options?.onProgress) {
      const pct = Math.round((sampleIndex / numSamples) * 100)
      options.onProgress(pct)
    }

    // Yield control to event loop to keep UI responsive
    if (sampleIndex < numSamples && sampleIndex % (chunkSize * 4) === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
