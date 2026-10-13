import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools'
import {
  VAULT_FORMAT,
  VaultAuthenticationError,
  VaultHeaderError,
  VaultTamperedError,
} from '../src/lib/fileVault/types'
import {
  serializeVaultHeader,
  parseVaultHeader,
  serializeChunkFrame,
} from '../src/lib/fileVault/vaultFormat'
import {
  generateRandomBytes,
  constructChunkNonce,
  constructChunkAad,
  deriveVaultKey,
  encryptChunk,
  decryptChunk,
  sanitizeFilename,
  evaluatePasswordStrength,
} from '../src/lib/fileVault/cryptoEngine'
import {
  encryptFileToVault,
  decryptVaultToFile,
} from '../src/lib/fileVault/streamProcessor'

describe('Zero-Knowledge Military File Encrypter & Decrypter Suite', () => {
  it('should be registered in tools registry with complete SEO metadata', () => {
    assert.ok(TOOLS.length >= 59, 'Registry must contain at least 59 tools')
    assert.ok(CATEGORIES.create.toolCount >= 20, 'Create category must have at least 20 tools')

    const tool = getToolBySlug('zero-knowledge-file-vault')
    assert.ok(tool, 'Tool must exist in registry')
    assert.strictEqual(tool.slug, 'zero-knowledge-file-vault')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/zero-knowledge-file-vault')
    assert.ok(tool.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.faqs.length >= 5, 'Must have at least 5 FAQs')
    assert.ok(tool.tags.includes('AES-256-GCM'), 'Must tag AES-256-GCM')
    assert.ok(tool.exampleCalculation, 'Must have example calculation')
  })

  it('should serialize and parse binary .vault header with integrity hash', async () => {
    const salt = generateRandomBytes(16)
    const noncePrefix = generateRandomBytes(8)
    const metadata = {
      originalName: 'Classified_Report_2026.pdf',
      originalSize: 1048576,
      mimeType: 'application/pdf',
      createdAt: Date.now(),
      hint: 'High school graduation year',
    }

    const { rawHeaderBytes, headerHash, header } = await serializeVaultHeader(
      salt,
      noncePrefix,
      4194304,
      metadata,
      250000
    )

    assert.ok(rawHeaderBytes.length > 48, 'Header must be larger than fixed prefix')
    assert.strictEqual(headerHash.length, 32, 'Header hash must be 32 bytes SHA-256')

    const parsed = await parseVaultHeader(rawHeaderBytes)
    assert.strictEqual(parsed.magic, VAULT_FORMAT.MAGIC)
    assert.strictEqual(parsed.version, 1)
    assert.strictEqual(parsed.kdfIterations, 250000)
    assert.strictEqual(parsed.chunkSize, 4194304)
    assert.strictEqual(parsed.metadata.originalName, metadata.originalName)
    assert.strictEqual(parsed.metadata.hint, metadata.hint)
    assert.deepStrictEqual(parsed.salt, salt)
    assert.deepStrictEqual(parsed.noncePrefix, noncePrefix)
  })

  it('should reject malformed or invalid container headers', async () => {
    const corruptMagic = new Uint8Array(64)
    corruptMagic.set([0x46, 0x41, 0x4b, 0x45, 0x56, 0x41, 0x55, 0x4c]) // FAKEVAUL

    await assert.rejects(
      async () => {
        await parseVaultHeader(corruptMagic)
      },
      (err: any) => err instanceof VaultHeaderError,
      'Must reject invalid magic'
    )

    const truncated = new Uint8Array(20)
    await assert.rejects(
      async () => {
        await parseVaultHeader(truncated)
      },
      (err: any) => err instanceof VaultHeaderError,
      'Must reject truncated header'
    )
  })

  it('should generate unique 12-byte chunk nonces and domain-separated AAD', () => {
    const prefix = generateRandomBytes(8)
    const nonce0 = constructChunkNonce(prefix, 0)
    const nonce1 = constructChunkNonce(prefix, 1)
    const nonceFinal = constructChunkNonce(prefix, 0xffffffff)

    assert.strictEqual(nonce0.length, 12)
    assert.strictEqual(nonce1.length, 12)
    assert.strictEqual(nonceFinal.length, 12)
    assert.notDeepStrictEqual(nonce0, nonce1, 'Sequential nonces must not collide')

    const dummyHash = generateRandomBytes(32)
    const aad0 = constructChunkAad(dummyHash, 0, VAULT_FORMAT.RECORD_TYPE_CHUNK)
    const aad1 = constructChunkAad(dummyHash, 1, VAULT_FORMAT.RECORD_TYPE_CHUNK)
    const aadFinal = constructChunkAad(dummyHash, 0xffffffff, VAULT_FORMAT.RECORD_TYPE_FINAL)

    assert.strictEqual(aad0.length, 37)
    assert.notDeepStrictEqual(aad0, aad1)
    assert.notDeepStrictEqual(aad0, aadFinal)
  })

  it('should sanitize dangerous and illegal filenames correctly', () => {
    assert.strictEqual(sanitizeFilename('../../etc/passwd'), 'etc_passwd')
    assert.strictEqual(sanitizeFilename('..\\..\\Windows\\System32\\cmd.exe'), 'Windows_System32_cmd.exe')
    assert.strictEqual(sanitizeFilename('CON.txt'), 'safe_CON.txt')
    assert.strictEqual(sanitizeFilename('NUL'), 'safe_NUL')
    assert.strictEqual(sanitizeFilename('normal_doc.pdf'), 'normal_doc.pdf')
    assert.strictEqual(sanitizeFilename(''), 'recovered_file.bin')
  })

  it('should perform genuine encryption and decryption round-trip on a single-chunk file', async () => {
    const originalText = 'Highly confidential intelligence data. Zero-Knowledge local execution.'
    const fileBytes = new TextEncoder().encode(originalText)
    const file = new File([fileBytes], 'TopSecret.txt', { type: 'text/plain' })
    const password = 'SuperStrongMasterKey2026!'

    // 1. Encrypt (use 100,000 iterations for fast test runner execution)
    const encrypted = await encryptFileToVault(file, {
      password,
      kdfIterations: 100000,
      chunkSize: 65536,
    })

    assert.ok(encrypted.outputBlob.size > file.size, 'Encrypted container must include header + tags')
    assert.strictEqual(encrypted.outputName, 'TopSecret.vault')

    // 2. Decrypt with correct password
    const decrypted = await decryptVaultToFile(encrypted.outputBlob, {
      password,
    })

    assert.strictEqual(decrypted.outputName, 'TopSecret.txt')
    assert.strictEqual(decrypted.outputSizeBytes, file.size)

    const recoveredBuf = await decrypted.outputBlob.arrayBuffer()
    const recoveredText = new TextDecoder().decode(recoveredBuf)
    assert.strictEqual(recoveredText, originalText, 'Recovered text must match original exactly')
  })

  it('should handle multi-chunk streaming files with exact byte-for-byte equality', async () => {
    // Generate 150 KiB random binary data with 64 KiB chunks -> 3 chunks
    const dataSize = 150 * 1024
    const randomBinary = generateRandomBytes(dataSize)
    const file = new File([randomBinary], 'MultiChunkSpecimen.bin', {
      type: 'application/octet-stream',
    })
    const password = 'MultiChunkTestPassword!456'

    const encrypted = await encryptFileToVault(file, {
      password,
      chunkSize: 64 * 1024,
      kdfIterations: 100000,
    })

    assert.strictEqual(encrypted.totalChunks, 3, 'Must have partitioned into exactly 3 chunks')

    const decrypted = await decryptVaultToFile(encrypted.outputBlob, {
      password,
    })

    assert.strictEqual(decrypted.outputSizeBytes, dataSize)
    const recoveredBuf = await decrypted.outputBlob.arrayBuffer()
    const recoveredBytes = new Uint8Array(recoveredBuf)

    assert.deepStrictEqual(recoveredBytes, randomBinary, 'Decrypted binary payload must be identical')
  })

  it('should support empty 0-byte files with authenticated final manifest', async () => {
    const emptyFile = new File([], 'EmptyDocument.dat', { type: 'application/octet-stream' })
    const password = 'EmptyFilePassword!789'

    const encrypted = await encryptFileToVault(emptyFile, {
      password,
      kdfIterations: 100000,
    })

    assert.strictEqual(encrypted.totalChunks, 0)
    assert.ok(encrypted.outputBlob.size > 0, 'Container must have header and final manifest')

    const decrypted = await decryptVaultToFile(encrypted.outputBlob, {
      password,
    })

    assert.strictEqual(decrypted.outputSizeBytes, 0)
    assert.strictEqual(decrypted.outputName, 'EmptyDocument.dat')
  })

  it('should reject decryption when an incorrect password is supplied', async () => {
    const file = new File(['Classified notes'], 'Notes.txt', { type: 'text/plain' })
    const password = 'CorrectPassword123!'

    const encrypted = await encryptFileToVault(file, {
      password,
      kdfIterations: 100000,
    })

    await assert.rejects(
      async () => {
        await decryptVaultToFile(encrypted.outputBlob, {
          password: 'WrongPassword999!',
        })
      },
      (err: any) => err instanceof VaultAuthenticationError,
      'Must throw VaultAuthenticationError on incorrect password'
    )
  })

  it('should detect and reject tampered ciphertext chunks', async () => {
    const file = new File(['Financial audit records'], 'Records.csv', { type: 'text/csv' })
    const password = 'AuditPassword#1'

    const encrypted = await encryptFileToVault(file, {
      password,
      kdfIterations: 100000,
    })

    const rawContainerBuf = await encrypted.outputBlob.arrayBuffer()
    const tamperedBytes = new Uint8Array(rawContainerBuf)

    // Flip a bit specifically in the ciphertext/tag payload (near the end of container)
    const targetByte = tamperedBytes.length - 25
    tamperedBytes[targetByte] ^= 0x01

    const tamperedBlob = new Blob([tamperedBytes])

    await assert.rejects(
      async () => {
        await decryptVaultToFile(tamperedBlob, { password })
      },
      (err: any) =>
        err instanceof VaultAuthenticationError ||
        err instanceof VaultTamperedError ||
        err instanceof VaultHeaderError,
      'Must reject tampered ciphertext'
    )
  })

  it('should detect truncation and missing final manifest record', async () => {
    const file = new File(['Important document payload'], 'Doc.txt', { type: 'text/plain' })
    const password = 'TruncationTestKey!'

    const encrypted = await encryptFileToVault(file, {
      password,
      kdfIterations: 100000,
    })

    const rawContainerBuf = await encrypted.outputBlob.arrayBuffer()
    // Slice off the last 40 bytes (which contains final manifest)
    const truncatedBytes = new Uint8Array(rawContainerBuf).slice(0, rawContainerBuf.byteLength - 40)
    const truncatedBlob = new Blob([truncatedBytes])

    await assert.rejects(
      async () => {
        await decryptVaultToFile(truncatedBlob, { password })
      },
      (err: any) => err instanceof VaultTamperedError,
      'Must reject truncated container'
    )
  })

  it('should evaluate password strength accurately with entropy estimates', () => {
    const weak = evaluatePasswordStrength('12345')
    assert.strictEqual(weak.score, 0)

    const moderate = evaluatePasswordStrength('Password123')
    assert.ok(moderate.score >= 2)

    const strong = evaluatePasswordStrength('N8#kL9$mP2!qR5*v')
    assert.ok(strong.entropyBits >= 70)
    assert.ok(strong.score >= 3)
  })
})
