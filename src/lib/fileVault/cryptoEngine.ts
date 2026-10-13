/**
 * Cryptographic Engine for Zero-Knowledge File Vault
 * Native Web Crypto API primitives: PBKDF2-HMAC-SHA256 key derivation,
 * AES-256-GCM chunk encryption & decryption, deterministic nonces,
 * domain-separated Additional Authenticated Data (AAD), and SHA-256 hashing.
 */

import {
  VAULT_FORMAT,
  VaultAuthenticationError,
} from './types'

/**
 * Generate cryptographically secure random bytes
 * Safely handles lengths exceeding Web Crypto's 65,536-byte per-call quota
 */
export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  const MAX_CHUNK = 65536
  for (let offset = 0; offset < length; offset += MAX_CHUNK) {
    const chunkLength = Math.min(MAX_CHUNK, length - offset)
    crypto.getRandomValues(bytes.subarray(offset, offset + chunkLength))
  }
  return bytes
}

/**
 * Compute SHA-256 hash of arbitrary bytes
 */
export async function computeSha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', data as any)
  return new Uint8Array(digest)
}

/**
 * Derive a 256-bit AES-GCM CryptoKey using PBKDF2 with SHA-256
 */
export async function deriveVaultKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(password)

  // 1. Import raw passphrase as PBKDF2 key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes as any,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  // 2. Derive non-extractable 256-bit AES-GCM key
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false, // non-extractable for memory protection
    ['encrypt', 'decrypt']
  )

  return derivedKey
}

/**
 * Construct 12-byte nonce for a specific chunk index
 * Byte 0..7: Random per-file nonce prefix
 * Byte 8..11: Big-Endian 32-bit chunk index
 */
export function constructChunkNonce(
  noncePrefix: Uint8Array,
  chunkIndex: number
): Uint8Array {
  if (noncePrefix.length !== VAULT_FORMAT.NONCE_PREFIX_LENGTH) {
    throw new Error(`Invalid nonce prefix length: expected ${VAULT_FORMAT.NONCE_PREFIX_LENGTH}`)
  }

  const nonce = new Uint8Array(VAULT_FORMAT.NONCE_TOTAL_LENGTH)
  nonce.set(noncePrefix, 0)

  const view = new DataView(nonce.buffer, nonce.byteOffset, nonce.byteLength)
  view.setUint32(8, chunkIndex, false) // Big-endian uint32

  return nonce
}

/**
 * Construct Additional Authenticated Data (AAD) for a chunk or final manifest
 * Domain-separated binding:
 * [HeaderHash (32 bytes) | ChunkIndex (4 bytes Big-Endian) | RecordType (1 byte)]
 */
export function constructChunkAad(
  headerHash: Uint8Array,
  chunkIndex: number,
  recordType: number
): Uint8Array {
  const aad = new Uint8Array(32 + 4 + 1)
  aad.set(headerHash, 0)

  const view = new DataView(aad.buffer, aad.byteOffset, aad.byteLength)
  view.setUint32(32, chunkIndex, false)
  view.setUint8(36, recordType)

  return aad
}

/**
 * Encrypt a chunk using AES-256-GCM with specified nonce and AAD
 * Returns ciphertext with appended 16-byte GCM authentication tag
 */
export async function encryptChunk(
  key: CryptoKey,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): Promise<Uint8Array> {
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: nonce as any,
      additionalData: aad as any,
      tagLength: 128,
    },
    key,
    plaintext as any
  )

  return new Uint8Array(encrypted)
}

/**
 * Authenticate and decrypt an AES-256-GCM chunk
 * Throws VaultAuthenticationError if key, ciphertext, nonce, or AAD do not match tag
 */
export async function decryptChunk(
  key: CryptoKey,
  nonce: Uint8Array,
  ciphertextWithTag: Uint8Array,
  aad: Uint8Array
): Promise<Uint8Array> {
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce as any,
        additionalData: aad as any,
        tagLength: 128,
      },
      key,
      ciphertextWithTag as any
    )

    return new Uint8Array(decrypted)
  } catch (err: any) {
    throw new VaultAuthenticationError(
      'Authentication verification failed: Chunk ciphertext or integrity tag rejected.'
    )
  }
}

/**
 * Sanitize a filename restored from container metadata
 * Prevents directory traversal, illegal chars, and reserved names
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'recovered_file.bin'
  }

  // 1. Remove dangerous traversal sequences first
  let clean = filename
    .replace(/\.\.+/g, '')
    .replace(/[/\\]+/g, '_')
    .replace(/^_+/, '')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .trim()

  // 2. Prevent Windows reserved device names
  const reservedRegex = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i
  if (reservedRegex.test(clean)) {
    clean = `safe_${clean}`
  }

  if (clean.length === 0 || clean === '.' || clean === '..') {
    return 'recovered_file.bin'
  }

  // Bound length to 255 chars
  return clean.slice(0, 255)
}

/**
 * Generate a cryptographically secure passphrase using CSPRNG
 */
export function generateSecurePassphrase(length = 20): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+'
  const randomBytes = generateRandomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length]
  }
  return result
}

/**
 * Evaluate password entropy and strength characteristics
 */
export function evaluatePasswordStrength(password: string): {
  score: number // 0 to 4
  entropyBits: number // estimated
  label: string
  color: string
} {
  if (!password) {
    return { score: 0, entropyBits: 0, label: 'Empty', color: 'bg-slate-700' }
  }

  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/\d/.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32

  const entropyBits = Math.round(password.length * Math.log2(Math.max(poolSize, 2)))

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 10 && poolSize >= 36) score += 1
  if (password.length >= 14 && poolSize >= 50) score += 1
  if (entropyBits >= 70) score += 1

  let label = 'Very Weak'
  let color = 'bg-rose-500'

  if (score === 1) {
    label = 'Weak'
    color = 'bg-rose-400'
  } else if (score === 2) {
    label = 'Moderate'
    color = 'bg-amber-400'
  } else if (score === 3) {
    label = 'Strong'
    color = 'bg-cyan-400'
  } else if (score >= 4) {
    label = 'Maximum Security'
    color = 'bg-emerald-400'
  }

  return { score, entropyBits, label, color }
}
