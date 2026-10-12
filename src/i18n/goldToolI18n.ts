import type { SupportedLocale } from './locales.ts'

export interface GoldToolFaq {
  question: string
  answer: string
}

export interface GoldToolContent {
  locale: SupportedLocale
  localeName: string
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  introText: string
  keywords: string[]

  labels: {
    goldRates: string
    goldRateBasis: string
    ratePerGram: string
    gstRate: string
    oldGoldSection: string
    oldGoldDesc: string
    newGoldSection: string
    newGoldDesc: string
    grossWeight: string
    stoneWeight: string
    netWeight: string
    purity: string
    deductionPct: string
    exchangeValue: string
    makingCharges: string
    makingChargeType: string
    wastageCharge: string
    wastageType: string
    hallmarking: string
    stoneCost: string
    otherCharges: string
    discount: string
    totalBill: string
    netPayable: string
    compareQuotes: string
    quoteA: string
    quoteB: string
    savingsDiff: string
    calculateBtn: string
    resetBtn: string
    copyResultBtn: string
    disclaimer: string
  }

  faqs: GoldToolFaq[]
  tips: string[]
}

const BASE_URL = 'https://indiatools-rho.vercel.app'

export const GOLD_TOOL_I18N: Record<SupportedLocale, GoldToolContent> = {
  // ================= 1. ENGLISH =================
  en: {
    locale: 'en',
    localeName: 'English',
    title: 'Gold Exchange & Jewellery Bill Calculator India | IndiaTools',
    metaDescription: 'Calculate old gold exchange value, jewellery making charges, wastage, and 3% GST. Compare jeweller quotations side by side before buying.',
    h1: 'Gold Exchange & Jewellery Bill Checker',
    subtitle: 'Transparent bill breakdown for old gold exchange value, making charges, wastage, and 3% GST across Indian jewellers.',
    introText: 'Buying or exchanging gold jewellery in India? Jewellers charge making charges, wastage (value addition), stone weight deductions, and 3% GST that significantly vary between shops. Use this calculator to inspect quotes, convert purities accurately, and ensure you receive the true exchange value for your old gold.',
    keywords: [
      'gold exchange calculator india',
      'old gold exchange value calculator',
      'jewellery bill calculator with gst',
      'gold making charges and wastage calculator',
      '916 gold bill verification',
      'compare gold jewellery quotations'
    ],
    labels: {
      goldRates: 'Current Gold Market Benchmark Rate',
      goldRateBasis: 'Rate Standard (24K / 22K)',
      ratePerGram: 'Gold Rate per Gram (₹)',
      gstRate: 'GST Percentage (%)',
      oldGoldSection: 'Old Gold Exchange Estimation',
      oldGoldDesc: 'Calculate fair cash or exchange value after deducting stone weight and melting loss.',
      newGoldSection: 'New Jewellery Purchase Quotation',
      newGoldDesc: 'Itemized breakdown of new ornament with making charges, wastage, and GST.',
      grossWeight: 'Gross Weight (Grams)',
      stoneWeight: 'Stones / Beads Weight (Grams)',
      netWeight: 'Net Pure Gold Weight (Grams)',
      purity: 'Gold Purity / Fineness',
      deductionPct: 'Testing / Melting Deduction (%)',
      exchangeValue: 'Net Old Gold Exchange Value',
      makingCharges: 'Making Charges (MC)',
      makingChargeType: 'Charge Format (% or ₹/g)',
      wastageCharge: 'Wastage (Value Addition - VA)',
      wastageType: 'Wastage Format (% or grams)',
      hallmarking: 'BIS Hallmarking Fee (₹)',
      stoneCost: 'Stone / Diamond Charges (₹)',
      otherCharges: 'Miscellaneous Surcharges (₹)',
      discount: 'Shop Promotion Discount (₹)',
      totalBill: 'Final Jewellery Invoice Total',
      netPayable: 'Net Cash Payable (After Old Gold Exchange)',
      compareQuotes: 'Compare Two Jeweller Quotations',
      quoteA: 'Quotation A (Primary Shop)',
      quoteB: 'Quotation B (Alternative Shop)',
      savingsDiff: 'Quotation Comparison Difference',
      calculateBtn: 'Calculate Bill',
      resetBtn: 'Reset All Values',
      copyResultBtn: 'Copy Detailed Bill Summary',
      disclaimer: 'Notice: This calculation is an educational estimate based on user-entered values and standard Indian bullion formulas. Actual shop exchange policies, melting purity assay tests, and hallmark fees vary across individual jewellers.',
    },
    faqs: [
      {
        question: 'How is the exchange value of old gold calculated in India?',
        answer: 'Old gold value = (Gross Weight − Stone/Bead Weight) × (Jewellery Purity ÷ 24) × 24K Gold Rate − Melting/Refining Deduction. Reputed BIS hallmarked jewellers typically deduct 0% to 2% for hallmark exchange, while unhallmarked gold may face a 3% to 5% melting test deduction.'
      },
      {
        question: 'What is the difference between Making Charges and Wastage (VA)?',
        answer: 'Making charges represent the artisan craftsmanship fee (labour). Wastage (often termed Value Addition or VA) historically accounted for microscopic gold loss during melting, soldering, and polishing. Today, many branded jewellers combine them into a single percentage (typically 8% to 25% depending on ornament complexity).'
      },
      {
        question: 'How is GST applied on gold jewellery purchases and exchanges in India?',
        answer: 'In India, GST on gold jewellery is strictly 3% applied on the total taxable value (metal value + making charges + wastage + stones). If you exchange old gold, jewellers deduct the old gold value from the final payable amount, but GST is legally assessed on the gross purchase value of the new ornament.'
      }
    ],
    tips: [
      'Always insist that stone weight is weighed separately before and after setting.',
      'Check for the 6-digit alphanumeric HUID (Hallmark Unique Identification) code stamped on 22K/18K gold.',
      'Ask whether the quoted making charge is calculated on the gold value or as a flat rupee rate per gram.'
    ]
  },

  // ================= 2. MALAYALAM =================
  ml: {
    locale: 'ml',
    localeName: 'മലയാളം',
    title: 'പഴയ സ്വർണ്ണ എക്സ്ചേഞ്ച് & ആഭരണ ബിൽ കാൽക്കുലേറ്റർ | IndiaTools',
    metaDescription: 'പഴയ സ്വർണ്ണത്തിന്റെ യഥാർത്ഥ വില, പണിക്കൂലി, വേസ്റ്റേജ്, 3% ജിഎസ്ടി എന്നിവ കണക്കാക്കൂ. ജ്വല്ലറി ബില്ലുകൾ കൃത്യമായി താരതമ്യം ചെയ്യാം.',
    h1: 'സ്വർണ്ണ എക്സ്ചേഞ്ച് & ആഭരണ ബിൽ ചെക്കർ',
    subtitle: 'പഴയ സ്വർണ്ണം മാറ്റിവാങ്ങുമ്പോൾ ലഭിക്കുന്ന കൃത്യമായ വില, പണിക്കൂലി, വേസ്റ്റേജ്, 3% GST എന്നിവയുടെ സുതാര്യമായ കണക്ക്.',
    introText: 'കേരളത്തിലെ ജ്വല്ലറികളിൽ നിന്ന് സ്വർണ്ണാഭരണങ്ങൾ വാങ്ങുമ്പോഴോ പഴയ സ്വർണ്ണം എക്സ്ചേഞ്ച് ചെയ്യുമ്പോഴോ പണിക്കൂലി, വേസ്റ്റേജ്, കല്ലിന്റെ തൂക്കം കിഴിക്കൽ, 3% ജിഎസ്ടി എന്നിവയിൽ വരുന്ന വ്യത്യാസങ്ങൾ നിങ്ങളുടെ ബില്ലിനെ വലിയ തോതിൽ ബാധിക്കാം. ഈ കാൽക്കുലേറ്റർ ഉപയോഗിച്ച് പഴയ സ്വർണ്ണത്തിന് എത്ര രൂപ കിട്ടുമെന്നും പുതിയ ആഭരണത്തിന് കൃത്യമായി എത്ര തുക നൽകണമെന്നും പരിശോധിക്കൂ.',
    keywords: [
      'gold exchange calculator malayalam',
      'old gold exchange value kerala',
      'jewellery bill calculator kerala',
      'gold panikkooli calculator',
      '916 gold exchange deduction kerala',
      'swarna bill checking kerala'
    ],
    labels: {
      goldRates: 'ഇന്നത്തെ സ്വർണ്ണവില നിരക്ക്',
      goldRateBasis: 'ഗ്രാം നിരക്ക് തരം (24K / 22K)',
      ratePerGram: 'ഒരു ഗ്രാമിന് സ്വർണ്ണവില (₹)',
      gstRate: 'ജിഎസ്ടി ശതമാനം (%)',
      oldGoldSection: 'പഴയ സ്വർണ്ണ എക്സ്ചേഞ്ച് കണക്ക്',
      oldGoldDesc: 'കല്ലിന്റെ തൂക്കവും ഉരുകൽ നഷ്ടവും കിഴിച്ചുള്ള യഥാർത്ഥ മൂല്യം.',
      newGoldSection: 'പുതിയ ആഭരണ പർച്ചേസ് കൊട്ടേഷൻ',
      newGoldDesc: 'സ്വർണ്ണവില, പണിക്കൂലി, വേസ്റ്റേജ്, ജിഎസ്ടി എന്നിവ ചേർത്തുള്ള കണക്ക്.',
      grossWeight: 'മൊത്തം തൂക്കം (ഗ്രാം)',
      stoneWeight: 'കല്ല് / മുത്തുകളുടെ തൂക്കം (ഗ്രാം)',
      netWeight: 'തനി സ്വർണ്ണ തൂക്കം (ഗ്രാം)',
      purity: 'സ്വർണ്ണത്തിന്റെ പരിശുദ്ധി (ക്യാരറ്റ്/916)',
      deductionPct: 'ഉരുക്കൽ / ടെസ്റ്റിംഗ് കുറവ് (%)',
      exchangeValue: 'പഴയ സ്വർണ്ണത്തിന്റെ മൊത്തം മൂല്യം',
      makingCharges: 'പണിക്കൂലി (Making Charges)',
      makingChargeType: 'പണിക്കൂലി കണക്കാക്കുന്ന രീതി (% അല്ലെങ്കിൽ ₹/ഗ്രാം)',
      wastageCharge: 'വേസ്റ്റേജ് (Wastage / Value Addition)',
      wastageType: 'വേസ്റ്റേജ് രീതി (% അല്ലെങ്കിൽ ഗ്രാം)',
      hallmarking: 'ഹാൾമാർക്കിംഗ് ചാർജ്ജ് (₹)',
      stoneCost: 'കല്ലുകളുടെ വില (₹)',
      otherCharges: 'മറ്റു ചാർജ്ജുകൾ (₹)',
      discount: 'ലഭിച്ച ഡിസ്കൗണ്ട് (₹)',
      totalBill: 'ആകെ ആഭരണ ബിൽ തുക',
      netPayable: 'കൈയ്യിൽ നിന്ന് നൽകേണ്ട ബാക്കി തുക',
      compareQuotes: 'രണ്ട് ജ്വല്ലറികളുടെ കൊട്ടേഷൻ താരതമ്യം',
      quoteA: 'കൊട്ടേഷൻ A (പ്രധാന ഷോപ്പ്)',
      quoteB: 'കൊട്ടേഷൻ B (രണ്ടാമത്തെ ഷോപ്പ്)',
      savingsDiff: 'ബിൽ തുകയിലെ വ്യത്യാസം / ലാഭം',
      calculateBtn: 'ബിൽ കണക്കാക്കൂ',
      resetBtn: 'റീസെറ്റ് ചെയ്യുക',
      copyResultBtn: 'ബിൽ വിവരങ്ങൾ കോപ്പി ചെയ്യുക',
      disclaimer: 'ശ്രദ്ധിക്കുക: ഇതൊരു സാങ്കേതിക കണക്കുകൂട്ടൽ മാത്രമാണ്. ഓരോ ജ്വല്ലറിയുടെയും എക്സ്ചേഞ്ച് നിബന്ധനകൾ, ഉരുകൽ പരിശോധന, പണിക്കൂലി വ്യത്യാസങ്ങൾ എന്നിവയ്ക്കനുസരിച്ച് യഥാർത്ഥ ബില്ലിൽ മാറ്റങ്ങൾ വരാം.',
    },
    faqs: [
      {
        question: 'പഴയ സ്വർണ്ണം മാറ്റിവാങ്ങുമ്പോൾ കേരളത്തിലെ ജ്വല്ലറികൾ പണം കുറയ്ക്കുന്നത് എങ്ങനെയാണ്?',
        answer: 'ആഭരണത്തിന്റെ മൊത്തം തൂക്കത്തിൽ നിന്ന് കല്ലുകളുടെ തൂക്കം പൂർണ്ണമായും കുറയ്ക്കുന്നു. ശേഷം പരിശുദ്ധി (916 ആണെങ്കിൽ 91.6%) കണക്കാക്കി 24 കാരറ്റ് വിലയ്ക്ക് തുല്യമാക്കുന്നു. BIS ഹാൾമാർക്ക് ഉള്ള സ്വർണ്ണത്തിന് 0% മുതൽ 1% വരെ മാത്രമാണ് സാധാരണ കിഴിവ് വരുന്നത്.'
      },
      {
        question: 'പണിക്കൂലിയും വേസ്റ്റേജും തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?',
        answer: 'പണിക്കൂലി എന്നത് ആഭരണം നിർമ്മിച്ച തൊഴിലാളിയുടെ അധ്വാനത്തിനുള്ള കൂലിയാണ്. വേസ്റ്റേജ് (Value Addition) എന്നത് നിർമ്മാണ വേളയിൽ ഉണ്ടാകുന്ന ലോഹ നഷ്ടത്തിന് പകരമായി കണക്കാക്കുന്നതാണ്. സാധാരണ ആഭരണങ്ങൾക്ക് 6% മുതൽ 18% വരെ ഇത് വരാം.'
      },
      {
        question: 'സ്വർണ്ണത്തിന് ഇന്ത്യയിൽ എത്ര ശതമാനമാണ് ജിഎസ്ടി?',
        answer: 'സ്വർണ്ണാഭരണങ്ങൾക്ക് കേന്ദ്ര-സംസ്ഥാന ജിഎസ്ടി ചേർത്ത് ആകെ 3 ശതമാനമാണ് നികുതി. സ്വർണ്ണത്തിന്റെ വില, പണിക്കൂലി, വേസ്റ്റേജ് എന്നിവ ചേർത്തുള്ള മൊത്തം തുകയ്ക്കാണ് 3% GST ബാധകമാകുന്നത്.'
      }
    ],
    tips: [
      'പഴയ സ്വർണ്ണത്തിൽ കല്ലുകൾ ഉണ്ടെങ്കിൽ അത് വേർതിരിച്ച് കൃത്യമായ തൂക്കം പരിശോധിക്കാൻ ആവശ്യപ്പെടുക.',
      'ആഭരണത്തിൽ 6 അക്ക HUID ഹാൾമാർക്ക് മുദ്ര ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക.',
      'പണിക്കൂലി ഗ്രാമിനാണോ അതോ മൊത്തം സ്വർണ്ണവിലയുടെ ശതമാനമാണോ എന്ന് കൃത്യമായി ചോദിച്ചറിയുക.'
    ]
  },

  // ================= 3. HINDI =================
  hi: {
    locale: 'hi',
    localeName: 'हिन्दी',
    title: 'पुराना सोना एक्सचेंज और ज्वेलरी बिल कैलकुलेटर | IndiaTools',
    metaDescription: 'पुराने सोने का सही एक्सचेंज मूल्य, मेकिंग चार्ज, वेस्टेज और 3% GST का सटीक हिसाब लगाएं। ज्वेलरी बिलों की तुलना करें।',
    h1: 'गोल्ड एक्सचेंज एवं ज्वेलरी बिल चेकर',
    subtitle: 'पुराना सोना बदलने पर मिलने वाला वास्तविक मूल्य, मेकिंग चार्ज, वेस्टेज एवं 3% GST का पारदर्शी ब्रेकडाउन।',
    introText: 'भारत में सोने के आभूषण खरीदते समय या पुराना सोना बदलते समय मेकिंग चार्ज, वेस्टेज (वैल्यू एडिशन), नगीने (स्टोन) का वजन काटना और 3% GST में ज्वैलर्स के अनुसार काफी अंतर होता है। इस कैलकुलेटर की मदद से अपने पुराने सोने का सही एक्सचेंज भाव जानें और नए आभूषण का पक्का बिल आसानी से चेक करें।',
    keywords: [
      'gold exchange calculator hindi',
      'purana sona exchange value calculator',
      'jewellery bill calculator with gst hindi',
      'gold making charge calculator',
      '916 gold bill checking',
      'sona khareedte samay bill calculation'
    ],
    labels: {
      goldRates: 'सोने का वर्तमान बाज़ार भाव',
      goldRateBasis: 'रेट का आधार (24K / 22K)',
      ratePerGram: 'प्रति ग्राम सोने का भाव (₹)',
      gstRate: 'GST प्रतिशत (%)',
      oldGoldSection: 'पुराना सोना एक्सचेंज मूल्यांकन',
      oldGoldDesc: 'स्टोन का वजन और गलाई कटौती घटाकर पुराने सोने का शुद्ध मूल्य।',
      newGoldSection: 'नया आभूषण खरीद कोटेशन',
      newGoldDesc: 'सोने की कीमत, मेकिंग चार्ज, वेस्टेज और GST सहित संपूर्ण विवरण।',
      grossWeight: 'कुल वजन (ग्राम)',
      stoneWeight: 'नगीने/पत्थर का वजन (ग्राम)',
      netWeight: 'शुद्ध सोने का वजन (ग्राम)',
      purity: 'सोने की शुद्धता (कैरेट/916)',
      deductionPct: 'गलाई / टेस्टिंग कटौती (%)',
      exchangeValue: 'पुराने सोने का कुल एक्सचेंज मूल्य',
      makingCharges: 'मेकिंग चार्ज (गढ़ाई शुल्क)',
      makingChargeType: 'मेकिंग चार्ज प्रकार (% या ₹/ग्राम)',
      wastageCharge: 'वेस्टेज (Value Addition)',
      wastageType: 'वेस्टेज प्रकार (% या ग्राम)',
      hallmarking: 'हॉलमार्किंग शुल्क (₹)',
      stoneCost: 'नगीने की कीमत (₹)',
      otherCharges: 'अन्य शुल्क (₹)',
      discount: 'छूट / डिस्काउंट (₹)',
      totalBill: 'आभूषण का कुल बिल',
      netPayable: 'एक्सचेंज के बाद देय शुद्ध राशि',
      compareQuotes: 'दो ज्वैलर्स के कोटेशन की तुलना',
      quoteA: 'कोटेशन A (पहली दुकान)',
      quoteB: 'कोटेशन B (दूसरी दुकान)',
      savingsDiff: 'दोनों बिलों में अंतर / बचत',
      calculateBtn: 'बिल की गणना करें',
      resetBtn: 'रीसेट करें',
      copyResultBtn: 'बिल विवरण कॉपी करें',
      disclaimer: 'सूचना: यह गणना केवल सूचनात्मक और शैक्षणिक अनुमान है। वास्तविक बिल ज्वैलर की दुकान की एक्सचेंज नीति, गलाई टेस्टिंग और मेकिंग चार्ज के अनुसार अलग हो सकता है।',
    },
    faqs: [
      {
        question: 'पुराना सोना बदलने पर ज्वैलर कितना पैसा काटते हैं?',
        answer: 'ज्वैलर सबसे पहले गहने से स्टोन/नगीने का वजन अलग करते हैं। हॉलमार्क 916 सोने पर प्रतिष्ठित ज्वैलर्स केवल 0% से 2% की मामूली कटौती करते हैं, जबकि बिना हॉलमार्क वाले सोने पर गलाई के नाम पर 3% से 5% तक कटौती की जा सकती है।'
      },
      {
        question: 'मेकिंग चार्ज और वेस्टेज में क्या अंतर होता है?',
        answer: 'मेकिंग चार्ज आभूषण बनाने वाले कारीगर का मेहनताना होता है। वेस्टेज गहना बनाते समय सोने की घिसाई और गलाई में होने वाले नुकसान की भरपाई मानी जाती है। आजकल कई ब्रांड इसे मिलाकर 8% से 22% के बीच लेते हैं।'
      },
      {
        question: 'सोने के आभूषणों पर कितना GST लगता है?',
        answer: 'भारत में सोने के आभूषणों पर कुल 3% GST लगता है। यह टैक्स सोने की धातु की कीमत, मेकिंग चार्ज और वेस्टेज की कुल राशि पर लगाया जाता है।'
      }
    ],
    tips: [
      'पुराना सोना देते समय स्टोन का वजन अपनी आँखों के सामने अलग करवाएं।',
      'हमेशा 6 अंकों वाले अल्फ़ान्यूमेरिक HUID हॉलमार्क युक्त आभूषण ही खरीदें।',
      'ज्वैलर से पक्के बिल में मेकिंग चार्ज और वेस्टेज अलग-अलग दिखाने का आग्रह करें।'
    ]
  },

  // ================= 4. TAMIL =================
  ta: {
    locale: 'ta',
    localeName: 'தமிழ்',
    title: 'பழைய தங்க எக்ஸ்சேஞ்ச் & நகை பில் கால்குலேட்டர் | IndiaTools',
    metaDescription: 'பழைய தங்கத்தின் சரியான மதிப்பு, செய்கூலி, சேதாரம், 3% GST கணக்கிடுங்கள். நகைக்கடை பில்களை ஒப்பிடுங்கள்.',
    h1: 'தங்க எக்ஸ்சேஞ்ச் & நகை பில் கால்குலேட்டர்',
    subtitle: 'பழைய தங்கம் மாற்றும்போது கிடைக்கும் மதிப்பு, செய்கூலி, சேதாரம், 3% GST ஆகியவற்றின் வெளிப்படையான கணக்கீடு.',
    introText: 'தமிழ்நாட்டில் தங்கம் வாங்கும்போது அல்லது பழைய தங்கத்தை மாற்றும்போது செய்கூலி, சேதாரம், கல் எடை கழிவு மற்றும் 3% GST ஆகியவற்றில் கடைகளுக்கு இடையே பெரிய வித்தியாசம் இருக்கும். இந்த கால்குலேட்டர் மூலம் உங்கள் பழைய தங்கத்திற்கான நியாயமான விலையையும், புதிய நகைக்கான சரியான பில் தொகையையும் துல்லியமாக கணக்கிடுங்கள்.',
    keywords: [
      'gold exchange calculator tamil',
      'old gold exchange value tamil nadu',
      'jewellery bill calculator tamil',
      'seikooli setharam calculator',
      '916 gold bill checking tamil',
      'thangam bill calculation'
    ],
    labels: {
      goldRates: 'இன்றைய தங்கம் சந்தை விலை',
      goldRateBasis: 'விலை அடிப்படை (24K / 22K)',
      ratePerGram: 'ஒரு கிராம் தங்கத்தின் விலை (₹)',
      gstRate: 'GST சதவீதம் (%)',
      oldGoldSection: 'பழைய தங்கம் எக்ஸ்சேஞ்ச் மதிப்பு',
      oldGoldDesc: 'கல் எடை மற்றும் உருக்கல் கழிவு நீக்கிய நிகர தங்க மதிப்பு.',
      newGoldSection: 'புதிய நகை வாங்குதல் கொட்டேஷன்',
      newGoldDesc: 'தங்க விலை, செய்கூலி, சேதாரம், GST உள்ளிட்ட முழு விபரம்.',
      grossWeight: 'மொத்த எடை (கிராம்)',
      stoneWeight: 'கல் / மணிகள் எடை (கிராம்)',
      netWeight: 'நிகர தங்க எடை (கிராம்)',
      purity: 'தங்கத்தின் தரம் (கேரட்/916)',
      deductionPct: 'உருக்கல் கழிவு (%)',
      exchangeValue: 'பழைய தங்கத்தின் மொத்த மதிப்பு',
      makingCharges: 'செய்கூலி (Making Charges)',
      makingChargeType: 'செய்கூலி வகை (% அல்லது ₹/கிராம்)',
      wastageCharge: 'சேதாரம் (Wastage / VA)',
      wastageType: 'சேதாரம் வகை (% அல்லது கிராம்)',
      hallmarking: 'ஹால்மார்க்கிங் கட்டணம் (₹)',
      stoneCost: 'கல் விலை (₹)',
      otherCharges: 'இதர கட்டணங்கள் (₹)',
      discount: 'தள்ளுபடி (₹)',
      totalBill: 'மொத்த நகை பில் தொகை',
      netPayable: 'எக்ஸ்சேஞ்சிற்குப் பிறகு செலுத்த வேண்டிய தொகை',
      compareQuotes: 'இரண்டு நகைக்கடைகளின் கொட்டேஷன் ஒப்பீடு',
      quoteA: 'கொட்டேஷன் A (முதன்மை கடை)',
      quoteB: 'கொட்டேஷன் B (இரண்டாவது கடை)',
      savingsDiff: 'பில் தொகையில் உள்ள வித்தியாசம் / சேமிப்பு',
      calculateBtn: 'பில் கணக்கிடுங்கள்',
      resetBtn: 'ரீசெட் செய்க',
      copyResultBtn: 'பில் விவரங்களை நகலெடு',
      disclaimer: 'குறிப்பு: இந்த கணக்கீடு தகவல் நோக்கங்களுக்கானது மட்டுமே. உண்மையான பில் நகைக்கடையின் விதிகள் மற்றும் செய்கூலிக்கு ஏற்ப மாறுபடலாம்.',
    },
    faqs: [
      {
        question: 'பழைய தங்கம் மாற்றும்போது கடைகளில் கழிப்பது எப்படி?',
        answer: 'முதலில் நகையிலுள்ள கல் மற்றும் அரக்கு எடையை கழித்து நிகர தங்க எடையை எடுப்பார்கள். 916 ஹால்மார்க் நகைகளுக்கு 0% முதல் 1% மட்டுமே கழிப்பார்கள், ஹால்மார்க் இல்லாத நகைகளுக்கு 3% முதல் 5% வரை கழிப்பார்கள்.'
      },
      {
        question: 'செய்கூலிக்கும் சேதாரத்திற்கும் என்ன வித்தியாசம்?',
        answer: 'செய்கூலி என்பது தொழிலாளியின் கூலி. சேதாரம் என்பது நகை செய்யும்போது சிதறும் தங்கத்திற்கான இழப்பீடு. பொதுவாக 8% முதல் 18% வரை சேதாரம் வசூலிக்கப்படுகிறது.'
      },
      {
        question: 'தங்க நகைக்கு இந்தியாவில் GST எவ்வளவு?',
        answer: 'தங்க நகைகளுக்கு மொத்தம் 3% GST வசூலிக்கப்படுகிறது. இது தங்கம், செய்கூலி, சேதாரம் அனைத்திற்கும் சேர்த்து கணக்கிடப்படுகிறது.'
      }
    ],
    tips: [
      'கல் எடையை உங்கள் கண் முன்னால் தனித்தனியாக நிறுக்கச் சொல்லுங்கள்.',
      'நகையில் 6 இலக்க HUID ஹால்மார்க் முத்திரை இருப்பதை சரிபார்க்கவும்.',
      'செய்கூலி மற்றும் சேதாரத்தை தனித்தனியாக பில்லில் குறிப்பிடக் கேளுங்கள்.'
    ]
  },

  // ================= 5. TELUGU =================
  te: {
    locale: 'te',
    localeName: 'తెలుగు',
    title: 'పాత బంగారం ఎక్స్ఛేంజ్ & ఆభరణాల బిల్లు కాలిక్యులేటర్ | IndiaTools',
    metaDescription: 'పాత బంగారం అసలు విలువ, తరుగు, తయారీ ఖర్చులు మరియు 3% GST లెక్కించండి. జ్యువెలరీ బిల్లులను సరిపోల్చండి.',
    h1: 'గోల్డ్ ఎక్స్ఛేంజ్ & జ్యువెలరీ బిల్ చెకర్',
    subtitle: 'పాత బంగారం మార్పిడి విలువ, తయారీ ఖర్చులు, తరుగు మరియు 3% GST యొక్క పారదర్శక లెక్కింపు.',
    introText: 'బంగారు ఆభరణాలు కొనుగోలు చేసేటప్పుడు లేదా పాత బంగారం మార్పిడి చేసేటప్పుడు తయారీ ఖర్చులు (Making Charges), తరుగు (Wastage), రాళ్ల బరువు తగ్గింపులు మరియు 3% GST లో దుకాణాల మధ్య చాలా వ్యత్యాసం ఉంటుంది. ఈ కాలిక్యులేటర్‌తో మీ పాత బంగారానికి సరైన విలువ తెలుసుకోండి.',
    keywords: [
      'gold exchange calculator telugu',
      'old gold exchange value telangana andhra',
      'jewellery bill calculator telugu',
      'tarugu making charges gold telugu',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'ప్రస్తుత బంగారం మార్కెట్ ధర',
      goldRateBasis: 'ధర ప్రమాణం (24K / 22K)',
      ratePerGram: 'గ్రాము బంగారం ధర (₹)',
      gstRate: 'GST శాతం (%)',
      oldGoldSection: 'పాత బంగారం ఎక్స్ఛేంజ్ విలువ',
      oldGoldDesc: 'రాళ్ల బరువు మరియు కరిగించే నష్టాన్ని తీసివేసిన నికర విలువ.',
      newGoldSection: 'కొత్త ఆభరణాల కొటేషన్',
      newGoldDesc: 'బంగారం ధర, తయారీ ఖర్చులు, తరుగు, GST తో కూడిన పూర్తి బిల్లు.',
      grossWeight: 'మొత్తం బరువు (గ్రాములు)',
      stoneWeight: 'రాళ్ల బరువు (గ్రాములు)',
      netWeight: 'నికర బంగారం బరువు (గ్రాములు)',
      purity: 'బంగారం స్వచ్ఛత (క్యారెట్/916)',
      deductionPct: 'కరిగించే నష్టం తగ్గింపు (%)',
      exchangeValue: 'పాత బంగారం మొత్తం విలువ',
      makingCharges: 'తయారీ ఖర్చులు (Making Charges)',
      makingChargeType: 'ఖర్చు రకం (% లేదా ₹/గ్రాము)',
      wastageCharge: 'తరుగు (Wastage / VA)',
      wastageType: 'తరుగు రకం (% లేదా గ్రాములు)',
      hallmarking: 'హాల్‌మార్కింగ్ ఫీజు (₹)',
      stoneCost: 'రాళ్ల ఖరీదు (₹)',
      otherCharges: 'ఇతర ఛార్జీలు (₹)',
      discount: 'డిస్కౌంట్ (₹)',
      totalBill: 'మొత్తం ఆభరణాల బిల్లు',
      netPayable: 'చెల్లించాల్సిన నికర మొత్తం',
      compareQuotes: 'రెండు దుకాణాల కొటేషన్ల పోలిక',
      quoteA: 'కొటేషన్ A (మొదటి దుకాణం)',
      quoteB: 'కొటేషన్ B (రెండవ దుకాణం)',
      savingsDiff: 'బిల్లుల మధ్య వ్యత్యాసం / ఆదా',
      calculateBtn: 'బిల్లు లెక్కించండి',
      resetBtn: 'రీసెట్ చేయండి',
      copyResultBtn: 'సారాంశాన్ని కాపీ చేయండి',
      disclaimer: 'గమనిక: ఇది సమాచార అంచనా మాత్రమే. దుకాణాల నిబంధనలు మరియు పరీక్షల ఆధారంగా వాస్తవ బిల్లు మారవచ్చు.',
    },
    faqs: [
      {
        question: 'పాత బంగారం మార్పిడిలో దుకాణదారులు ఎంత తగ్గిస్తారు?',
        answer: 'మొదట రాళ్ల బరువును తీసివేసి నికర బంగారాన్ని లెక్కిస్తారు. 916 హాల్‌మార్క్ బంగారానికి 0% నుండి 1% మాత్రమే తగ్గిస్తారు, హాల్‌మార్క్ లేని బంగారానికి 3% నుండి 5% వరకు కరిగించే నష్టం తీసివేస్తారు.'
      },
      {
        question: 'తయారీ ఖర్చులు మరియు తరుగు మధ్య తేడా ఏమిటి?',
        answer: 'తయారీ ఖర్చు శ్రామికుడి వేతనం. తరుగు అనేది ఆభరణం తయారుచేసేటప్పుడు జరిగే నష్టం భర్తీ. సాధారణంగా ఇది 8% నుండి 20% వరకు ఉంటుంది.'
      },
      {
        question: 'బంగారంపై GST ఎంత శాతం?',
        answer: 'భారతదేశంలో బంగారం ఆభరణాలపై మొత్తం 3% GST వర్తిస్తుంది.'
      }
    ],
    tips: [
      'రాళ్ల బరువును మీ ఎదుటే తూకం వేయమని అడగండి.',
      '6 అంకెల HUID హాల్‌మార్క్ ముద్రను తనిఖీ చేయండి.',
      'తరుగు మరియు తయారీ ఖర్చులను బిల్లులో విడిగా చూపించమని కోరండి.'
    ]
  },

  // ================= 6. KANNADA =================
  kn: {
    locale: 'kn',
    localeName: 'ಕನ್ನಡ',
    title: 'ಹಳೆ ಚಿನ್ನ ಎಕ್ಸ್‌ಚೇಂಜ್ ಮತ್ತು ಆಭರಣ ಬಿಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | IndiaTools',
    metaDescription: 'ಹಳೆ ಚಿನ್ನದ ಸರಿಯಾದ ಮೌಲ್ಯ, ಮೇಕಿಂಗ್ ಚಾರ್ಜ್, ವೇಸ್ಟೇಜ್ ಮತ್ತು 3% GST ಲೆಕ್ಕ ಹಾಕಿ. ಜ್ಯುವೆಲರಿ ಬಿಲ್‌ಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ.',
    h1: 'ಗೋಲ್ಡ್ ಎಕ್ಸ್‌ಚೇಂಜ್ & ಜ್ಯುವೆಲರಿ ಬಿಲ್ ಚೆಕರ್',
    subtitle: 'ಹಳೆ ಚಿನ್ನ ಬದಲಾವಣೆ ಮೌಲ್ಯ, ಮೇಕಿಂಗ್ ಚಾರ್ಜ್, ವೇಸ್ಟೇಜ್ ಮತ್ತು 3% GST ಯ ಪಾರದರ್ಶಕ ಲೆಕ್ಕಾಚಾರ.',
    introText: 'ಚಿನ್ನದ ಆಭರಣಗಳನ್ನು ಖರೀದಿಸುವಾಗ ಅಥವಾ ಹಳೆ ಚಿನ್ನವನ್ನು ಎಕ್ಸ್‌ಚೇಂಜ್ ಮಾಡುವಾಗ ಅಂಗಡಿಗಳ ನಡುವೆ ಮೇಕಿಂಗ್ ಚಾರ್ಜ್, ವೇಸ್ಟೇಜ್, ಹರಳುಗಳ ತೂಕ ಕಡಿತ ಮತ್ತು 3% GST ಯಲ್ಲಿ ಬಹಳ ವ್ಯತ್ಯಾಸವಿರುತ್ತದೆ. ಈ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಬಳಸಿ ನಿಮ್ಮ ಹಳೆ ಚಿನ್ನದ ನಿಖರ ಮೌಲ್ಯವನ್ನು ಮತ್ತು ಹೊಸ ಒಡವೆಯ ಅಸಲಿ ಬಿಲ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಪರಿಶೀಲಿಸಿ.',
    keywords: [
      'gold exchange calculator kannada',
      'old gold exchange value karnataka',
      'jewellery bill calculator kannada',
      'gold making charges wastage karnataka',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'ಇಂದಿನ ಚಿನ್ನದ ಮಾರುಕಟ್ಟೆ ದರ',
      goldRateBasis: 'ದರದ ಆಧಾರ (24K / 22K)',
      ratePerGram: 'ಪ್ರತಿ ಗ್ರಾಂ ಚಿನ್ನದ ದರ (₹)',
      gstRate: 'GST ಶೇಕಡಾ (%)',
      oldGoldSection: 'ಹಳೆ ಚಿನ್ನ ಎಕ್ಸ್‌ಚೇಂಜ್ ಮೌಲ್ಯಮಾಪನ',
      oldGoldDesc: 'ಹರಳುಗಳ ತೂಕ ಮತ್ತು ಕರಗಿಸುವ ನಷ್ಟವನ್ನು ಕಳೆದ ನಂತರದ ನಿವ್ವಳ ಮೌಲ್ಯ.',
      newGoldSection: 'ಹೊಸ ಆಭರಣ ಖರೀದಿ ಕೊಟೇಶನ್',
      newGoldDesc: 'ಚಿನ್ನದ ಬೆಲೆ, ಮೇಕಿಂಗ್ ಚಾರ್ಜ್, ವೇಸ್ಟೇಜ್ ಮತ್ತು GST ಸೇರಿದಂತೆ ಪೂರ್ಣ ವಿವರ.',
      grossWeight: 'ಒಟ್ಟು ತೂಕ (ಗ್ರಾಂ)',
      stoneWeight: 'ಹರಳುಗಳ ತೂಕ (ಗ್ರಾಂ)',
      netWeight: 'ನಿವ್ವಳ ಚಿನ್ನದ ತೂಕ (ಗ್ರಾಂ)',
      purity: 'ಚಿನ್ನದ ಶುದ್ಧತೆ (ಕ್ಯಾರೆಟ್/916)',
      deductionPct: 'ಕರಗಿಸುವ ಕಡಿತ (%)',
      exchangeValue: 'ಹಳೆ ಚಿನ್ನದ ಒಟ್ಟು ಮೌಲ್ಯ',
      makingCharges: 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ (ಕೂಲಿ)',
      makingChargeType: 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ವಿಧಾನ (% ಅಥವಾ ₹/ಗ್ರಾಂ)',
      wastageCharge: 'ವೇಸ್ಟೇಜ್ (Wastage / VA)',
      wastageType: 'ವೇಸ್ಟೇಜ್ ವಿಧಾನ (% ಅಥವಾ ಗ್ರಾಂ)',
      hallmarking: 'ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಶುಲ್ಕ (₹)',
      stoneCost: 'ಹರಳುಗಳ ಬೆಲೆ (₹)',
      otherCharges: 'ಇತರೆ ಶುಲ್ಕಗಳು (₹)',
      discount: 'ರಿಯಾಯಿತಿ (₹)',
      totalBill: 'ಒಟ್ಟು ಆಭರಣ ಬಿಲ್ ಮೊತ್ತ',
      netPayable: 'ಪಾವತಿಸಬೇಕಾದ ಅಂತಿಮ ಹಣ',
      compareQuotes: 'ಎರಡು ಅಂಗಡಿಗಳ ಕೊಟೇಶನ್ ಹೋಲಿಕೆ',
      quoteA: 'ಕೊಟೇಶನ್ A (ಮೊದಲ ಅಂಗಡಿ)',
      quoteB: 'ಕೊಟೇಶನ್ B (ಎರಡನೇ ಅಂಗಡಿ)',
      savingsDiff: 'ಬಿಲ್ ಮೊತ್ತದಲ್ಲಿನ ವ್ಯತ್ಯಾಸ / ಉಳಿತಾಯ',
      calculateBtn: 'ಬಿಲ್ ಲೆಕ್ಕ ಹಾಕಿ',
      resetBtn: 'ರೀಸೆಟ್ ಮಾಡಿ',
      copyResultBtn: 'ವಿವರ ಕಾಪಿ ಮಾಡಿ',
      disclaimer: 'ಸೂಚನೆ: ಇದು ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಅಂದಾಜು ಮಾತ್ರ. ಅಂಗಡಿಗಳ ನಿಬಂಧನೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವಾಸ್ತವ ಬಿಲ್ ಬದಲಾಗಬಹುದು.',
    },
    faqs: [
      {
        question: 'ಹಳೆ ಚಿನ್ನ ಬದಲಾಯಿಸುವಾಗ ಅಂಗಡಿಯವರು ಎಷ್ಟು ಹಣ ಕಡಿತಗೊಳಿಸುತ್ತಾರೆ?',
        answer: 'ಮೊದಲು ಹರಳುಗಳ ತೂಕವನ್ನು ಕಳೆದು ಶುದ್ಧ ಚಿನ್ನದ ತೂಕವನ್ನು ಲೆಕ್ಕ ಮಾಡಲಾಗುತ್ತದೆ. 916 ಹಾಲ್‌ಮಾರ್ಕ್ ಚಿನ್ನಕ್ಕೆ 0% ರಿಂದ 1% ಮಾತ್ರ ಕಡಿತಗೊಳಿಸುತ್ತಾರೆ.'
      },
      {
        question: 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ಮತ್ತು ವೇಸ್ಟೇಜ್ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
        answer: 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ಆಭರಣ ತಯಾರಿಕೆಯ ಕೂಲಿ. ವೇಸ್ಟೇಜ್ ಒಡವೆ ಮಾಡುವಾಗ ವ್ಯರ್ಥವಾಗುವ ಚಿನ್ನದ ನಷ್ಟ ತುಂಬಲು ಹಾಕುವ ಶುಲ್ಕ.'
      },
      {
        question: 'ಚಿನ್ನದ ಆಭರಣಗಳಿಗೆ GST ಎಷ್ಟು?',
        answer: 'ಭಾರತದಲ್ಲಿ ಚಿನ್ನದ ಆಭರಣಗಳಿಗೆ ಒಟ್ಟು 3% GST ವಿಧಿಸಲಾಗುತ್ತದೆ.'
      }
    ],
    tips: [
      'ಹರಳುಗಳ ತೂಕವನ್ನು ನಿಮ್ಮ ಮುಂದೆಯೇ ಪ್ರತ್ಯೇಕವಾಗಿ ತೂಕ ಮಾಡಿಸಿ.',
      '6 ಅಂಕಿಯ HUID ಹಾಲ್‌ಮಾರ್ಕ್ ಮುದ್ರೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
      'ಬಿಲ್‌ನಲ್ಲಿ ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ಮತ್ತು ವೇಸ್ಟೇಜ್ ಪ್ರತ್ಯೇಕವಾಗಿ ನಮೂದಿಸಲು ಕೇಳಿ.'
    ]
  },

  // ================= 7. BENGALI =================
  bn: {
    locale: 'bn',
    localeName: 'বাংলা',
    title: 'পুরনো সোনা এক্সচেঞ্জ ও জুয়েলারি বিল ক্যালকুলেটর | IndiaTools',
    metaDescription: 'পুরনো সোনার সঠিক এক্সচেঞ্জ মূল্য, মজুরি (Making charge), খাদ/ওয়েস্টেজ এবং ৩% GST হিসেব করুন। গহনার বিল তুলনা করুন।',
    h1: 'গোল্ড এক্সচেঞ্জ ও জুয়েলারি বিল চেকার',
    subtitle: 'পুরনো সোনা বদলানোর সঠিক মূল্য, মজুরি, ওয়েস্টেজ এবং ৩% GST-এর স্বচ্ছ হিসেব।',
    introText: 'সোনার গহনা কেনার সময় বা পুরনো সোনা বদলে নতুন গহনা নেওয়ার সময় বিভিন্ন দোকানে মজুরি (Making Charges), ওয়েস্টেজ ও ৩% GST-তে অনেক পার্থক্য দেখা যায়। এই ক্যালকুলেটরের মাধ্যমে আপনার পুরনো সোনার সঠিক দাম জানুন এবং নতুন গহনার পাকা বিল সহজেই যাচাই করুন।',
    keywords: [
      'gold exchange calculator bengali',
      'old gold exchange value west bengal',
      'jewellery bill calculator bengali',
      'gold making charge wastage bangla',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'বর্তমান সোনার বাজার দর',
      goldRateBasis: 'দরের ভিত্তি (24K / 22K)',
      ratePerGram: 'প্রতি গ্রাম সোনার দাম (₹)',
      gstRate: 'GST শতাংশ (%)',
      oldGoldSection: 'পুরনো সোনা এক্সচেঞ্জ মূল্যায়ন',
      oldGoldDesc: 'পাথরের ওজন ও গলানোর ক্ষতি বাদ দিয়ে খাঁটি সোনার মূল্য।',
      newGoldSection: 'নতুন গহনা ক্রয়ের কোটেশন',
      newGoldDesc: 'সোনার দাম, মজুরি, ওয়েস্টেজ ও GST সহ সম্পূর্ণ হিসাব।',
      grossWeight: 'মোট ওজন (গ্রাম)',
      stoneWeight: 'পাথর / পুতির ওজন (গ্রাম)',
      netWeight: 'খাঁটি সোনার ওজন (গ্রাম)',
      purity: 'সোনার বিশুদ্ধতা (ক্যারেট/916)',
      deductionPct: 'গলানোর বাদ (%)',
      exchangeValue: 'পুরনো সোনার মোট এক্সচেঞ্জ মূল্য',
      makingCharges: 'মজুরি (Making Charges)',
      makingChargeType: 'মজুরির ধরন (% বা ₹/গ্রাম)',
      wastageCharge: 'ওয়েস্টেজ (Wastage / VA)',
      wastageType: 'ওয়েস্টেজের ধরন (% বা গ্রাম)',
      hallmarking: 'হলমার্কিং ফি (₹)',
      stoneCost: 'পাথরের দাম (₹)',
      otherCharges: 'অন্যান্য খরচ (₹)',
      discount: 'ছাড় / ডিসকাউন্ট (₹)',
      totalBill: 'মোট জুয়েলারি বিল',
      netPayable: 'এক্সচেঞ্জের পর প্রদেয় টাকা',
      compareQuotes: 'দুটি দোকানের কোটেশন তুলনা',
      quoteA: 'কোটেশন A (প্রথম দোকান)',
      quoteB: 'কোটেশন B (দ্বিতীয় দোকান)',
      savingsDiff: 'বিল দুটির পার্থক্য / সঞ্চয়',
      calculateBtn: 'বিল হিসেব করুন',
      resetBtn: 'রিসেট করুন',
      copyResultBtn: 'বিলের সারসংক্ষেপ কপি করুন',
      disclaimer: 'বিজ্ঞপ্তি: এটি শুধুমাত্র তথ্যের উদ্দেশ্যে একটি অনুমান। দোকানের নিয়মাবলী অনুসারে চূড়ান্ত বিলে পরিবর্তন হতে পারে।',
    },
    faqs: [
      {
        question: 'পুরনো সোনা বদলানোর সময় দোকানদাররা কতটা কাটেন?',
        answer: 'প্রথমে পাথর ও মালের ওজন বাদ দিয়ে খাঁটি সোনা হিসেব করা হয়। 916 হলমার্ক সোনায় সাধারণত ০% থেকে ১% মাত্র বাদ দেওয়া হয়।'
      },
      {
        question: 'মজুরি ও ওয়েস্টেজ-এর মধ্যে পার্থক্য কী?',
        answer: 'মজুরি হলো কারিগরের পরিশ্রমের মূল্য। আর ওয়েস্টেজ হলো গহনা তৈরির সময় যে সোনা সামান্য পরিমাণে ক্ষয় হয় তার ক্ষতিপূরণ।'
      },
      {
        question: 'সোনার গহনায় GST কত শতাংশ?',
        answer: 'ভারতে সোনার গহনায় মোট ৩% GST ধার্য করা হয়।'
      }
    ],
    tips: [
      'পাথরের ওজন নিজের সামনে মেপে নিতে বলুন।',
      'গহনায় ৬ সংখ্যার HUID হলমার্ক সিল আছে কিনা দেখে নিন।',
      'বিলে মজুরি এবং ওয়েস্টেজ আলাদা করে লিখতে বলুন।'
    ]
  },

  // ================= 8. MARATHI =================
  mr: {
    locale: 'mr',
    localeName: 'मराठी',
    title: 'जुने सोने एक्सचेंज व दागिने बिल कॅल्क्युलेटर | IndiaTools',
    metaDescription: 'जुन्या सोन्याचे खरे एक्सचेंज मूल्य, घडणावळ, घट (Wastage) आणि ३% GST ची अचूक गणना करा. ज्वेलर्सच्या बिलांची तुलना करा.',
    h1: 'गोल्ड एक्सचेंज व ज्वेलरी बिल चेकर',
    subtitle: 'जुने सोने बदलून मिळणारे अचूक मूल्य, घडणावळ, घट आणि ३% GST चा पारदर्शक हिशोब.',
    introText: 'महाराष्ट्रात सोन्याचे दागिने खरेदी करताना किंवा जुने सोने बदलताना घडणावळ (Making charges), घट (Wastage), खड्यांचे वजन व ३% GST मध्ये दुकानांनुसार मोठा फरक असतो. या कॅल्क्युलेटरच्या मदतीने आपल्या जुन्या सोन्याचे योग्य मूल्य जाणून घ्या आणि नवीन दागिन्यांचे बिल तपासा.',
    keywords: [
      'gold exchange calculator marathi',
      'old gold exchange value maharashtra',
      'jewellery bill calculator marathi',
      'gold ghadnavol wastage calculator',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'सध्याचा सोन्याचा बाजारभाव',
      goldRateBasis: 'भावाचा आधार (24K / 22K)',
      ratePerGram: 'प्रति ग्रॅम सोन्याचा दर (₹)',
      gstRate: 'GST टक्केवारी (%)',
      oldGoldSection: 'जुने सोने एक्सचेंज मूल्यांकन',
      oldGoldDesc: 'खड्यांचे वजन आणि गळती वजा करून सोन्याचे शुद्ध मूल्य.',
      newGoldSection: 'नवीन दागिने खरेदी कोटेशन',
      newGoldDesc: 'सोन्याची किंमत, घडणावळ, घट आणि GST सह संपूर्ण बिल.',
      grossWeight: 'एकूण वजन (ग्रॅम)',
      stoneWeight: 'खड्यांचे वजन (ग्रॅम)',
      netWeight: 'शुद्ध सोन्याचे वजन (ग्रॅम)',
      purity: 'सोन्याची शुद्धता (कॅरेट/916)',
      deductionPct: 'गळती / टेस्टिंग वजावट (%)',
      exchangeValue: 'जुन्या सोन्याचे एकूण मूल्य',
      makingCharges: 'घडणावळ (Making Charges)',
      makingChargeType: 'घडणावळ प्रकार (% किंवा ₹/ग्रॅम)',
      wastageCharge: 'घट (Wastage / VA)',
      wastageType: 'घट प्रकार (% किंवा ग्रॅम)',
      hallmarking: 'हॉलमार्किंग शुल्क (₹)',
      stoneCost: 'खड्यांची किंमत (₹)',
      otherCharges: 'इतर शुल्क (₹)',
      discount: 'सूट / डिस्काउंट (₹)',
      totalBill: 'दागिन्यांचे एकूण बिल',
      netPayable: 'एक्सचेंज नंतर देय रक्कम',
      compareQuotes: 'दोन ज्वेलर्सच्या बिलांची तुलना',
      quoteA: 'कोटेशन A (पहिले दुकान)',
      quoteB: 'कोटेशन B (दुसरे दुकान)',
      savingsDiff: 'दोन्ही बिलांमधील फरक / बचत',
      calculateBtn: 'बिल मोजा',
      resetBtn: 'रीसेट करा',
      copyResultBtn: 'तपशील कॉपी करा',
      disclaimer: 'सूचना: ही गणना केवळ माहितीसाठी आहे. दुकानाच्या नियमांनुसार अंतिम बिलात बदल होऊ शकतो.',
    },
    faqs: [
      {
        question: 'जुने सोने बदलताना सराफ किती कपात करतात?',
        answer: 'प्रथम खड्यांचे वजन वजा केले जाते. 916 हॉलमार्क सोन्यावर प्रतिष्ठित सराफ केवळ ०% ते १% कपात करतात.'
      },
      {
        question: 'घडणावळ आणि घट मध्ये काय फरक आहे?',
        answer: 'घडणावळ कारागिराचे मजुरी शुल्क असते, तर घट ही दागिना बनवताना वाया जाणाऱ्या सोन्याची भरपाई असते.'
      },
      {
        question: 'सोन्याच्या दागिन्यांवर किती GST लागतो?',
        answer: 'भारतात सोन्याच्या दागिन्यांवर एकूण ३% GST आकारला जातो.'
      }
    ],
    tips: [
      'खड्यांचे वजन स्वतंत्रपणे मोजून घ्या.',
      'दागिन्यांवर ६ अंकी HUID हॉलमार्क तपासा.',
      'बिलामध्ये घडणावळ आणि घट स्वतंत्रपणे दाखवण्यास सांगा.'
    ]
  },

  // ================= 9. GUJARATI =================
  gu: {
    locale: 'gu',
    localeName: 'ગુજરાતી',
    title: 'જૂનું સોનું એક્સચેન્જ અને જ્વેલરી બિલ કેલ્ક્યુલેટર | IndiaTools',
    metaDescription: 'જૂના સોનાનું સાચું એક્સચેન્જ મૂલ્ય, ઘડામણ (Making charges), વેસ્ટેજ અને ૩% GST ગણો. જ્વેલર્સના બિલની સરખામણી કરો.',
    h1: 'ગોલ્ડ એક્સચેન્જ અને જ્વેલરી બિલ ચેકર',
    subtitle: 'જૂનું સોનું બદલવાનું સાચું મૂલ્ય, ઘડામણ, વેસ્ટેજ અને ૩% GST ની પારદર્શક ગણતરી.',
    introText: 'ગુજરાતમાં સોનાના દાગીના ખરીદતી વખતે કે જૂનું સોનું બદલતી વખતે ઘડામણ, વેસ્ટેજ અને ૩% GST માં જ્વેલર્સ પ્રમાણે મોટો તફાવત હોય છે. આ કેલ્ક્યુલેટરથી તમારા જૂના સોનાનો સાચો ભાવ જાણો અને નવા દાગીનાનું બિલ ચકાસો.',
    keywords: [
      'gold exchange calculator gujarati',
      'old gold exchange value gujarat',
      'jewellery bill calculator gujarati',
      'gold ghadaman wastage calculator',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'હાલનો સોનાનો બજાર ભાવ',
      goldRateBasis: 'ભાવનો આધાર (24K / 22K)',
      ratePerGram: 'પ્રતિ ગ્રામ સોનાનો ભાવ (₹)',
      gstRate: 'GST ટકાવારી (%)',
      oldGoldSection: 'જૂનું સોનું એક્સચેન્જ મૂલ્યાંકન',
      oldGoldDesc: 'પથ્થરનું વજન અને ગળતર બાદ કરી શુદ્ધ સોનાનું મૂલ્ય.',
      newGoldSection: 'નવા દાગીના ખરીદી કોટેશન',
      newGoldDesc: 'સોનાનો ભાવ, ઘડામણ, વેસ્ટેજ અને GST સહિત સંપૂર્ણ વિગત.',
      grossWeight: 'કુલ વજન (ગ્રામ)',
      stoneWeight: 'નંગ / પથ્થરનું વજન (ગ્રામ)',
      netWeight: 'ચોખ્ખું સોનાનું વજન (ગ્રામ)',
      purity: 'સોનાની શુદ્ધતા (કેરેટ/916)',
      deductionPct: 'ગળતર કપાત (%)',
      exchangeValue: 'જૂના સોનાનું કુલ મૂલ્ય',
      makingCharges: 'ઘડામણ (Making Charges)',
      makingChargeType: 'ઘડામણ પ્રકાર (% અથવા ₹/ગ્રામ)',
      wastageCharge: 'વેસ્ટેજ (Wastage / VA)',
      wastageType: 'વેસ્ટેજ પ્રકાર (% અથવા ગ્રામ)',
      hallmarking: 'હોલમાર્કિંગ ચાર્જ (₹)',
      stoneCost: 'નંગની કિંમત (₹)',
      otherCharges: 'અન્ય ખર્ચ (₹)',
      discount: 'ડિસ્કાઉન્ટ (₹)',
      totalBill: 'કુલ જ્વેલરી બિલ',
      netPayable: 'એક્સચેન્જ પછી ચૂકવવાપાત્ર રકમ',
      compareQuotes: 'બે જ્વેલર્સના કોટેશનની સરખામણી',
      quoteA: 'કોટેશન A (પ્રથમ દુકાન)',
      quoteB: 'કોટેશન B (બીજી દુકાન)',
      savingsDiff: 'બંને બિલ વચ્ચેનો તફાવત / બચત',
      calculateBtn: 'બિલ ગણો',
      resetBtn: 'રીસેટ કરો',
      copyResultBtn: 'વિગત કોપી કરો',
      disclaimer: 'નોંધ: આ ગણતરી ફક્ત શૈક્ષણિક હેતુ માટે છે. દુકાનના નિયમો મુજબ વાસ્તવિક બિલમાં ફેરફાર થઈ શકે છે.',
    },
    faqs: [
      {
        question: 'જૂનું સોનું બદલતી વખતે જ્વેલર્સ કેટલી કપાત કરે છે?',
        answer: 'સૌ પ્રથમ નંગનું વજન બાદ કરવામાં આવે છે. 916 હોલમાર્ક સોના પર માત્ર ૦% થી ૧% જેવી સામાન્ય કપાત થાય છે.'
      },
      {
        question: 'ઘડામણ અને વેસ્ટેજમાં શું તફાવત છે?',
        answer: 'ઘડામણ કારીગરની મજૂરી છે, જ્યારે વેસ્ટેજ દાગીના બનાવતી વખતે થતા નુકસાનની ભરપાઈ છે.'
      },
      {
        question: 'સોનાના દાગીના પર કેટલો GST લાગે છે?',
        answer: 'ભારતમાં સોનાના દાગીના પર કુલ ૩% GST લાગે છે.'
      }
    ],
    tips: [
      'નંગનું વજન તમારી સામે અલગથી કરાવડાવો.',
      'દાગીના પર ૬ અંકનો HUID હોલમાર્ક માર્કો ચકાસો.',
      'બિલમાં ઘડામણ અને વેસ્ટેજ અલગ બતાવવા આગ્રહ રાખો.'
    ]
  },

  // ================= 10. PUNJABI =================
  pa: {
    locale: 'pa',
    localeName: 'ਪੰਜਾਬੀ',
    title: 'ਪੁਰਾਣਾ ਸੋਨਾ ਐਕਸਚੇਂਜ ਅਤੇ ਗਹਿਣੇ ਬਿੱਲ ਕੈਲਕੁਲੇਟਰ | IndiaTools',
    metaDescription: 'ਪੁਰਾਣੇ ਸੋਨੇ ਦੀ ਸਹੀ ਕੀਮਤ, ਘੜਾਈ (Making charge), ਵੇਸਟੇਜ ਅਤੇ 3% GST ਦੀ ਸਹੀ ਗਣਨਾ ਕਰੋ। ਗਹਿਣਿਆਂ ਦੇ ਬਿੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।',
    h1: 'ਗੋਲਡ ਐਕਸਚੇਂਜ ਅਤੇ ਜਿਊਲਰੀ ਬਿੱਲ ਚੈਕਰ',
    subtitle: 'ਪੁਰਾਣਾ ਸੋਨਾ ਬਦਲਣ ਤੇ ਮਿਲਣ ਵਾਲੀ ਅਸਲ ਕੀਮਤ, ਘੜਾਈ, ਵੇਸਟੇਜ ਅਤੇ 3% GST ਦਾ ਪਾਰਦਰਸ਼ੀ ਹਿਸਾਬ।',
    introText: 'ਪੰਜਾਬ ਵਿੱਚ ਸੋਨੇ ਦੇ ਗਹਿਣੇ ਖਰੀਦਣ ਜਾਂ ਪੁਰਾਣਾ ਸੋਨਾ ਬਦਲਣ ਸਮੇਂ ਘੜਾਈ (Making Charges), ਵੇਸਟੇਜ ਅਤੇ 3% GST ਵਿੱਚ ਦੁਕਾਨਦਾਰਾਂ ਅਨੁਸਾਰ ਕਾਫੀ ਫ਼ਰਕ ਹੁੰਦਾ ਹੈ। ਇਸ ਕੈਲਕੁਲੇਟਰ ਨਾਲ ਆਪਣੇ ਪੁਰਾਣੇ ਸੋਨੇ ਦਾ ਸਹੀ ਮੁੱਲ ਜਾਣੋ ਅਤੇ ਨਵੇਂ ਗਹਿਣਿਆਂ ਦਾ ਬਿੱਲ ਚੈੱਕ ਕਰੋ।',
    keywords: [
      'gold exchange calculator punjabi',
      'old gold exchange value punjab',
      'jewellery bill calculator punjabi',
      'gold making charges wastage punjab',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'ਮੌਜੂਦਾ ਸੋਨੇ ਦਾ ਬਾਜ਼ਾਰ ਭਾਅ',
      goldRateBasis: 'ਰੇਟ ਦਾ ਆਧਾਰ (24K / 22K)',
      ratePerGram: 'ਪ੍ਰਤੀ ਗ੍ਰਾਮ ਸੋਨੇ ਦਾ ਭਾਅ (₹)',
      gstRate: 'GST ਪ੍ਰਤੀਸ਼ਤ (%)',
      oldGoldSection: 'ਪੁਰਾਣਾ ਸੋਨਾ ਐਕਸਚੇਂਜ ਮੁੱਲ',
      oldGoldDesc: 'ਨਗਾਂ ਦਾ ਵਜ਼ਨ ਅਤੇ ਗਲਾਈ ਕਟੌਤੀ ਘਟਾ ਕੇ ਸ਼ੁੱਧ ਸੋਨੇ ਦੀ ਕੀਮਤ।',
      newGoldSection: 'ਨਵੇਂ ਗਹਿਣੇ ਖਰੀਦ ਕੋਟੇਸ਼ਨ',
      newGoldDesc: 'ਸੋਨੇ ਦੀ ਕੀਮਤ, ਘੜਾਈ, ਵੇਸਟੇਜ ਅਤੇ GST ਸਮੇਤ ਪੂਰਾ ਵੇਰਵਾ।',
      grossWeight: 'ਕੁੱਲ ਵਜ਼ਨ (ਗ੍ਰਾਮ)',
      stoneWeight: 'ਨਗਾਂ/ਮੋਤੀਆਂ ਦਾ ਵਜ਼ਨ (ਗ੍ਰਾਮ)',
      netWeight: 'ਸ਼ੁੱਧ ਸੋਨੇ ਦਾ ਵਜ਼ਨ (ਗ੍ਰਾਮ)',
      purity: 'ਸੋਨੇ ਦੀ ਸ਼ੁੱਧਤਾ (ਕੈਰੇਟ/916)',
      deductionPct: 'ਗਲਾਈ ਕਟੌਤੀ (%)',
      exchangeValue: 'ਪੁਰਾਣੇ ਸੋਨੇ ਦਾ ਕੁੱਲ ਮੁੱਲ',
      makingCharges: 'ਘੜਾਈ (Making Charges)',
      makingChargeType: 'ਘੜਾਈ ਦਾ ਤਰੀਕਾ (% ਜਾਂ ₹/ਗ੍ਰਾਮ)',
      wastageCharge: 'ਵੇਸਟੇਜ (Wastage / VA)',
      wastageType: 'ਵੇਸਟੇਜ ਦਾ ਤਰੀਕਾ (% ਜਾਂ ਗ੍ਰਾਮ)',
      hallmarking: 'ਹਾਲਮਾਰਕਿੰਗ ਫ਼ੀਸ (₹)',
      stoneCost: 'ਨਗਾਂ ਦੀ ਕੀਮਤ (₹)',
      otherCharges: 'ਹੋਰ ਖਰਚੇ (₹)',
      discount: 'ਛੋਟ / ਡਿਸਕਾਊਂਟ (₹)',
      totalBill: 'ਕੁੱਲ ਗਹਿਣੇ ਬਿੱਲ',
      netPayable: 'ਐਕਸਚੇਂਜ ਤੋਂ ਬਾਅਦ ਦੇਣਯੋਗ ਰਕਮ',
      compareQuotes: 'ਦੋ ਦੁਕਾਨਾਂ ਦੇ ਕੋਟੇਸ਼ਨਾਂ ਦੀ ਤੁਲਨਾ',
      quoteA: 'ਕੋਟੇਸ਼ਨ A (ਪਹਿਲੀ ਦੁਕਾਨ)',
      quoteB: 'ਕੋਟੇਸ਼ਨ B (ਦੂਜੀ ਦੁਕਾਨ)',
      savingsDiff: 'ਬਿੱਲਾਂ ਵਿੱਚ ਫ਼ਰਕ / ਬੱਚਤ',
      calculateBtn: 'ਬਿੱਲ ਗਿਣੋ',
      resetBtn: 'ਰੀਸੈੱਟ ਕਰੋ',
      copyResultBtn: 'ਵੇਰਵਾ ਕਾਪੀ ਕਰੋ',
      disclaimer: 'ਨੋਟ: ਇਹ ਗਣਨਾ ਸਿਰਫ ਜਾਣਕਾਰੀ ਲਈ ਹੈ। ਦੁਕਾਨ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਅਸਲ ਬਿੱਲ ਵਿੱਚ ਫ਼ਰਕ ਹੋ ਸਕਦਾ ਹੈ।',
    },
    faqs: [
      {
        question: 'ਪੁਰਾਣਾ ਸੋਨਾ ਬਦਲਣ ਤੇ ਸੁਨਿਆਰੇ ਕਿੰਨੀ ਕਟੌਤੀ ਕਰਦੇ ਹਨ?',
        answer: 'ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਨਗਾਂ ਦਾ ਵਜ਼ਨ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ। 916 ਹਾਲਮਾਰਕ ਸੋਨੇ ਤੇ ਸਿਰਫ 0% ਤੋਂ 1% ਦੀ ਕਟੌਤੀ ਹੁੰਦੀ ਹੈ।'
      },
      {
        question: 'ਘੜਾਈ ਅਤੇ ਵੇਸਟੇਜ ਵਿੱਚ ਕੀ ਫ਼ਰਕ ਹੁੰਦਾ ਹੈ?',
        answer: 'ਘੜਾਈ ਕਾਰੀਗਰ ਦੀ ਮਿਹਨਤ ਹੁੰਦੀ ਹੈ ਅਤੇ ਵੇਸਟੇਜ ਗਹਿਣੇ ਬਣਾਉਣ ਵੇਲੇ ਖਰਾਬ ਹੋਏ ਸੋਨੇ ਦਾ ਮੁਆਵਜ਼ਾ ਹੁੰਦਾ ਹੈ।'
      },
      {
        question: 'ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ ਤੇ ਕਿੰਨਾ GST ਲੱਗਦਾ ਹੈ?',
        answer: 'ਭਾਰਤ ਵਿੱਚ ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ ਤੇ ਕੁੱਲ 3% GST ਲੱਗਦਾ ਹੈ।'
      }
    ],
    tips: [
      'ਨਗਾਂ ਦਾ ਵਜ਼ਨ ਆਪਣੇ ਸਾਹਮਣੇ ਵੱਖਰਾ ਕਰਵਾਓ।',
      'ਗਹਿਣਿਆਂ ਤੇ 6 ਅੰਕਾਂ ਦਾ HUID ਹਾਲਮਾਰਕ ਜ਼ਰੂਰ ਦੇਖੋ।',
      'ਬਿੱਲ ਵਿੱਚ ਘੜਾਈ ਅਤੇ ਵੇਸਟੇਜ ਵੱਖ-ਵੱਖ ਲਿਖਵਾਓ।'
    ]
  },

  // ================= 11. ODIA =================
  or: {
    locale: 'or',
    localeName: 'ଓଡ଼ିଆ',
    title: 'ପୁରୁଣା ସୁନା ଏକ୍ସଚେଞ୍ଜ ଏବଂ ଅଳଙ୍କାର ବିଲ୍ କାଲକୁଲେଟର | IndiaTools',
    metaDescription: 'ପୁରୁଣା ସୁନାର ପ୍ରକୃତ ମୂଲ୍ୟ, ଗଢ଼ା ମଜୁରୀ (Making charge), ୱେଷ୍ଟେଜ୍ ଏବଂ ୩% GST ହିସାବ କରନ୍ତୁ। ଦୋକାନ ବିଲ୍ ତୁଳନା କରନ୍ତୁ।',
    h1: 'ଗୋଲ୍ଡ ଏକ୍ସଚେଞ୍ଜ ଏବଂ ଅଳଙ୍କାର ବିଲ୍ ଚେକର୍',
    subtitle: 'ପୁରୁଣା ସୁନା ବଦଳାଇବାର ସଠିକ୍ ମୂଲ୍ୟ, ଗଢ଼ା ମଜୁରୀ, ୱେଷ୍ଟେଜ୍ ଏବଂ ୩% GST ର ସ୍ୱଚ୍ଛ ହିସାବ।',
    introText: 'ଓଡ଼ିଶାରେ ସୁନା ଗହଣା କିଣିବା କିମ୍ବା ପୁରୁଣା ସୁନା ବଦଳାଇବା ସମୟରେ ଗଢ଼ା ମଜୁରୀ, ୱେଷ୍ଟେଜ୍ ଏବଂ ୩% GST ରେ ଦୋକାନ ଅନୁସାରେ ବହୁତ ଫରକ ଥାଏ। ଏହି କାଲକୁଲେଟର ସାହାଯ୍ୟରେ ନିଜ ପୁରୁଣା ସୁନାର ପ୍ରକୃତ ମୂଲ୍ୟ ଜାଣନ୍ତୁ ଏବଂ ନୂଆ ଅଳଙ୍କାରର ବିଲ୍ ଯାଞ୍ଚ କରନ୍ତୁ।',
    keywords: [
      'gold exchange calculator odia',
      'old gold exchange value odisha',
      'jewellery bill calculator odia',
      'gold making charges wastage odia',
      '916 gold bill checking'
    ],
    labels: {
      goldRates: 'ବର୍ତ୍ତମାନ ସୁନା ବଜାର ଦର',
      goldRateBasis: 'ଦର ଭିତ୍ତି (24K / 22K)',
      ratePerGram: 'ଗ୍ରାମ୍ ପିଛା ସୁନା ଦର (₹)',
      gstRate: 'GST ପ୍ରତିଶତ (%)',
      oldGoldSection: 'ପୁରୁଣା ସୁନା ଏକ୍ସଚେଞ୍ଜ ମୂଲ୍ୟାଙ୍କନ',
      oldGoldDesc: 'ପଥର ଓଜନ ଏବଂ ତରଳାଇବା କ୍ଷତି ବାଦ୍ ଦେଇ ପ୍ରକୃତ ସୁନା ମୂଲ୍ୟ।',
      newGoldSection: 'ନୂଆ ଅଳଙ୍କାର କ୍ରୟ କୋଟେସନ୍',
      newGoldDesc: 'ସୁନା ଦର, ଗଢ଼ା ମଜୁରୀ, ୱେଷ୍ଟେଜ୍ ଓ GST ସହିତ ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ।',
      grossWeight: 'ମୋଟ ଓଜନ (ଗ୍ରାମ୍)',
      stoneWeight: 'ପଥର / ମୋତି ଓଜନ (ଗ୍ରାମ୍)',
      netWeight: 'ନିଖୁଣ ସୁନା ଓଜନ (ଗ୍ରାମ୍)',
      purity: 'ସୁନାର ଶୁଦ୍ଧତା (କ୍ୟାରେଟ୍/916)',
      deductionPct: 'ତରଳାଇବା କଟତି (%)',
      exchangeValue: 'ପୁରୁଣା ସୁନାର ମୋଟ ମୂଲ୍ୟ',
      makingCharges: 'ଗଢ଼ା ମଜୁରୀ (Making Charges)',
      makingChargeType: 'ମଜୁରୀ ପ୍ରକାର (% ବା ₹/ଗ୍ରାମ୍)',
      wastageCharge: 'ୱେଷ୍ଟେଜ୍ (Wastage / VA)',
      wastageType: 'ୱେଷ୍ଟେଜ୍ ପ୍ରକାର (% ବା ଗ୍ରାମ୍)',
      hallmarking: 'ହଲମାର୍କିଂ ଫି (₹)',
      stoneCost: 'ପଥର ଦାମ୍ (₹)',
      otherCharges: 'ଅନ୍ୟାନ୍ୟ ଖର୍ଚ୍ଚ (₹)',
      discount: 'ରିହାତି (₹)',
      totalBill: 'ମୋଟ ଅଳଙ୍କାର ବିଲ୍',
      netPayable: 'ଏକ୍ସଚେଞ୍ଜ ପରେ ଦେବାକୁ ଥିବା ଟଙ୍କା',
      compareQuotes: 'ଦୁଇଟି ଦୋକାନ କୋଟେସନ୍ ତୁଳନା',
      quoteA: 'କୋଟେସନ୍ A (ପ୍ରଥମ ଦୋକାନ)',
      quoteB: 'କୋଟେସନ୍ B (ଦ୍ୱିତୀୟ ଦୋକାନ)',
      savingsDiff: 'ବିଲ୍ ମଧ୍ୟରେ ଫରକ / ବଞ୍ଚତ',
      calculateBtn: 'ବିଲ୍ ହିସାବ କରନ୍ତୁ',
      resetBtn: 'ରିସେଟ୍ କରନ୍ତୁ',
      copyResultBtn: 'ବିବରଣୀ କପି କରନ୍ତୁ',
      disclaimer: 'ସୂଚନା: ଏହା କେବଳ ଏକ ଆନୁମାନିକ ହିସାବ। ଦୋକାନର ନିୟମ ଅନୁଯାୟୀ ପ୍ରକୃତ ବିଲ୍ ଭିନ୍ନ ହୋଇପାରେ।',
    },
    faqs: [
      {
        question: 'ପୁରୁଣା ସୁନା ବଦଳାଇବା ବେଳେ ଦୋକାନୀ କେତେ କାଟନ୍ତି?',
        answer: 'ପ୍ରଥମେ ପଥରର ଓଜନ ବାଦ୍ ଦିଆଯାଏ। 916 ହଲମାର୍କ ସୁନାରେ ମାତ୍ର ୦% ରୁ ୧% କଟତି ହୁଏ।'
      },
      {
        question: 'ଗଢ଼ା ମଜୁରୀ ଏବଂ ୱେଷ୍ଟେଜ୍ ମଧ୍ୟରେ ଫରକ କ’ଣ?',
        answer: 'ଗଢ଼ା ମଜୁରୀ କାରିଗରର ପାରିଶ୍ରମିକ ଏବଂ ୱେଷ୍ଟେଜ୍ ଗହଣା ତିଆରି ସମୟରେ ନଷ୍ଟ ହେଉଥିବା ସୁନାର ଭରପାଇ।'
      },
      {
        question: 'ସୁନା ଗହଣା ଉପରେ କେତେ GST ଲାଗେ?',
        answer: 'ଭାରତରେ ସୁନା ଗହଣା ଉପରେ ମୋଟ ୩% GST ଲାଗୁ ହୁଏ।'
      }
    ],
    tips: [
      'ପଥରର ଓଜନ ନିଜ ସାମ୍ନାରେ ମାପିବାକୁ କୁହନ୍ତୁ।',
      'ଗହଣାରେ ୬ ଅଙ୍କ ବିଶିଷ୍ଟ HUID ହଲମାର୍କ ନିଶ୍ଚୟ ଯାଞ୍ଚ କରନ୍ତୁ।',
      'ବିଲ୍‌ରେ ଗଢ଼ା ମଜୁରୀ ଓ ୱେଷ୍ଟେଜ୍ ଅଲଗା ଲେଖିବାକୁ କୁହନ୍ତୁ।'
    ]
  }
}

export function getGoldToolTranslation(locale: SupportedLocale): GoldToolContent {
  return GOLD_TOOL_I18N[locale] || GOLD_TOOL_I18N.en
}
