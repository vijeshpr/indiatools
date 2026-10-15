/**
 * Name Slip Maker for Kids – Core Computational & Template Engine
 * 100% Client-Side Privacy, High-DPI Print Calculations, Multi-Student Layouts
 */

export type SlipSizeId = 'small' | 'medium' | 'large'
export type PhotoShape = 'circle' | 'rounded' | 'square'
export type PhotoPosition = 'left' | 'right' | 'top'
export type BackgroundPattern = 'plain' | 'dots' | 'stars' | 'grid' | 'waves' | 'stripes'

export interface StudentProfile {
  id: string
  fullName: string
  className: string
  section: string
  schoolName: string
  rollNumber: string
  bloodGroup: string
  parentPhone: string
  subject: string
  customLabel: string
  customValue: string
  copiesCount: number
  photoId?: string
}

export interface StudentPhoto {
  id: string
  originalDataUrl: string
  processedDataUrl?: string
  isProcessingBg: boolean
  useBgRemoved: boolean
  bgRemovalFailed: boolean
  cropZoom: number // 1 to 2.5
  cropPanX: number // -50 to 50
  cropPanY: number // -50 to 50
  shape: PhotoShape
  fileName: string
}

export interface SlipTemplate {
  id: string
  name: string
  badgeLabel: string
  themeDescription: string
  defaultPrimary: string
  defaultSecondary: string
  defaultText: string
  defaultBorderColor: string
  defaultBgPattern: BackgroundPattern
  headerBg: string
  iconType:
    | 'rocket'
    | 'dino'
    | 'unicorn'
    | 'superhero'
    | 'ocean'
    | 'book'
    | 'flower'
    | 'robot'
    | 'sports'
    | 'teddy'
    | 'doodle'
    | 'heritage'
}

export interface SlipCustomization {
  templateId: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  borderColor: string
  borderWidth: number // 0, 1, 2, 3
  bgPattern: BackgroundPattern
  photoPosition: PhotoPosition
  nameFontSize: 'sm' | 'md' | 'lg' | 'xl'
  detailsFontSize: 'compact' | 'normal' | 'relaxed'
  showTextStroke: boolean
  showBloodGroup: boolean
  showPhone: boolean
  showSchool: boolean
  showRollNo: boolean
  showSubject: boolean
  showCustomField: boolean
  slipSize: SlipSizeId
  showCutGuides: boolean
}

export interface A4PageLayout {
  slipWidthMm: number
  slipHeightMm: number
  columnsPerPage: number
  rowsPerPage: number
  slipsPerPage: number
  marginMm: number
  gapXMm: number
  gapYMm: number
  totalSlips: number
  totalPages: number
}

