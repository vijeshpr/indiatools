/**
 * Stream Processor for Zero-Knowledge File Vault
 * Bounded-memory chunk-by-chunk encryption and decryption pipelines
 * with authenticated framing, nonce sequencing, and final manifest integrity verification.
 */

import {
  VAULT_FORMAT,
  VaultHeader,
  EncryptConfig,
  DecryptConfig,
  VaultProgressUpdate,
  VaultAuthenticationError,
  VaultTamperedError,
  VaultHeaderError,
} from './types'
import {
  deriveVaultKey,
  constructChunkNonce,
  constructChunkAad,
  encryptChunk,
  decryptChunk,
  computeSha256,
  generateRandomBytes,
  sanitizeFilename,
} from './cryptoEngine'
import {
  FIXED_HEADER_PREFIX_LENGTH,
  serializeVaultHeader,
  parseVaultHeader,
  serializeChunkFrame,
  serializeFinalManifestPlaintext,
  parseFinalManifestPlaintext,
} from './vaultFormat'

export interface EncryptionResult {
  outputBlob: Blob
  outputName: string
  outputSizeBytes: number
  totalChunks: number
  originalSize: number
  elapsedMs: number
}

export interface DecryptionResult {
  outputBlob: Blob
  outputName: string
  outputSizeBytes: number
  totalChunks: number
  header: VaultHeader
  elapsedMs: number
}

/**
 * Encrypt a File/Blob to an authentic .vault container
 */
