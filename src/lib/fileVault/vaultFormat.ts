/**
 * Binary Container Specification & Serializer for .vault Files
 * Implements deterministic big-endian binary packing for headers,
 * chunk records, and authenticated finalization manifests.
 */

import {
  VAULT_FORMAT,
  VaultContainerMetadata,
  VaultHeader,
  VaultHeaderError,
} from './types'
import { computeSha256 } from './cryptoEngine'

export const FIXED_HEADER_PREFIX_LENGTH = 48 // 8+2+1+4+1+16+8+4+4

/**
 * Serialize a .vault header into binary bytes
 */
export async function serializeVaultHeader(
  salt: Uint8Array,
  noncePrefix: Uint8Array,
  chunkSize: number,
  metadata: VaultContainerMetadata,
  kdfIterations: number = VAULT_FORMAT.DEFAULT_KDF_ITERATIONS
): Promise<{ rawHeaderBytes: Uint8Array; headerHash: Uint8Array; header: VaultHeader }> {
  const encoder = new TextEncoder()
  const metadataJson = JSON.stringify(metadata)
  const metadataBytes = encoder.encode(metadataJson)

  if (metadataBytes.length > 65535) {
    throw new VaultHeaderError('Metadata payload exceeds maximum permitted length (64 KB).')
  }

  const totalHeaderLength = FIXED_HEADER_PREFIX_LENGTH + metadataBytes.length
  const buffer = new Uint8Array(totalHeaderLength)
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  let offset = 0

  // 1. Magic bytes (8 bytes)
  buffer.set(VAULT_FORMAT.MAGIC_BYTES, offset)
  offset += 8

  // 2. Format version (2 bytes, uint16 BE)
  view.setUint16(offset, VAULT_FORMAT.VERSION, false)
  offset += 2

  // 3. KDF algorithm (1 byte, uint8)
  view.setUint8(offset, VAULT_FORMAT.KDF_PBKDF2_SHA256)
  offset += 1

  // 4. KDF iterations (4 bytes, uint32 BE)
  view.setUint32(offset, kdfIterations, false)
  offset += 4

  // 5. Cipher algorithm (1 byte, uint8)
  view.setUint8(offset, VAULT_FORMAT.CIPHER_AES256_GCM)
  offset += 1

  // 6. Salt (16 bytes)
  buffer.set(salt, offset)
  offset += VAULT_FORMAT.SALT_LENGTH

  // 7. Nonce prefix (8 bytes)
  buffer.set(noncePrefix, offset)
  offset += VAULT_FORMAT.NONCE_PREFIX_LENGTH

  // 8. Chunk size (4 bytes, uint32 BE)
  view.setUint32(offset, chunkSize, false)
  offset += 4

  // 9. Metadata length (4 bytes, uint32 BE)
  view.setUint32(offset, metadataBytes.length, false)
  offset += 4

  // 10. Metadata bytes
  buffer.set(metadataBytes, offset)

  const headerHash = await computeSha256(buffer)

  const header: VaultHeader = {
    magic: VAULT_FORMAT.MAGIC,
    version: VAULT_FORMAT.VERSION,
    kdfAlgorithm: VAULT_FORMAT.KDF_PBKDF2_SHA256,
    kdfIterations,
    cipherAlgorithm: VAULT_FORMAT.CIPHER_AES256_GCM,
    salt,
    noncePrefix,
    chunkSize,
    metadataLength: metadataBytes.length,
    metadata,
    rawHeaderBytes: buffer,
    headerHash,
  }

  return { rawHeaderBytes: buffer, headerHash, header }
}

/**
 * Parse and validate binary .vault container header
 */
