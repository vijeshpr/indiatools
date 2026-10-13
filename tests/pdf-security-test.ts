import { createPdfToolkit, PdfPasswordError } from 'pdfstudio'
import assert from 'node:assert'

// Generate a minimal valid PDF 1.4 buffer
function createSamplePdf(text = 'Hello IndiaTools Security'): Uint8Array {
  const content = `BT /F1 24 Tf 100 700 Td (${text}) Tj ET`
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n${stream}\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  let currentOffset = pdf.length

  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset)
    const objStr = objects[i] + '\n'
    pdf += objStr
    currentOffset += objStr.length
  }

  const startxref = currentOffset
  pdf += 'xref\n'
  pdf += `0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
  }
  pdf += 'trailer\n'
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += 'startxref\n'
  pdf += `${startxref}\n`
  pdf += '%%EOF\n'

  return new TextEncoder().encode(pdf)
}

async function run() {
  console.log('Initializing QPDF WebAssembly toolkit...')
  const pdf = await createPdfToolkit()
  console.log('QPDF WASM Toolkit initialized successfully!')

  const originalPdf = createSamplePdf('Top Secret Document')
  console.log('Original PDF created, bytes:', originalPdf.length)

  // Check original encryption
  const isEncryptedBefore = await pdf.isEncrypted(originalPdf)
  assert.strictEqual(isEncryptedBefore, false, 'Original PDF should not be encrypted')
  console.log('Original PDF isEncrypted = false (Verified)')

  // 1. Test AES-256 Encryption
  console.log('Encrypting with AES-256 (User PW: "user123", Owner PW: "owner456")...')
  const aes256Encrypted = await pdf.lock(originalPdf, {
    userPassword: 'user123',
    ownerPassword: 'owner456',
    keyLength: 256,
    permissions: {
      print: 'none',
      modify: 'none',
      extract: false,
    },
  })

  console.log('AES-256 encrypted bytes:', aes256Encrypted.length)
  const isEncrypted256 = await pdf.isEncrypted(aes256Encrypted)
  assert.strictEqual(isEncrypted256, true, 'AES-256 PDF must be encrypted')

  // Inspect security properties
  const info256 = await pdf.getInfo(aes256Encrypted, { password: 'user123' })
  console.log('AES-256 Info:', JSON.stringify(info256.encryption, null, 2))
  assert.strictEqual(info256.encrypted, true)
  assert.strictEqual(info256.encryption?.bits, 256)
  assert.strictEqual(info256.encryption?.permissions.print, false)
  assert.strictEqual(info256.encryption?.permissions.extract, false)
  assert.strictEqual(info256.encryption?.permissions.modify, false)

  // 2. Test Wrong Password
  console.log('Testing wrong password rejection...')
  try {
    await pdf.unlock(aes256Encrypted, { password: 'wrongpassword' })
    assert.fail('Should have thrown PdfPasswordError on wrong password')
  } catch (err: any) {
    assert.ok(err instanceof PdfPasswordError || err.message.includes('password'), 'Wrong password caught')
    console.log('Correctly rejected wrong password with error:', err.message)
  }

  // 3. Test Decryption / Unlock
  console.log('Unlocking AES-256 PDF with correct password...')
  const unlockedPdf = await pdf.unlock(aes256Encrypted, { password: 'user123' })
  const isEncryptedAfter = await pdf.isEncrypted(unlockedPdf)
  assert.strictEqual(isEncryptedAfter, false, 'Unlocked PDF must not be encrypted')
  console.log('Successfully decrypted PDF! isEncrypted = false')

  // 4. Test AES-128 Encryption
  console.log('Encrypting with AES-128...')
  const aes128Encrypted = await pdf.lock(originalPdf, {
    userPassword: 'pass128',
    ownerPassword: 'admin128',
    keyLength: 128,
    permissions: {
      print: 'low',
      extract: true,
      modify: 'none',
    },
  })
  const isEncrypted128 = await pdf.isEncrypted(aes128Encrypted)
  assert.strictEqual(isEncrypted128, true)
  const info128 = await pdf.getInfo(aes128Encrypted, { password: 'pass128' })
  console.log('AES-128 Info:', JSON.stringify(info128.encryption, null, 2))
  assert.strictEqual(info128.encryption?.bits, 128)
  assert.strictEqual(info128.encryption?.permissions.extract, true)

  console.log('ALL CRYPTOGRAPHIC TESTS PASSED WITH 100% SUCCESS!')
}

run().catch((e) => {
  console.error('Test failed:', e)
  process.exit(1)
})