// 12 Premium Ready-Made Kid-Friendly Templates
export const SLIP_TEMPLATES: SlipTemplate[] = [
  {
    id: 'space_astronaut',
    name: 'Space Explorer',
    badgeLabel: 'Cosmic Star',
    themeDescription: 'Deep cosmic violet, twinkling stars, and an adventurous rocket ship.',
    defaultPrimary: '#4F46E5',
    defaultSecondary: '#7C3AED',
    defaultText: '#1E1B4B',
    defaultBorderColor: '#6366F1',
    defaultBgPattern: 'stars',
    headerBg: 'linear-gradient(135deg, #312E81 0%, #4338CA 50%, #6366F1 100%)',
    iconType: 'rocket'
  },
  {
    id: 'safari_dino',
    name: 'Jungle Dino',
    badgeLabel: 'Safari Pal',
    themeDescription: 'Friendly baby dinosaurs, lush palm leaves, and vibrant mint accents.',
    defaultPrimary: '#059669',
    defaultSecondary: '#10B981',
    defaultText: '#064E3B',
    defaultBorderColor: '#10B981',
    defaultBgPattern: 'dots',
    headerBg: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #34D399 100%)',
    iconType: 'dino'
  },
  {
    id: 'rainbow_unicorn',
    name: 'Rainbow Fairytale',
    badgeLabel: 'Magical Dream',
    themeDescription: 'Soft pastel rainbow gradients, clouds, and delightful sparkles.',
    defaultPrimary: '#DB2777',
    defaultSecondary: '#F472B6',
    defaultText: '#831843',
    defaultBorderColor: '#F472B6',
    defaultBgPattern: 'dots',
    headerBg: 'linear-gradient(135deg, #9D174D 0%, #EC4899 50%, #F472B6 100%)',
    iconType: 'unicorn'
  },
  {
    id: 'superhero_action',
    name: 'Superhero Academy',
    badgeLabel: 'Super Champion',
    themeDescription: 'Bold power shield, action comic burst, and heroic crimson and gold.',
    defaultPrimary: '#DC2626',
    defaultSecondary: '#F59E0B',
    defaultText: '#7F1D1D',
    defaultBorderColor: '#EF4444',
    defaultBgPattern: 'stripes',
    headerBg: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #F59E0B 100%)',
    iconType: 'superhero'
  },
  {
    id: 'ocean_marine',
    name: 'Ocean Odyssey',
    badgeLabel: 'Sea Adventurer',
    themeDescription: 'Aquamarine coral, ocean bubbles, and happy sea friends.',
    defaultPrimary: '#0284C7',
    defaultSecondary: '#38BDF8',
    defaultText: '#0C4A6E',
    defaultBorderColor: '#0EA5E9',
    defaultBgPattern: 'waves',
    headerBg: 'linear-gradient(135deg, #075985 0%, #0284C7 50%, #38BDF8 100%)',
    iconType: 'ocean'
  },
  {
    id: 'modern_minimal',
    name: 'Modern Scholar',
    badgeLabel: 'Clean Academic',
    themeDescription: 'Distinguished slate blue, clean dual-stripe borders, and crisp typography.',
    defaultPrimary: '#1E293B',
    defaultSecondary: '#3B82F6',
    defaultText: '#0F172A',
    defaultBorderColor: '#334155',
    defaultBgPattern: 'plain',
    headerBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #3B82F6 100%)',
    iconType: 'book'
  },
  {
    id: 'floral_sweet',
    name: 'Floral Blossom',
    badgeLabel: 'Sweet Garden',
    themeDescription: 'Gentle peach blossoms, soft watercolor hues, and ribbon accents.',
    defaultPrimary: '#E11D48',
    defaultSecondary: '#FB7185',
    defaultText: '#881337',
    defaultBorderColor: '#FB7185',
    defaultBgPattern: 'dots',
    headerBg: 'linear-gradient(135deg, #9F1239 0%, #E11D48 50%, #FDA4AF 100%)',
    iconType: 'flower'
  },
  {
    id: 'tech_robot',
    name: 'Robotics & STEM',
    badgeLabel: 'Future Genius',
    themeDescription: 'Electric cyan, atom orbits, and a cheerful coding robot.',
    defaultPrimary: '#0891B2',
    defaultSecondary: '#4F46E5',
    defaultText: '#164E63',
    defaultBorderColor: '#06B6D4',
    defaultBgPattern: 'grid',
    headerBg: 'linear-gradient(135deg, #155E75 0%, #0891B2 50%, #6366F1 100%)',
    iconType: 'robot'
  },
  {
    id: 'sports_allstar',
    name: 'Sports Champion',
    badgeLabel: 'All-Star Athlete',
    themeDescription: 'Athletic grass green, trophy gold, and energetic sport stripes.',
    defaultPrimary: '#15803D',
    defaultSecondary: '#EAB308',
    defaultText: '#14532D',
    defaultBorderColor: '#22C55E',
    defaultBgPattern: 'stripes',
    headerBg: 'linear-gradient(135deg, #166534 0%, #15803D 50%, #EAB308 100%)',
    iconType: 'sports'
  },
  {
    id: 'woodland_teddy',
    name: 'Woodland Pals',
    badgeLabel: 'Cozy Bear',
    themeDescription: 'Warm honeycomb amber, smiling teddy bear, and forest leaves.',
    defaultPrimary: '#D97706',
    defaultSecondary: '#FBBF24',
    defaultText: '#78350F',
    defaultBorderColor: '#F59E0B',
    defaultBgPattern: 'dots',
    headerBg: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #FCD34D 100%)',
    iconType: 'teddy'
  },
  {
    id: 'crayon_doodle',
    name: 'Crayon Sketchbook',
    badgeLabel: 'Art Studio',
    themeDescription: 'Colorful notebook doodles, paper tape tags, and playful creativity.',
    defaultPrimary: '#EA580C',
    defaultSecondary: '#F97316',
    defaultText: '#7C2D12',
    defaultBorderColor: '#FB923C',
    defaultBgPattern: 'grid',
    headerBg: 'linear-gradient(135deg, #9A3412 0%, #EA580C 50%, #FBBF24 100%)',
    iconType: 'doodle'
  },
  {
    id: 'heritage_scholar',
    name: 'Heritage India',
    badgeLabel: 'Royal Scholar',
    themeDescription: 'Royal saffron & deep indigo with ornamental Indian geometric corner motifs.',
    defaultPrimary: '#C2410C',
    defaultSecondary: '#4338CA',
    defaultText: '#1E1B4B',
    defaultBorderColor: '#EA580C',
    defaultBgPattern: 'plain',
    headerBg: 'linear-gradient(135deg, #9A3412 0%, #C2410C 50%, #312E81 100%)',
    iconType: 'heritage'
  }
]

// Size configurations on standard A4 (210mm x 297mm)
export const SLIP_SIZE_SPECS: Record<
  SlipSizeId,
  {
    name: string
    subtitle: string
    widthMm: number
    heightMm: number
    cols: number
    rows: number
    slipsPerPage: number
    gapXMm: number
    gapYMm: number
    marginMm: number
  }