export async function encryptFileToVault(
  file: File | Blob,
  config: EncryptConfig,
  onProgress?: (progress: VaultProgressUpdate) => void,
  signal?: AbortSignal
): Promise<EncryptionResult> {
  const startTime = performance.now()
  const originalSize = file.size
  const chunkSize = config.chunkSize || VAULT_FORMAT.DEFAULT_CHUNK_SIZE
  const kdfIterations = config.kdfIterations || VAULT_FORMAT.DEFAULT_KDF_ITERATIONS

  const originalName = file instanceof File ? file.name : 'unnamed.bin'
  const mimeType = file.type || 'application/octet-stream'

  // 1. Generate fresh cryptographic randomness
  const salt = generateRandomBytes(VAULT_FORMAT.SALT_LENGTH)
  const noncePrefix = generateRandomBytes(VAULT_FORMAT.NONCE_PREFIX_LENGTH)

  // 2. Build and serialize header
  const metadata = {
    originalName,
    originalSize,
    mimeType,
    createdAt: Date.now(),
    hint: config.hint ? config.hint.trim() : undefined,
  }

  const { rawHeaderBytes, headerHash } = await serializeVaultHeader(
    salt,
    noncePrefix,
    chunkSize,
    metadata,
    kdfIterations
  )

  // 3. Derive AES-256-GCM key from password
  if (onProgress) {
    onProgress({
      itemId: originalName,
      bytesProcessed: 0,
      totalBytes: originalSize,
      chunksProcessed: 0,
      totalChunks: Math.max(1, Math.ceil(originalSize / chunkSize)),
      throughputMBps: 0,
      elapsedMs: 0,
      status: 'deriving-key',
      statusMessage: `Deriving 256-bit AES key via PBKDF2 (${kdfIterations.toLocaleString()} rounds)...`,
    })
  }

  const key = await deriveVaultKey(config.password, salt, kdfIterations)

  if (signal?.aborted) {
    throw new Error('Operation cancelled by user.')
  }

  const outputParts: any[] = [rawHeaderBytes]
  const totalChunks = originalSize === 0 ? 0 : Math.ceil(originalSize / chunkSize)
  const chunkDigests: Uint8Array[] = []

  let bytesProcessed = 0
  let chunkIndex = 0

  // 4. Encrypt chunks sequentially
  while (bytesProcessed < originalSize) {
    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.')
    }

    const start = bytesProcessed
    const end = Math.min(originalSize, start + chunkSize)
    const sliceBlob = file.slice(start, end)
    const sliceBuffer = await sliceBlob.arrayBuffer()
    const plaintextChunk = new Uint8Array(sliceBuffer)

    // Compute chunk digest for cumulative manifest
    const chunkDigest = await computeSha256(plaintextChunk)
    chunkDigests.push(chunkDigest)

    // Construct 12-byte unique nonce & AAD
    const nonce = constructChunkNonce(noncePrefix, chunkIndex)
    const aad = constructChunkAad(headerHash, chunkIndex, VAULT_FORMAT.RECORD_TYPE_CHUNK)

    // Encrypt chunk with AES-256-GCM
    const ciphertextWithTag = await encryptChunk(key, nonce, plaintextChunk, aad)
    const chunkFrame = serializeChunkFrame(chunkIndex, ciphertextWithTag)
    outputParts.push(chunkFrame)

    bytesProcessed += plaintextChunk.length
    chunkIndex += 1

    const elapsedMs = performance.now() - startTime
    const elapsedSec = elapsedMs / 1000
    const throughputMBps =
      elapsedSec > 0 ? Number((bytesProcessed / (1024 * 1024) / elapsedSec).toFixed(2)) : 0

    if (onProgress) {
      onProgress({
        itemId: originalName,
        bytesProcessed,
        totalBytes: originalSize,
        chunksProcessed: chunkIndex,
        totalChunks: Math.max(1, totalChunks),
        throughputMBps,
        elapsedMs,
        status: 'processing',
        statusMessage: `Encrypting chunk ${chunkIndex} of ${Math.max(1, totalChunks)} (${throughputMBps} MB/s)...`,
      })
    }
  }

  // 5. Build and encrypt Authenticated Finalization Record (Manifest)
  const allDigestsBuffer = new Uint8Array(chunkDigests.length * 32)
  for (let i = 0; i < chunkDigests.length; i++) {
    allDigestsBuffer.set(chunkDigests[i], i * 32)
  }
  const cumulativePlaintextDigest = await computeSha256(allDigestsBuffer)

  const finalManifestPlaintext = serializeFinalManifestPlaintext(
    chunkIndex,
    originalSize,
    cumulativePlaintextDigest
  )

  const finalNonce = constructChunkNonce(noncePrefix, VAULT_FORMAT.FINAL_RECORD_MARKER)
  const finalAad = constructChunkAad(
    headerHash,
    VAULT_FORMAT.FINAL_RECORD_MARKER,
    VAULT_FORMAT.RECORD_TYPE_FINAL
  )

  const finalCiphertextWithTag = await encryptChunk(
    key,
    finalNonce,
    finalManifestPlaintext,
    finalAad
  )
  const finalFrame = serializeChunkFrame(
    VAULT_FORMAT.FINAL_RECORD_MARKER,
    finalCiphertextWithTag
  )
  outputParts.push(finalFrame)

  const finalBlob = new Blob(outputParts, { type: 'application/octet-stream' })
  const outputName = originalName.replace(/\.[^/.]+$/, '') + '.vault'

  return {
    outputBlob: finalBlob,
    outputName,
    outputSizeBytes: finalBlob.size,
    totalChunks: chunkIndex,
    originalSize,
    elapsedMs: performance.now() - startTime,
  }
}

/**
 * Decrypt an authentic .vault container and verify complete integrity
 */
