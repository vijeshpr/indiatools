import type { SupportedLanguage, AmountToWordsResult } from './types.ts'
import { getLanguage } from './languages.ts'

/**
 * Format a number into standard Indian numbering representation (e.g. 12,34,567.89)
 */
export function formatInr(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '₹ 0.00'

  const [integerPart, decimalPart = '00'] = Math.abs(num).toFixed(2).split('.')

  // Format integer with Indian comma grouping (last 3 digits, then pairs of 2)
  let lastThree = integerPart.slice(-3)
  const otherNumbers = integerPart.slice(0, -3)

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree
  }

  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
  return `₹ ${formattedInteger}.${decimalPart.padEnd(2, '0').slice(0, 2)}`
}

// ==========================================
// 1. ENGLISH CONVERTER
// ==========================================
const EN_ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
]
const EN_TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
]

function convertTwoDigitsEn(n: number): string {
  if (n < 20) return EN_ONES[n]
  const tens = EN_TENS[Math.floor(n / 10)]
  const ones = EN_ONES[n % 10]
  return ones ? `${tens}-${ones}` : tens
}

function convertThreeDigitsEn(n: number): string {
  const hundred = Math.floor(n / 100)
  const rest = n % 100
  let res = ''
  if (hundred > 0) {
    res += `${EN_ONES[hundred]} Hundred`
  }
  if (rest > 0) {
    if (res) res += ' '
    res += convertTwoDigitsEn(rest)
  }
  return res
}

export function convertToEnglishWords(rupees: number, paise: number = 0): string {
  if (rupees === 0 && paise === 0) return 'Zero Rupees Only'

  const parts: string[] = []

  // Crores (>= 1,00,00,000)
  const crores = Math.floor(rupees / 10000000)
  let remainder = rupees % 10000000

  if (crores > 0) {
    parts.push(`${convertThreeDigitsEn(crores)} Crore${crores > 1 ? 's' : ''}`)
  }

  // Lakhs (>= 1,00,000)
  const lakhs = Math.floor(remainder / 100000)
  remainder = remainder % 100000
  if (lakhs > 0) {
    parts.push(`${convertTwoDigitsEn(lakhs)} Lakh${lakhs > 1 ? 's' : ''}`)
  }

  // Thousands (>= 1,000)
  const thousands = Math.floor(remainder / 1000)
  remainder = remainder % 1000
  if (thousands > 0) {
    parts.push(`${convertTwoDigitsEn(thousands)} Thousand`)
  }

  // Hundreds & rest
  if (remainder > 0) {
    parts.push(convertThreeDigitsEn(remainder))
  }

  let words = ''
  if (parts.length > 0) {
    words = parts.join(' ') + ` ${rupees === 1 ? 'Rupee' : 'Rupees'}`
  }

  if (paise > 0) {
    const paiseWords = convertTwoDigitsEn(paise)
    if (words) {
      words += ` and ${paiseWords} Paise`
    } else {
      words = `${paiseWords} Paise`
    }
  }

  return words ? `${words} Only` : 'Zero Rupees Only'
}

// ==========================================
// 2. MULTI-LANGUAGE NUMBER DATA & HELPERS
// ==========================================

interface LanguageNumberSet {
  zero: string
  ones: string[] // 1-19
  tens: string[] // 20, 30, 40, 50, 60, 70, 80, 90
  hundred: string
  thousand: string
  lakh: string
  crore: string
  rupee: string
  rupees: string
  paise: string
  and: string
  only: string
}

