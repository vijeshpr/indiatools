export type QrType = 'upi' | 'url' | 'whatsapp' | 'wifi' | 'text' | 'vcard'

export interface UpiFormData {
  upiId: string
  payeeName: string
  amount: string
  note: string
  merchantPhone?: string
}

export type PosterSize = 'a5' | 'a4'

export interface PosterConfig {
  enabled: boolean
  size: PosterSize
  tagline: string
  themeColor: string
}

export const DEFAULT_POSTER_CONFIG: PosterConfig = {
  enabled: false,
  size: 'a5',
  tagline: 'Scan & Pay with Any UPI App',
  themeColor: '#0F172A',
}

export interface UrlFormData {
  url: string
}

export interface WhatsAppFormData {
  countryCode: string
  phone: string
  message: string
}

export interface WifiFormData {
  ssid: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  password: string
  hidden: boolean
}

export interface TextFormData {
  text: string
}

export interface VCardFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  company: string
  title: string
  website: string
}

export type DotStyleType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
export type CornerSquareStyleType = 'square' | 'dot' | 'extra-rounded'
export type CornerDotStyleType = 'square' | 'dot'
export type ColorMode = 'single' | 'gradient'
export type GradientType = 'linear' | 'radial'
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type ExportResolution = 512 | 1024 | 2048

export interface QrStylingConfig {
  dotType: DotStyleType
  cornerSquareType: CornerSquareStyleType
  cornerDotType: CornerDotStyleType
  colorMode: ColorMode
  fgColor: string
  gradientType: GradientType
  gradientColor1: string
  gradientColor2: string
  gradientRotation: number
  bgColor: string
  bgTransparent: boolean
  customCornerColors: boolean
  cornerSquareColor: string
  cornerDotColor: string
  logoUrl: string
  logoSize: number
  logoMargin: number
  hideBackgroundDots: boolean
  qrMargin: number
  errorCorrection: ErrorCorrectionLevel
}

export const DEFAULT_UPI_FORM: UpiFormData = {
  upiId: 'merchant@okaxis',
  payeeName: 'Sharma General Store',
  amount: '',
  note: 'Payment for groceries',
  merchantPhone: '+91 98765 43210',
}

export const DEFAULT_URL_FORM: UrlFormData = {
  url: 'https://indiatools-rho.vercel.app',
}

export const DEFAULT_WHATSAPP_FORM: WhatsAppFormData = {
  countryCode: '+91',
  phone: '9876543210',
  message: 'Hello! I would like to enquire about your services.',
}

export const DEFAULT_WIFI_FORM: WifiFormData = {
  ssid: 'Sharma_Fiber_5G',
  encryption: 'WPA',
  password: 'Password@2025',
  hidden: false,
}

export const DEFAULT_TEXT_FORM: TextFormData = {
  text: 'Welcome to IndiaTools — 100% Free, Private Indian Everyday Web Tools.',
}

export const DEFAULT_VCARD_FORM: VCardFormData = {
  firstName: 'Rajesh',
  lastName: 'Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@business.in',
  company: 'Bharat Digital Enterprises',
  title: 'Managing Director',
  website: 'https://bharatdigital.in',
}

export const DEFAULT_STYLING: QrStylingConfig = {
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  colorMode: 'gradient',
  fgColor: '#0F172A',
  gradientType: 'linear',
  gradientColor1: '#0F172A',
  gradientColor2: '#2563EB',
  gradientRotation: 45,
  bgColor: '#FFFFFF',
  bgTransparent: false,
  customCornerColors: false,
  cornerSquareColor: '#1E40AF',
  cornerDotColor: '#2563EB',
  logoUrl: '',
  logoSize: 0.32,
  logoMargin: 6,
  hideBackgroundDots: true,
  qrMargin: 10,
  errorCorrection: 'Q',
}

/**
 * Escapes characters for Wi-Fi QR encoding
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1')
}

/**
 * Sanitizes phone number by removing spaces, hyphens, and leading plus
 */
function cleanPhoneNumber(countryCode: string, phone: string): string {
  const code = countryCode.replace(/\D/g, '')
  const num = phone.replace(/\D/g, '')
  return `${code}${num}`
}

/**
 * Generates the standardized QR payload string for any QR code type
 */
export function buildQrPayload(
  type: QrType,
  data: {
    upi: UpiFormData
    url: UrlFormData
    whatsapp: WhatsAppFormData
    wifi: WifiFormData
    text: TextFormData
    vcard: VCardFormData
  }
): string {
  switch (type) {
    case 'upi': {
      const { upiId, payeeName, amount, note } = data.upi
      if (!upiId.trim()) return 'upi://pay?pa=merchant@upi'

      const params = new URLSearchParams()
      params.set('pa', upiId.trim())
      if (payeeName.trim()) params.set('pn', payeeName.trim())
      if (amount.trim() && !isNaN(Number(amount))) {
        params.set('am', Number(amount).toFixed(2))
      }
      params.set('cu', 'INR')
      if (note.trim()) params.set('tn', note.trim())

      return `upi://pay?${params.toString()}`
    }

    case 'url': {
      const raw = data.url.url.trim()
      if (!raw) return 'https://indiatools-rho.vercel.app'
      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(raw)) {
        return raw
      }
      return `https://${raw}`
    }

    case 'whatsapp': {
      const { countryCode, phone, message } = data.whatsapp
      const fullPhone = cleanPhoneNumber(countryCode, phone)
      if (!fullPhone) return 'https://wa.me/919876543210'

      const base = `https://wa.me/${fullPhone}`
      if (message.trim()) {
        return `${base}?text=${encodeURIComponent(message.trim())}`
      }
      return base
    }

    case 'wifi': {
      const { ssid, encryption, password, hidden } = data.wifi
      if (!ssid.trim()) return 'WIFI:T:WPA;S:HomeWiFi;P:Password123;;'

      const enc = encryption === 'nopass' ? 'nopass' : encryption
      const pass = enc === 'nopass' ? '' : escapeWifiString(password)
      const s = escapeWifiString(ssid.trim())
      const h = hidden ? 'H:true;' : ''

      return `WIFI:T:${enc};S:${s};P:${pass};${h};`
    }

    case 'vcard': {
      const { firstName, lastName, phone, email, company, title, website } = data.vcard
      const fn = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || 'Contact Person'
      
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName.trim()};${firstName.trim()};;;`,
        `FN:${fn}`,
      ]
      if (phone.trim()) lines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`)
      if (email.trim()) lines.push(`EMAIL;TYPE=INTERNET,WORK:${email.trim()}`)
      if (company.trim()) lines.push(`ORG:${company.trim()}`)
      if (title.trim()) lines.push(`TITLE:${title.trim()}`)
      if (website.trim()) {
        const url = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(website.trim())
          ? website.trim()
          : `https://${website.trim()}`
        lines.push(`URL:${url}`)
      }
      lines.push('END:VCARD')
      return lines.join('\n')
    }

    case 'text':
    default: {
      return data.text.text.trim() || 'IndiaTools QR'
    }
  }
}