export async function parseVaultHeader(bytes: Uint8Array): Promise<VaultHeader> {
  if (bytes.length < FIXED_HEADER_PREFIX_LENGTH) {
    throw new VaultHeaderError(
      `Truncated file header: expected at least ${FIXED_HEADER_PREFIX_LENGTH} bytes, got ${bytes.length}.`
    )
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0

  // 1. Verify Magic
  for (let i = 0; i < 8; i++) {
    if (bytes[offset + i] !== VAULT_FORMAT.MAGIC_BYTES[i]) {
      throw new VaultHeaderError(
        'Invalid container magic identifier. This file is not an authentic .vault container.'
      )
    }
  }
  offset += 8

  // 2. Version
  const version = view.getUint16(offset, false)
  offset += 2
  if (version !== VAULT_FORMAT.VERSION) {
    throw new VaultHeaderError(
      `Unsupported container version (${version}). This application supports format version ${VAULT_FORMAT.VERSION}.`
    )
  }

  // 3. KDF algorithm
  const kdfAlgorithm = view.getUint8(offset)
  offset += 1
  if (kdfAlgorithm !== VAULT_FORMAT.KDF_PBKDF2_SHA256) {
    throw new VaultHeaderError(`Unsupported KDF algorithm identifier: ${kdfAlgorithm}.`)
  }

  // 4. KDF iterations
  const kdfIterations = view.getUint32(offset, false)
  offset += 4
  if (
    kdfIterations < VAULT_FORMAT.MIN_KDF_ITERATIONS ||
    kdfIterations > VAULT_FORMAT.MAX_KDF_ITERATIONS
  ) {
    throw new VaultHeaderError(
      `KDF iteration count (${kdfIterations}) is outside permitted security bounds.`
    )
  }

  // 5. Cipher algorithm
  const cipherAlgorithm = view.getUint8(offset)
  offset += 1
  if (cipherAlgorithm !== VAULT_FORMAT.CIPHER_AES256_GCM) {
    throw new VaultHeaderError(`Unsupported cipher algorithm identifier: ${cipherAlgorithm}.`)
  }

  // 6. Salt
  const salt = bytes.slice(offset, offset + VAULT_FORMAT.SALT_LENGTH)
  offset += VAULT_FORMAT.SALT_LENGTH

  // 7. Nonce prefix
  const noncePrefix = bytes.slice(offset, offset + VAULT_FORMAT.NONCE_PREFIX_LENGTH)
  offset += VAULT_FORMAT.NONCE_PREFIX_LENGTH

  // 8. Chunk size
  const chunkSize = view.getUint32(offset, false)
  offset += 4
  if (chunkSize < VAULT_FORMAT.MIN_CHUNK_SIZE || chunkSize > VAULT_FORMAT.MAX_CHUNK_SIZE) {
    throw new VaultHeaderError(`Unsupported chunk size: ${chunkSize} bytes.`)
  }

  // 9. Metadata length
  const metadataLength = view.getUint32(offset, false)
  offset += 4
  if (metadataLength > 65535) {
    throw new VaultHeaderError(`Metadata length (${metadataLength}) exceeds maximum permitted bound.`)
  }

  if (bytes.length < FIXED_HEADER_PREFIX_LENGTH + metadataLength) {
    throw new VaultHeaderError('Truncated container: incomplete metadata section.')
  }

  // 10. Metadata JSON
  const metadataBytes = bytes.slice(offset, offset + metadataLength)
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let metadata: VaultContainerMetadata
  try {
    const jsonStr = decoder.decode(metadataBytes)
    metadata = JSON.parse(jsonStr)
  } catch (err: any) {
    throw new VaultHeaderError(`Malformed container metadata: ${err?.message || 'Invalid JSON'}`)
  }

  const rawHeaderBytes = bytes.slice(0, FIXED_HEADER_PREFIX_LENGTH + metadataLength)
  const headerHash = await computeSha256(rawHeaderBytes)

  return {
    magic: VAULT_FORMAT.MAGIC,
    version,
    kdfAlgorithm,
    kdfIterations,
    cipherAlgorithm,
    salt,
    noncePrefix,
    chunkSize,
    metadataLength,
    metadata,
    rawHeaderBytes,
    headerHash,
  }
}

/**
 * Serialize a chunk record frame
 * [ChunkIndex (4 bytes BE) | CiphertextLength (4 bytes BE) | CiphertextWithTag]
 */
export function serializeChunkFrame(
  chunkIndex: number,
  ciphertextWithTag: Uint8Array
): Uint8Array {
  const frame = new Uint8Array(8 + ciphertextWithTag.length)
  const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength)

  view.setUint32(0, chunkIndex, false)
  view.setUint32(4, ciphertextWithTag.length, false)
  frame.set(ciphertextWithTag, 8)

  return frame
}

/**
 * Serialize the plaintext final manifest before encryption
 * [TotalChunks (4 bytes uint32) | TotalPlaintextSize (8 bytes uint64 Big-Endian) | PlaintextSha256 (32 bytes)]
 */
export function serializeFinalManifestPlaintext(
  totalChunks: number,
  totalPlaintextSize: number,
  plaintextSha256: Uint8Array
): Uint8Array {
  const buffer = new Uint8Array(4 + 8 + 32)
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  // 1. Total chunk count (4 bytes)
  view.setUint32(0, totalChunks, false)

  // 2. Total plaintext size (8 bytes BigInt uint64)
  view.setBigUint64(4, BigInt(totalPlaintextSize), false)

  // 3. Plaintext cumulative SHA-256 (32 bytes)
  buffer.set(plaintextSha256, 12)

  return buffer
}

/**
 * Parse the decrypted final manifest plaintext
 */
export function parseFinalManifestPlaintext(buffer: Uint8Array): {
  totalChunks: number
  totalPlaintextSize: number
  plaintextSha256: Uint8Array
} {
  if (buffer.length !== 4 + 8 + 32) {
    throw new VaultHeaderError(
      `Invalid final manifest length: expected 44 bytes, got ${buffer.length}.`
    )
  }

  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  const totalChunks = view.getUint32(0, false)
  const totalPlaintextSize = Number(view.getBigUint64(4, false))
  const plaintextSha256 = buffer.slice(12, 12 + 32)

  return { totalChunks, totalPlaintextSize, plaintextSha256 }
}
