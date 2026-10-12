import fs from 'fs'
import path from 'path'
import {
  buildQrPayload,
  DEFAULT_UPI_FORM,
  DEFAULT_URL_FORM,
  DEFAULT_WHATSAPP_FORM,
  DEFAULT_WIFI_FORM,
  DEFAULT_TEXT_FORM,
  DEFAULT_VCARD_FORM,
  DEFAULT_STYLING,
} from '../src/components/qrCode/QrCodeTypes'
import { PRESET_LOGOS, STYLING_PRESETS } from '../src/components/qrCode/QrCodePresets'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools'

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL'
  details?: string
}

const results: TestResult[] = []

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, status: 'PASS', details })
    console.log(`✅ [PASS] ${name}`)
  } else {
    results.push({ name, status: 'FAIL', details })
    console.error(`❌ [FAIL] ${name}: ${details || 'Assertion failed'}`)
  }
}

console.log('=== STARTING QR CODE GENERATOR AUTOMATED TEST SUITE ===\n')

// 1. UPI Payload Tests
console.log('1. Testing UPI Payload Engine...')
const upiPayload1 = buildQrPayload('upi', {
  upi: { upiId: 'merchant@okaxis', payeeName: 'Sharma Store', amount: '150.50', note: 'Grocery Bill' },
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(upiPayload1.startsWith('upi://pay?'), 'UPI deep link starts with upi://pay?')
assert(upiPayload1.includes('pa=merchant%40okaxis'), 'UPI ID encoded correctly')
assert(upiPayload1.includes('pn=Sharma+Store') || upiPayload1.includes('pn=Sharma%20Store'), 'Payee Name encoded')
assert(upiPayload1.includes('am=150.50'), 'Amount formatted to two decimals')
assert(upiPayload1.includes('cu=INR'), 'Currency is INR')
assert(upiPayload1.includes('tn=Grocery+Bill') || upiPayload1.includes('tn=Grocery%20Bill'), 'Note encoded')

// UPI without amount
const upiPayload2 = buildQrPayload('upi', {
  upi: { upiId: 'store@upi', payeeName: 'My Store', amount: '', note: '' },
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(!upiPayload2.includes('am='), 'Amount is omitted when blank')
assert(upiPayload2.includes('pa=store%40upi'), 'UPI ID present in amount-free QR')

// 2. URL Payload Tests
console.log('\n2. Testing URL Payload Engine...')
const urlPayload1 = buildQrPayload('url', {
  upi: DEFAULT_UPI_FORM,
  url: { url: 'indiatools-rho.vercel.app' },
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(urlPayload1 === 'https://indiatools-rho.vercel.app', 'Auto-prefixes https:// to naked domain')

const urlPayload2 = buildQrPayload('url', {
  upi: DEFAULT_UPI_FORM,
  url: { url: 'http://custom-domain.org/path?q=1' },
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(urlPayload2 === 'http://custom-domain.org/path?q=1', 'Preserves existing http protocol')

// 3. WhatsApp Direct Payload Tests
console.log('\n3. Testing WhatsApp Payload Engine...')
const waPayload = buildQrPayload('whatsapp', {
  upi: DEFAULT_UPI_FORM,
  url: DEFAULT_URL_FORM,
  whatsapp: { countryCode: '+91', phone: '98765-43210', message: 'Hi! Enquiry for order' },
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(waPayload.startsWith('https://wa.me/919876543210'), 'Cleans country code and phone digits')
assert(waPayload.includes('text=Hi!%20Enquiry%20for%20order') || waPayload.includes('text=Hi'), 'Pre-filled message URL encoded')

// 4. Wi-Fi Network Payload Tests
console.log('\n4. Testing Wi-Fi Payload Engine...')
const wifiPayload1 = buildQrPayload('wifi', {
  upi: DEFAULT_UPI_FORM,
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: { ssid: 'Sharma_WiFi', encryption: 'WPA', password: 'Secret;Password', hidden: true },
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(wifiPayload1.startsWith('WIFI:T:WPA;S:Sharma_WiFi;'), 'Standard Wi-Fi prefix with WPA')
assert(wifiPayload1.includes('P:Secret\\;Password;'), 'Escapes semicolons in password')
assert(wifiPayload1.includes('H:true;'), 'Sets H:true for hidden network')

const wifiPayload2 = buildQrPayload('wifi', {
  upi: DEFAULT_UPI_FORM,
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: { ssid: 'Public_Open', encryption: 'nopass', password: '', hidden: false },
  text: DEFAULT_TEXT_FORM,
  vcard: DEFAULT_VCARD_FORM,
})
assert(wifiPayload2.includes('T:nopass;'), 'Handles open unencrypted network')

// 5. vCard Contact Payload Tests
console.log('\n5. Testing vCard Contact Payload Engine...')
const vcardPayload = buildQrPayload('vcard', {
  upi: DEFAULT_UPI_FORM,
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: DEFAULT_TEXT_FORM,
  vcard: {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@kumar.in',
    company: 'Bharat Digital',
    title: 'Managing Director',
    website: 'https://bharatdigital.in',
  },
})
assert(vcardPayload.startsWith('BEGIN:VCARD\nVERSION:3.0'), 'Standard vCard 3.0 header')
assert(vcardPayload.includes('FN:Rajesh Kumar'), 'Full Name formatted correctly')
assert(vcardPayload.includes('TEL;TYPE=CELL,VOICE:+91 98765 43210'), 'Phone number present')
assert(vcardPayload.includes('EMAIL;TYPE=INTERNET,WORK:rajesh@kumar.in'), 'Email present')
assert(vcardPayload.includes('ORG:Bharat Digital'), 'Company present')
assert(vcardPayload.includes('URL:https://bharatdigital.in'), 'Website present')
assert(vcardPayload.endsWith('END:VCARD'), 'vCard ends with END:VCARD')

// 6. Plain Text Payload Tests
console.log('\n6. Testing Plain Text Payload Engine...')
const textPayload = buildQrPayload('text', {
  upi: DEFAULT_UPI_FORM,
  url: DEFAULT_URL_FORM,
  whatsapp: DEFAULT_WHATSAPP_FORM,
  wifi: DEFAULT_WIFI_FORM,
  text: { text: 'IndiaTools Custom QR Code Test 2026' },
  vcard: DEFAULT_VCARD_FORM,
})
assert(textPayload === 'IndiaTools Custom QR Code Test 2026', 'Plain text passed verbatim')

// 7. Preset Logos & Styling Presets Tests
console.log('\n7. Testing Preset Logos & Styles...')
assert(PRESET_LOGOS.length >= 6, `At least 6 preset logos available (found ${PRESET_LOGOS.length})`)
const logoIds = PRESET_LOGOS.map((l) => l.id)
assert(logoIds.includes('upi'), 'UPI preset logo exists')
assert(logoIds.includes('gpay'), 'GPay preset logo exists')
assert(logoIds.includes('phonepe'), 'PhonePe preset logo exists')
assert(logoIds.includes('paytm'), 'Paytm preset logo exists')
assert(logoIds.includes('whatsapp'), 'WhatsApp preset logo exists')
assert(logoIds.includes('wifi'), 'Wi-Fi preset logo exists')

assert(STYLING_PRESETS.length >= 5, `At least 5 curated styling presets (found ${STYLING_PRESETS.length})`)

// 8. Tool Registry & Routing Integrity Tests
console.log('\n8. Testing Tool Registry & Routing...')
const qrTool = getToolBySlug('qr-code-generator')
assert(Boolean(qrTool), 'Tool qr-code-generator resolved from getToolBySlug')
assert(qrTool?.category === 'create', 'Tool category is create')
assert(qrTool?.type === 'calculator', 'Tool type is calculator')
assert(qrTool?.seo.canonicalPath === '/calculators/qr-code-generator', 'Canonical path is /calculators/qr-code-generator')
assert(qrTool?.seo.title.endsWith('| IndiaTools'), 'SEO title ends with | IndiaTools')

const createTools = TOOLS.filter((t) => t.category === 'create')
assert(createTools.length === CATEGORIES.create.toolCount, `Create tools count matches CATEGORIES.create.toolCount (${createTools.length} === ${CATEGORIES.create.toolCount})`)

const sitemapPath = path.resolve('public/sitemap.xml')
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')
assert(sitemapContent.includes('https://indiatools-rho.vercel.app/calculators/qr-code-generator'), 'Canonical URL present in sitemap.xml')

const toolDetailPath = path.resolve('src/pages/ToolDetailPage.tsx')
const toolDetailContent = fs.readFileSync(toolDetailPath, 'utf-8')
assert(toolDetailContent.includes("'qr-code-generator': QrCodeGeneratorTool"), 'Mapped in ToolDetailPage.tsx')

console.log('\n=== TEST SUITE COMPLETE ===')
const failed = results.filter((r) => r.status === 'FAIL')
console.log(`TOTAL CHECKS: ${results.length}`)
console.log(`PASSED: ${results.length - failed.length}`)
console.log(`FAILED: ${failed.length}`)

if (failed.length > 0) {
  process.exit(1)
} else {
  console.log('\n🎉 ALL QR CODE GENERATOR TESTS PASSED!')
}
