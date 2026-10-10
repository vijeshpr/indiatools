import type { SupportedLanguage } from '../lib/cheque/types'

export interface ChequeFaqItem {
  question: string
  answer: string
}

export interface ChequeGuideStep {
  stepNumber: number
  title: string
  instruction: string
  tip?: string
}

export interface ChequeLanguageSeoInfo {
  lang: SupportedLanguage
  localeCode: string // BCP-47 for hreflang
  langName: string
  nativeName: string
  script: string
  direction: 'ltr' | 'rtl'
  slugPath: string
  canonicalUrl: string
  title: string
  description: string
  h1: string
  subtitle: string
  keywords: string[]
  searchIntents: string[]
  headings: {
    guideTitle: string
    faqTitle: string
    mistakesTitle: string
    languagesTitle: string
    dateLabel: string
    payeeLabel: string
    amountNumbersLabel: string
    amountWordsLabel: string
    signatureLabel: string
    crossingLabel: string
  }
  guideSteps: ChequeGuideStep[]
  faqs: ChequeFaqItem[]
  commonMistakes: string[]
}

const BASE_URL = 'https://indiatools-rho.vercel.app'

export const CHEQUE_SEO_LANGUAGES: Record<SupportedLanguage, ChequeLanguageSeoInfo> = {
  // ================= 1. ENGLISH =================
  en: {
    lang: 'en',
    localeCode: 'en-IN',
    langName: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio`,
    title: 'Indian Cheque Writing Guide & Format – Fill Cheques in 13 Languages | IndiaTools',
    description: 'Master how to write an Indian bank cheque step-by-step. Convert amount in numbers to words, understand A/C Payee crossing, CTS-2010 rules, and prevent cheque mistakes.',
    h1: 'How to Write an Indian Bank Cheque: Complete Guide & Format',
    subtitle: 'Official RBI CTS-2010 format guidance, amount in words converter, Account Payee crossings, and common mistake prevention.',
    keywords: [
      'how to write a cheque in india',
      'how to fill bank cheque',
      'cheque writing format india',
      'cheque amount in words',
      'how to write self cheque',
      'account payee cheque crossing',
      'cheque date format india',
      'common cheque writing mistakes',
      'cts 2010 cheque sample',
      'sbi cheque filling format'
    ],
    searchIntents: [
      'How to write a cheque',
      'How to fill out a bank cheque',
      'Indian cheque writing format',
      'How to write an amount in words on a cheque',
      'How to write the date and payee name',
      'Cheque writing examples',
      'Common cheque writing mistakes',
      'How to write a self cheque'
    ],
    headings: {
      guideTitle: 'Step-by-Step Guide: How to Fill an Indian Bank Cheque',
      faqTitle: 'Frequently Asked Questions About Indian Cheques',
      mistakesTitle: '5 Critical Cheque Writing Mistakes to Avoid',
      languagesTitle: 'Explore Indian Cheque Guides in Other Languages',
      dateLabel: 'Date (DDMMYYYY)',
      payeeLabel: 'Payee Name (Whom to Pay)',
      amountNumbersLabel: 'Amount in Numbers (₹ Box)',
      amountWordsLabel: 'Rupees in Words',
      signatureLabel: 'Signature (Authorised Signatory)',
      crossingLabel: 'Account Payee Crossing (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'Write the Date Accurately (Top-Right)',
        instruction: 'Fill in the 8 date boxes in DD-MM-YYYY format (e.g., 15-10-2026). In India, an issued cheque remains legally valid for exactly 3 calendar months from this date. Never write a future date unless you specifically intend to issue a post-dated cheque (PDC).',
        tip: 'After 3 months, the cheque turns into a "Stale Cheque" and banks will reject clearing.'
      },
      {
        stepNumber: 2,
        title: 'Write Payee Name & Strike Extra Space',
        instruction: 'Write the exact full name of the recipient or business after "PAY". Begin writing directly adjacent to the word "PAY" so no fraudulent letters can be inserted beforehand. Draw a clean horizontal line across any empty space remaining on that line.',
        tip: 'If withdrawing cash for yourself, simply write "SELF" as the payee name.'
      },
      {
        stepNumber: 3,
        title: 'Fill Amount in Words Ending with "Only //"',
        instruction: 'Write the numeric amount in legal Indian words (e.g., "One Lakh Twenty-Five Thousand Seven Hundred Fifty Rupees Only"). Always append the word "Only" and terminate with double slashes "//" to prevent fraudulent additions of higher denominations.',
        tip: 'Never leave empty gaps between words. Match the spelling exactly with the figure in the ₹ box.'
      },
      {
        stepNumber: 4,
        title: 'Enter Amount in Figures in the ₹ Box',
        instruction: 'Write the numerical value starting immediately after the printed "₹" symbol without leaving any gap. Write clearly using Indian comma grouping (e.g., 1,25,750/-). Always place a slash and hyphen "/-" right after the last digit to prevent adding extra zeros.',
        tip: 'The numbers in this box must match the words written on the line above identically.'
      },
      {
        stepNumber: 5,
        title: 'Apply Account Payee Crossing (Top-Left Corner)',
        instruction: 'For secure non-cash transactions, draw two parallel transverse lines across the top-left corner of the cheque and write "A/C PAYEE" or "A/C PAYEE ONLY" between them. This legally instructs the bank to deposit funds solely into the named beneficiary’s account.',
        tip: 'A crossed cheque cannot be cashed over the counter by any third party.'
      },
      {
        stepNumber: 6,
        title: 'Sign Strictly Above "Authorised Signatory"',
        instruction: 'Place your legal signature clearly in the space above "Authorised Signatory". Your signature must strictly match the mandate specimen signature registered in your bank records. Never sign over the bottom white MICR band.',
        tip: 'Never sign on the front of a cheque until all payee and amount details are completed.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Account Payee and Bearer cheque in India?',
        answer: 'An Account Payee cheque has two parallel diagonal lines drawn on the top-left corner with "A/C PAYEE ONLY". The money can only be credited directly into the payee’s verified bank account. A Bearer cheque has no crossing, and the words "OR BEARER" are not struck out, meaning anyone physically presenting the cheque at the drawee branch can receive cash over the counter.'
      },
      {
        question: 'What is the legal validity period of an Indian bank cheque?',
        answer: 'As per Reserve Bank of India (RBI) regulations, all CTS-2010 Indian bank cheques are valid for exactly 3 calendar months from the date written on the cheque. After 3 months, it becomes a "Stale Cheque" and cannot be honoured without revalidation.'
      },
      {
        question: 'Why must the amount in words end with "Only" and double slashes "//"?',
        answer: 'Appending "Only" and drawing double slashes or horizontal lines prevents fraudsters from writing additional words such as "Thousand" or "Lakh" after your intended sum, securing your account against unauthorized alterations.'
      },
      {
        question: 'What is the RBI Positive Pay mechanism for cheques?',
        answer: 'Positive Pay is an automated anti-fraud process mandated by RBI for cheques above ₹50,000. The issuer confirms key cheque details (cheque number, date, payee name, amount, account number) via net banking or SMS prior to clearing, ensuring counterfeit cheques cannot pass.'
      },
      {
        question: 'How do I write a Self cheque for cash withdrawal at the bank branch?',
        answer: 'To withdraw cash from your own account, write "SELF" in the Payee field, enter the amount, sign on the front above Authorised Signatory, and sign once or twice on the back of the cheque for counter verification. Do not cross the cheque with A/C Payee.'
      }
    ],
    commonMistakes: [
      'Overwriting or making corrections on the cheque (RBI CTS-2010 mandates zero corrections; any overwriting causes rejection).',
      'Mismatch between amount written in figures (₹ 50,000) and amount written in words (Fifty-Five Thousand).',
      'Signing inside or overlapping the bottom white MICR/cheque number band.',
      'Leaving large gaps before or after the payee name and amount in words.',
      'Presenting a cheque with an expired date past the 3-month legal validity window.'
    ]
  },

  // ================= 2. HINDI =================
  hi: {
    lang: 'hi',
    localeCode: 'hi-IN',
    langName: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/hi',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/hi`,
    title: 'चेक कैसे भरें – बैंक चेक भरने का सही तरीका और प्रारूप (13 भाषाएं) | IndiaTools',
    description: 'बैंक चेक भरने का सही तरीका सीखें। शब्दों में राशि (रुपये मात्र), खाता धारक का नाम, दिनांक, अकाउंट पेयी क्रॉसिंग और चेक बाउंस से बचने के नियम विस्तार से जानें।',
    h1: 'बैंक चेक कैसे भरें: भारतीय चेक भरने का सही तरीका और नियम',
    subtitle: 'आरबीआई सीटीएस-2010 प्रारूप, शब्दों में राशि (रुपये मात्र), अकाउंट पेयी क्रॉसिंग और चेक लिखने की पूरी गाइड।',
    keywords: [
      'cheque kaise bhare',
      'bank cheque kaise bhare',
      'cheque bharne ka tarika',
      'cheque par amount in words hindi',
      'self cheque kaise bhare',
      'account payee cheque kaise banaye',
      'cheque writing format hindi',
      'cheque par date kaise dale',
      'cheque bounce se bachne ke upay',
      'sbi cheque kaise bhare'
    ],
    searchIntents: [
      'चेक कैसे भरें',
      'बैंक चेक भरने का सही तरीका',
      'चेक पर शब्दों में राशि कैसे लिखें',
      'अकाउंट पेयी चेक कैसे बनाएं',
      'सेल्फ चेक भरने का तरीका',
      'चेक लिखने के नियम और सावधानियां'
    ],
    headings: {
      guideTitle: 'स्टेप-बाय-स्टेप गाइड: बैंक चेक भरने का सही तरीका',
      faqTitle: 'बैंक चेक से जुड़े जरूरी सवाल और जवाब (FAQs)',
      mistakesTitle: 'चेक भरते समय 5 सबसे आम गलतियां जिनसे बचें',
      languagesTitle: 'अन्य भारतीय भाषाओं में चेक लिखने की गाइड देखें',
      dateLabel: 'दिनांक (DDMMYYYY)',
      payeeLabel: 'पाने वाले का नाम (Payee)',
      amountNumbersLabel: 'अंकों में राशि (₹ बॉक्स)',
      amountWordsLabel: 'शब्दों में रुपये (Amount in Words)',
      signatureLabel: 'हस्ताक्षर (Authorised Signatory)',
      crossingLabel: 'अकाउंट पेयी क्रॉसिंग (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ऊपर दाईं ओर सही दिनांक दर्ज करें (DDMMYYYY)',
        instruction: 'चेक के ऊपरी दाएं कोने में दिए गए 8 बॉक्स में DDMMYYYY प्रारूप में दिनांक लिखें (जैसे 15-10-2026)। भारत में चेक लिखे गए दिनांक से ठीक 3 महीने तक ही वैध रहता है।',
        tip: '3 महीने पूरे होने के बाद चेक अमान्य (Stale Cheque) हो जाता है और बैंक में पास नहीं होता।'
      },
      {
        stepNumber: 2,
        title: 'पाने वाले का नाम (Payee) लिखें और खाली जगह काटें',
        instruction: '"PAY" शब्द के ठीक आगे से जिसे पैसे देने हैं उसका पूरा सही नाम लिखें। नाम के आगे कोई खाली जगह न छोड़ें और नाम खत्म होने के बाद बची हुई लाइन पर सीधी लकीर खींच दें ताकि कोई नाम में छेड़छाड़ न कर सके।',
        tip: 'यदि आप स्वयं बैंक से नकद निकालना चाहते हैं, तो नाम की जगह "SELF" लिखें।'
      },
      {
        stepNumber: 3,
        title: 'शब्दों में राशि लिखें और अंत में "मात्र //" जोड़ें',
        instruction: 'राशि को हिंदी या अंग्रेजी शब्दों में लिखें (जैसे: पचास हज़ार रुपये मात्र //)। अंत में "मात्र" (या "Only") लिखकर दो तिरछी लाइनें "//" अवश्य खींचें ताकि कोई आगे अतिरिक्त शब्द न जोड़ सके।',
        tip: 'शब्दों और अंकों की राशि में एक पैसे का भी अंतर नहीं होना चाहिए।'
      },
      {
        stepNumber: 4,
        title: '₹ बॉक्स में अंकों में राशि दर्ज करें',
        instruction: 'मुद्रित "₹" चिह्न के तुरंत बाद बिना जगह छोड़े अंकों में राशि लिखें (जैसे: ₹ 50,000/-)। राशि के तुरंत बाद तिरछी लकीर और डैश "/-" अवश्य लगाएं ताकि कोई अतिरिक्त शून्य न जोड़ सके।',
        tip: 'भारतीय कॉमा प्रणाली (हज़ार, लाख, करोड़) का सही उपयोग करें।'
      },
      {
        stepNumber: 5,
        title: 'सुरक्षा के लिए अकाउंट पेयी क्रॉसिंग (A/C Payee) करें',
        instruction: 'चेक के ऊपरी बाएं कोने पर दो समानांतर तिरछी रेखाएं खींचकर उनके बीच "A/C PAYEE" लिखें। इससे यह सुनिश्चित होता है कि पैसा केवल उसी व्यक्ति के बैंक खाते में जमा होगा जिसके नाम पर चेक बना है।',
        tip: 'क्रॉस किया हुआ चेक काउंटर पर नकद नहीं मिलता, यह सीधे खाते में ट्रांसफर होता है।'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" के ठीक ऊपर हस्ताक्षर करें',
        instruction: 'चेक पर नीचे दाईं ओर अपने हस्ताक्षर करें। आपके हस्ताक्षर बैंक रिकॉर्ड में मौजूद नमूने से बिल्कुल मेल खाने चाहिए। चेक के नीचे की सफेद एमआईसीआर (MICR) पट्टी पर कभी हस्ताक्षर न करें।',
        tip: 'चेक पूरा भरने से पहले कभी भी खाली चेक पर हस्ताक्षर (Blank Cheque) न करें।'
      }
    ],
    faqs: [
      {
        question: 'अकाउंट पेयी (A/C Payee) और बियरर चेक (Bearer Cheque) में क्या अंतर है?',
        answer: 'अकाउंट पेयी चेक के बाएं कोने पर दो तिरछी रेखाएं खींची जाती हैं, जिससे राशि केवल नामित व्यक्ति के बैंक खाते में जमा होती है। बियरर चेक में कोई क्रॉसिंग नहीं होती, और जिसके पास वह चेक होता है वह बैंक काउंटर पर जाकर सीधे नकद ले सकता है, जिससे चोरी का खतरा रहता है।'
      },
      {
        question: 'भारत में बैंक चेक कितने समय तक वैध रहता है?',
        answer: 'भारतीय रिजर्व बैंक (RBI) के नियमानुसार बैंक चेक जारी होने की तारीख से ठीक 3 महीने तक वैध रहता है। 3 महीने के बाद चेक बासी (Stale) हो जाता है और बैंक उसे स्वीकार नहीं करता।'
      },
      {
        question: 'चेक में शब्दों के अंत में "मात्र" (Only) लिखना क्यों जरूरी है?',
        answer: 'शब्दों के अंत में "मात्र" या "Only" और "//" लगाने से कोई भी जालसाज आपके लिखे गए शब्दों के आगे "हज़ार" या "लाख" जोड़कर धोखाधड़ी नहीं कर सकता।'
      },
      {
        question: 'आरबीआई का पॉजिटिव पे सिस्टम (Positive Pay System) क्या है?',
        answer: 'पॉजिटिव पे सिस्टम 50,000 रुपये से अधिक के चेक के लिए एक सुरक्षा व्यवस्था है। चेक जारी करने वाले को नेट बैंकिंग या एसएमएस द्वारा चेक नंबर, तारीख, राशि और नाम की पुष्टि पहले से बैंक को करनी होती है।'
      },
      {
        question: 'सेल्फ चेक (Self Cheque) कैसे भरते हैं?',
        answer: 'अपने खाते से स्वयं नकद निकालने के लिए Payee के स्थान पर "SELF" लिखें, राशि भरें, चेक के सामने सामान्य हस्ताक्षर करें और पहचान सत्यापन के लिए चेक के पीछे दो हस्ताक्षर करें। इसे अकाउंट पेयी क्रॉस न करें।'
      }
    ],
    commonMistakes: [
      'चेक पर किसी भी शब्द या अंक पर ओवरराइटिंग या कांट-छांट करना (RBI नियमों के अनुसार कांट-छांट वाला चेक सीधे रिजेक्ट हो जाता है)।',
      'अंकों की राशि (₹ 50,000) और शब्दों की राशि में वर्तनी या संख्या का अंतर होना।',
      'चेक के नीचे दी गई सफेद मैग्नेटिक एमआईसीआर (MICR) कोड वाली पट्टी पर हस्ताक्षर या स्याही लगाना।',
      'Payee के नाम या राशि के आगे खाली जगह छोड़ देना।',
      'तारीख लिखे जाने के 3 महीने बाद चेक बैंक में पेश करना।'
    ]
  },

  // ================= 3. MALAYALAM =================
  ml: {
    lang: 'ml',
    localeCode: 'ml-IN',
    langName: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/ml',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/ml`,
    title: 'ബാങ്ക് ചെക്ക് എങ്ങനെ എഴുതാം – ചെക്ക് എഴുതുന്ന രീതിയും നിയമങ്ങളും | IndiaTools',
    description: 'ഇന്ത്യൻ ബാങ്ക് ചെക്ക് ശരിയായി എഴുതുന്ന വിധം പഠിക്കുക. തുക അക്ഷരങ്ങളിൽ എഴുതുന്ന രീതി (രൂപ മാത്രം), അക്കൗണ്ട് പെയീ ക്രോസിങ്, സെൽഫ് ചെക്ക്, തീയതി നിയമങ്ങൾ എന്നിവ മനസ്സിലാക്കുക.',
    h1: 'ബാങ്ക് ചെക്ക് എങ്ങനെ ശരിയായി എഴുതാം: ഘട്ടം ഘട്ടമായുള്ള ഗൈഡ്',
    subtitle: 'ആർബിഐ സിടിഎസ്-2010 ഫോർമാറ്റ്, തുക അക്ഷരങ്ങളിൽ മാറ്റുന്ന സംവിധാനം, അക്കൗണ്ട് പെയീ ക്രോസിങ്, ബാങ്കിങ് സുരക്ഷാ നിർദ്ദേശങ്ങൾ.',
    keywords: [
      'cheque engane ezhutham',
      'bank cheque ezhuthunna reethi',
      'cheque writing in malayalam',
      'cheque amount in words malayalam',
      'self cheque engane ezhutham',
      'account payee cheque malayalam',
      'cheque date rules india',
      'cheque thettukal ozhivakkan',
      'cheque bounce niyamangal',
      'sbi cheque ezhuthan'
    ],
    searchIntents: [
      'ബാങ്ക് ചെക്ക് എങ്ങനെ എഴുതാം',
      'ചെക്ക് എഴുതുന്ന ശരിയായ രീതി',
      'തുക അക്ഷരങ്ങളിൽ എങ്ങനെ എഴുതാം',
      'അക്കൗണ്ട് പെയീ ചെക്ക് എങ്ങനെ തയ്യാറാക്കാം',
      'സെൽഫ് ചെക്ക് എഴുതുന്ന വിധം',
      'ചെക്ക് എഴുതുമ്പോൾ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ'
    ],
    headings: {
      guideTitle: 'ഘട്ടം ഘട്ടമായുള്ള ഗൈഡ്: ബാങ്ക് ചെക്ക് ശരിയായി എഴുതുന്ന വിധം',
      faqTitle: 'ബാങ്ക് ചെക്കുകളുമായി ബന്ധപ്പെട്ട സംശയങ്ങളും മറുപടികളും (FAQs)',
      mistakesTitle: 'ചെക്ക് എഴുതുമ്പോൾ സാധാരണയായി വരുത്തുന്ന 5 വലിയ തെറ്റുകൾ',
      languagesTitle: 'മറ്റ് ഇന്ത്യൻ ഭാഷകളിൽ ചെക്ക് എഴുതാനുള്ള ഗൈഡുകൾ കാണുക',
      dateLabel: 'തീയതി (DDMMYYYY)',
      payeeLabel: 'പണം നൽകേണ്ടയാളുടെ പേര് (Payee)',
      amountNumbersLabel: 'തുക അക്കങ്ങളിൽ (₹ ബോക്സ്)',
      amountWordsLabel: 'തുക അക്ഷരങ്ങളിൽ (Amount in Words)',
      signatureLabel: 'ഒപ്പ് (Authorised Signatory)',
      crossingLabel: 'അക്കൗണ്ട് പെയീ ക്രോസിങ് (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'മുകളിൽ വലതുവശത്ത് തീയതി കൃത്യമായി രേഖപ്പെടുത്തുക',
        instruction: 'മുകളിൽ വലതുവശത്തുള്ള 8 ബോക്സുകളിൽ DDMMYYYY ക്രമത്തിൽ തീയതി എഴുതുക (ഉദാ: 15-10-2026). എഴുതുന്ന തീയതി മുതൽ കൃത്യം 3 മാസം മാത്രമേ ചെക്കിന് ഇന്ത്യയിൽ സാധുതയുള്ളൂ.',
        tip: '3 മാസം കഴിഞ്ഞ ചെക്ക് അസാധുവാകും (Stale Cheque).'
      },
      {
        stepNumber: 2,
        title: 'സ്വീകർത്താവിന്റെ പേര് എഴുതി ബാക്കി ഭാഗം വരച്ചു നിർത്തുക',
        instruction: '"PAY" എന്ന വാക്കിന് തൊട്ടുപിന്നാലെ പണം ലഭിക്കേണ്ട ആളുടെയോ സ്ഥാപനത്തിന്റെയോ പൂർണ്ണമായ പേര് എഴുതുക. പേരിന് മുന്നിലോ പിന്നിലോ സ്ഥലം ബാക്കി വെക്കാതെ വരയിട്ട് നിർത്തുക.',
        tip: 'സ്വന്തം അക്കൗണ്ടിൽ നിന്ന് പണം പിൻവലിക്കാൻ "SELF" എന്ന് എഴുതാം.'
      },
      {
        stepNumber: 3,
        title: 'തുക അക്ഷരങ്ങളിൽ എഴുതി അവസാനം "രൂപ മാത്രം //" എന്ന് ചേർക്കുക',
        instruction: 'തുക മലയാളത്തിലോ ഇംഗ്ലീഷിലോ അക്ഷരങ്ങളിൽ വ്യക്തമായി എഴുതുക (ഉദാ: അമ്പതിനായിരം രൂപ മാത്രം //). ആരും അധിക തുക ചേർക്കാതിരിക്കാൻ അവസാനം രണ്ട് വരകൾ "//" ഇടുക.',
        tip: 'അക്കങ്ങളിലെ തുകയും അക്ഷരങ്ങളിലെ തുകയും തമ്മിൽ വ്യത്യാസം ഉണ്ടാകരുത്.'
      },
      {
        stepNumber: 4,
        title: '₹ ചിഹ്നത്തിന് ശേഷം അക്കങ്ങളിൽ തുക എഴുതുക',
        instruction: 'അച്ചടിച്ച ₹ ചിഹ്നത്തിന് തൊട്ടടുത്ത് തന്നെ അക്കങ്ങളിൽ തുക എഴുതുക (ഉദാ: ₹ 50,000/-). തുക കഴിഞ്ഞയുടൻ സ്ലാഷും വരയും "/-" ഇടുക.',
        tip: 'അധിക പൂജ്യങ്ങൾ ആരും ചേർക്കാതിരിക്കാനാണ് സ്ലാഷ് ഇടുന്നത്.'
      },
      {
        stepNumber: 5,
        title: 'സുരക്ഷിതത്വത്തിനായി അക്കൗണ്ട് പെയീ ക്രോസിങ് നടത്തുക',
        instruction: 'ചെക്കിന്റെ മുകളിൽ ഇടതുവശത്ത് രണ്ട് സമാന്തര വരകൾ വരച്ച് അതിനുള്ളിൽ "A/C PAYEE" എന്ന് എഴുതുക. ഇത് പണം സ്വീകർത്താവിന്റെ അക്കൗണ്ടിലേക്ക് മാത്രമേ പോകുന്നുള്ളൂ എന്ന് ഉറപ്പാക്കുന്നു.',
        tip: 'ക്രോസ് ചെയ്ത ചെക്ക് കൗണ്ടറിൽ നിന്ന് നേരിട്ട് കാശാക്കാൻ സാധിക്കില്ല.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" എന്നതിന് മുകളിൽ ഒപ്പ് രേഖപ്പെടുത്തുക',
        instruction: 'ചെക്കിന്റെ താഴെ വലതുവശത്ത് നിങ്ങളുടെ ബാങ്ക് രേഖകളിലുള്ള ഒപ്പ് കൃത്യമായി ഇടുക. താഴെയുള്ള വെളുത്ത MICR കോഡ് ഭാഗത്ത് ഒപ്പിടരുത്.',
        tip: 'വിവരങ്ങൾ പൂർണ്ണമായി എഴുതാതെ ഒരിക്കലും ബ്ലാങ്ക് ചെക്കിൽ ഒപ്പിടരുത്.'
      }
    ],
    faqs: [
      {
        question: 'അക്കൗണ്ട് പെയീ ചെക്കും ബെയറർ ചെക്കും തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?',
        answer: 'അക്കൗണ്ട് പെയീ ചെക്കിൽ മുകളിൽ ഇടതുവശത്ത് വരകൾ ഉള്ളതിനാൽ പണം ബാങ്ക് അക്കൗണ്ടിലേക്ക് മാത്രമേ ക്രെഡിറ്റ് ചെയ്യപ്പെടൂ. എന്നാൽ ബെയറർ ചെക്ക് കയ്യിലുള്ള ആർക്കും ബാങ്ക് കൗണ്ടറിൽ നൽകി നേരിട്ട് പണം വാങ്ങാം, ഇത് സുരക്ഷിതമല്ല.'
      },
      {
        question: 'ഒരു ബാങ്ക് ചെക്കിന്റെ സാധുത കാലാവധി എത്രയാണ്?',
        answer: 'ആർബിഐ നിയമപ്രകാരം ഒരു ചെക്ക് എഴുതിയ തീയതി മുതൽ കൃത്യം 3 മാസത്തേക്ക് മാത്രമേ സാധുതയുള്ളൂ.'
      },
      {
        question: 'തുക അക്ഷരങ്ങളിൽ എഴുതുമ്പോൾ "മാത്രം" (Only) എന്ന് ചേർക്കുന്നത് എന്തിന്?',
        answer: 'എഴുതിയ തുകയ്ക്ക് ശേഷം ആരും മറ്റൊരു തുകയോ അക്കങ്ങളോ കൂട്ടിച്ചേർക്കാതിരിക്കാനാണ് "മാത്രം" എന്ന് ചേർക്കുന്നത്.'
      },
      {
        question: 'എന്താണ് പോസിറ്റീവ് പേ സിസ്റ്റം (Positive Pay System)?',
        answer: '50,000 രൂപയ്ക്ക് മുകളിലുള്ള ചെക്കുകൾക്ക് ആർബിഐ നടപ്പിലാക്കിയ സുരക്ഷാ ക്രമീകരണമാണിത്. ചെക്ക് നൽകുന്നയാൾ നെറ്റ് ബാങ്കിങ് വഴിയോ എസ്എംഎസ് വഴിയോ ചെക്കിന്റെ വിശദാംശങ്ങൾ മുൻകൂട്ടി ബാങ്കിനെ അറിയിക്കണം.'
      },
      {
        question: 'സ്വന്തമായി പണം പിൻവലിക്കാൻ സെൽഫ് ചെക്ക് എങ്ങനെ എഴുതാം?',
        answer: 'Payee സ്ഥാനത്ത് "SELF" എന്ന് എഴുതി തുക രേഖപ്പെടുത്തി മുന്നിലും പിന്നിലും ഒപ്പിട്ട് ബാങ്ക് കൗണ്ടറിൽ നൽകി സ്വന്തം അക്കൗണ്ടിൽ നിന്ന് പണം പിൻവലിക്കാം.'
      }
    ],
    commonMistakes: [
      'ചെക്കിൽ വെട്ടിത്തിരുത്തലുകൾ വരുത്തുന്നത് (ആർബിഐ സിടിഎസ് നിയമപ്രകാരം വെട്ടിയ ചെക്കുകൾ ബാങ്ക് നിരസിക്കും).',
      'അക്കങ്ങളിലെ തുകയും അക്ഷരങ്ങളിലെ തുകയും തമ്മിൽ വ്യത്യാസം വരുന്നത്.',
      'താഴെയുള്ള വെളുത്ത MICR ബാൻഡിൽ ഒപ്പുവെക്കുന്നത്.',
      'പേരിനും തുകയ്ക്കും ചുറ്റും വലിയ ഇടവേളകൾ ബാക്കി വെക്കുന്നത്.',
      'തീയതി കഴിഞ്ഞ് 3 മാസത്തിന് ശേഷം ചെക്ക് സമർപ്പിക്കുന്നത്.'
    ]
  },

  // ================= 4. TAMIL =================
  ta: {
    lang: 'ta',
    localeCode: 'ta-IN',
    langName: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/ta',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/ta`,
    title: 'வங்கி காசோலை எழுதுவது எப்படி – செக் எழுதும் சரியான முறை | IndiaTools',
    description: 'வங்கி காசோலை (Cheque) சரியாக எழுதுவது எப்படி என்று தெரிந்து கொள்ளுங்கள். தொகையை எழுத்தால் எழுதுவது (ரூபாய் மட்டும்), அக்கவுண்ட் பேயீ கோடு போடுதல் மற்றும் பொதுவான தவறுகள்.',
    h1: 'வங்கி காசோலை (Cheque) எழுதுவது எப்படி: முழுமையான வழிகாட்டி',
    subtitle: 'ரிசர்வ் வங்கி CTS-2010 முறை, தொகையை வார்த்தைகளில் எழுதுதல் (ரூபாய் மட்டும்), அக்கவுண்ட் பேயீ பாதுகாப்பு மற்றும் வழிகாட்டி.',
    keywords: [
      'cheque ezhuthuvathu eppadi',
      'bank cheque ezhuthum murai',
      'cheque writing in tamil',
      'cheque amount in words tamil',
      'self cheque ezhuthuvathu eppadi',
      'account payee cheque tamil',
      'cheque fill panrathu eppadi',
      'tamil cheque format',
      'cheque date validity india',
      'sbi cheque fill tamil'
    ],
    searchIntents: [
      'காசோலை எழுதுவது எப்படி',
      'வங்கி செக் எழுதும் சரியான முறை',
      'தொகையை எழுத்தால் எழுதுவது எப்படி',
      'அக்கவுண்ட் பேயீ செக் எழுதுவது எப்படி',
      'செல்ஃப் செக் எழுதும் முறை',
      'செக் எழுதும்போது தவிர்க்க வேண்டிய தவறுகள்'
    ],
    headings: {
      guideTitle: 'படி படியான வழிகாட்டி: வங்கி காசோலையை எவ்வாறு நிரப்புவது',
      faqTitle: 'வங்கி காசோலை பற்றிய முக்கிய கேள்விகள் (FAQs)',
      mistakesTitle: 'காசோலை எழுதும்போது தவிர்க்க வேண்டிய 5 தவறுகள்',
      languagesTitle: 'மற்ற இந்திய மொழிகளில் காசோலை எழுதும் வழிகாட்டிகள்',
      dateLabel: 'தேதி (DDMMYYYY)',
      payeeLabel: 'பெறுபவர் பெயர் (Payee)',
      amountNumbersLabel: 'எண்களில் தொகை (₹ பாக்ஸ்)',
      amountWordsLabel: 'வார்த்தைகளில் தொகை (Amount in Words)',
      signatureLabel: 'கையொப்பம் (Authorised Signatory)',
      crossingLabel: 'அக்கவுண்ட் பேயீ கிராஸிங் (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'மேல் வலதுபுறத்தில் தேதியை சரியாக எழுதவும் (DDMMYYYY)',
        instruction: 'மேல் வலது பெட்டிகளில் DDMMYYYY முறையில் தேதியை எழுதவும் (எ.கா: 15-10-2026). இந்தியாவில் காசோலை எழுதப்பட்ட தேதியிலிருந்து 3 மாதங்கள் மட்டுமே செல்லும்.',
        tip: '3 மாதங்கள் கடந்தால் காசோலை காலாவதியாகிவிடும் (Stale Cheque).'
      },
      {
        stepNumber: 2,
        title: 'பெறுபவர் பெயரை எழுதி மீதமுள்ள வரியை அடிக்கவும்',
        instruction: '"PAY" என்ற சொல்லுக்கு அருகில் பெறுபவரின் முழு பெயரை எழுதவும். பெயர் முடிந்தவுடன் மீதமுள்ள வெற்றிடத்தில் ஒரு கிடைமட்ட கோடு போடவும்.',
        tip: 'சுயமாக பணம் எடுக்க "SELF" என்று எழுதவும்.'
      },
      {
        stepNumber: 3,
        title: 'தொகையை வார்த்தைகளில் எழுதி "ரூபாய் மட்டும் //" என முடிக்கவும்',
        instruction: 'தொகையை தமிழில் அல்லது ஆங்கிலத்தில் வார்த்தைகளால் எழுதி (எ.கா: ஐம்பதாயிரம் ரூபாய் மட்டும் //) இறுதியில் இரண்டு சாய்வு கோடுகள் "//" போடவும்.',
        tip: 'எண்களிலும் வார்த்தைகளிலும் உள்ள தொகை ஒன்றுபோல இருக்க வேண்டும்.'
      },
      {
        stepNumber: 4,
        title: '₹ பெட்டியில் எண்களில் தொகையை எழுதவும்',
        instruction: 'அச்சிடப்பட்ட ₹ குறியீட்டின் பக்கத்தில் இடைவெளி இல்லாமல் எண்களை எழுதி (எ.கா: ₹ 50,000/-) இறுதியில் "/-" குறியிடவும்.',
        tip: 'கூடுதல் பூஜ்ஜியங்களை சேர்க்காமல் இருக்க "/-" போடுவது அவசியம்.'
      },
      {
        stepNumber: 5,
        title: 'பாதுகாப்பிற்கு அக்கவுண்ட் பேயீ (A/C Payee) கோடு போடவும்',
        instruction: 'காசோலையின் மேல் இடது மூலையில் இரண்டு சாய்ந்த கோடுகளை வரைந்து "A/C PAYEE" என்று எழுதவும். இது பணம் அவரது வங்கிக் கணக்கில் மட்டுமே சேர்வதை உறுதி செய்யும்.',
        tip: 'இதை மற்றவர்கள் நேரில் பணமாக மாற்ற முடியாது.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" மீது கையொப்பமிடவும்',
        instruction: 'கீழ் வலதுபுறத்தில் உங்கள் வங்கிப் பதிவேட்டில் உள்ள கையொப்பத்தை இடவும். கீழ் உள்ள வெள்ளை MICR பகுதியில் கையொப்பமிடக் கூடாது.',
        tip: 'முழு விவரங்களையும் எழுதாமல் வெற்று காசோலையில் கையொப்பமிடாதீர்கள்.'
      }
    ],
    faqs: [
      {
        question: 'அக்கவுண்ட் பேயீ மற்றும் பியரர் காசோலைக்கு உள்ள வேறுபாடு என்ன?',
        answer: 'அக்கவுண்ட் பேயீ காசோலையில் கோடிடப்படுவதால் தொகை பெறுபவரின் வங்கிக் கணக்கில் மட்டுமே சேரும். பியரர் காசோலையில் எவரும் நேரில் சென்று பணம் பெறலாம்.'
      },
      {
        question: 'இந்தியாவில் காசோலையின் செல்லுபடியாகும் காலம் என்ன?',
        answer: 'ரிசர்வ் வங்கி விதிகளின்படி காசோலை எழுதப்பட்ட தேதியிலிருந்து சரியாக 3 மாதங்கள் வரை மட்டுமே செல்லும்.'
      },
      {
        question: 'தொகையை எழுதும்போது "மட்டும்" (Only) என்று சேர்ப்பது ஏன்?',
        answer: 'எழுதிய தொகைக்குப் பின்னால் எவரும் வேறு எண்களையோ வார்த்தைகளையோ சேர்க்காமல் தடுக்க "மட்டும்" என்று எழுதப்படுகிறது.'
      },
      {
        question: 'பாசிட்டிவ் பே முறை (Positive Pay System) என்றால் என்ன?',
        answer: 'ரூ.50,000-க்கு மேற்பட்ட காசோலைகளுக்கு வங்கியிடம் இணையம் அல்லது எஸ்எம்எஸ் மூலம் விவரங்களை முன்கூட்டியே உறுதிப்படுத்தும் பாதுகாப்பு முறை.'
      },
      {
        question: 'செல்ஃப் காசோலை (Self Cheque) எவ்வாறு எழுதுவது?',
        answer: 'Payee இடத்தில் "SELF" என்று எழுதி தொகையை குறிப்பிட்டு முன்னும் பின்னும் கையொப்பமிட்டு வங்கியில் பணம் பெறலாம்.'
      }
    ],
    commonMistakes: [
      'காசோலையில் அடித்தல் திருத்தல் செய்வது (திருத்தப்பட்ட காசோலையை வங்கி ஏற்காது).',
      'எண்களிலும் எழுத்துக்களிலும் உள்ள தொகையில் முரண்பாடு இருப்பது.',
      'கீழே உள்ள வெள்ளை MICR பகுதியில் கையொப்பமிடுவது.',
      'பெயர் மற்றும் தொகைக்கு முன்னும் பின்னும் இடைவெளி விடுவது.',
      '3 மாத கால அவகாசத்திற்குப் பிறகு காசோலையை வங்கியில் சமர்ப்பிப்பது.'
    ]
  },

  // ================= 5. TELUGU =================
  te: {
    lang: 'te',
    localeCode: 'te-IN',
    langName: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/te',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/te`,
    title: 'బ్యాంక్ చెక్ ఎలా రాయాలి – చెక్ రాసే సరైన విధానం మరియు నియమాలు | IndiaTools',
    description: 'భారతీయ బ్యాంక్ చెక్ రాయడం ఎలాగో సులభంగా నేర్చుకోండి. అక్షరాల్లో మొత్తం (రూపాయలు మాత్రమే), అకౌంట్ పేయీ క్రాసింగ్, సెల్ఫ్ చెక్ మరియు ముఖ్యమైన బ్యాంకింగ్ నియమాలు.',
    h1: 'బ్యాంక్ చెక్ ఎలా రాయాలి: సరైన పద్ధతి మరియు పూర్తి గైడ్',
    subtitle: 'RBI CTS-2010 ప్రమాణాలు, అక్షరాలలో మొత్తం మార్పిడి (రూపాయలు మాత్రమే), అకౌంట్ పేయీ క్రాసింగ్ మరియు చెక్ భద్రతా నియమాలు.',
    keywords: [
      'bank cheque ela rayali',
      'cheque rayadam ela',
      'cheque writing in telugu',
      'cheque amount in words telugu',
      'self cheque ela rayali',
      'account payee cheque telugu',
      'cheque format telugu',
      'cheque lo date ela rayali',
      'cheque bounce rules telugu',
      'sbi cheque fill telugu'
    ],
    searchIntents: [
      'బ్యాంక్ చెక్ ఎలా రాయాలి',
      'చెక్ రాసే సరైన విధానం',
      'మొత్తాన్ని అక్షరాల్లో ఎలా రాయాలి',
      'అకౌంట్ పేయీ చెక్ ఎలా చేయాలి',
      'సెల్ఫ్ చెక్ రాసే పద్ధతి',
      'చెక్ రాసేటప్పుడు చేయకూడని తప్పులు'
    ],
    headings: {
      guideTitle: 'స్టెప్-బై-స్టెప్ గైడ్: బ్యాంక్ చెక్ రాసే సరైన విధానం',
      faqTitle: 'బ్యాంక్ చెక్కులకు సంబంధించిన ముఖ్యమైన ప్రశ్నలు (FAQs)',
      mistakesTitle: 'చెక్ రాసేటప్పుడు చేయకూడని 5 సాధారణ తప్పులు',
      languagesTitle: 'ఇతర భారతీయ భాషలలో చెక్ గైడ్‌లను చూడండి',
      dateLabel: 'తేదీ (DDMMYYYY)',
      payeeLabel: 'గ్రహీత పేరు (Payee)',
      amountNumbersLabel: 'సంఖ్యలలో మొత్తం (₹ బాక్స్)',
      amountWordsLabel: 'అక్షరాలలో మొత్తం (Amount in Words)',
      signatureLabel: 'సంతకం (Authorised Signatory)',
      crossingLabel: 'అకౌంట్ పేయీ క్రాసింగ్ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ఎగువ కుడివైపున తేదీని సరిగ్గా నమోదు చేయండి (DDMMYYYY)',
        instruction: 'ఎగువ కుడివైపు ఉన్న 8 పెట్టెలలో DDMMYYYY ఫార్మాట్‌లో తేదీని రాయండి (ఉదా: 15-10-2026). భారతదేశంలో చెక్ రాసిన తేదీ నుండి 3 నెలల వరకు మాత్రమే చెల్లుబాటు అవుతుంది.',
        tip: '3 నెలలు దాటిన తర్వాత చెక్ చెల్లదు (Stale Cheque).'
      },
      {
        stepNumber: 2,
        title: 'గ్రహీత పేరును వ్రాసి మిగిలిన ఖాళీని గీతతో కొట్టివేయండి',
        instruction: '"PAY" పక్కనే డబ్బు చెల్లించాల్సిన వ్యక్తి లేదా సంస్థ పేరును స్పష్టంగా రాయండి. పేరు పక్కన ఖాళీ ఉంచకుండా అడ్డగీత గీయండి.',
        tip: 'మీరే నగదు తీసుకోవాలనుకుంటే "SELF" అని రాయండి.'
      },
      {
        stepNumber: 3,
        title: 'మొత్తాన్ని అక్షరాలలో వ్రాసి చివర "మాత్రమే //" అని ముగించండి',
        instruction: 'మొత్తాన్ని తెలుగు లేదా ఇంగ్లీషు అక్షరాలలో రాసి (ఉదా: యాభై వేల రూపాయలు మాత్రమే //) చివర రెండు గీతలు "//" పెట్టండి.',
        tip: 'అంకెల మొత్తానికి, అక్షరాల మొత్తానికి తేడా ఉండకూడదు.'
      },
      {
        stepNumber: 4,
        title: '₹ బాక్స్‌లో సంఖ్యలలో మొత్తాన్ని రాయండి',
        instruction: 'ముద్రించిన ₹ గుర్తు పక్కనే స్థలం వదలకుండా సంఖ్యలలో రాయండి (ఉదా: ₹ 50,000/-) మరియు చివర "/-" పెట్టండి.',
        tip: 'అదనపు సున్నాలు ఎవరూ చేర్చకుండా ఉండటానికి "/-" పెట్టడం ముఖ్యం.'
      },
      {
        stepNumber: 5,
        title: 'భద్రత కోసం అకౌంట్ పేయీ (A/C Payee) క్రాసింగ్ చేయండి',
        instruction: 'చెక్ ఎగువ ఎడమ మూలలో రెండు సమాంతర వాలు గీతలు గీసి వాటి మధ్య "A/C PAYEE" అని రాయండి. దీనివల్ల డబ్బు కేవలం గ్రహీత ఖాతాలో మాత్రమే జమ అవుతుంది.',
        tip: 'ఇలాంటి చెక్కులను కౌంటర్‌లో నేరుగా నగదు రూపంలో మార్చలేరు.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" పైన మాత్రమే సంతకం చేయండి',
        instruction: 'దిగువ కుడివైపున మీ బ్యాంక్ రికార్డులలోని సంతకాన్ని ఖచ్చితంగా చేయండి. దిగువన ఉన్న తెల్లటి MICR స్ట్రిప్‌పై సంతకం చేయకూడదు.',
        tip: 'ఖాళీ చెక్కులపై ఎప్పుడూ సంతకం చేయవద్దు.'
      }
    ],
    faqs: [
      {
        question: 'అకౌంట్ పేయీ మరియు బేరర్ చెక్కుల మధ్య తేడా ఏమిటి?',
        answer: 'అకౌంట్ పేయీ చెక్ ద్వారా డబ్బు నేరుగా గ్రహీత ఖాతాలో మాత్రమే జమ అవుతుంది. బేరర్ చెక్ ఉన్నవారు ఎవరైనా నేరుగా బ్యాంకుకు వెళ్లి కౌంటర్‌లో నగదు తీసుకోవచ్చు.'
      },
      {
        question: 'భారతదేశంలో బ్యాంక్ చెక్ చెల్లుబాటు వ్యవధి ఎంత?',
        answer: 'RBI నిబంధనల ప్రకారం చెక్ రాసిన తేదీ నుండి ఖచ్చితంగా 3 నెలల పాటు మాత్రమే చెల్లుబాటు అవుతుంది.'
      },
      {
        question: 'అక్షరాలలో మొత్తం రాసేటప్పుడు "మాత్రమే" (Only) అని ఎందుకు రాయాలి?',
        answer: 'మనం రాసిన మొత్తం తర్వాత ఎవరూ అదనపు పదాలు లేదా సంఖ్యలు జోడించకుండా నిరోధించడానికి "మాత్రమే" అని రాస్తారు.'
      },
      {
        question: 'పాజిటివ్ పే విధానం (Positive Pay System) అంటే ఏమిటి?',
        answer: 'రూ. 50,000 మించిన చెక్కుల కోసం మోసాలను అరికట్టడానికి బ్యాంక్ నెట్ బ్యాంకింగ్ లేదా ఎస్ఎంఎస్ ద్వారా వివరాలను ముందుగానే ధృవీకరించే విధానం.'
      },
      {
        question: 'సెల్ఫ్ చెక్ (Self Cheque) ఎలా రాయాలి?',
        answer: 'Payee వద్ద "SELF" అని రాసి, మొత్తాన్ని నమోదు చేసి ముందు, వెనుక సంతకాలు చేసి బ్యాంకులో నగదు పొందవచ్చు.'
      }
    ],
    commonMistakes: [
      'చెక్ మీద కొట్టివేతలు లేదా దిద్దుబాట్లు చేయడం (దిద్దుబాట్లు ఉన్న చెక్కులను బ్యాంక్ తిరస్కరిస్తుంది).',
      'సంఖ్యలలో రాసిన మొత్తం, అక్షరాలలో రాసిన మొత్తంలో వ్యత్యాసం ఉండటం.',
      'దిగువన ఉన్న తెల్లటి MICR కోడ్ ప్రాంతంలో సంతకం చేయడం.',
      'పేరు మరియు మొత్తం పక్కన పెద్ద ఖాళీలను వదిలివేయడం.',
      'తేదీ రాసిన 3 నెలల తర్వాత చెక్‌ను బ్యాంకులో సమర్పించడం.'
    ]
  },

  // ================= 6. KANNADA =================
  kn: {
    lang: 'kn',
    localeCode: 'kn-IN',
    langName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/kn',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/kn`,
    title: 'ಬ್ಯಾಂಕ್ ಚೆಕ್ ಬರೆಯುವುದು ಹೇಗೆ – ಚೆಕ್ ಭರ್ತಿ ಮಾಡುವ ಸರಿಯಾದ ವಿಧಾನ | IndiaTools',
    description: 'ಬ್ಯಾಂಕ್ ಚೆಕ್ ಅನ್ನು ಸರಿಯಾಗಿ ಬರೆಯುವುದು ಹೇಗೆ ಎಂದು ತಿಳಿಯಿರಿ. ಅಕ್ಷರಗಳಲ್ಲಿ ಮೊತ್ತ (ರೂಪಾಯಿ ಮಾತ್ರ), ಅಕೌಂಟ್ ಪೇಯೀ ಕ್ರಾಸಿಂಗ್, ಸೆಲ್ಫ್ ಚೆಕ್ ಮತ್ತು ಚೆಕ್ ಬರೆಯುವಾಗ ಮಾಡುವ ತಪ್ಪುಗಳನ್ನು ತಡೆಯಿರಿ.',
    h1: 'ಬ್ಯಾಂಕ್ ಚೆಕ್ ಬರೆಯುವುದು ಹೇಗೆ: ಹಂತ-ಹಂತದ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ',
    subtitle: 'ಆರ್‌ಬಿಐ CTS-2010 ಮಾನದಂಡ, ಮೊತ್ತವನ್ನು ಅಕ್ಷರಗಳಲ್ಲಿ ಬರೆಯುವುದು (ರೂಪಾಯಿ ಮಾತ್ರ), ಅಕೌಂಟ್ ಪೇಯೀ ಕ್ರಾಸಿಂಗ್ ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳು.',
    keywords: [
      'bank cheque bariyuvudu hege',
      'cheque bariyuvudu hege',
      'cheque writing in kannada',
      'cheque amount in words kannada',
      'self cheque bariyodu hege',
      'account payee cheque kannada',
      'kannada cheque format',
      'cheque filling rules india',
      'cheque date validity kannada',
      'sbi cheque filling kannada'
    ],
    searchIntents: [
      'ಬ್ಯಾಂಕ್ ಚೆಕ್ ಬರೆಯುವುದು ಹೇಗೆ',
      'ಚೆಕ್ ಬರೆಯುವ ಸರಿಯಾದ ವಿಧಾನ',
      'ಮೊತ್ತವನ್ನು ಅಕ್ಷರಗಳಲ್ಲಿ ಬರೆಯುವುದು ಹೇಗೆ',
      'ಅಕೌಂಟ್ ಪೇಯೀ ಚೆಕ್ ಬರೆಯುವುದು ಹೇಗೆ',
      'ಸೆಲ್ಫ್ ಚೆಕ್ ಬರೆಯುವ ಪದ್ಧತಿ',
      'ಚೆಕ್ ಬರೆಯುವಾಗ ಮಾಡುವ ತಪ್ಪುಗಳು'
    ],
    headings: {
      guideTitle: 'ಹಂತ-ಹಂತದ ಗೈಡ್: ಬ್ಯಾಂಕ್ ಚೆಕ್ ಭರ್ತಿ ಮಾಡುವ ಸರಿಯಾದ ವಿಧಾನ',
      faqTitle: 'ಬ್ಯಾಂಕ್ ಚೆಕ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ಮುಖ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQs)',
      mistakesTitle: 'ಚೆಕ್ ಬರೆಯುವಾಗ ತಪ್ಪಿಸಬೇಕಾದ 5 ಸಾಮಾನ್ಯ ತಪ್ಪುಗಳು',
      languagesTitle: 'ಇತರ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಚೆಕ್ ಗೈಡ್‌ಗಳನ್ನು ನೋಡಿ',
      dateLabel: 'ದಿನಾಂಕ (DDMMYYYY)',
      payeeLabel: 'ಪಡೆಯುವವರ ಹೆಸರು (Payee)',
      amountNumbersLabel: 'ಅಂಕಿಗಳಲ್ಲಿ ಮೊತ್ತ (₹ ಬಾಕ್ಸ್)',
      amountWordsLabel: 'ಅಕ್ಷರಗಳಲ್ಲಿ ಮೊತ್ತ (Amount in Words)',
      signatureLabel: 'ಸಹಿ (Authorised Signatory)',
      crossingLabel: 'ಅಕೌಂಟ್ ಪೇಯೀ ಕ್ರಾಸಿಂಗ್ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ಮೇಲಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿ ದಿನಾಂಕವನ್ನು ನಮೂದಿಸಿ (DDMMYYYY)',
        instruction: 'ಮೇಲಿನ 8 ಬಾಕ್ಸ್‌ಗಳಲ್ಲಿ DDMMYYYY ರೂಪದಲ್ಲಿ ದಿನಾಂಕ ಬರೆಯಿರಿ (ಉದಾ: 15-10-2026). ಭಾರತದಲ್ಲಿ ಚೆಕ್ ಬರೆದ ದಿನಾಂಕದಿಂದ ಕೇವಲ 3 ತಿಂಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.',
        tip: '3 ತಿಂಗಳ ನಂತರ ಚೆಕ್ ಅಮಾನ್ಯವಾಗುತ್ತದೆ (Stale Cheque).'
      },
      {
        stepNumber: 2,
        title: 'ಪಡೆಯುವವರ ಹೆಸರನ್ನು ಬರೆದು ಉಳಿದ ಜಾಗಕ್ಕೆ ಗೆರೆ ಹಾಕಿ',
        instruction: '"PAY" ಪಕ್ಕದಲ್ಲಿ ಹಣ ಪಡೆಯುವವರ ಪೂರ್ಣ ಹೆಸರನ್ನು ಬರೆಯಿರಿ. ಹೆಸರಿನ ಪಕ್ಕದಲ್ಲಿ ಖಾಲಿ ಜಾಗ ಬಿಡದೆ ನೇರ ಗೆರೆ ಹಾಕಿ.',
        tip: 'ಸ್ವತಃ ನಗದು ಪಡೆಯಲು "SELF" ಎಂದು ಬರೆಯಿರಿ.'
      },
      {
        stepNumber: 3,
        title: 'ಮೊತ್ತವನ್ನು ಅಕ್ಷರಗಳಲ್ಲಿ ಬರೆದು "ರೂಪಾಯಿ ಮಾತ್ರ //" ಎಂದು ಮುಗಿಸಿ',
        instruction: 'ಮೊತ್ತವನ್ನು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳಲ್ಲಿ ಬರೆದು (ಉದಾ: ಐವತ್ತು ಸಾವಿರ ರೂಪಾಯಿ ಮಾತ್ರ //) ಕೊನೆಯಲ್ಲಿ ಎರಡು ಗೆರೆ "//" ಹಾಕಿ.',
        tip: 'ಅಂಕಿ ಮತ್ತು ಅಕ್ಷರಗಳ ಮೊತ್ತದಲ್ಲಿ ವ್ಯತ್ಯಾಸವಿರಬಾರದು.'
      },
      {
        stepNumber: 4,
        title: '₹ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಅಂಕಿಗಳಲ್ಲಿ ಮೊತ್ತವನ್ನು ಬರೆಯಿರಿ',
        instruction: 'ಮುದ್ರಿತ ₹ ಚಿಹ್ನೆಯ ಪಕ್ಕದಲ್ಲಿ ಸ್ಥಳ ಬಿಡದೆ ಅಂಕಿಗಳನ್ನು ಬರೆಯಿರಿ (ಉದಾ: ₹ 50,000/-) ಮತ್ತು ಕೊನೆಯಲ್ಲಿ "/-" ಚಿಹ್ನೆ ಹಾಕಿ.',
        tip: 'ಹೆಚ್ಚುವರಿ ಶೂನ್ಯಗಳನ್ನು ಸೇರಿಸುವುದನ್ನು ತಡೆಯಲು "/-" ಹಾಕುವುದು ಅಗತ್ಯ.'
      },
      {
        stepNumber: 5,
        title: 'ಸುರಕ್ಷತೆಗಾಗಿ ಅಕೌಂಟ್ ಪೇಯೀ (A/C Payee) ಕ್ರಾಸಿಂಗ್ ಮಾಡಿ',
        instruction: 'ಚೆಕ್‌ನ ಮೇಲಿನ ಎಡ ಮೂಲೆಯಲ್ಲಿ ಎರಡು ಸಮಾನಾಂತರ ಓರೆ ಗೆರೆಗಳನ್ನು ಎಳೆದು "A/C PAYEE" ಎಂದು ಬರೆಯಿರಿ. ಇದರಿಂದ ಹಣವು ನೇರವಾಗಿ ಅವರ ಖಾತೆಗೆ ಮಾತ್ರ ಜಮೆಯಾಗುತ್ತದೆ.',
        tip: 'ಇದನ್ನು ಕೌಂಟರ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ನಗದಾಗಿ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" ಮೇಲ್ಭಾಗದಲ್ಲಿ ಸಹಿ ಮಾಡಿ',
        instruction: 'ಕೆಳಗಿನ ಬಲಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ದಾಖಲೆಯ ಸಹಿಯನ್ನು ಹಾಕಿ. ಕೆಳಗಿನ ಬಿಳಿ MICR ಜಾಗದಲ್ಲಿ ಸಹಿ ಮಾಡಬೇಡಿ.',
        tip: 'ಖಾಲಿ ಚೆಕ್‌ಗಳ ಮೇಲೆ ಎಂದಿಗೂ ಸಹಿ ಮಾಡಬೇಡಿ.'
      }
    ],
    faqs: [
      {
        question: 'ಅಕೌಂಟ್ ಪೇಯೀ ಮತ್ತು ಬೇರರ್ ಚೆಕ್ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
        answer: 'ಅಕೌಂಟ್ ಪೇಯೀ ಚೆಕ್ ಹಣವು ಕೇವಲ ಪಡೆಯುವವರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಮಾತ್ರ ಜಮೆಯಾಗುತ್ತದೆ. ಬೇರರ್ ಚೆಕ್ ಇರುವವರು ಯಾರಾದರೂ ಬ್ಯಾಂಕ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ನಗದು ಪಡೆಯಬಹುದು.'
      },
      {
        question: 'ಭಾರತದಲ್ಲಿ ಬ್ಯಾಂಕ್ ಚೆಕ್‌ನ ಮಾನ್ಯತೆಯ ಅವಧಿ ಎಷ್ಟು?',
        answer: 'ಆರ್‌ಬಿಐ ನಿಯಮಗಳ ಪ್ರಕಾರ ಚೆಕ್ ಬರೆದ ದಿನಾಂಕದಿಂದ ನಿಖರವಾಗಿ 3 ತಿಂಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.'
      },
      {
        question: 'ಅಕ್ಷರಗಳಲ್ಲಿ ಮೊತ್ತ ಬರೆಯುವಾಗ "ಮಾತ್ರ" (Only) ಎಂದು ಏಕೆ ಬರೆಯಬೇಕು?',
        answer: 'ಬರೆದ ಮೊತ್ತದ ನಂತರ ಯಾರೂ ಹೆಚ್ಚುವರಿ ಪದಗಳನ್ನು ಸೇರಿಸದಂತೆ ತಡೆಯಲು "ಮಾತ್ರ" ಎಂದು ಬರೆಯಲಾಗುತ್ತದೆ.'
      },
      {
        question: 'ಪಾಸಿಟಿವ್ ಪೇ ಸಿಸ್ಟಮ್ (Positive Pay System) ಎಂದರೇನು?',
        answer: 'ರೂ. 50,000 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಮೊತ್ತದ ಚೆಕ್‌ಗಳಿಗೆ ವಂಚನೆ ತಡೆಯಲು ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಎಸ್‌ಎಂಎಸ್ ಮೂಲಕ ವಿವರಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ದೃಢೀಕರಿಸುವ ವ್ಯವಸ್ಥೆ.'
      },
      {
        question: 'ಸೆಲ್ಫ್ ಚೆಕ್ (Self Cheque) ಹೇಗೆ ಬರೆಯುವುದು?',
        answer: 'Payee ಜಾಗದಲ್ಲಿ "SELF" ಎಂದು ಬರೆದು, ಮೊತ್ತ ನಮೂದಿಸಿ ಮುಂದೆ ಮತ್ತು ಹಿಂದೆ ಸಹಿ ಮಾಡಿ ಬ್ಯಾಂಕಿನಲ್ಲಿ ನಗದು ಪಡೆಯಬಹುದು.'
      }
    ],
    commonMistakes: [
      'ಚೆಕ್ ಮೇಲೆ ತಿದ್ದಿ ಬರೆಯುವುದು (ತಿದ್ದಿದ ಚೆಕ್‌ಗಳನ್ನು ಬ್ಯಾಂಕ್ ತಿರಸ್ಕರಿಸುತ್ತದೆ).',
      'ಅಂಕಿಗಳಲ್ಲಿ ಬರೆದ ಮೊತ್ತ ಮತ್ತು ಅಕ್ಷರಗಳಲ್ಲಿ ಬರೆದ ಮೊತ್ತದಲ್ಲಿ ವ್ಯತ್ಯಾಸವಿರುವುದು.',
      'ಕೆಳಗಿನ ಬಿಳಿ MICR ಕೋಡ್ ಜಾಗದಲ್ಲಿ ಸಹಿ ಹಾಕುವುದು.',
      'ಹೆಸರು ಮತ್ತು ಮೊತ್ತದ ಪಕ್ಕದಲ್ಲಿ ಜಾಗ ಬಿಡುವುದು.',
      'ದಿನಾಂಕ ಬರೆದು 3 ತಿಂಗಳು ಕಳೆದ ನಂತರ ಚೆಕ್ ಬ್ಯಾಂಕಿಗೆ ಸಲ್ಲಿಸುವುದು.'
    ]
  },

  // ================= 7. BENGALI =================
  bn: {
    lang: 'bn',
    localeCode: 'bn-IN',
    langName: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/bn',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/bn`,
    title: 'ব্যাংক চেক লেখার সঠিক নিয়ম – চেক কিভাবে পূরণ করবেন | IndiaTools',
    description: 'ভারতীয় ব্যাংক চেক লেখার সঠিক পদ্ধতি জানুন। কথায় টাকার পরিমাণ (টাকা মাত্র), অ্যাকাউন্ট পেয়ি ক্রসিং, সেলফ চেক লেখার নিয়ম এবং ভুল এড়ানোর উপায় বিস্তারিত দেখুন।',
    h1: 'ব্যাংক চেক কিভাবে লিখতে হয়: সঠিক নিয়ম ও সম্পূর্ণ গাইড',
    subtitle: 'আরবিআই CTS-2010 ফরম্যাট, কথায় টাকার পরিমাণ (টাকা মাত্র), অ্যাকাউন্ট পেয়ি ক্রসিং এবং ব্যাংকিং সুরক্ষা নির্দেশিকা।',
    keywords: [
      'cheque kivabe likhte hoy',
      'bank cheque lekhar niyom',
      'cheque writing in bengali',
      'cheque amount in words bengali',
      'self cheque kivabe likhbo',
      'account payee cheque bengali',
      'cheque format bangla',
      'cheque er date validity',
      'cheque bounce rules bangla',
      'sbi cheque filling bengali'
    ],
    searchIntents: [
      'ব্যাংক চেক কিভাবে লিখবেন',
      'চেক লেখার সঠিক নিয়ম',
      'কথায় টাকার পরিমাণ কিভাবে লিখতে হয়',
      'অ্যাকাউন্ট পেয়ি চেক কিভাবে করবেন',
      'সেলফ চেক লেখার নিয়ম',
      'চেক লেখার সময় সাধারণ ভুল'
    ],
    headings: {
      guideTitle: 'ধাপে ধাপে গাইড: ব্যাংক চেক লেখার সঠিক নিয়ম',
      faqTitle: 'ব্যাংক চেক সংক্রান্ত গুরুত্বপূর্ণ প্রশ্নোত্তর (FAQs)',
      mistakesTitle: 'চেক লেখার সময় যে ৫টি সাধারণ ভুল এড়িয়ে চলবেন',
      languagesTitle: 'অন্যান্য ভারতীয় ভাষায় চেকের গাইড দেখুন',
      dateLabel: 'তারিখ (DDMMYYYY)',
      payeeLabel: 'প্রাপকের নাম (Payee)',
      amountNumbersLabel: 'অঙ্কে টাকার পরিমাণ (₹ বক্স)',
      amountWordsLabel: 'কথায় টাকার পরিমাণ (Amount in Words)',
      signatureLabel: 'স্বাক্ষর (Authorised Signatory)',
      crossingLabel: 'অ্যাকাউন্ট পেয়ি ক্রসিং (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'উপরে ডানদিকে তারিখ সঠিকভাবে লিখুন (DDMMYYYY)',
        instruction: 'উপরের ডানদিকের ৮টি বক্সে DDMMYYYY ফরম্যাটে তারিখ লিখুন (যেমন: 15-10-2026)। ভারতে চেক লেখার তারিখ থেকে ঠিক ৩ মাস পর্যন্ত বৈধ থাকে।',
        tip: '৩ মাস পার হয়ে গেলে চেক বাতিল হয়ে যায় (Stale Cheque)।'
      },
      {
        stepNumber: 2,
        title: 'প্রাপকের নাম লিখে বাকি ফাঁকা অংশে দাগ টানুন',
        instruction: '"PAY" শব্দের পাশে প্রাপকের সঠিক নাম লিখুন। নামের পাশে কোনো ফাঁকা জায়গা না রেখে একটি সোজা দাগ টেনে দিন।',
        tip: 'নিজের অ্যাকাউন্ট থেকে টাকা তুলতে "SELF" লিখুন।'
      },
      {
        stepNumber: 3,
        title: 'কথায় টাকার পরিমাণ লিখে শেষে "টাকা মাত্র //" যোগ করুন',
        instruction: 'টাকার পরিমাণ বাংলায় বা ইংরেজিতে কথায় লিখুন (যেমন: পঞ্চাশ হাজার টাকা মাত্র //) এবং শেষে দুটি স্ল্যাশ "//" দিন।',
        tip: 'অঙ্ক এবং কথার পরিমাণের মধ্যে কোনো গরমিল থাকা যাবে না।'
      },
      {
        stepNumber: 4,
        title: '₹ বক্সে অঙ্কে টাকার পরিমাণ লিখুন',
        instruction: 'মুদ্রিত ₹ চিহ্নের পাশে ফাঁকা না রেখে অঙ্কে লিখুন (যেমন: ₹ 50,000/-) এবং শেষে "/-" চিহ্ন দিন।',
        tip: 'অতিরিক্ত শূন্য যাতে কেউ যোগ না করতে পারে সেজন্য "/-" দেওয়া হয়।'
      },
      {
        stepNumber: 5,
        title: 'সুরক্ষার জন্য অ্যাকাউন্ট পেয়ি (A/C Payee) ক্রসিং করুন',
        instruction: 'চেকের উপরের বাঁদিকের কোণায় দুটি সমান্তরাল তির্যক রেখা টেনে "A/C PAYEE" লিখুন। এর ফলে টাকা শুধু প্রাপকের অ্যাকাউন্টে জমা হবে।',
        tip: 'ক্রস করা চেক কাউন্টারে নগদে ভাঙানো যায় না।'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" লেখার উপরে স্বাক্ষর করুন',
        instruction: 'নিচের ডানদিকে আপনার ব্যাংক রেকর্ডের সাথে মিলিয়ে স্বাক্ষর করুন। নিচের সাদা MICR অংশে স্বাক্ষর করবেন না।',
        tip: 'ব্ল্যাঙ্ক চেকে কখনো স্বাক্ষর করবেন না।'
      }
    ],
    faqs: [
      {
        question: 'অ্যাকাউন্ট পেয়ি এবং বেয়ারার চেকের মধ্যে পার্থক্য কি?',
        answer: 'অ্যাকাউন্ট পেয়ি চেক সরাসরি প্রাপকের ব্যাংক অ্যাকাউন্টে জমা হয়। অন্যদিকে বেয়ারার চেক যে কেউ ব্যাংকে জমা দিয়ে কাউন্টারে সরাসরি নগদ টাকা নিতে পারে।'
      },
      {
        question: 'ভারতে ব্যাংক চেকের মেয়াদ কতদিন থাকে?',
        answer: 'আরবিআই-এর নিয়ম অনুসারে চেক লেখার তারিখ থেকে ঠিক ৩ মাস পর্যন্ত বৈধ থাকে।'
      },
      {
        question: 'কথায় টাকা লেখার পর "মাত্র" (Only) লেখা কেন জরুরি?',
        answer: 'লেখা পরিমাণের পর কেউ যাতে অতিরিক্ত শব্দ বা টাকা যোগ করে প্রতারণা না করতে পারে সেজন্য "মাত্র" লেখা হয়।'
      },
      {
        question: 'পজিটিভ পে সিস্টেম (Positive Pay System) কি?',
        answer: '৫০,০০০ টাকার বেশি চেকে জালিয়াতি রোধে নেট ব্যাংকিং বা এসএমএসের মাধ্যমে চেকের তথ্য ব্যাংকে আগে থেকে নিশ্চিত করার ব্যবস্থা।'
      },
      {
        question: 'সেলফ চেক (Self Cheque) কিভাবে লিখবেন?',
        answer: 'Payee-র জায়গায় "SELF" লিখে, টাকার অঙ্ক বসিয়ে সামনে এবং পিছনে স্বাক্ষর করে ব্যাংক কাউন্টারে নগদ টাকা তোলা যায়।'
      }
    ],
    commonMistakes: [
      'চেকে কাটাকাটি বা ওভাররাইটিং করা (আরবিআই নিয়ম অনুযায়ী কাটাকাটি থাকা চেক বাতিল হয়)।',
      'অঙ্কের পরিমাণ এবং কথার পরিমাণের মধ্যে অমিল থাকা।',
      'নিচের সাদা ম্যাগনেটিক MICR কোড অংশে স্বাক্ষর করা।',
      'নাম ও পরিমাণের পাশে ফাঁকা জায়গা রেখে দেওয়া।',
      'তারিখ লেখার ৩ মাস পরে চেক ব্যাংকে জমা দেওয়া।'
    ]
  },

  // ================= 8. MARATHI =================
  mr: {
    lang: 'mr',
    localeCode: 'mr-IN',
    langName: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/mr',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/mr`,
    title: 'बँक धनादेश कसा भरावा – चेक भरण्याची योग्य पद्धत व नियम | IndiaTools',
    description: 'बँकेचा चेक (धनादेश) अचूक कसा भरावा ते शिका. अक्षरी रक्कम (रुपये फक्त), खातेदार नाव, अकाउंट पेयी क्रॉसिंग, सेल्फ चेक आणि धनादेश लिहिताना होणाऱ्या चुका टाळण्याचे उपाय.',
    h1: 'बँकेचा धनादेश (Cheque) कसा भरावा: सोपी आणि योग्य पद्धत',
    subtitle: 'आरबीआय सीटीएस-2010 नियम, अक्षरी रक्कम रूपांतरण (रुपये फक्त), अकाउंट पेयी क्रॉसिंग आणि धनादेश सुरक्षा.',
    keywords: [
      'cheque kasa bharava',
      'bank cheque kasa lihava',
      'dhanadesh kasa bharava',
      'cheque writing in marathi',
      'cheque amount in words marathi',
      'self cheque kasa kadhava',
      'account payee cheque marathi',
      'marathi cheque format',
      'cheque validity rules marathi',
      'sbi cheque filling marathi'
    ],
    searchIntents: [
      'धनादेश कसा भरावा',
      'बँक चेक भरण्याची योग्य पद्धत',
      'अक्षरी रक्कम कशी लिहावी',
      'अकाउंट पेयी चेक कसा करावा',
      'सेल्फ चेक कसा भरावा',
      'चेक लिहिताना होणाऱ्या चुका'
    ],
    headings: {
      guideTitle: 'स्टेप-बाय-स्टेप पद्धत: बँकेचा धनादेश अचूक कसा भरावा',
      faqTitle: 'धनादेशाबाबत वारंवार विचारले जाणारे प्रश्न (FAQs)',
      mistakesTitle: 'धनादेश भरताना टाळावयाच्या ५ गंभीर चुका',
      languagesTitle: 'इतर भारतीय भाषांमध्ये धनादेश मार्गदर्शिका पहा',
      dateLabel: 'दिनांक (DDMMYYYY)',
      payeeLabel: 'मिळणाऱ्या व्यक्तीचे नाव (Payee)',
      amountNumbersLabel: 'अंकात रक्कम (₹ बॉक्स)',
      amountWordsLabel: 'अक्षरी रक्कम (Amount in Words)',
      signatureLabel: 'स्वाक्षरी (Authorised Signatory)',
      crossingLabel: 'अकाउंट पेयी क्रॉसिंग (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'वर उजव्या कोपऱ्यात अचूक दिनांक लिहा (DDMMYYYY)',
        instruction: 'वर उजवीकडे दिलेल्या ८ बॉक्समध्ये DDMMYYYY फॉरमॅटमध्ये तारीख लिहा (उदा: 15-10-2026). भारतात धनादेश जारी केल्याच्या दिनांकापासून ३ महिन्यांपर्यंतच वैध असतो.',
        tip: '३ महिन्यांनंतर चेक बाद (Stale Cheque) होतो.'
      },
      {
        stepNumber: 2,
        title: 'रक्कम घेणाऱ्याचे नाव लिहा व रिकाम्या जागेवर रेघ मारा',
        instruction: '"PAY" शब्दाच्या पुढे व्यक्तीचे किंवा संस्थेचे पूर्ण नाव लिहा. नावानंतर उरलेल्या जागेवर आडवी रेघ मारा.',
        tip: 'स्वतः रोख रक्कम काढण्यासाठी "SELF" असे लिहा.'
      },
      {
        stepNumber: 3,
        title: 'अक्षरी रक्कम लिहून शेवटी "रुपये फक्त //" जोडा',
        instruction: 'रक्कम अक्षरात लिहा (उदा: पन्नास हजार रुपये फक्त //) आणि शेवटी दोन तिरप्या रेघा "//" मारा.',
        tip: 'अंकातील आणि अक्षरातील रक्कमेत तफावत नसावी.'
      },
      {
        stepNumber: 4,
        title: '₹ बॉक्समध्ये अंकात रक्कम भरा',
        instruction: '₹ चिन्हाच्या लगतच अंकात रक्कम लिहा (उदा: ₹ 50,000/-) आणि पुढे "/-" चिन्ह द्या.',
        tip: 'पुढे शून्य वाढवता येऊ नये म्हणून "/-" लावणे आवश्यक आहे.'
      },
      {
        stepNumber: 5,
        title: 'सुरक्षिततेसाठी अकाउंट पेयी (A/C Payee) क्रॉसिंग करा',
        instruction: 'धनादेशाच्या वर डाव्या कोपऱ्यात दोन तिरप्या रेघा ओढून "A/C PAYEE" लिहा. यामुळे रक्कम केवळ बँक खात्यातच जमा होते.',
        tip: 'क्रॉस केलेला चेक काउंटरवर रोख स्वरूपात मिळत नाही.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" च्या वर स्वाक्षरी करा',
        instruction: 'खाली उजवीकडे बँक रेकॉर्डमधील स्वाक्षरी तंतोतंत जुळणारी करा. खालील पांढऱ्या MICR पट्ट्यावर स्वाक्षरी करू नका.',
        tip: 'कोऱ्या (Blank) धनादेशावर कधीही स्वाक्षरी करू नका.'
      }
    ],
    faqs: [
      {
        question: 'अकाउंट पेयी आणि बेअरर चेकमध्ये काय फरक आहे?',
        answer: 'अकाउंट पेयी चेकचे पैसे केवळ संबंधित व्यक्तीच्या बँक खात्यात जमा होतात, तर बेअरर चेक कोणालाही काउंटरवर रोख स्वरूपात वटवता येतो.'
      },
      {
        question: 'भारतात धनादेशाची वैधता किती दिवस असते?',
        answer: 'आरबीआयच्या नियमांनुसार धनादेश जारी केलेल्या दिनांकापासून बरोबर ३ महिन्यांपर्यंत वैध असतो.'
      },
      {
        question: 'अक्षरी रक्कमेच्या शेवटी "फक्त" (Only) का लिहावे?',
        answer: 'लिहिलेल्या रक्कमेपुढे कोणीही अधिक रक्कम जोडू नये म्हणून "फक्त" आणि "//" लिहिणे कायद्याने बंधनकारक आहे.'
      },
      {
        question: 'पॉझिटिव्ह पे सिस्टम (Positive Pay System) म्हणजे काय?',
        answer: '५०,००० रुपयांपेक्षा जास्त रक्कमेच्या धनादेशाची खात्री करण्यासाठी नेट बँकिंगद्वारे बँकेला आधीच तपशील देण्याची सुरक्षित प्रणाली.'
      },
      {
        question: 'सेल्फ चेक (Self Cheque) कसा लिहावा?',
        answer: 'Payee च्या जागी "SELF" लिहून, रक्कम भरून समोर व मागे स्वाक्षरी करून बँक काउंटरवरून स्वतः रोख रक्कम काढता येते.'
      }
    ],
    commonMistakes: [
      'धनादेशावर खाडाखोड करणे (खाडाखोड केलेला धनादेश बँक थेट नाकारते).',
      'अंकातील रक्कम आणि अक्षरातील रक्कमेत फरक असणे.',
      'खालील पांढऱ्या चुंबकीय MICR कोड भागावर स्वाक्षरी करणे.',
      'नाव आणि रक्कमेच्या पुढे मोकळी जागा ठेवणे.',
      '३ महिन्यांची मुदत संपल्यानंतर धनादेश बँकेत सादर करणे.'
    ]
  },

  // ================= 9. GUJARATI =================
  gu: {
    lang: 'gu',
    localeCode: 'gu-IN',
    langName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/gu',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/gu`,
    title: 'બેંક ચેક કેવી રીતે ભરવો – ચેક લખવાની સાચી રીત અને નિયમો | IndiaTools',
    description: 'ભારતીય બેંક ચેક કેવી રીતે ભરવો તે શીખો. શબ્દોમાં રકમ (રૂપિયા પૂરા), એકાઉન્ટ પેયી ક્રોસિંગ, સેલ્ફ ચેક અને ચેક લખતી વખતે સામાન્ય ભૂલો અટકાવવાની માહિતી.',
    h1: 'બેંક ચેક કેવી રીતે લખવો: સંપૂર્ણ માર્ગદર્શિકા અને સાચી રીત',
    subtitle: 'RBI CTS-2010 નિયમો, શબ્દોમાં રકમ (રૂપિયા પૂરા), એકાઉન્ટ પેયી ક્રોસિંગ અને બેંકિંગ સલામતી સૂચનાઓ.',
    keywords: [
      'cheque kevi rite bharvo',
      'bank cheque lakhvani rit',
      'cheque writing in gujarati',
      'cheque amount in words gujarati',
      'self cheque kevi rite lakhavo',
      'account payee cheque gujarati',
      'gujarati cheque format',
      'cheque rules india',
      'cheque validity gujarati',
      'sbi cheque filling gujarati'
    ],
    searchIntents: [
      'બેંક ચેક કેવી રીતે ભરવો',
      'ચેક લખવાની સાચી રીત',
      'શબ્દોમાં રકમ કેવી રીતે લખવી',
      'એકાઉન્ટ પેયી ચેક બનાવવાની રીત',
      'સેલ્ફ ચેક લખવાની રીત',
      'ચેક લખતી વખતે થતી ભૂલો'
    ],
    headings: {
      guideTitle: 'સ્ટેપ-બાય-સ્ટેપ ગાઈડ: બેંક ચેક ભરવાની સાચી રીત',
      faqTitle: 'બેંક ચેક સંબંધિત પ્રશ્નોત્તરી (FAQs)',
      mistakesTitle: 'ચેક ભરતી વખતે ન કરવા જેવી ૫ સામાન્ય ભૂલો',
      languagesTitle: 'અન્ય ભારતીય ભાષાઓમાં ચેક ગાઈડ જુઓ',
      dateLabel: 'તારીખ (DDMMYYYY)',
      payeeLabel: 'નાણાં મેળવનારનું નામ (Payee)',
      amountNumbersLabel: 'આંકડામાં રકમ (₹ બોક્સ)',
      amountWordsLabel: 'શબ્દોમાં રકમ (Amount in Words)',
      signatureLabel: 'સહી (Authorised Signatory)',
      crossingLabel: 'એકાઉન્ટ પેયી ક્રોસિંગ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ઉપર જમણી બાજુએ તારીખ યોગ્ય રીતે લખો (DDMMYYYY)',
        instruction: 'ઉપર આપેલા ૮ બોક્સમાં DDMMYYYY ફોર્મેટમાં તારીખ લખો (દા.ત. 15-10-2026). ભારતમાં ચેક લખ્યાની તારીખથી ૩ મહિના સુધી જ માન્ય રહે છે.',
        tip: '૩ મહિના પછી ચેક અમાન્ય (Stale Cheque) બની જાય છે.'
      },
      {
        stepNumber: 2,
        title: 'મેળવનારનું નામ લખી ખાલી જગ્યા પર લાઈન દોરો',
        instruction: '"PAY" ની બાજુમાં જ જેને નાણાં આપવાના હોય તેનું પૂરું નામ લખો અને ખાલી જગ્યા પર આડી લાઈન દોરી દો.',
        tip: 'પોતાના ખાતામાંથી રોકડા ઉપાડવા માટે "SELF" લખો.'
      },
      {
        stepNumber: 3,
        title: 'શબ્દોમાં રકમ લખી અંતમાં "રૂપિયા પૂરા //" લખો',
        instruction: 'રકમ ગુજરાતી કે અંગ્રેજી શબ્દોમાં લખો (દા.ત. પચાસ હજાર રૂપિયા પૂરા //) અને છેલ્લે બે ત્રાસી લાઈન "//" કરો.',
        tip: 'આંકડા અને શબ્દોની રકમમાં કોઈ ફેરફાર ન હોવો જોઈએ.'
      },
      {
        stepNumber: 4,
        title: '₹ બોક્સમાં આંકડામાં રકમ લખો',
        instruction: '₹ ની બાજુમાં જગ્યા છોડ્યા વગર રકમ લખો (દા.ત. ₹ 50,000/-) અને પાછળ "/-" નું ચિહ્ન કરો.',
        tip: 'વધારાના શૂન્ય કોઈ ન ઉમેરે તે માટે "/-" જરૂરી છે.'
      },
      {
        stepNumber: 5,
        title: 'સુરક્ષા માટે એકાઉન્ટ પેયી (A/C Payee) ક્રોસિંગ કરો',
        instruction: 'ચેકની ઉપર ડાબી બાજુ બે ત્રાસી સમાંતર લાઈનો દોરી તેમાં "A/C PAYEE" લખો. આનાથી રકમ માત્ર તેના ખાતામાં જ જમા થશે.',
        tip: 'આ ચેક કેશ કાઉન્ટર પરથી રોકડમાં મળતો નથી.'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" ની ઉપર સહી કરો',
        instruction: 'નીચે જમણી બાજુ બેંક રેકોર્ડ સાથે મેળ ખાતી સહી કરો. નીચેની સફેદ MICR પટ્ટી પર સહી કરવી નહીં.',
        tip: 'ખાલી ચેક (Blank Cheque) પર ક્યારેય સહી ન કરવી.'
      }
    ],
    faqs: [
      {
        question: 'એકાઉન્ટ પેયી અને બેરર ચેક વચ્ચે શું તફાવત છે?',
        answer: 'એકાઉન્ટ પેયી ચેકના નાણાં સીધા મેળવનારના બેંક ખાતામાં જમા થાય છે, જ્યારે બેરર ચેક કોઈ પણ વ્યક્તિ કાઉન્ટર પર આપીને રોકડ લઈ શકે છે.'
      },
      {
        question: 'ભારતમાં બેંક ચેકની માન્યતા કેટલો સમય હોય છે?',
        answer: 'RBI ના નિયમો મુજબ ચેક લખ્યાની તારીખથી બરાબર ૩ મહિના સુધી જ માન્ય રહે છે.'
      },
      {
        question: 'શબ્દોમાં રકમ લખ્યા પછી "પૂરા" (Only) શા માટે લખવું?',
        answer: 'લખેલી રકમ પાછળ કોઈ વધારાની રકમ કે શબ્દ ન ઉમેરી શકે તે માટે "પૂરા" અને "//" લખવું જરૂરી છે.'
      },
      {
        question: 'પોઝિટિવ પે સિસ્ટમ (Positive Pay System) શું છે?',
        answer: '૫૦,૦૦૦ થી વધુ રકમના ચેક માટે નેટ બેંકિંગ કે એસએમએસ દ્વારા બેંકને વિગતોની અગાઉથી ખાતરી કરાવતી સુરક્ષા વ્યવસ્થા.'
      },
      {
        question: 'સેલ્ફ ચેક (Self Cheque) કેવી રીતે લખાય?',
        answer: 'Payee ની જગ્યાએ "SELF" લખી, રકમ ભરી આગળ અને પાછળ સહી કરીને કાઉન્ટર પરથી રોકડ મેળવી શકાય છે.'
      }
    ],
    commonMistakes: [
      'ચેક પર છેકછાક કરવી (છેકછાકવાળો ચેક બેંક સ્વીકારતી નથી).',
      'આંકડા અને શબ્દોની રકમમાં તફાવત હોવો.',
      'નીચેના સફેદ MICR કોડ વાળા ભાગ પર સહી કરવી.',
      'નામ અને રકમની આસપાસ મોટી ખાલી જગ્યાઓ છોડવી.',
      '૩ મહિનાની મુદત વીતી ગયા પછી ચેક બેંકમાં જમા કરવો.'
    ]
  },

  // ================= 10. PUNJABI =================
  pa: {
    lang: 'pa',
    localeCode: 'pa-IN',
    langName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/pa',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/pa`,
    title: 'ਬੈਂਕ ਚੈੱਕ ਕਿਵੇਂ ਭਰੀਏ – ਚੈੱਕ ਲਿਖਣ ਦਾ ਸਹੀ ਤਰੀਕਾ ਅਤੇ ਨਿਯਮ | IndiaTools',
    description: 'ਭਾਰਤੀ ਬੈਂਕ ਚੈੱਕ ਲਿਖਣ ਦਾ ਸਹੀ ਢੰਗ ਸਿੱਖੋ। ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ (ਰੁਪਏ ਕੇਵਲ), ਅਕਾਊਂਟ ਪੇਈ ਕ੍ਰਾਸਿੰਗ, ਸੈਲਫ਼ ਚੈੱਕ ਅਤੇ ਚੈੱਕ ਭਰਨ ਸਮੇਂ ਹੋਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਤੋਂ ਬਚੋ।',
    h1: 'ਬੈਂਕ ਚੈੱਕ ਕਿਵੇਂ ਭਰੀਏ: ਚੈੱਕ ਲਿਖਣ ਦੀ ਪੂਰੀ ਗਾਈਡ',
    subtitle: 'ਆਰਬੀਆਈ CTS-2010 ਫਾਰਮੈਟ, ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ (ਰੁਪਏ ਕੇਵਲ), ਅਕਾਊਂਟ ਪੇਈ ਕ੍ਰਾਸਿੰਗ ਅਤੇ ਬੈਂਕਿੰਗ ਸੁਰੱਖਿਆ ਨਿਯਮ।',
    keywords: [
      'cheque kiven bhariye',
      'bank cheque likhan da tarika',
      'cheque writing in punjabi',
      'cheque amount in words punjabi',
      'self cheque kiven bhariye',
      'account payee cheque punjabi',
      'punjabi cheque format',
      'cheque date niyam',
      'cheque bounce rules punjabi',
      'sbi cheque fill punjabi'
    ],
    searchIntents: [
      'ਬੈਂਕ ਚੈੱਕ ਕਿਵੇਂ ਭਰੀਏ',
      'ਚੈੱਕ ਲਿਖਣ ਦਾ ਸਹੀ ਤਰੀਕਾ',
      'ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ ਕਿਵੇਂ ਲਿਖੀਏ',
      'ਅਕਾਊਂਟ ਪੇਈ ਚੈੱਕ ਕਿਵੇਂ ਬਣਾਈਏ',
      'ਸੈਲਫ਼ ਚੈੱਕ ਲਿਖਣ ਦਾ ਤਰੀਕਾ',
      'ਚੈੱਕ ਲਿਖਣ ਸਮੇਂ ਸਾਵਧਾਨੀਆਂ'
    ],
    headings: {
      guideTitle: 'ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ: ਬੈਂਕ ਚੈੱਕ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਕਿਵੇਂ ਭਰੀਏ',
      faqTitle: 'ਬੈਂਕ ਚੈੱਕ ਨਾਲ ਜੁੜੇ ਜ਼ਰੂਰੀ ਸਵਾਲ-ਜਵਾਬ (FAQs)',
      mistakesTitle: 'ਚੈੱਕ ਭਰਨ ਸਮੇਂ ਹੋਣ ਵਾਲੀਆਂ 5 ਵੱਡੀਆਂ ਗਲਤੀਆਂ',
      languagesTitle: 'ਹੋਰ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਚੈੱਕ ਗਾਈਡ ਦੇਖੋ',
      dateLabel: 'ਮਿਤੀ (DDMMYYYY)',
      payeeLabel: 'ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ ਨਾਮ (Payee)',
      amountNumbersLabel: 'ਅੰਕਾਂ ਵਿੱਚ ਰਕਮ (₹ ਬਾਕਸ)',
      amountWordsLabel: 'ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ (Amount in Words)',
      signatureLabel: 'ਦਸਤਖਤ (Authorised Signatory)',
      crossingLabel: 'ਅਕਾਊਂਟ ਪੇਈ ਕ੍ਰਾਸਿੰਗ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ਉੱਪਰ ਸੱਜੇ ਪਾਸੇ ਸਹੀ ਮਿਤੀ ਦਰਜ ਕਰੋ (DDMMYYYY)',
        instruction: 'ਉੱਪਰ ਦਿੱਤੇ 8 ਬਾਕਸਾਂ ਵਿੱਚ DDMMYYYY ਫਾਰਮੈਟ ਵਿੱਚ ਤਾਰੀਖ ਲਿਖੋ (ਜਿਵੇਂ 15-10-2026)। ਭਾਰਤ ਵਿੱਚ ਚੈੱਕ ਲਿਖੀ ਮਿਤੀ ਤੋਂ 3 ਮਹੀਨੇ ਤੱਕ ਹੀ ਵੈਧ ਹੁੰਦਾ ਹੈ।',
        tip: '3 ਮਹੀਨੇ ਬਾਅਦ ਚੈੱਕ ਅਵੈਧ (Stale Cheque) ਹੋ ਜਾਂਦਾ ਹੈ।'
      },
      {
        stepNumber: 2,
        title: 'ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ ਨਾਮ ਲਿਖੋ ਅਤੇ ਖਾਲੀ ਥਾਂ ਕੱਟੋ',
        instruction: '"PAY" ਦੇ ਬਿਲਕੁਲ ਨਾਲ ਜਿਸਨੂੰ ਪੈਸੇ ਦੇਣੇ ਹਨ ਉਸਦਾ ਪੂਰਾ ਨਾਮ ਲਿਖੋ ਅਤੇ ਬਾਕੀ ਬਚੀ ਲਾਈਨ ਉੱਤੇ ਸਿੱਧੀ ਲਕੀਰ ਖਿੱਚੋ।',
        tip: 'ਆਪਣੇ ਖਾਤੇ ਵਿੱਚੋਂ ਨਕਦ ਕਢਵਾਉਣ ਲਈ "SELF" ਲਿਖੋ।'
      },
      {
        stepNumber: 3,
        title: 'ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ ਲਿਖ ਕੇ ਅੰਤ ਵਿੱਚ "ਰੁਪਏ ਕੇਵਲ //" ਲਿਖੋ',
        instruction: 'ਰਕਮ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੋ (ਜਿਵੇਂ: ਪੰਜਾਹ ਹਜ਼ਾਰ ਰੁਪਏ ਕੇਵਲ //) ਅਤੇ ਅਖੀਰ ਵਿੱਚ ਦੋ ਤਿਰਛੀਆਂ ਲਾਈਨਾਂ "//" ਲਗਾਓ।',
        tip: 'ਅੰਕਾਂ ਅਤੇ ਸ਼ਬਦਾਂ ਦੀ ਰਕਮ ਵਿੱਚ ਕੋਈ ਫ਼ਰਕ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।'
      },
      {
        stepNumber: 4,
        title: '₹ ਬਾਕਸ ਵਿੱਚ ਅੰਕਾਂ ਵਿੱਚ ਰਕਮ ਲਿਖੋ',
        instruction: '₹ ਦੇ ਨਿਸ਼ਾਨ ਨਾਲ ਬਿਨਾਂ ਥਾਂ ਛੱਡੇ ਅੰਕਾਂ ਵਿੱਚ ਰਕਮ ਲਿਖੋ (ਜਿਵੇਂ: ₹ 50,000/-) ਅਤੇ ਅਖੀਰ ਵਿੱਚ "/-" ਦਾ ਨਿਸ਼ਾਨ ਲਗਾਓ।',
        tip: 'ਵਾਧੂ ਸਿਫ਼ਰ ਕੋਈ ਨਾ ਜੋੜ ਸਕੇ ਇਸ ਲਈ "/-" ਲਗਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ।'
      },
      {
        stepNumber: 5,
        title: 'ਸੁਰੱਖਿਆ ਲਈ ਅਕਾਊਂਟ ਪੇਈ (A/C Payee) ਕ੍ਰਾਸਿੰਗ ਕਰੋ',
        instruction: 'ਚੈੱਕ ਦੇ ਉੱਪਰਲੇ ਖੱਬੇ ਕੋਨੇ ਉੱਤੇ ਦੋ ਸਮਾਨਾਂਤਰ ਤਿਰਛੀਆਂ ਲਾਈਨਾਂ ਖਿੱਚ ਕੇ "A/C PAYEE" ਲਿਖੋ। ਇਸ ਨਾਲ ਪੈਸਾ ਸਿਰਫ਼ ਉਸਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਹੀ ਜਾਵੇਗਾ।',
        tip: 'ਕ੍ਰਾਸ ਕੀਤਾ ਚੈੱਕ ਕਾਊਂਟਰ ਤੋਂ ਨਕਦ ਨਹੀਂ ਮਿਲਦਾ।'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" ਦੇ ਉੱਪਰ ਦਸਤਖਤ ਕਰੋ',
        instruction: 'ਹੇਠਾਂ ਸੱਜੇ ਪਾਸੇ ਆਪਣੇ ਬੈਂਕ ਰਿਕਾਰਡ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਦਸਤਖਤ ਕਰੋ। ਹੇਠਲੀ ਚਿੱਟੀ MICR ਪੱਟੀ ਉੱਤੇ ਦਸਤਖਤ ਨਾ ਕਰੋ।',
        tip: 'ਖਾਲੀ ਚੈੱਕ (Blank Cheque) ਉੱਤੇ ਕਦੇ ਵੀ ਦਸਤਖਤ ਨਾ ਕਰੋ।'
      }
    ],
    faqs: [
      {
        question: 'ਅਕਾਊਂਟ ਪੇਈ ਅਤੇ ਬੇਅਰਰ ਚੈੱਕ ਵਿੱਚ ਕੀ ਫਰਕ ਹੈ?',
        answer: 'ਅਕਾਊਂਟ ਪੇਈ ਚੈੱਕ ਦਾ ਪੈਸਾ ਸਿੱਧਾ ਲਿਖੇ ਵਿਅਕਤੀ ਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾ ਹੁੰਦਾ ਹੈ, ਜਦਕਿ ਬੇਅਰਰ ਚੈੱਕ ਕੋਈ ਵੀ ਕਾਊਂਟਰ ਉੱਤੇ ਜਾ ਕੇ ਨਕਦ ਕਢਵਾ ਸਕਦਾ ਹੈ।'
      },
      {
        question: 'ਭਾਰਤ ਵਿੱਚ ਬੈਂਕ ਚੈੱਕ ਦੀ ਮਿਆਦ ਕਿੰਨੀ ਹੁੰਦੀ ਹੈ?',
        answer: 'ਆਰਬੀਆਈ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਚੈੱਕ ਜਾਰੀ ਹੋਣ ਦੀ ਤਾਰੀਖ ਤੋਂ ਠੀਕ 3 ਮਹੀਨੇ ਤੱਕ ਹੀ ਵੈਧ ਹੁੰਦਾ ਹੈ।'
      },
      {
        question: 'ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ ਲਿਖਣ ਤੋਂ ਬਾਅਦ "ਕੇਵਲ" (Only) ਲਿਖਣਾ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ?',
        answer: 'ਕੋਈ ਵੀ ਲਿਖੀ ਰਕਮ ਤੋਂ ਅੱਗੇ ਵਾਧੂ ਸ਼ਬਦ ਜੋੜ ਕੇ ਧੋਖਾਧੜੀ ਨਾ ਕਰ ਸਕੇ ਇਸ ਲਈ "ਕੇਵਲ" ਅਤੇ "//" ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।'
      },
      {
        question: 'ਪਾਜ਼ੀਟਿਵ ਪੇ ਸਿਸਟਮ (Positive Pay System) ਕੀ ਹੈ?',
        answer: '50,000 ਤੋਂ ਵੱਧ ਦੇ ਚੈੱਕ ਲਈ ਨੈੱਟ ਬੈਂਕਿੰਗ ਜਾਂ ਐਸਐਮਐਸ ਰਾਹੀਂ ਵੇਰਵਿਆਂ ਦੀ ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰਨ ਵਾਲਾ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ।'
      },
      {
        question: 'ਸੈਲਫ਼ ਚੈੱਕ (Self Cheque) ਕਿਵੇਂ ਲਿਖਦੇ ਹਨ?',
        answer: 'Payee ਵਿੱਚ "SELF" ਲਿਖ ਕੇ, ਰਕਮ ਭਰ ਕੇ ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਦਸਤਖਤ ਕਰਕੇ ਬੈਂਕ ਕਾਊਂਟਰ ਤੋਂ ਨਕਦ ਪੈਸੇ ਕਢਵਾਏ ਜਾ ਸਕਦੇ ਹਨ।'
      }
    ],
    commonMistakes: [
      'ਚੈੱਕ ਉੱਤੇ ਕੱਟ-ਵੱਢ ਜਾਂ ਓਵਰਰਾਈਟਿੰਗ ਕਰਨਾ (ਕੱਟਿਆ ਚੈੱਕ ਬੈਂਕ ਰੱਦ ਕਰ ਦਿੰਦਾ ਹੈ)।',
      'ਅੰਕਾਂ ਅਤੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੀ ਰਕਮ ਵਿੱਚ ਅੰਤਰ ਹੋਣਾ।',
      'ਹੇਠਲੀ ਚਿੱਟੀ MICR ਕੋਡ ਵਾਲੀ ਥਾਂ ਉੱਤੇ ਦਸਤਖਤ ਕਰਨਾ।',
      'ਨਾਮ ਅਤੇ ਰਕਮ ਦੇ ਅੱਗੇ-ਪਿੱਛੇ ਖਾਲੀ ਥਾਂ ਛੱਡਣਾ।',
      '3 ਮਹੀਨੇ ਦਾ ਸਮਾਂ ਲੰਘਣ ਤੋਂ ਬਾਅਦ ਚੈੱਕ ਬੈਂਕ ਵਿੱਚ ਲਗਾਉਣਾ।'
    ]
  },

  // ================= 11. ODIA =================
  or: {
    lang: 'or',
    localeCode: 'or-IN',
    langName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/or',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/or`,
    title: 'ବ୍ୟାଙ୍କ ଚେକ୍ କିପରି ଲେଖିବେ – ଚେକ୍ ଭରିବାର ସଠିକ୍ ନିୟମ | IndiaTools',
    description: 'ଭାରତୀୟ ବ୍ୟାଙ୍କ ଚେକ୍ ସଠିକ୍ ଭାବରେ କିପରି ଲେଖିବେ ଶିଖନ୍ତୁ। ଅକ୍ଷରରେ ଟଙ୍କା (ଟଙ୍କା ମାତ୍ର), ଆକାଉଣ୍ଟ ପେୟୀ କ୍ରସିଂ, ସେଲ୍ଫ ଚେକ୍ ଏବଂ ଚେକ୍ ଲେଖିବାର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନିୟମ।',
    h1: 'ବ୍ୟାଙ୍କ ଚେକ୍ କିପରି ଲେଖିବେ: ସଠିକ୍ ପଦ୍ଧତି ଓ ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍',
    subtitle: 'RBI CTS-2010 ଫର୍ମାଟ୍, ଅକ୍ଷରରେ ଟଙ୍କା ରୂପାନ୍ତର (ଟଙ୍କା ମାତ୍ର), ଆକାଉଣ୍ଟ ପେୟୀ କ୍ରସିଂ ଏବଂ ସୁରକ୍ଷା ନିୟମ।',
    keywords: [
      'cheque kipari lekhibe',
      'bank cheque lekhiba niyama',
      'cheque writing in odia',
      'cheque amount in words odia',
      'self cheque kipari lekhanti',
      'account payee cheque odia',
      'odia cheque format',
      'cheque filling guide odia',
      'cheque date validity odia',
      'sbi cheque filling odia'
    ],
    searchIntents: [
      'ବ୍ୟାଙ୍କ ଚେକ୍ କିପରି ଲେଖିବେ',
      'ଚେକ୍ ଲେଖିବାର ସଠିକ୍ ନିୟମ',
      'ଅକ୍ଷରରେ ଟଙ୍କା କିପରି ଲେଖାଯାଏ',
      'ଆକାଉଣ୍ଟ ପେୟୀ ଚେକ୍ କିପରି କରିବେ',
      'ସେଲ୍ଫ ଚେକ୍ ଲେଖିବା ନିୟମ',
      'ଚେକ୍ ଲେଖିବା ବେଳେ ସାଧାରଣ ଭୁଲ'
    ],
    headings: {
      guideTitle: 'ଷ୍ଟେପ୍-ବାଇ-ଷ୍ଟେପ୍ ଗାଇଡ୍: ବ୍ୟାଙ୍କ ଚେକ୍ ଲେଖିବାର ସଠିକ୍ ଉପାୟ',
      faqTitle: 'ବ୍ୟାଙ୍କ ଚେକ୍ ସମ୍ବନ୍ଧୀୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପ୍ରଶ୍ନୋତ୍ତର (FAQs)',
      mistakesTitle: 'ଚେକ୍ ଲେଖିବା ସମୟରେ ଏଡ଼ାଇବାକୁ ଥିବା ୫ଟି ଭୁଲ',
      languagesTitle: 'ଅନ୍ୟାନ୍ୟ ଭାରତୀୟ ଭାଷାରେ ଚେକ୍ ଗାଇଡ୍ ଦେଖନ୍ତୁ',
      dateLabel: 'ତାରିଖ (DDMMYYYY)',
      payeeLabel: 'ପ୍ରାପକଙ୍କ ନାମ (Payee)',
      amountNumbersLabel: 'ଅଙ୍କରେ ଟଙ୍କା (₹ ବକ୍ସ)',
      amountWordsLabel: 'ଅକ୍ଷରରେ ଟଙ୍କା (Amount in Words)',
      signatureLabel: 'ଦସ୍ତଖତ (Authorised Signatory)',
      crossingLabel: 'ଆକାଉଣ୍ଟ ପେୟୀ କ୍ରସିଂ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ଉପରେ ଡାହାଣ ପଟେ ସଠିକ୍ ତାରିଖ ଲେଖନ୍ତୁ (DDMMYYYY)',
        instruction: '୮ଟି ବକ୍ସରେ DDMMYYYY ଫର୍ମାଟରେ ତାରିଖ ଲେଖନ୍ତୁ (ଯଥା: 15-10-2026)। ଭାରତରେ ଚେକ୍ ଲେଖାଯାଇଥିବା ତାରିଖଠାରୁ ୩ ମାସ ପର୍ଯ୍ୟନ୍ତ ବୈଧ ରହିଥାଏ।',
        tip: '୩ ମାସ ପରେ ଚେକ୍ ଅବୈଧ (Stale Cheque) ହୋଇଯାଏ।'
      },
      {
        stepNumber: 2,
        title: 'ପ୍ରାପକଙ୍କ ନାମ ଲେଖି ବଳକା ସ୍ଥାନରେ ଗାର ଟାଣନ୍ତୁ',
        instruction: '"PAY" ପାଖରେ ଯାହାଙ୍କୁ ଟଙ୍କା ଦେବାର ଅଛି ତାଙ୍କର ପୂରା ନାମ ଲେଖନ୍ତୁ ଏବଂ ନାମ ପରେ ଖାଲି ଜାଗାରେ ଗୋଟିଏ ସିଧା ଗାର ଟାଣିଦିଅନ୍ତୁ।',
        tip: 'ନିଜେ ଟଙ୍କା ଉଠାଇବା ପାଇଁ "SELF" ଲେଖନ୍ତୁ।'
      },
      {
        stepNumber: 3,
        title: 'ଅକ୍ଷରରେ ଟଙ୍କା ଲେଖି ଶେଷରେ "ଟଙ୍କା ମାତ୍ର //" ଯୋଡନ୍ତୁ',
        instruction: 'ଟଙ୍କାର ପରିମାଣ ଅକ୍ଷରରେ ଲେଖନ୍ତୁ (ଯଥା: ପଚାଶ ହଜାର ଟଙ୍କା ମାତ୍ର //) ଏବଂ ଶେଷରେ ଦୁଇଟି ସ୍ଲାସ୍ "//" ଦିଅନ୍ତୁ।',
        tip: 'ଅଙ୍କ ଓ ଅକ୍ଷରର ପରିମାଣ ମଧ୍ୟରେ କୌଣସି ଅମେଳ ରହିବା ଉଚିତ୍ ନୁହେଁ।'
      },
      {
        stepNumber: 4,
        title: '₹ ବକ୍ସରେ ଅଙ୍କରେ ଟଙ୍କା ଲେଖନ୍ତୁ',
        instruction: '₹ ଚିହ୍ନ ପାଖରେ ଖାଲି ସ୍ଥାନ ନ ଛାଡ଼ି ଅଙ୍କରେ ଲେଖନ୍ତୁ (ଯଥା: ₹ 50,000/-) ଏବଂ ପଛରେ "/-" ଚିହ୍ନ ଦିଅନ୍ତୁ।',
        tip: 'କେହି ଯେପରି ଅତିରିକ୍ତ ଶୂନ ନ ଲଗାଇପାରିବେ ସେଥିପାଇଁ "/-" ଦିଆଯାଏ।'
      },
      {
        stepNumber: 5,
        title: 'ସୁରକ୍ଷା ପାଇଁ ଆକାଉଣ୍ଟ ପେୟୀ (A/C Payee) କ୍ରସିଂ କରନ୍ତୁ',
        instruction: 'ଚେକର ଉପର ବାମ ପାଖରେ ଦୁଇଟି ସମାନ୍ତରାଳ ତେରଛା ଗାର ଟାଣି ମଝିରେ "A/C PAYEE" ଲେଖନ୍ତୁ। ଏହା ଦ୍ୱାରା ଟଙ୍କା କେବଳ ତାଙ୍କ ବ୍ୟାଙ୍କ ଖାତାରେ ଜମା ହେବ।',
        tip: 'ଏହି ଚେକ୍ କାଉଣ୍ଟରରେ ନଗଦ ମିଳିବ ନାହିଁ।'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" ଉପରେ ଦସ୍ତଖତ କରନ୍ତୁ',
        instruction: 'ତଳେ ଡାହାଣ ପାଖରେ ବ୍ୟାଙ୍କ ରେକର୍ଡ ସହିତ ମେଳ ଖାଉଥିବା ଦସ୍ତଖତ କରନ୍ତୁ। ତଳ ଧଳା MICR ଅଂଶରେ ଦସ୍ତଖତ କରିବେ ନାହିଁ।',
        tip: 'ଖାଲି ଚେକରେ କେବେ ଦସ୍ତଖତ କରିବେ ନାହିଁ।'
      }
    ],
    faqs: [
      {
        question: 'ଆକାଉଣ୍ଟ ପେୟୀ ଏବଂ ବିଅରର ଚେକ୍ ମଧ୍ୟରେ ପାର୍ଥକ୍ୟ କଣ?',
        answer: 'ଆକାଉଣ୍ଟ ପେୟୀ ଚେକର ଟଙ୍କା ସିଧାସଳଖ ତାଙ୍କ ବ୍ୟାଙ୍କ ଖାତାରେ ଜମା ହୋଇଥାଏ। ବିଅରର ଚେକରେ ଯେକୌଣସି ବ୍ୟକ୍ତି ବ୍ୟାଙ୍କ କାଉଣ୍ଟରରେ ଯାଇ ନଗଦ ଟଙ୍କା ନେଇପାରିବେ।'
      },
      {
        question: 'ଭାରତରେ ବ୍ୟାଙ୍କ ଚେକର ବୈଧତା କେତେ ଦିନ ଥାଏ?',
        answer: 'ଆରବିଆଇ ନିୟମ ଅନୁଯାୟୀ ଚେକ୍ ଲେଖାଯିବା ତାରିଖରୁ ଠିକ୍ ୩ ମାସ ପର୍ଯ୍ୟନ୍ତ ବୈଧ ଥାଏ।'
      },
      {
        question: 'ଅକ୍ଷରରେ ଲେଖିବା ପରେ "ମାତ୍ର" (Only) ଲେଖିବା କାହିଁକି ଆବଶ୍ୟକ?',
        answer: 'ଲେଖାଯାଇଥିବା ଟଙ୍କା ପରେ କେହି ଯେପରି ଅତିରିକ୍ତ ଶବ୍ଦ ନ ଯୋଡିପାରିବେ ସେଥିପାଇଁ "ମାତ୍ର" ଏବଂ "//" ଲେଖାଯାଏ।'
      },
      {
        question: 'ପଜିଟିଭ୍ ପେ ସିଷ୍ଟମ୍ (Positive Pay System) କଣ?',
        answer: '୫୦,୦୦୦ ଟଙ୍କାରୁ ଅଧିକ ଚେକ୍ ପାଇଁ ନେଟ୍ ବ୍ୟାଙ୍କିଂ କିମ୍ବା ଏସଏମଏସ ମାଧ୍ୟମରେ ଚେକର ବିବରଣୀ ପୂର୍ବରୁ ବ୍ୟାଙ୍କକୁ ଜଣାଇବାର ସୁରକ୍ଷା ବ୍ୟବସ୍ଥା।'
      },
      {
        question: 'ସେଲ୍ଫ ଚେକ୍ (Self Cheque) କିପରି ଲେଖାଯାଏ?',
        answer: 'Payee ସ୍ଥାନରେ "SELF" ଲେଖି, ଟଙ୍କା ଭରି ଆଗରେ ଏବଂ ପଛରେ ଦସ୍ତଖତ କରି ବ୍ୟାଙ୍କ କାଉଣ୍ଟରରୁ ନଗଦ ଟଙ୍କା ଉଠାଯାଇପାରିବ।'
      }
    ],
    commonMistakes: [
      'ଚେକରେ କଟାକଟି କରିବା (କଟାକଟି ଥିବା ଚେକ୍ ବ୍ୟାଙ୍କ ଗ୍ରହଣ କରେ ନାହିଁ)।',
      'ଅଙ୍କ ଓ ଅକ୍ଷରରେ ଲେଖାଯାଇଥିବା ଟଙ୍କାରେ ଅମେଳ ରହିବା।',
      'ତଳେ ଥିବା ଧଳା MICR କୋଡ୍ ସ୍ଥାନରେ ଦସ୍ତଖତ କରିବା।',
      'ନାମ ଏବଂ ଟଙ୍କା ପାଖରେ ଖାଲି ଜାଗା ଛାଡିବା।',
      '୩ ମାସ ବିତିଯିବା ପରେ ଚେକ୍ ବ୍ୟାଙ୍କରେ ଦାଖଲ କରିବା।'
    ]
  },

  // ================= 12. ASSAMESE =================
  as: {
    lang: 'as',
    localeCode: 'as-IN',
    langName: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    direction: 'ltr',
    slugPath: '/calculators/indian-cheque-studio/as',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/as`,
    title: 'বেংক চেক কেনেকৈ লিখিব – চেক পূৰণ কৰাৰ সঠিক নিয়ম | IndiaTools',
    description: 'ভাৰতীয় বেংক চেক সঠিকভাৱে কেনেকৈ লিখিব জানক। কথাত ধনৰ পৰিমাণ (টকা মাত্ৰ), একাউণ্ট পেয়ী ক্ৰছিং, চেল্ফ চেক আৰু চেক লিখাৰ সময়ত হোৱা ভুল এৰাই চলাৰ নিয়ম।',
    h1: 'বেংক চেক কেনেকৈ লিখিব: সঠিক নিয়ম আৰু সম্পূৰ্ণ নিৰ্দেশনা',
    subtitle: 'আৰবিআই CTS-2010 ফৰ্মেট, কথাত ধনৰ পৰিমাণ (টকা মাত্ৰ), একাউণ্ট পেয়ী ক্ৰছিং আৰু বেংকিং সুৰক্ষা নিৰ্দেশনা।',
    keywords: [
      'cheque kenekoi likhibo',
      'bank cheque likhar niyom',
      'cheque writing in assamese',
      'cheque amount in words assamese',
      'self cheque kenekoi likhe',
      'account payee cheque assamese',
      'assamese cheque format',
      'cheque date validity',
      'cheque bounce rules assamese',
      'sbi cheque filling assamese'
    ],
    searchIntents: [
      'বেংক চেক কেনেকৈ লিখিব',
      'চেক লিখাৰ সঠিক নিয়ম',
      'কথাত ধনৰ পৰিমাণ কেনেকৈ লিখে',
      'একাউণ্ট পেয়ী চেক কেনেকৈ কৰিব',
      'চেল্ফ চেক লিখাৰ নিয়ম',
      'চেক লিখাৰ সময়ত হোৱা ভুল'
    ],
    headings: {
      guideTitle: 'ধাপে ধাপে নিৰ্দেশনা: বেংক চেক সঠিকভাৱে লিখাৰ নিয়ম',
      faqTitle: 'বেংক চেক সম্পৰ্কীয় প্ৰয়োজনীয় প্ৰশ্নোত্তৰ (FAQs)',
      mistakesTitle: 'চেক লিখাৰ সময়ত নকৰিবলগীয়া ৫টা ভুল',
      languagesTitle: 'অন্যান্য ভাৰতীয় ভাষাত চেক গাইড চাওক',
      dateLabel: 'তাৰিখ (DDMMYYYY)',
      payeeLabel: 'প্ৰাপকৰ নাম (Payee)',
      amountNumbersLabel: 'অংকত ধনৰ পৰিমাণ (₹ বক্স)',
      amountWordsLabel: 'কথাত ধনৰ পৰিমাণ (Amount in Words)',
      signatureLabel: 'স্বাক্ষৰ (Authorised Signatory)',
      crossingLabel: 'একাউণ্ট পেয়ী ক্ৰছিং (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'ওপৰত সোঁফালে সঠিক তাৰিখ লিখক (DDMMYYYY)',
        instruction: 'ওপৰৰ ৮টা বাকচত DDMMYYYY ফৰ্মেটত তাৰিখ লিখক (যেনে: 15-10-2026)। ভাৰতত চেক লিখাৰ তাৰিখৰ পৰা ৩ মাহলৈকেহে বৈধ থাকে।',
        tip: '৩ মাহ পাৰ হৈ গ’লে চেক বাতিল হয় (Stale Cheque)।'
      },
      {
        stepNumber: 2,
        title: 'প্ৰাপকৰ নাম লিখি বাকী থকা ঠাইত আঁচ টানক',
        instruction: '"PAY" শব্দৰ কাষতে যিয়ে ধন পাব তেওঁৰ সম্পূৰ্ণ নাম লিখক আৰু নামৰ পিছৰ খালী ঠাইত এডাল পোন আঁচ টানি দিয়ক।',
        tip: 'নিজে নগদ ধন তুলিবলৈ "SELF" লিখক।'
      },
      {
        stepNumber: 3,
        title: 'কথাত ধনৰ পৰিমাণ লিখি শেষত "টকা মাত্ৰ //" যোগ কৰক',
        instruction: 'ধনৰ পৰিমাণ অসমীয়া বা ইংৰাজীত কথাত লিখক (যেনে: পঞ্চাশ হাজাৰ টকা মাত্ৰ //) আৰু শেষত দুডাল হেলনীয়া আঁচ "//" দিয়ক।',
        tip: 'অংক আৰু কথাত লিখা পৰিমাণ একে হ’ব লাগিব।'
      },
      {
        stepNumber: 4,
        title: '₹ বাকচত অংকত ধনৰ পৰিমাণ লিখক',
        instruction: 'মুদ্ৰিত ₹ চিহ্নৰ কাষতে খালী ঠাই নেৰাকৈ অংকত লিখক (যেনে: ₹ 50,000/-) আৰু শেষত "/-" চিহ্ন দিয়ক।',
        tip: 'কোনেও যাতে অতিৰিক্ত শূন্য যোগ কৰিব নোৱাৰে তাৰ বাবে "/-" দিয়া হয়।'
      },
      {
        stepNumber: 5,
        title: 'সুৰক্ষাৰ বাবে একাউণ্ট পেয়ী (A/C Payee) ক্ৰছিং কৰক',
        instruction: 'চেকৰ ওপৰৰ বাওঁফালে দুডাল সমান্তৰাল হেলনীয়া আঁচ টানি "A/C PAYEE" লিখক। ইয়াৰ দ্বাৰা ধন কেৱਲ তেওঁৰ একাউণ্টতহে জমা হ’ব।',
        tip: 'এই চেক কাউণ্টাৰত নগদ হিচাপে ভঙাব নোৱাৰি।'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" ৰ ওপৰত চহী কৰক',
        instruction: 'তলৰ সোঁফালে বেংক ৰেকৰ্ডৰ লগত মিলাকৈ চহী কৰক। তলৰ বগা MICR অংশত চহী নকৰিব।',
        tip: 'সম্পূৰ্ণ তথ্য নিলিখাকৈ খালী চেকত চহী নকৰিব।'
      }
    ],
    faqs: [
      {
        question: 'একাউণ্ট পেয়ী আৰু বিয়েৰাৰ চেকৰ মাজত পাৰ্থক্য কি?',
        answer: 'একাউণ্ট পেয়ী চেকৰ ধন কেৱਲ প্ৰাপকৰ বেংক একাউণ্টত জমা হয়। আনহাতে বিয়েৰাৰ চেক যিকোনো ব্যক্তিয়ে বেংক কাউণ্টাৰত দেখুৱাই নগদ ধন ল’ব পাৰে।'
      },
      {
        question: 'ভাৰতত বেংক চেকৰ ম্যাদ কিমান দিন থাকে?',
        answer: 'আৰবিআইৰ নিয়ম অনুসৰি চেক লিখাৰ তাৰিখৰ পৰা ঠিক ৩ মাহলৈকেহে বৈধ থাকে।'
      },
      {
        question: 'কথাত ধন লিখাৰ পিছত "মাত্ৰ" (Only) কিয় লিখিব লাগে?',
        answer: 'লিখা ধনৰ পিছত কোনেও যাতে অতিৰিক্ত শব্দ বা ধন যোগ কৰিব নোৱাৰে তাৰ বাবে "মাত্ৰ" লিখা হয়।'
      },
      {
        question: 'পজিটিভ পে’ ব্যৱস্থা (Positive Pay System) কি?',
        answer: '৫০,০০০ টকাতকৈ অধিক চেকৰ জালিয়াতি ৰোধ কৰিবলৈ নেট বেংকিং বা এছএমএছৰ দ্বাৰা আগতীয়াকৈ তথ্য নিশ্চিত কৰাৰ সুৰক্ষা ব্যৱস্থা।'
      },
      {
        question: 'চেল্ফ চেক (Self Cheque) কেনেকৈ লিখে?',
        answer: 'Payee ৰ ঠাইত "SELF" লিখি, ধনৰ পৰিমাণ বহুৱাই আগফালে আৰু পিছফালে চহী কৰি বেংকৰ পৰা নগদ ধন তুলিব পাৰি।'
      }
    ],
    commonMistakes: [
      'চেকত কাটি লিখা বা কাটাকুটি কৰা (কাটাকুটি থকা চেক বেংকে গ্ৰহণ নকৰে)।',
      'অংকৰ পৰিমাণ আৰু কথাৰ পৰিমাণত অমিল থকা।',
      'তলৰ বগা চুম্বকীয় MICR কোড থকা অংশত চহী কৰা।',
      'নাম আৰু ধনৰ কাষত খালী ঠাই এৰি থোৱা।',
      'তাৰিখ লিখাৰ ৩ মাহ পাৰ হোৱাৰ পিছত চেক জমা দিয়া।'
    ]
  },

  // ================= 13. URDU =================
  ur: {
    lang: 'ur',
    localeCode: 'ur-IN',
    langName: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic/Nastaliq',
    direction: 'rtl',
    slugPath: '/calculators/indian-cheque-studio/ur',
    canonicalUrl: `${BASE_URL}/calculators/indian-cheque-studio/ur`,
    title: 'بینک چیک کیسے بھریں – چیک لکھنے کا درست طریقہ اور فارمیٹ | IndiaTools',
    description: 'ہندوستانی بینک چیک درست طریقے سے لکھنا سیکھیں۔ الفاظ میں رقم (روپے فقط)، اکاؤنٹ پےئی کراسنگ، سیلف چیک اور چیک باؤنس سے بچنے کے قواعد کی تفصیل۔',
    h1: 'بینک چیک کیسے لکھیں: چیک بھرنے کا درست طریقہ اور رہنما',
    subtitle: 'آر بی آئی سی ٹی ایس-2010 فارمیٹ، الفاظ میں رقم (روپے فقط)، اکاؤنٹ پےئی کراسنگ اور بینکنگ تحفظ کے اصول۔',
    keywords: [
      'cheque kaise bhare urdu',
      'bank cheque likhne ka tarika',
      'cheque writing format urdu',
      'cheque amount in words urdu',
      'self cheque kaise likhe',
      'account payee cheque urdu',
      'cheque par date kaise dale',
      'cheque bounce se bachne ke tarike',
      'urdu cheque format',
      'sbi cheque filling urdu'
    ],
    searchIntents: [
      'بینک چیک کیسے بھریں',
      'چیک لکھنے کا درست طریقہ',
      'الفاظ میں رقم کیسے لکھیں',
      'اکاؤنٹ پےئی چیک بنانے کا طریقہ',
      'سیلف چیک لکھنے کا طریقہ',
      'چیک لکھتے وقت احتیاطی تدابیر'
    ],
    headings: {
      guideTitle: 'مرحلہ وار گائیڈ: بینک چیک بھرنے کا درست طریقہ',
      faqTitle: 'بینک چیک سے متعلق اہم سوالات اور جوابات (FAQs)',
      mistakesTitle: 'چیک لکھتے وقت کی جانے والی ۵ بڑی غلطیاں',
      languagesTitle: 'دیگر ہندوستانی زبانوں میں چیک گائیڈ دیکھیں',
      dateLabel: 'تاریخ (DDMMYYYY)',
      payeeLabel: 'وصول کنندہ کا نام (Payee)',
      amountNumbersLabel: 'ہندسوں میں رقم (₹ باکس)',
      amountWordsLabel: 'الفاظ میں رقم (Amount in Words)',
      signatureLabel: 'دستخط (Authorised Signatory)',
      crossingLabel: 'اکاؤنٹ پےئی کراسنگ (A/C Payee)'
    },
    guideSteps: [
      {
        stepNumber: 1,
        title: 'اوپر دائیں جانب درست تاریخ درج کریں (DDMMYYYY)',
        instruction: 'اوپر دیے گئے ۸ خانوں میں DDMMYYYY فارمیٹ میں تاریخ لکھیں (مثلاً 15-10-2026)۔ ہندوستان میں چیک تاریخ کے دن سے ٹھیک ۳ ماہ تک ہی قابل استعمال رہتا ہے۔',
        tip: '۳ ماہ گزرنے کے بعد چیک باسی (Stale Cheque) ہو جاتا ہے اور بینک میں کیش نہیں ہوتا۔'
      },
      {
        stepNumber: 2,
        title: 'وصول کنندہ کا نام لکھیں اور خالی جگہ پر لکیر کھینچیں',
        instruction: '"PAY" کے فوراً بعد رقم وصول کرنے والے کا پورا نام لکھیں۔ نام کے بعد باقی خالی جگہ پر سیدھی لکیر کھینچ دیں تاکہ کوئی نام میں ردوبدل نہ کر سکے۔',
        tip: 'اپنے اکاؤنٹ سے نقد رقم نکالنے کے لیے "SELF" لکھیں۔'
      },
      {
        stepNumber: 3,
        title: 'الفاظ میں رقم لکھیں اور آخر میں "روپے فقط //" لکھیں',
        instruction: 'رقم کو الفاظ میں لکھیں (مثلاً: پچاس ہزار روپے فقط //) اور آخر میں دو ترچھی لکیریں "//" کھینچیں تاکہ کوئی اضافی رقم نہ لکھ سکے۔',
        tip: 'ہندسوں اور الفاظ کی رقم میں کوئی فرق نہیں ہونا چاہیے۔'
      },
      {
        stepNumber: 4,
        title: '₹ باکس میں ہندسوں میں رقم درج کریں',
        instruction: 'چھپے ہوئے ₹ نشان کے بالکل قریب ہندسوں میں رقم لکھیں (مثلاً: ₹ 50,000/-) اور آگے سلیش اور ڈیش "/-" ضرور لگائیں۔',
        tip: 'اضافی صفر لگانے سے روکنے کے لیے "/-" لگایا جاتا ہے۔'
      },
      {
        stepNumber: 5,
        title: 'حفاظت کے لیے اکاؤنٹ پےئی (A/C Payee) کراسنگ کریں',
        instruction: 'چیک کے اوپر بائیں کونے پر دو متوازی ترچھی لکیریں لگا کر درمیان میں "A/C PAYEE" لکھیں۔ اس سے رقم صرف اسی شخص کے بینک اکاؤنٹ میں جمع ہوگی۔',
        tip: 'کراس کیا ہوا چیک کاؤنٹر پر نقد نہیں ملتا۔'
      },
      {
        stepNumber: 6,
        title: '"Authorised Signatory" کے اوپر دستخط کریں',
        instruction: 'نیچے دائیں جانب اپنے بینک ریکارڈ سے ملتے جلتے دستخط کریں۔ نیچے کی سفید MICR پٹی پر کبھی دستخط نہ کریں۔',
        tip: 'مکمل تفصیلات لکھے بغیر کبھی خالی چیک پر دستخط نہ کریں۔'
      }
    ],
    faqs: [
      {
        question: 'اکاؤنٹ پےئی اور بیرر چیک میں کیا فرق ہے؟',
        answer: 'اکاؤنٹ پےئی چیک کی رقم براہ راست متعلقہ شخص کے بینک اکاؤنٹ میں جمع ہوتی ہے، جبکہ بیرر چیک کوئی بھی شخص بینک کاؤنٹر پر پیش کر کے نقد حاصل کر سکتا ہے۔'
      },
      {
        question: 'ہندوستان میں بینک چیک کی میعاد کتنی ہوتی ہے؟',
        answer: 'آر بی آئی کے قواعد کے مطابق چیک پر لکھی گئی تاریخ سے ٹھیک ۳ ماہ تک ہی چیک قابل قبول ہوتا ہے۔'
      },
      {
        question: 'الفاظ میں رقم لکھنے کے بعد "فقط" (Only) لکھنا کیوں ضروری ہے؟',
        answer: 'لکھی گئی رقم کے آگے کوئی بھی اضافی الفاظ یا رقم نہ بڑھا سکے اس لیے "فقط" اور "//" لکھنا ضروری ہے۔'
      },
      {
        question: 'پوزیٹیو پے سسٹم (Positive Pay System) کیا ہے؟',
        answer: '۵۰,۰۰০ روپے سے زائد کے چیک کی تصدیق نیٹ بینکنگ یا ایس ایم ایس کے ذریعے پہلے سے بینک کو کرانے کا حفاظتی نظام۔'
      },
      {
        question: 'سیلف چیک (Self Cheque) کیسے لکھتے ہیں؟',
        answer: 'Payee کی جگہ "SELF" لکھیں، رقم درج کریں اور سامنے اور پیچھے دستخط کر کے بینک سے نقد رقم حاصل کی جا سکتی ہے۔'
      }
    ],
    commonMistakes: [
      'چیک پر کاٹ چھانٹ یا اوور رائٹنگ کرنا (کاٹ چھانٹ والا چیک بینک مسترد کر دیتا ہے)۔',
      'ہندسوں اور الفاظ کی رقم میں تضاد ہونا۔',
      'نیچے کی سفید مقناطیسی MICR کوڈ والی پٹی پر دستخط کرنا۔',
      'نام اور رقم کے آگے خالی جگہیں چھوڑ دینا۔',
      'تاریخ لکھے جانے کے ۳ ماہ بعد چیک بینک میں جمع کرنا۔'
    ]
  }
}

export function getChequeSeoData(lang: SupportedLanguage): ChequeLanguageSeoInfo {
  return CHEQUE_SEO_LANGUAGES[lang] || CHEQUE_SEO_LANGUAGES.en
}

export function getAllChequeHreflangs(): Array<{ lang: string; href: string }> {
  const list = Object.values(CHEQUE_SEO_LANGUAGES).map((item) => ({
    lang: item.localeCode,
    href: item.canonicalUrl
  }))
  // Add x-default pointing to the default English URL
  list.unshift({
    lang: 'x-default',
    href: `${BASE_URL}/calculators/indian-cheque-studio`
  })
  return list
}