export async function decryptVaultToFile(
  vaultFile: File | Blob,
  config: DecryptConfig,
  onProgress?: (progress: VaultProgressUpdate) => void,
  signal?: AbortSignal
): Promise<DecryptionResult> {
  const startTime = performance.now()
  const containerSize = vaultFile.size

  if (containerSize < FIXED_HEADER_PREFIX_LENGTH) {
    throw new VaultHeaderError('File is too small to be a valid .vault container.')
  }

  // 1. Read header candidate slice (up to 64 KB + 48 bytes)
  const headerProbeSize = Math.min(containerSize, 65536 + FIXED_HEADER_PREFIX_LENGTH)
  const headerSlice = await vaultFile.slice(0, headerProbeSize).arrayBuffer()
  const header = await parseVaultHeader(new Uint8Array(headerSlice))

  let fileOffset = header.rawHeaderBytes.length

  // 2. Derive key using salt and validated parameters
  if (onProgress) {
    onProgress({
      itemId: header.metadata.originalName,
      bytesProcessed: 0,
      totalBytes: header.metadata.originalSize,
      chunksProcessed: 0,
      totalChunks: Math.max(1, Math.ceil(header.metadata.originalSize / header.chunkSize)),
      throughputMBps: 0,
      elapsedMs: 0,
      status: 'deriving-key',
      statusMessage: `Deriving cryptographic key via PBKDF2 (${header.kdfIterations.toLocaleString()} rounds)...`,
    })
  }

  const key = await deriveVaultKey(config.password, header.salt, header.kdfIterations)

  if (signal?.aborted) {
    throw new Error('Operation cancelled by user.')
  }

  const decryptedChunks: Uint8Array[] = []
  const chunkDigests: Uint8Array[] = []
  let expectedChunkIndex = 0
  let totalPlaintextBytesRead = 0
  let finalManifestVerified = false

  // 3. Read and decrypt chunks sequentially
  while (fileOffset < containerSize) {
    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.')
    }

    // Read frame header: 4 bytes chunkIndex + 4 bytes ciphertextLength = 8 bytes
    if (fileOffset + 8 > containerSize) {
      throw new VaultTamperedError('Truncated container: incomplete chunk record header.')
    }

    const frameHeaderBuf = await vaultFile.slice(fileOffset, fileOffset + 8).arrayBuffer()
    const frameHeaderView = new DataView(frameHeaderBuf)
    const chunkIndex = frameHeaderView.getUint32(0, false)
    const ciphertextLength = frameHeaderView.getUint32(4, false)
    fileOffset += 8

    if (fileOffset + ciphertextLength > containerSize) {
      throw new VaultTamperedError('Truncated container: incomplete ciphertext payload.')
    }

    // Read ciphertext chunk
    const ciphertextBuf = await vaultFile.slice(fileOffset, fileOffset + ciphertextLength).arrayBuffer()
    const ciphertextWithTag = new Uint8Array(ciphertextBuf)
    fileOffset += ciphertextLength

    // Check if this is the final manifest record
    if (chunkIndex === VAULT_FORMAT.FINAL_RECORD_MARKER) {
      // Authenticate and decrypt final manifest
      const finalNonce = constructChunkNonce(header.noncePrefix, VAULT_FORMAT.FINAL_RECORD_MARKER)
      const finalAad = constructChunkAad(
        header.headerHash,
        VAULT_FORMAT.FINAL_RECORD_MARKER,
        VAULT_FORMAT.RECORD_TYPE_FINAL
      )

      let finalPlaintextBuf: Uint8Array
      try {
        finalPlaintextBuf = await decryptChunk(key, finalNonce, ciphertextWithTag, finalAad)
      } catch (err: any) {
        throw new VaultAuthenticationError(
          'Authentication failed: Password does not match or final integrity record is tampered.'
        )
      }

      const manifest = parseFinalManifestPlaintext(finalPlaintextBuf)

      // Verification checks
      if (manifest.totalChunks !== expectedChunkIndex) {
        throw new VaultTamperedError(
          `Integrity verification failed: Chunk count mismatch (expected ${manifest.totalChunks}, got ${expectedChunkIndex}). Container may have been truncated or altered.`
        )
      }

      if (manifest.totalPlaintextSize !== totalPlaintextBytesRead) {
        throw new VaultTamperedError(
          `Integrity verification failed: Plaintext size mismatch (expected ${manifest.totalPlaintextSize} bytes, recovered ${totalPlaintextBytesRead} bytes).`
        )
      }

      // Verify cumulative SHA-256
      const allDigestsBuffer = new Uint8Array(chunkDigests.length * 32)
      for (let i = 0; i < chunkDigests.length; i++) {
        allDigestsBuffer.set(chunkDigests[i], i * 32)
      }
      const actualCumulativeDigest = await computeSha256(allDigestsBuffer)

      for (let i = 0; i < 32; i++) {
        if (actualCumulativeDigest[i] !== manifest.plaintextSha256[i]) {
          throw new VaultTamperedError(
            'Integrity verification failed: Cumulative cryptographic hash does not match finalization record.'
          )
        }
      }

      // Verify no trailing data after final manifest
      if (fileOffset !== containerSize) {
        throw new VaultTamperedError(
          `Security violation: Container contains unexpected trailing data (${containerSize - fileOffset} extra bytes).`
        )
      }

      finalManifestVerified = true
      break
    }

    // Normal encrypted chunk
    if (chunkIndex !== expectedChunkIndex) {
      throw new VaultTamperedError(
        `Security violation: Chunk index mismatch (expected ${expectedChunkIndex}, received ${chunkIndex}). Chunks may be reordered, duplicated, or missing.`
      )
    }

    const nonce = constructChunkNonce(header.noncePrefix, chunkIndex)
    const aad = constructChunkAad(header.headerHash, chunkIndex, VAULT_FORMAT.RECORD_TYPE_CHUNK)

    let plaintextChunk: Uint8Array
    try {
      plaintextChunk = await decryptChunk(key, nonce, ciphertextWithTag, aad)
    } catch (err: any) {
      // Clear sensitive memory immediately
      decryptedChunks.length = 0
      throw new VaultAuthenticationError(
        `Authentication failed on chunk ${chunkIndex}: Incorrect password or ciphertext modified.`
      )
    }

    const chunkDigest = await computeSha256(plaintextChunk)
    chunkDigests.push(chunkDigest)
    decryptedChunks.push(plaintextChunk)

    totalPlaintextBytesRead += plaintextChunk.length
    expectedChunkIndex += 1

    const elapsedMs = performance.now() - startTime
    const elapsedSec = elapsedMs / 1000
    const throughputMBps =
      elapsedSec > 0
        ? Number((totalPlaintextBytesRead / (1024 * 1024) / elapsedSec).toFixed(2))
        : 0

    if (onProgress) {
      onProgress({
        itemId: header.metadata.originalName,
        bytesProcessed: totalPlaintextBytesRead,
        totalBytes: header.metadata.originalSize,
        chunksProcessed: expectedChunkIndex,
        totalChunks: Math.max(1, Math.ceil(header.metadata.originalSize / header.chunkSize)),
        throughputMBps,
        elapsedMs,
        status: 'processing',
        statusMessage: `Authenticating & decrypting chunk ${expectedChunkIndex}... (${throughputMBps} MB/s)`,
      })
    }
  }

  // Ensure final manifest record was encountered and validated
  if (!finalManifestVerified) {
    decryptedChunks.length = 0
    throw new VaultTamperedError(
      'Integrity violation: Container ended prematurely without an authenticated finalization manifest.'
    )
  }

  // Restore sanitized filename and MIME type
  const restoredName = sanitizeFilename(header.metadata.originalName)
  const mimeType = header.metadata.mimeType || 'application/octet-stream'

  // Construct verified final Blob
  const finalBlob = new Blob(decryptedChunks as any[], { type: mimeType })

  // Clean memory reference
  decryptedChunks.length = 0

  return {
    outputBlob: finalBlob,
    outputName: restoredName,
    outputSizeBytes: finalBlob.size,
    totalChunks: expectedChunkIndex,
    header,
    elapsedMs: performance.now() - startTime,
  }
}
