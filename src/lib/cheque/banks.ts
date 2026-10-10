import type { BankInfo, BankCategory } from './types.ts'

export const BANKS: BankInfo[] = [
  // ==========================================
  // 1. PUBLIC SECTOR BANKS
  // ==========================================
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#00539F', // SBI Royal Blue
    accentColor: '#2885D0',
    branchPlaceholder: 'NARIMAN POINT BRANCH, MUMBAI 400021',
    ifscPrefix: 'SBIN0000300',
    tagline: 'The Banker to Every Indian',
    isPopular: true,
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank',
    shortName: 'PNB',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#A21420', // PNB Crimson Red
    accentColor: '#FFB81C',
    branchPlaceholder: 'SANSAD MARG BRANCH, NEW DELHI 110001',
    ifscPrefix: 'PUNB0000100',
    tagline: 'The Name You Can Bank Upon',
    isPopular: true,
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    shortName: 'Bank of Baroda',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#F26522', // BOB Vermilion Orange
    accentColor: '#005A9C',
    branchPlaceholder: 'ALKAPURI BRANCH, VADODARA 390007',
    ifscPrefix: 'BARB0ALKMUM',
    tagline: "India's International Bank",
    isPopular: true,
  },
  {
    id: 'canara',
    name: 'Canara Bank',
    shortName: 'Canara Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#0091DF', // Canara Cyan Blue
    accentColor: '#FFCC00',
    branchPlaceholder: 'TOWN HALL BRANCH, BANGALORE 560002',
    ifscPrefix: 'CNRB0000100',
    tagline: 'Together We Can',
    isPopular: true,
  },
  {
    id: 'ubi',
    name: 'Union Bank of India',
    shortName: 'Union Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#ED1C24', // Union Bank Red
    accentColor: '#0B4EA2',
    branchPlaceholder: 'VIDHAN BHAVAN MARG, MUMBAI 400021',
    ifscPrefix: 'UBIN0530018',
    tagline: 'Good People to Bank With',
    isPopular: true,
  },
  {
    id: 'indian-bank',
    name: 'Indian Bank',
    shortName: 'Indian Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#1A3668', // Deep Navy
    accentColor: '#EAA812',
    branchPlaceholder: 'RAJAJI SALAI BRANCH, CHENNAI 600001',
    ifscPrefix: 'IDIB000M001',
    tagline: 'Taking Banking Technology to the Common Man',
    isPopular: true,
  },
  {
    id: 'boi',
    name: 'Bank of India',
    shortName: 'Bank of India',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#D9480F', // BOI Saffron Orange
    accentColor: '#1864AB',
    branchPlaceholder: 'BANDRA KURLA COMPLEX, MUMBAI 400051',
    ifscPrefix: 'BKID0000101',
    tagline: 'Relationships Beyond Banking',
    isPopular: false,
  },
  {
    id: 'central-bank',
    name: 'Central Bank of India',
    shortName: 'Central Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#0C4A60',
    accentColor: '#EF5B5B',
    branchPlaceholder: 'CHANDER MUKHI, NARIMAN POINT, MUMBAI 400021',
    ifscPrefix: 'CBIN0280001',
    tagline: 'Central to You Since 1911',
    isPopular: false,
  },
  {
    id: 'iob',
    name: 'Indian Overseas Bank',
    shortName: 'IOB',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#19398A',
    accentColor: '#F58220',
    branchPlaceholder: 'ANNA SALAI, MOUNT ROAD, CHENNAI 600002',
    ifscPrefix: 'IOBA0000001',
    tagline: 'Good People to Grow With',
    isPopular: false,
  },
  {
    id: 'uco',
    name: 'UCO Bank',
    shortName: 'UCO Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#005BAC',
    accentColor: '#FFB81C',
    branchPlaceholder: 'BTM SARANI, KOLKATA 700001',
    ifscPrefix: 'UCBA0000001',
    tagline: 'Honours Your Trust',
    isPopular: false,
  },
  {
    id: 'bom',
    name: 'Bank of Maharashtra',
    shortName: 'Maha Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#0E3A74',
    accentColor: '#F18701',
    branchPlaceholder: 'LOKMANGAL, SHIVAJINAGAR, PUNE 411005',
    ifscPrefix: 'MAHB0000001',
    tagline: 'Ek Parivaar, Ek Bank',
    isPopular: false,
  },
  {
    id: 'psb',
    name: 'Punjab & Sind Bank',
    shortName: 'Punjab & Sind Bank',
    category: 'public',
    categoryLabel: 'Public Sector',
    themeColor: '#BA8B02',
    accentColor: '#0B2545',
    branchPlaceholder: 'RAJENDRA PLACE, NEW DELHI 110008',
    ifscPrefix: 'PSIB0000001',
    tagline: 'Where Service is a Way of Life',
    isPopular: false,
  },

  // ==========================================
  // 2. PRIVATE SECTOR BANKS
  // ==========================================
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#004C8F', // HDFC Navy
    accentColor: '#ED232A', // HDFC Red
    branchPlaceholder: 'SENAPATI BAPAT MARG, LOWER PAREL, MUMBAI 400013',
    ifscPrefix: 'HDFC0000001',
    tagline: 'We Understand Your World',
    isPopular: true,
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#B02A30', // ICICI Dark Maroon
    accentColor: '#F58220', // ICICI Marigold
    branchPlaceholder: 'BANDRA KURLA COMPLEX, MUMBAI 400051',
    ifscPrefix: 'ICIC0000001',
    tagline: 'Hum Hai Na, Khayal Aapka',
    isPopular: true,
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#97144D', // Axis Burgundy
    accentColor: '#C41230',
    branchPlaceholder: 'WORLI EXTENSION, MUMBAI 400025',
    ifscPrefix: 'UTIB0000001',
    tagline: 'Badhti Ka Naam Zindagi',
    isPopular: true,
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#DA251D', // Kotak Crimson
    accentColor: '#003366',
    branchPlaceholder: 'BKC ROAD, BANDRA EAST, MUMBAI 400051',
    ifscPrefix: 'KKBK0000001',
    tagline: "Let's Make Money Simple",
    isPopular: true,
  },
  {
    id: 'idfc-first',
    name: 'IDFC FIRST Bank',
    shortName: 'IDFC FIRST',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#800020', // Burgundy
    accentColor: '#A31D33',
    branchPlaceholder: 'KHAMBATTA HALL, CHURCHGATE, MUMBAI 400020',
    ifscPrefix: 'IDFB0040101',
    tagline: 'Always You First',
    isPopular: true,
  },
  {
    id: 'federal',
    name: 'Federal Bank',
    shortName: 'Federal Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#002F6C', // Royal Blue
    accentColor: '#FED100', // Gold Yellow
    branchPlaceholder: 'FEDERAL TOWERS, ALUVA, ERNAKULAM 683101',
    ifscPrefix: 'FDRL0001001',
    tagline: 'Your Perfect Banking Partner',
    isPopular: true,
  },
  {
    id: 'south-indian',
    name: 'South Indian Bank',
    shortName: 'SIB',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#A6192E',
    accentColor: '#D99B26',
    branchPlaceholder: 'T.B ROAD, MISSION QUARTERS, THRISSUR 680001',
    ifscPrefix: 'SIBL0000001',
    tagline: 'Experience Next Generation Banking',
    isPopular: true,
  },
  {
    id: 'indusind',
    name: 'IndusInd Bank',
    shortName: 'IndusInd',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#781D22',
    accentColor: '#C41230',
    branchPlaceholder: 'SOLITAIRE PARK, CHAKALA, MUMBAI 400093',
    ifscPrefix: 'INDB0000001',
    tagline: 'We Make You Feel Richer',
    isPopular: false,
  },
  {
    id: 'yes-bank',
    name: 'YES Bank',
    shortName: 'YES Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#004B87',
    accentColor: '#D71920',
    branchPlaceholder: 'SANTACRUZ EAST, MUMBAI 400055',
    ifscPrefix: 'YESB0000001',
    tagline: 'Experience Our Expertise',
    isPopular: false,
  },
  {
    id: 'bandhan',
    name: 'Bandhan Bank',
    shortName: 'Bandhan Bank',
    category: 'private',
    categoryLabel: 'Private Sector',
    themeColor: '#0F2537',
    accentColor: '#C72026',
    branchPlaceholder: 'SECTOR V, SALT LAKE CITY, KOLKATA 700091',
    ifscPrefix: 'BDBL0000001',
    tagline: 'Aapka Bhala, Sabki Bhalai',
    isPopular: false,
  },

  // ==========================================
  // 3. REGIONAL RURAL BANKS (RRBs)
  // ==========================================
  {
    id: 'kerala-gramin',
    name: 'Kerala Gramin Bank',
    shortName: 'Kerala Gramin Bank',
    category: 'rrb',
    categoryLabel: 'Regional Rural Bank',
    themeColor: '#0B4F6C',
    accentColor: '#20BF55',
    branchPlaceholder: 'HEAD OFFICE, MALAPPURAM 676505',
    ifscPrefix: 'KLGB0040101',
    tagline: 'Keralathinte Swantham Gramin Bank',
    isPopular: true,
  },
  {
    id: 'baroda-up',
    name: 'Baroda UP Bank',
    shortName: 'Baroda UP Bank',
    category: 'rrb',
    categoryLabel: 'Regional Rural Bank',
    themeColor: '#E65100',
    accentColor: '#1565C0',
    branchPlaceholder: 'BUDDH VIHAR, GORAKHPUR, UP 273016',
    ifscPrefix: 'BARB0BUPGBX',
    tagline: 'Empowering Rural Uttar Pradesh',
    isPopular: false,
  },
  {
    id: 'aryavart',
    name: 'Aryavart Bank',
    shortName: 'Aryavart Bank',
    category: 'rrb',
    categoryLabel: 'Regional Rural Bank',
    themeColor: '#1B5E20',
    accentColor: '#F57F17',
    branchPlaceholder: 'GOMTI NAGAR, LUCKNOW, UP 226010',
    ifscPrefix: 'BKID0ARYAGB',
    tagline: 'Prosperity Through Rural Banking',
    isPopular: false,
  },
  {
    id: 'karnataka-gramin',
    name: 'Karnataka Gramin Bank',
    shortName: 'Karnataka Gramin',
    category: 'rrb',
    categoryLabel: 'Regional Rural Bank',
    themeColor: '#00695C',
    accentColor: '#FFB300',
    branchPlaceholder: 'GANDHI NAGAR, BALLARI, KARNATAKA 583103',
    ifscPrefix: 'PKGB0010101',
    tagline: 'Namma Gramin Bank',
    isPopular: false,
  },
  {
    id: 'apgv',
    name: 'Andhra Pradesh Grameena Vikas Bank',
    shortName: 'APGVB',
    category: 'rrb',
    categoryLabel: 'Regional Rural Bank',
    themeColor: '#0277BD',
    accentColor: '#F57C00',
    branchPlaceholder: 'HANMAKONDA, WARANGAL, TELANGANA 506001',
    ifscPrefix: 'SBIN0RRAPGV',
    tagline: 'Serving Rural Telangana & Andhra Pradesh',
    isPopular: false,
  },

  // ==========================================
  // 4. COOPERATIVE BANKS
  // ==========================================
  {
    id: 'saraswat',
    name: 'Saraswat Co-operative Bank',
    shortName: 'Saraswat Bank',
    category: 'cooperative',
    categoryLabel: 'Urban Co-operative Bank',
    themeColor: '#C41E3A',
    accentColor: '#0B3C5D',
    branchPlaceholder: 'PRABHADEVI BRANCH, MUMBAI 400025',
    ifscPrefix: 'SRCB0000001',
    tagline: 'Most Trusted Multi-State Scheduled Bank',
    isPopular: true,
  },
  {
    id: 'cosmos',
    name: 'Cosmos Co-operative Bank',
    shortName: 'Cosmos Bank',
    category: 'cooperative',
    categoryLabel: 'Urban Co-operative Bank',
    themeColor: '#003366',
    accentColor: '#F39C12',
    branchPlaceholder: 'SHIVAJINAGAR, PUNE 411005',
    ifscPrefix: 'COSB0000001',
    tagline: 'Financial Excellence Since 1906',
    isPopular: false,
  },
  {
    id: 'svc',
    name: 'SVC Co-operative Bank',
    shortName: 'SVC Bank',
    category: 'cooperative',
    categoryLabel: 'Urban Co-operative Bank',
    themeColor: '#1A4480',
    accentColor: '#E66000',
    branchPlaceholder: 'VAKOLA, SANTACRUZ EAST, MUMBAI 400055',
    ifscPrefix: 'SVCB0000001',
    tagline: 'Community Banking Excellence',
    isPopular: false,
  },

  // ==========================================
  // 5. STANDARD GENERIC INDIAN CTS-2010 CHEQUE
  // ==========================================
  {
    id: 'generic',
    name: 'Generic Indian Bank (CTS-2010 Standard)',
    shortName: 'Generic CTS-2010',
    category: 'public',
    categoryLabel: 'Universal Standard',
    themeColor: '#1E293B', // Slate Charcoal
    accentColor: '#D97706', // Amber Gold
    branchPlaceholder: 'CENTRAL BRANCH, CITY PLAZA, NEW DELHI 110001',
    ifscPrefix: 'UTIB0000999',
    tagline: 'RBI Standard CTS-2010 Educational Model',
    isPopular: true,
  },
]

export function getBankById(id: string): BankInfo {
  return BANKS.find((b) => b.id === id) || BANKS[0]
}

export function filterBanks(query: string, category: BankCategory | 'all'): BankInfo[] {
  const q = query.toLowerCase().trim()
  return BANKS.filter((b) => {
    const matchesCat = category === 'all' || b.category === category
    const matchesQuery =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      b.categoryLabel.toLowerCase().includes(q) ||
      b.ifscPrefix.toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })
}
