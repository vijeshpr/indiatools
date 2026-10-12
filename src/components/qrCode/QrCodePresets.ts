export interface PresetLogo {
  id: string
  name: string
  category: 'payment' | 'social' | 'network' | 'none'
  svgDataUri: string
  previewBg: string
}

export interface StylingPreset {
  id: string
  name: string
  tag: string
  colorMode: 'single' | 'gradient'
  fgColor: string
  gradientType: 'linear' | 'radial'
  gradientColor1: string
  gradientColor2: string
  gradientRotation: number
  bgColor: string
  dotType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  cornerSquareType: 'square' | 'dot' | 'extra-rounded'
  cornerDotType: 'square' | 'dot'
}

// Crisp inline SVGs encoded as data URIs for 100% offline client-side rendering
export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'none',
    name: 'No Logo',
    category: 'none',
    svgDataUri: '',
    previewBg: 'bg-transparent',
  },
  {
    id: 'upi',
    name: 'BHIM UPI',
    category: 'payment',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/><polygon points="58,22 68,48 48,48" fill="#09793A"/><polygon points="42,78 32,52 52,52" fill="#E86C1D"/><text x="50" y="58" font-family="Arial,sans-serif" font-weight="900" font-size="22" fill="#1C3F94" text-anchor="middle">UPI</text></svg>`
    )}`,
    previewBg: 'bg-white',
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    category: 'payment',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/><path d="M 68 50 C 68 48.6 67.8 47.3 67.5 46 L 50 46 L 50 53.6 L 60.2 53.6 C 59.7 56.1 58.2 58.3 56 59.8 L 62.7 65 C 66.6 61.4 68.8 56.2 68.8 50 Z" fill="#4285F4"/><path d="M 50 69 C 55.1 69 59.5 67.3 62.7 64.4 L 56 59.2 C 54.1 60.5 51.8 61.3 50 61.3 C 44.9 61.3 40.5 57.9 39 53.1 L 32.1 58.4 C 35.5 65.1 42.2 69 50 69 Z" fill="#34A853"/><path d="M 39 53 C 38.6 51.8 38.4 50.4 38.4 49 C 38.4 47.6 38.6 46.2 39 45 L 32.1 39.6 C 30.6 42.4 29.8 45.6 29.8 49 C 29.8 52.4 30.6 55.6 32.1 58.4 L 39 53 Z" fill="#FBBC05"/><path d="M 50 36.7 C 52.8 36.7 55.3 37.7 57.3 39.5 L 62.9 33.9 C 59.4 30.7 55 29 50 29 C 42.2 29 35.5 32.9 32.1 39.6 L 39 45 C 40.5 40.1 44.9 36.7 50 36.7 Z" fill="#EA4335"/></svg>`
    )}`,
    previewBg: 'bg-white',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'payment',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#5F259F"/><path d="M 55 24 L 38 24 C 35.8 24 34 25.8 34 28 L 34 72 C 34 74.2 35.8 76 38 76 L 43 76 C 45.2 76 47 74.2 47 72 L 47 56 L 55 56 C 65 56 72 49 72 40 C 72 31 65 24 55 24 Z M 54 46 L 47 46 L 47 34 L 54 34 C 58 34 61 36.5 61 40 C 61 43.5 58 46 54 46 Z" fill="#FFFFFF"/></svg>`
    )}`,
    previewBg: 'bg-[#5F259F]',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    category: 'payment',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#00BAF2" stroke-width="2"/><text x="50" y="58" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#002970" text-anchor="middle">Pay<tspan fill="#00BAF2">tm</tspan></text></svg>`
    )}`,
    previewBg: 'bg-white',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#25D366"/><path d="M 50 20 C 33.4 20 20 33.4 20 50 C 20 56.1 21.8 61.8 25 66.6 L 22 78 L 34 74.3 C 38.6 77.3 44.1 79 50 79 C 66.6 79 80 65.6 80 50 C 80 33.4 66.6 20 50 20 Z" fill="#FFFFFF"/><path d="M 62.5 58.5 C 61.8 60.5 58.9 62.1 56.7 62.5 C 54.7 62.8 52.3 62.9 45.4 59.8 C 39.5 57.2 35.6 51.3 35.3 50.9 C 35 50.5 33 47.9 33 45.1 C 33 42.4 34.4 41 35 40.4 C 35.5 39.9 36.3 39.6 37.1 39.6 C 37.4 39.6 37.7 39.6 37.9 39.6 C 38.6 39.6 39 39.7 39.5 40.8 C 40.1 42.3 41.5 45.8 41.7 46.2 C 41.9 46.6 42 47.1 41.7 47.6 C 41.4 48.1 41.2 48.3 40.8 48.8 C 40.4 49.3 40.1 49.6 40.6 50.4 C 41.1 51.2 42.8 54 45.4 56.3 C 48.7 59.2 51.4 60.1 52.2 60.5 C 53 60.9 53.5 60.8 54 60.2 C 54.6 59.5 56.6 57.2 57.3 56.1 C 57.9 55.2 58.5 55.3 59.3 55.6 C 60.1 55.9 64.4 58 65.3 58.5 C 66.2 59 66.7 59.2 66.9 59.6 C 67.1 60 67.1 62.1 62.5 58.5 Z" fill="#25D366"/></svg>`
    )}`,
    previewBg: 'bg-[#25D366]',
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Signal',
    category: 'network',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#4F46E5"/><circle cx="50" cy="72" r="5" fill="#FFFFFF"/><path d="M 36 56 A 18 18 0 0 1 64 56" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M 26 44 A 32 32 0 0 1 74 44" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M 16 32 A 46 46 0 0 1 84 32" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`
    )}`,
    previewBg: 'bg-[#4F46E5]',
  },
]

export const STYLING_PRESETS: StylingPreset[] = [
  {
    id: 'fintech-navy',
    name: 'Fintech Navy',
    tag: 'Recommended for UPI',
    colorMode: 'gradient',
    fgColor: '#0B132B',
    gradientType: 'linear',
    gradientColor1: '#0B132B',
    gradientColor2: '#2563EB',
    gradientRotation: 45,
    bgColor: '#FFFFFF',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
  },
  {
    id: 'classic-black',
    name: 'Classic Black',
    tag: 'High Contrast',
    colorMode: 'single',
    fgColor: '#000000',
    gradientType: 'linear',
    gradientColor1: '#000000',
    gradientColor2: '#000000',
    gradientRotation: 0,
    bgColor: '#FFFFFF',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Merchant',
    tag: 'Fresh & Trustworthy',
    colorMode: 'gradient',
    fgColor: '#064E3B',
    gradientType: 'linear',
    gradientColor1: '#064E3B',
    gradientColor2: '#059669',
    gradientRotation: 60,
    bgColor: '#FFFFFF',
    dotType: 'classy',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    tag: 'Warm & Vibrant',
    colorMode: 'gradient',
    fgColor: '#B45309',
    gradientType: 'linear',
    gradientColor1: '#D97706',
    gradientColor2: '#DC2626',
    gradientRotation: 45,
    bgColor: '#FFFFFF',
    dotType: 'dots',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    tag: 'Modern Tech',
    colorMode: 'gradient',
    fgColor: '#4338CA',
    gradientType: 'linear',
    gradientColor1: '#4F46E5',
    gradientColor2: '#7C3AED',
    gradientRotation: 90,
    bgColor: '#FFFFFF',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
  },
]
