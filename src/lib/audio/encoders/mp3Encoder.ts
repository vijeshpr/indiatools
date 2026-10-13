import { Mp3Encoder } from '@breezystack/lamejs'

export interface Mp3EncodeOptions {
  kbps?: number
  onProgress?: (percent: number) => void
  isCancelled?: () => boolean
}

export async function encodeAudioBufferToMp3(
  audioBuffer: AudioBuffer,
  options?: Mp3EncodeOptions
): Promise<Blob> {
  const numChannels = Math.min(2, Math.max(1, audioBuffer.numberOfChannels))
  const sampleRate = audioBuffer.sampleRate
  const kbps = options?.kbps || 192

  const encoder = new Mp3Encoder(numChannels, sampleRate, kbps)
  const mp3DataChunks: Uint8Array[] = []

  const length = audioBuffer.length
  const leftFloat = audioBuffer.getChannelData(0)
  const rightFloat = numChannels > 1 ? audioBuffer.getChannelData(1) : null

  // Standard MPEG Layer 3 processing block size
  const blockSize = 1152
  const step = blockSize * 4 // 4608 samples per batch
  let cursor = 0

  while (cursor < length) {
    if (options?.isCancelled?.()) {
      throw new Error('Conversion cancelled by user.')
    }

    const currentBlockSize = Math.min(step, length - cursor)
    const leftInt16 = new Int16Array(currentBlockSize)
    const rightInt16 = numChannels > 1 ? new Int16Array(currentBlockSize) : undefined

    for (let i = 0; i < currentBlockSize; i++) {
      const idx = cursor + i
      const l = Math.max(-1, Math.min(1, leftFloat[idx]))
      leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7fff

      if (rightFloat && rightInt16) {
        const r = Math.max(-1, Math.min(1, rightFloat[idx]))
        rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7fff
      }
    }

    const mp3buf = encoder.encodeBuffer(leftInt16, rightInt16)
    if (mp3buf.length > 0) {
      mp3DataChunks.push(new Uint8Array(mp3buf))
    }

    cursor += currentBlockSize

    if (options?.onProgress) {
      const pct = Math.round((cursor / length) * 100)
      options.onProgress(pct)
    }

    // Yield execution to prevent UI freezing
    if (cursor < length && cursor % (step * 8) === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  // Flush remaining encoded buffer
  const finalMp3buf = encoder.flush()
  if (finalMp3buf.length > 0) {
    mp3DataChunks.push(new Uint8Array(finalMp3buf))
  }

  return new Blob(mp3DataChunks as BlobPart[], { type: 'audio/mp3' })
}
