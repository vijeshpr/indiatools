/**
 * Multi-Channel Linear PCM RIFF / WAVEFORMATEXTENSIBLE WAV Encoder
 * Supports 1 to 8 discrete channels (Stereo, 5.1 Surround, 7.1 Surround)
 * Supports 16-bit and 24-bit PCM depth with sample interleaving
 * Async chunked execution with cancelation and progress reporting
 */

export interface MultiChannelWavOptions {
  bitDepth?: 16 | 24
  channelMask?: number
  onProgress?: (percent: number) => void
  isCancelled?: () => boolean
}

// Standard Microsoft Speaker Channel Mask Flags
export const SPEAKER_MASKS = {
  STEREO: 0x0003, // FL | FR
  SURROUND_5_1: 0x003f, // FL | FR | FC | LFE | BL | BR (or SL | SR)
  SURROUND_7_1: 0x063f, // FL | FR | FC | LFE | BL | BR | SL | SR
}

/**
 * Encode multiple Float32Array channel streams into a multi-channel WAV Blob
 */
export async function encodeMultiChannelWav(
  channels: Float32Array[],
  sampleRate: number,
  options?: MultiChannelWavOptions
): Promise<Blob> {
  const numChannels = channels.length
  if (numChannels === 0) {
    throw new Error('At least one channel is required for WAV encoding.')
  }

  const numSamples = channels[0].length
  const bitDepth = options?.bitDepth === 24 ? 24 : 16
  const bytesPerSample = bitDepth === 24 ? 3 : 2
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numSamples * blockAlign

  // When channels > 2 or 24-bit, standard practice is WAVEFORMATEXTENSIBLE header (size 40 bytes)
  const isExtensible = numChannels > 2 || bitDepth === 24
  const fmtChunkSize = isExtensible ? 40 : 16
  const headerSize = 12 + (8 + fmtChunkSize) + 8 // RIFF(12) + fmt(8 + size) + data(8)
  const totalSize = headerSize + dataSize

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  // 1. Write RIFF chunk descriptor
  writeString(view, 0, 'RIFF')
  view.setUint32(4, totalSize - 8, true)
  writeString(view, 8, 'WAVE')

  // 2. Write fmt sub-chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, fmtChunkSize, true)

  if (isExtensible) {
    // WAVE_FORMAT_EXTENSIBLE = 0xFFFE
    view.setUint16(20, 0xfffe, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)

    // Extensible extension (cbSize = 22)
    view.setUint16(36, 22, true) // cbSize
    view.setUint16(38, bitDepth, true) // ValidBitsPerSample

    // Channel mask
    let channelMask = options?.channelMask
    if (!channelMask) {
      if (numChannels === 6) channelMask = SPEAKER_MASKS.SURROUND_5_1
      else if (numChannels === 8) channelMask = SPEAKER_MASKS.SURROUND_7_1
      else if (numChannels === 2) channelMask = SPEAKER_MASKS.STEREO
      else channelMask = 0
    }
    view.setUint32(40, channelMask, true)

    // SubFormat GUID: KSDATAFORMAT_SUBTYPE_PCM (00000001-0000-0010-8000-00aa00389b71)
    view.setUint32(44, 0x00000001, true)
    view.setUint16(48, 0x0000, true)
    view.setUint16(50, 0x0010, true)
    view.setUint8(52, 0x80)
    view.setUint8(53, 0x00)
    view.setUint8(54, 0x00)
    view.setUint8(55, 0xaa)
    view.setUint8(56, 0x00)
    view.setUint8(57, 0x38)
    view.setUint8(58, 0x9b)
    view.setUint8(59, 0x71)
  } else {
    // Standard WAVE_FORMAT_PCM = 0x0001
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
  }

  // 3. Write data sub-chunk
  const dataOffset = 12 + (8 + fmtChunkSize)
  writeString(view, dataOffset, 'data')
  view.setUint32(dataOffset + 4, dataSize, true)

  // 4. Interleave PCM samples
  let writeOffset = dataOffset + 8
  const chunkSize = 16384 // Samples per async slice to keep UI fluid
  let sampleIndex = 0

  while (sampleIndex < numSamples) {
    if (options?.isCancelled?.()) {
      throw new Error('Export cancelled by user.')
    }

    const end = Math.min(sampleIndex + chunkSize, numSamples)

    if (bitDepth === 24) {
      for (let i = sampleIndex; i < end; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const s = Math.max(-1, Math.min(1, channels[ch][i]))
          // Quantize 24-bit signed integer (-8388608 to 8388607)
          const int24 = Math.round(s < 0 ? s * 0x800000 : s * 0x7fffff)
          view.setUint8(writeOffset, int24 & 0xff)
          view.setUint8(writeOffset + 1, (int24 >> 8) & 0xff)
          view.setUint8(writeOffset + 2, (int24 >> 16) & 0xff)
          writeOffset += 3
        }
      }
    } else {
      // 16-bit PCM
      for (let i = sampleIndex; i < end; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const s = Math.max(-1, Math.min(1, channels[ch][i]))
          const int16 = s < 0 ? s * 0x8000 : s * 0x7fff
          view.setInt16(writeOffset, int16, true)
          writeOffset += 2
        }
      }
    }

    sampleIndex = end

    if (options?.onProgress) {
      options.onProgress(Math.round((sampleIndex / numSamples) * 100))
    }

    // Yield control periodically to avoid UI hiccups
    if (sampleIndex < numSamples && sampleIndex % (chunkSize * 2) === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}