const NUMBER_SETS: Record<SupportedLanguage, LanguageNumberSet> = {
  en: {
    zero: 'Zero',
    ones: EN_ONES,
    tens: EN_TENS,
    hundred: 'Hundred',
    thousand: 'Thousand',
    lakh: 'Lakh',
    crore: 'Crore',
    rupee: 'Rupee',
    rupees: 'Rupees',
    paise: 'Paise',
    and: 'and',
    only: 'Only',
  },
  hi: {
    zero: 'शून्य',
    ones: [
      '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ',
      'दस', 'ग्यारह', ' बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'
    ],
    tens: ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'],
    hundred: 'सौ',
    thousand: 'हज़ार',
    lakh: 'लाख',
    crore: 'करोड़',
    rupee: 'रुपया',
    rupees: 'रुपये',
    paise: 'पैसे',
    and: 'और',
    only: 'मात्र',
  },
  ml: {
    zero: 'പൂജ്യം',
    ones: [
      '', 'ഒന്ന്', 'രണ്ട്', 'മൂന്ന്', 'നാല്', 'അഞ്ച്', 'ആറ്', 'ഏഴ്', 'എട്ട്', 'ഒൻപത്',
      'പത്ത്', 'പതിനൊന്ന്', 'പന്ത്രണ്ട്', 'പതിമൂന്ന്', 'പ tizനാല്', 'പതിനഞ്ച്', 'പതിനാറ്', 'പതിനേഴ്', 'പതിനെട്ട്', 'പത്തൊൻപത്'
    ],
    tens: ['', '', 'ഇരുപത്', 'മുപ്പത്', 'നാൽപ്പത്', 'അൻപത്', 'അറുപത്', 'എഴുപത്', 'എൺപത്', 'തൊണ്ണൂറ്'],
    hundred: 'നൂറ്',
    thousand: 'ആയിരം',
    lakh: 'ലക്ഷം',
    crore: 'കോടി',
    rupee: 'രൂപ',
    rupees: 'രൂപ',
    paise: 'പൈസ',
    and: 'കൂടി',
    only: 'മാത്രം',
  },
  ta: {
    zero: 'பூஜ்ஜியம்',
    ones: [
      '', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது',
      'பத்து', 'பதினொன்று', 'பன்னிரண்டு', 'பதின்மூன்று', 'பதினான்கு', 'பதினைந்து', 'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'
    ],
    tens: ['', '', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொண்ணூறு'],
    hundred: 'நூறு',
    thousand: 'ஆயிரம்',
    lakh: 'லட்சம்',
    crore: 'கோடி',
    rupee: 'ரூபாய்',
    rupees: 'ரூபாய்',
    paise: 'பைசா',
    and: 'மற்றும்',
    only: 'மட்டும்',
  },
  te: {
    zero: 'సున్నా',
    ones: [
      '', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది',
      'పది', 'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పంతొమ్మిది'
    ],
    tens: ['', '', 'ఇరవై', 'ముప్పై', 'నలభై', 'యాభై', 'అరవై', 'డెబ్బై', 'ఎనభై', 'తొంభై'],
    hundred: 'వంద',
    thousand: 'వేలు',
    lakh: 'లక్ష',
    crore: 'కోటి',
    rupee: 'రూపాయి',
    rupees: 'రూపాయలు',
    paise: 'పైసలు',
    and: 'మరియు',
    only: 'మాత్రమే',
  },
  kn: {
    zero: 'ಸೊನ್ನೆ',
    ones: [
      '', 'ಒಂದು', 'ಎರಡು', 'ಮೂರು', 'ನಾಲ್ಕು', 'ಐದು', 'ಆರು', 'ಏಳು', 'ಎಂಟು', 'ಒಂಬತ್ತು',
      'ಹತ್ತು', 'ಹನ್ನೊಂದು', 'ಹನ್ನೆರಡು', 'ಹದಿಮೂರು', 'ಹದಿನಾಲ್ಕು', 'ಹದಿನೈದು', 'ಹದಿನಾರು', 'ಹದಿನೇಳು', 'ಹದಿನೆಂಟು', 'ಹತ್ತೊಂಬತ್ತು'
    ],
    tens: ['', '', 'ಇಪ್ಪತ್ತು', 'ಮೂವತ್ತು', 'ನಲವತ್ತು', 'ಐವತ್ತು', 'ಅರವತ್ತು', 'ಎಪ್ಪತ್ತು', 'ಎಂಬತ್ತು', 'ತೊಂಬತ್ತು'],
    hundred: 'ನೂರು',
    thousand: 'ಸಾವಿರ',
    lakh: 'ಲಕ್ಷ',
    crore: 'ಕೋಟಿ',
    rupee: 'ರೂಪಾಯಿ',
    rupees: 'ರೂಪಾಯಿಗಳು',
    paise: 'ಪೈಸೆ',
    and: 'ಮತ್ತು',
    only: 'ಮಾತ್ರ',
  },
  bn: {
    zero: 'শূন্য',
    ones: [
      '', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
      'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'
    ],
    tens: ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'],
    hundred: 'শত',
    thousand: 'হাজার',
    lakh: 'লাখ',
    crore: 'কোটি',
    rupee: 'টাকা',
    rupees: 'টাকা',
    paise: 'পয়সা',
    and: 'এবং',
    only: 'মাত্র',
  },
  mr: {
    zero: 'शून्य',
    ones: [
      '', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ',
      'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस'
    ],
    tens: ['', '', 'वीस', 'तीस', 'चाळीस', 'पन्नास', 'साठ', 'सत्तर', 'ऐंशी', 'नव्वद'],
    hundred: 'शे',
    thousand: 'हजार',
    lakh: 'लाख',
    crore: 'कोटी',
    rupee: 'रुपया',
    rupees: 'रुपये',
    paise: 'पैसे',
    and: 'आणि',
    only: 'फक्त',
  },
  gu: {
    zero: 'શૂન્ય',
    ones: [
      '', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ',
      'દસ', 'અગિયાર', 'બાર', 'તેર', 'ચૌદ', 'પંદર', 'સોળ', 'સત્તર', 'અઢાર', 'ઓગણીસ'
    ],
    tens: ['', '', 'વીસ', 'ત્રીસ', 'ચાલીસ', 'પચાસ', 'સાઈઠ', 'સિત્તેર', 'એંસી', 'નેવું'],
    hundred: 'સો',
    thousand: 'હજાર',
    lakh: 'લાખ',
    crore: 'કરોડ',
    rupee: 'રૂપિયો',
    rupees: 'રૂપિયા',
    paise: 'પૈસા',
    and: 'અને',
    only: 'પૂરા',
  },
  pa: {
    zero: 'ਸਿਫ਼ਰ',
    ones: [
      '', 'ਇੱਕ', 'ਦੋ', 'ਤਿੰਨ', 'ਚਾਰ', 'ਪੰਜ', 'ਛੇ', 'ਸੱਤ', 'ਅੱਠ', 'ਨੌਂ',
      'ਦਸ', 'ਗਿਆਰਾਂ', 'ਬਾਰਾਂ', 'ਤੇਰਾਂ', 'ਚੌਦਾਂ', 'ਪੰਦਰਾਂ', 'ਸੋਲਾਂ', 'ਸਤਾਰਾਂ', 'ਅਠਾਰਾਂ', 'ਉੱਨੀ'
    ],
    tens: ['', '', 'ਵੀਹ', 'ਤੀਹ', 'ਚਾਲੀ', 'ਪੰਜਾਹ', 'ਸੱਠ', 'ਸੱਤਰ', 'ਅੱਸੀ', 'ਨੱਬੇ'],
    hundred: 'ਸੌ',
    thousand: 'ਹਜ਼ਾਰ',
    lakh: 'ਲੱਖ',
    crore: 'ਕਰੋੜ',
    rupee: 'ਰੁਪਇਆ',
    rupees: 'ਰੁਪਏ',
    paise: 'ਪੈਸੇ',
    and: 'ਅਤੇ',
    only: 'ਕੇਵਲ',
  },
  or: {
    zero: 'ଶୂନ',
    ones: [
      '', 'ଏକ', 'ଦୁଇ', 'ତିନି', 'ଚାରି', 'ପାଞ୍ଚ', 'ଛଅ', 'ସାତ', 'ଆଠ', 'ନଅ',
      'ଦଶ', 'ଏଗାର', 'ବାର', 'ତେର', 'ଚଉଦ', 'ପନ୍ଦର', 'ଷୋହଳ', 'ସତର', 'ଅଠର', 'ଉଣାଇଶ'
    ],
    tens: ['', '', 'କୋଡ଼ିଏ', 'ତିରିଶ', 'ଚାଳିଶ', 'ପଚାଶ', 'ଷାଠିଏ', 'ସତୁରି', 'ଅଶୀ', 'ନବ୍ବେ'],
    hundred: 'ଶହ',
    thousand: 'ହଜାର',
    lakh: 'ଲକ୍ଷ',
    crore: 'କୋଟି',
    rupee: 'ଟଙ୍କା',
    rupees: 'ଟଙ୍କା',
    paise: 'ପଇସା',
    and: 'ଏବଂ',
    only: 'ମାତ୍ର',
  },
  as: {
    zero: 'শূন্য',
    ones: [
      '', 'এক', 'দুই', 'তিনি', 'চাৰি', 'পাঁচ', 'ছয়', 'সাত', 'আঠ', 'ন',
      'দহ', 'এঘাৰ', 'বাৰ', 'তেৰ', 'চৈধ্য', 'পোন্ধৰ', 'ষোল্ল', 'সোতৰ', 'ওঠৰ', 'ঊনৈশ'
    ],
    tens: ['', '', 'বিছ', 'ত্ৰিছ', 'চল্লিছ', 'পঞ্চাছ', 'ষাঠি', 'সত্তৰ', 'আশী', 'নব্বৈ'],
    hundred: 'শত',
    thousand: 'হাজাৰ',
    lakh: 'লাখ',
    crore: 'কোটি',
    rupee: 'টকা',
    rupees: 'টকা',
    paise: 'পইচা',
    and: 'আৰু',
    only: 'মাত্ৰ',
  },
  ur: {
    zero: 'صفر',
    ones: [
      '', 'ایک', 'دو', 'تین', 'چار', 'پانچ', 'چھ', 'سات', 'آٹھ', 'نو',
      'دس', 'گیارہ', 'بارہ', 'تیرہ', 'چودہ', 'پندرہ', 'سولہ', 'سترہ', 'اٹھارہ', 'انیس'
    ],
    tens: ['', '', 'بیس', 'تیس', 'چالیس', 'پچاس', 'ساٹھ', 'ستر', 'اسی', 'نوے'],
    hundred: 'سو',
    thousand: 'ہزار',
    lakh: 'لاکھ',
    crore: 'کروڑ',
    rupee: 'روپیہ',
    rupees: 'روپے',
    paise: 'پیسے',
    and: 'اور',
    only: 'فقط',
  },
}

function convertTwoDigitsGeneric(n: number, set: LanguageNumberSet): string {
  if (n < 20) return set.ones[n] || ''
  const t = Math.floor(n / 10)
  const o = n % 10
  const tenWord = set.tens[t] || ''
  const oneWord = set.ones[o] || ''
  return oneWord ? `${tenWord} ${oneWord}` : tenWord
}

function convertThreeDigitsGeneric(n: number, set: LanguageNumberSet): string {
  const h = Math.floor(n / 100)
  const r = n % 100
  let res = ''
  if (h > 0) {
    const oneWord = set.ones[h] || ''
    res += `${oneWord} ${set.hundred}`
  }
  if (r > 0) {
    if (res) res += ' '
    res += convertTwoDigitsGeneric(r, set)
  }
  return res
}

/**
 * Convert any Indian Rupee amount to words in any of the 13 supported languages.
 */
export function convertAmountToWords(
  amount: number | string,
  paiseAmount: number | string = 0,
  langCode: SupportedLanguage = 'en'
): AmountToWordsResult {
  const numRupees = Math.floor(Math.abs(typeof amount === 'string' ? parseFloat(amount) || 0 : amount))
  const numPaise = Math.min(99, Math.max(0, Math.floor(Math.abs(typeof paiseAmount === 'string' ? parseInt(paiseAmount, 10) || 0 : paiseAmount))))

  // Always compute English as the gold standard baseline
  const englishWords = convertToEnglishWords(numRupees, numPaise)
  const formattedInr = formatInr(numRupees + numPaise / 100)

  if (langCode === 'en') {
    return {
      words: englishWords,
      wordsInEnglish: englishWords,
      language: 'en',
      isFallback: false,
      formattedInr,
    }
  }

  const set = NUMBER_SETS[langCode]
  if (!set) {
    return {
      words: englishWords,
      wordsInEnglish: englishWords,
      language: langCode,
      isFallback: true,
      formattedInr,
    }
  }

  if (numRupees === 0 && numPaise === 0) {
    return {
      words: `${set.zero} ${set.rupees} ${set.only}`,
      wordsInEnglish: englishWords,
      language: langCode,
      isFallback: false,
      formattedInr,
    }
  }

  const parts: string[] = []

  // Crores
  const crores = Math.floor(numRupees / 10000000)
  let remainder = numRupees % 10000000
  if (crores > 0) {
    parts.push(`${convertThreeDigitsGeneric(crores, set)} ${set.crore}`)
  }

  // Lakhs
  const lakhs = Math.floor(remainder / 100000)
  remainder = remainder % 100000
  if (lakhs > 0) {
    parts.push(`${convertTwoDigitsGeneric(lakhs, set)} ${set.lakh}`)
  }

  // Thousands
  const thousands = Math.floor(remainder / 1000)
  remainder = remainder % 1000
  if (thousands > 0) {
    parts.push(`${convertTwoDigitsGeneric(thousands, set)} ${set.thousand}`)
  }

  // Hundreds and rest
  if (remainder > 0) {
    parts.push(convertThreeDigitsGeneric(remainder, set))
  }

  let finalWords = ''
  if (parts.length > 0) {
    const currencyStr = numRupees === 1 ? set.rupee : set.rupees
    finalWords = parts.join(' ') + ` ${currencyStr}`
  }

  if (numPaise > 0) {
    const paiseWords = convertTwoDigitsGeneric(numPaise, set)
    if (finalWords) {
      finalWords += ` ${set.and} ${paiseWords} ${set.paise}`
    } else {
      finalWords = `${paiseWords} ${set.paise}`
    }
  }

  if (finalWords) {
    finalWords += ` ${set.only}`
  } else {
    finalWords = `${set.zero} ${set.rupees} ${set.only}`
  }

  return {
    words: finalWords.replace(/\s+/g, ' ').trim(),
    wordsInEnglish: englishWords,
    language: langCode,
    isFallback: false,
    formattedInr,
  }
}