> = {
  small: {
    name: 'Small (Notebooks & Pocket)',
    subtitle: '65mm × 35mm • 21 slips per A4 sheet',
    widthMm: 65,
    heightMm: 35,
    cols: 3,
    rows: 7,
    slipsPerPage: 21,
    gapXMm: 4,
    gapYMm: 4,
    marginMm: 6
  },
  medium: {
    name: 'Medium (Textbooks & Diaries)',
    subtitle: '80mm × 45mm • 10 slips per A4 sheet',
    widthMm: 80,
    heightMm: 45,
    cols: 2,
    rows: 5,
    slipsPerPage: 10,
    gapXMm: 10,
    gapYMm: 6,
    marginMm: 12
  },
  large: {
    name: 'Large (Folders, Bags & Project Files)',
    subtitle: '95mm × 55mm • 8 slips per A4 sheet',
    widthMm: 95,
    heightMm: 55,
    cols: 2,
    rows: 4,
    slipsPerPage: 8,
    gapXMm: 8,
    gapYMm: 8,
    marginMm: 12
  }
}

// Compute A4 Layout based on student slip counts
export function calculateA4Layout(
  students: StudentProfile[],
  sizeId: SlipSizeId
): A4PageLayout {
  const spec = SLIP_SIZE_SPECS[sizeId] || SLIP_SIZE_SPECS.medium
  const totalSlips = students.reduce((sum, s) => sum + Math.max(1, s.copiesCount || 1), 0)
  const totalPages = Math.max(1, Math.ceil(totalSlips / spec.slipsPerPage))

  return {
    slipWidthMm: spec.widthMm,
    slipHeightMm: spec.heightMm,
    columnsPerPage: spec.cols,
    rowsPerPage: spec.rows,
    slipsPerPage: spec.slipsPerPage,
    marginMm: spec.marginMm,
    gapXMm: spec.gapXMm,
    gapYMm: spec.gapYMm,
    totalSlips,
    totalPages
  }
}

// Flatten student slips into sequential array for A4 layout rendering
export function generateFlattenedSlips(
  students: StudentProfile[]
): Array<{ student: StudentProfile; copyNumber: number; globalIndex: number }> {
  const result: Array<{ student: StudentProfile; copyNumber: number; globalIndex: number }> = []
  let globalIndex = 0

  students.forEach((student) => {
    const count = Math.max(1, student.copiesCount || 1)
    for (let c = 1; c <= count; c++) {
      result.push({
        student,
        copyNumber: c,
        globalIndex: globalIndex++
      })
    }
  })

  return result
}

// Sample Student Data for 1-Click Demo
export const SAMPLE_STUDENTS: StudentProfile[] = [
  {
    id: 'sample_student_1',
    fullName: 'Aarav Sharma',
    className: 'Class 4',
    section: 'Lotus',
    schoolName: 'Delhi Public School, R.K. Puram',
    rollNumber: '24',
    bloodGroup: 'B +ve',
    parentPhone: '+91 98765 43210',
    subject: 'All Subjects',
    customLabel: 'House',
    customValue: 'Ashoka House (Red)',
    copiesCount: 10,
    photoId: 'sample_photo_aarav'
  },
  {
    id: 'sample_student_2',
    fullName: 'Ananya Nair',
    className: 'Class 1',
    section: 'Rose',
    schoolName: 'Kendriya Vidyalaya, Pattom',
    rollNumber: '08',
    bloodGroup: 'O +ve',
    parentPhone: '+91 98450 12345',
    subject: 'English & Math',
    customLabel: 'Bus Route',
    customValue: 'Route No. 14',
    copiesCount: 10,
    photoId: 'sample_photo_ananya'
  }
]

// Fallback high-contrast avatar generation for demo
export function generateSvgKidAvatar(name: string, primaryColor = '#4F46E5'): string {
  const initial = (name.trim()[0] || 'A').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="#1E1B4B" />
      </linearGradient>
    </defs>
    <circle cx="80" cy="80" r="76" fill="url(#bg)" stroke="#FFFFFF" stroke-width="6" />
    <circle cx="80" cy="62" r="28" fill="#FDE68A" />
    <path d="M 46 126 C 50 96, 110 96, 114 126 Z" fill="#FFFFFF" opacity="0.9" />
    <circle cx="70" cy="60" r="4" fill="#1E293B" />
    <circle cx="90" cy="60" r="4" fill="#1E293B" />
    <path d="M 72 72 Q 80 80, 88 72" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round" />
    <text x="80" y="146" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FDE68A">${initial}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Client-side Background Removal with smart Canvas fallback
export async function performClientBgRemoval(
  imageDataUrl: string
): Promise<{ success: boolean; dataUrl: string; error?: string }> {
  try {
    // Dynamic import to prevent SSR/Node crashes and minimize initial bundle size
    const imgly = await import('@imgly/background-removal')
    const removeBackground = imgly.removeBackground

    const response = await fetch(imageDataUrl)
    const blob = await response.blob()

    const resultBlob = await removeBackground(blob, {
      progress: (key: string, current: number, total: number) => {
        // Optional tracking
      }
    })

    const reader = new FileReader()
    const convertedDataUrl = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(resultBlob)
    })

    return { success: true, dataUrl: convertedDataUrl }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.warn('Background removal library fallback triggered:', errorMsg)
    // Fallback: Return original image smoothly so workflow never breaks
    return { success: false, dataUrl: imageDataUrl, error: errorMsg }
  }
}
