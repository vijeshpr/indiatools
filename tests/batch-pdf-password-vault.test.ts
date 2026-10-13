import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools'
import {
  validatePdfMagicHeader,
  generateSamplePdfBytes,
  inspectPdfFile,
  encryptPdfDocument,
  unlockPdfDocument,
  PdfPasswordError,
} from '../src/lib/pdfVault/pdfSecurityEngine'
import { createBatchZipBundle } from '../src/lib/pdfVault/zipService'
import { PdfQueueItem } from '../src/lib/pdfVault/types'

describe('Batch PDF Password Vault & Permissions Manager', () => {
  it('should be registered in tools registry with complete SEO and metadata', () => {
    assert.strictEqual(TOOLS.length, 58, 'Registry must contain exactly 58 tools')
    assert.strictEqual(CATEGORIES.create.toolCount, 19, 'Create category must have 19 tools')

    const tool = getToolBySlug('batch-pdf-password-vault')
    assert.ok(tool, 'Tool must exist in registry')
    assert.strictEqual(tool.slug, 'batch-pdf-password-vault')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/batch-pdf-password-vault')
    assert.ok(tool.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.faqs.length >= 5, 'Must have at least 5 FAQs')
    assert.ok(tool.tags.includes('AES-256'), 'Must tag AES-256')
    assert.ok(tool.exampleCalculation, 'Must have example calculation')
  })

  it('should validate PDF magic headers correctly', () => {
    const validHeader = new TextEncoder().encode('%PDF-1.7\n%âãÏÓ\n')
    assert.strictEqual(validatePdfMagicHeader(validHeader), true)

    const invalidHeader = new TextEncoder().encode('GIF89a\x01\x00\x01\x00')
    assert.strictEqual(validatePdfMagicHeader(invalidHeader), false)

    const emptyHeader = new Uint8Array(0)
    assert.strictEqual(validatePdfMagicHeader(emptyHeader), false)
  })

  it('should generate a valid sample PDF and inspect unencrypted state', async () => {
    const sampleBytes = generateSamplePdfBytes('Test Document Title', 'Secret confidential content.')
    assert.ok(validatePdfMagicHeader(sampleBytes), 'Generated sample must have valid PDF magic bytes')

    const inspection = await inspectPdfFile(sampleBytes)
    assert.strictEqual(inspection.pageCount, 1)
    assert.strictEqual(inspection.isEncrypted, false)
  })

  it('should perform genuine AES-256 encryption with permissions', async () => {
    const sampleBytes = generateSamplePdfBytes('Protected Document', 'Classified payload.')
    const userPwd = 'SecureUserPassword123!'
    const ownerPwd = 'AdminMasterOwnerPassword456!'

    const encryptedBytes = await encryptPdfDocument(sampleBytes, {
      userPassword: userPwd,
      ownerPassword: ownerPwd,
      keyLength: 256,
      permissions: {
        allowPrinting: 'none',
        allowCopying: false,
        allowModifying: 'none',
        allowAnnotations: false,
      },
    })

    assert.ok(encryptedBytes.length > 0, 'Encrypted output must not be empty')
    
    // Inspect with password to verify cipher details
    const encryptedInspectionWithPwd = await inspectPdfFile(encryptedBytes, userPwd)
    assert.strictEqual(encryptedInspectionWithPwd.isEncrypted, true, 'Output must be encrypted')
    assert.strictEqual(encryptedInspectionWithPwd.encryptionDetails?.bits, 256, 'Must use 256-bit key length')
    assert.strictEqual(encryptedInspectionWithPwd.encryptionDetails?.method, 'AESv3', 'Must use ISO 32000-2 AESv3 cipher')

    // Inspecting without password should report encrypted
    const encryptedInspection = await inspectPdfFile(encryptedBytes)
    assert.strictEqual(encryptedInspection.isEncrypted, true)

    // Decrypt with wrong password should fail with PdfPasswordError
    await assert.rejects(
      async () => {
        await unlockPdfDocument(encryptedBytes, { password: 'WrongPassword999!' })
      },
      (err: any) => {
        return err instanceof PdfPasswordError || err.name === 'PdfPasswordError'
      },
      'Should throw PdfPasswordError on incorrect password'
    )

    // Decrypt with correct user password should succeed
    const unlocked = await unlockPdfDocument(encryptedBytes, { password: userPwd })
    assert.ok(unlocked.length > 0, 'Unlocked output must not be empty')

    // Inspecting decrypted document should show unencrypted
    const decryptedInspection = await inspectPdfFile(unlocked)
    assert.strictEqual(decryptedInspection.isEncrypted, false, 'Document must now be unencrypted')
  })

  it('should perform genuine AES-128 encryption with selective permissions', async () => {
    const sampleBytes = generateSamplePdfBytes('AES-128 Legacy Doc', 'Financial ledger content.')
    const password = 'LegacyPassword128!'

    const encryptedBytes = await encryptPdfDocument(sampleBytes, {
      userPassword: password,
      keyLength: 128,
      permissions: {
        allowPrinting: 'full',
        allowCopying: true,
        allowModifying: 'none',
        allowAnnotations: true,
      },
    })

    const inspection = await inspectPdfFile(encryptedBytes, password)
    assert.strictEqual(inspection.isEncrypted, true)
    assert.strictEqual(inspection.encryptionDetails?.bits, 128)
    assert.strictEqual(inspection.encryptionDetails?.method, 'AESv2')

    // Decrypt with password
    const unlocked = await unlockPdfDocument(encryptedBytes, { password })
    const decryptedInspection = await inspectPdfFile(unlocked)
    assert.strictEqual(decryptedInspection.isEncrypted, false)
  })

  it('should bundle batch items into a ZIP archive with manifest report', async () => {
    const dummyOutput1 = generateSamplePdfBytes('Report 1', 'Content 1')
    const dummyOutput2 = generateSamplePdfBytes('Report 2', 'Content 2')

    const mockQueue: PdfQueueItem[] = [
      {
        id: '1',
        file: new File([dummyOutput1], 'Statement-Jan.pdf', { type: 'application/pdf' }),
        name: 'Statement-Jan.pdf',
        sizeBytes: dummyOutput1.byteLength,
        status: 'success',
        progress: 100,
        outputBytes: dummyOutput1,
        outputName: 'Statement-Jan_encrypted.pdf',
      },
      {
        id: '2',
        file: new File([dummyOutput2], 'Statement-Feb.pdf', { type: 'application/pdf' }),
        name: 'Statement-Feb.pdf',
        sizeBytes: dummyOutput2.byteLength,
        status: 'success',
        progress: 100,
        outputBytes: dummyOutput2,
        outputName: 'Statement-Feb_encrypted.pdf',
      },
    ]

    const zipBlob = await createBatchZipBundle(mockQueue, 'encrypt')
    assert.ok(zipBlob.size > 0, 'ZIP blob size must be greater than zero')
    assert.strictEqual(zipBlob.type, 'application/zip')
  })
})
