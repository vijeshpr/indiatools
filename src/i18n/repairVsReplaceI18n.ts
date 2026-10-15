/**
 * Comprehensive Localization Dictionary for Repair vs Replace Decision Engine
 * Supports English + all 22 official Eighth Schedule Indian Languages:
 * Assamese (as), Bengali (bn), Bodo (brx), Dogri (doi), Gujarati (gu),
 * Hindi (hi), Kannada (kn), Kashmiri (ks), Konkani (kok), Maithili (mai),
 * Malayalam (ml), Meitei/Manipuri (mni), Marathi (mr), Nepali (ne),
 * Odia (or), Punjabi (pa), Sanskrit (sa), Santali (sat), Sindhi (sd),
 * Tamil (ta), Telugu (te), Urdu (ur), and English (en).
 */

import type {
  ItemCategory,
  Criticality,
  RiskTolerance,
  PersonalPreference,
  RepairConfidence
} from '../lib/repairVsReplaceCalc'

export type RepairLangCode =
  | 'en'
  | 'as'
  | 'bn'
  | 'brx'
  | 'doi'
  | 'gu'
  | 'hi'
  | 'kn'
  | 'ks'
  | 'kok'
  | 'mai'
  | 'ml'
  | 'mni'
  | 'mr'
  | 'ne'
  | 'or'
  | 'pa'
  | 'sa'
  | 'sat'
  | 'sd'
  | 'ta'
  | 'te'
  | 'ur'

export interface RepairLocaleMeta {
  code: RepairLangCode
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  bcp47: string
}

export const REPAIR_LOCALES: Record<RepairLangCode, RepairLocaleMeta> = {
  "en": {
    "code": "en",
    "name": "English",
    "nativeName": "English",
    "dir": "ltr",
    "bcp47": "en-IN"
  },
  "hi": {
    "code": "hi",
    "name": "Hindi",
    "nativeName": "हिन्दी",
    "dir": "ltr",
    "bcp47": "hi-IN"
  },
  "ml": {
    "code": "ml",
    "name": "Malayalam",
    "nativeName": "മലയാളം",
    "dir": "ltr",
    "bcp47": "ml-IN"
  },
  "ta": {
    "code": "ta",
    "name": "Tamil",
    "nativeName": "தமிழ்",
    "dir": "ltr",
    "bcp47": "ta-IN"
  },
  "te": {
    "code": "te",
    "name": "Telugu",
    "nativeName": "తెలుగు",
    "dir": "ltr",
    "bcp47": "te-IN"
  },
  "kn": {
    "code": "kn",
    "name": "Kannada",
    "nativeName": "ಕನ್ನಡ",
    "dir": "ltr",
    "bcp47": "kn-IN"
  },
  "bn": {
    "code": "bn",
    "name": "Bengali",
    "nativeName": "বাংলা",
    "dir": "ltr",
    "bcp47": "bn-IN"
  },
  "mr": {
    "code": "mr",
    "name": "Marathi",
    "nativeName": "मराठी",
    "dir": "ltr",
    "bcp47": "mr-IN"
  },
  "gu": {
    "code": "gu",
    "name": "Gujarati",
    "nativeName": "ગુજરાતી",
    "dir": "ltr",
    "bcp47": "gu-IN"
  },
  "pa": {
    "code": "pa",
    "name": "Punjabi",
    "nativeName": "ਪੰਜਾਬੀ",
    "dir": "ltr",
    "bcp47": "pa-IN"
  },
  "or": {
    "code": "or",
    "name": "Odia",
    "nativeName": "ଓଡ଼ିଆ",
    "dir": "ltr",
    "bcp47": "or-IN"
  },
  "as": {
    "code": "as",
    "name": "Assamese",
    "nativeName": "অসমীয়া",
    "dir": "ltr",
    "bcp47": "as-IN"
  },
  "ur": {
    "code": "ur",
    "name": "Urdu",
    "nativeName": "اردو",
    "dir": "rtl",
    "bcp47": "ur-IN"
  },
  "sa": {
    "code": "sa",
    "name": "Sanskrit",
    "nativeName": "संस्कृतम्",
    "dir": "ltr",
    "bcp47": "sa-IN"
  },
  "kok": {
    "code": "kok",
    "name": "Konkani",
    "nativeName": "कोंकणी",
    "dir": "ltr",
    "bcp47": "kok-IN"
  },
  "mai": {
    "code": "mai",
    "name": "Maithili",
    "nativeName": "मैथिली",
    "dir": "ltr",
    "bcp47": "mai-IN"
  },
  "ne": {
    "code": "ne",
    "name": "Nepali",
    "nativeName": "नेपाली",
    "dir": "ltr",
    "bcp47": "ne-IN"
  },
  "ks": {
    "code": "ks",
    "name": "Kashmiri",
    "nativeName": "कॉशुर / کٲشُر",
    "dir": "rtl",
    "bcp47": "ks-IN"
  },
  "sd": {
    "code": "sd",
    "name": "Sindhi",
    "nativeName": "سنڌي / सिन्धी",
    "dir": "rtl",
    "bcp47": "sd-IN"
  },
  "doi": {
    "code": "doi",
    "name": "Dogri",
    "nativeName": "डोगरी",
    "dir": "ltr",
    "bcp47": "doi-IN"
  },
  "mni": {
    "code": "mni",
    "name": "Manipuri (Meitei)",
    "nativeName": "মৈতৈলোন্",
    "dir": "ltr",
    "bcp47": "mni-IN"
  },
  "brx": {
    "code": "brx",
    "name": "Bodo",
    "nativeName": "बर’",
    "dir": "ltr",
    "bcp47": "brx-IN"
  },
  "sat": {
    "code": "sat",
    "name": "Santali",
    "nativeName": "ᱥᱟᱱᱛᱟᱲᱤ",
    "dir": "ltr",
    "bcp47": "sat-IN"
  }
}

export const ALL_REPAIR_LANG_CODES = Object.keys(REPAIR_LOCALES) as RepairLangCode[]

export function isRepairLocale(code: string): code is RepairLangCode {
  return code in REPAIR_LOCALES
}

export interface RepairFaq {
  question: string
  answer: string
}

export interface RepairToolContent {
  locale: RepairLangCode
  localeName: string
  dir: 'ltr' | 'rtl'
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  introText: string
  steps: {
    step1: string
    step2: string
    step3: string
    step4: string
    results: string
  }
  categories: Record<ItemCategory, string>
  criticalityLevels: Record<Criticality, string>
  riskToleranceLevels: Record<RiskTolerance, string>
  preferenceOptions: Record<PersonalPreference, string>
  confidenceLevels: Record<RepairConfidence, string>
  presetsTitle: string
  presets: Record<string, string>
  labels: {
    itemCategory: string
    customItemName: string
    problemType: string
    itemAgeMonths: string
    originalPrice: string
    resaleValue: string
    repairCost: string
    repairVisits: string
    repairDowntimeHours: string
    hourlyRate: string
    replacementPrice: string
    additionalReplacementCost: string
    repairLifeMonths: string
    replacementLifeMonths: string
    repairMonthlyMaintenance: string
    replacementMonthlyMaintenance: string
    criticality: string
    riskTolerance: string
    personalPreference: string
    repairConfidence: string
    calculateButton: string
    resultsTitle: string
    recommendation: string
    breakEven: string
    breakEvenDesc: string
    horizonAnalysis: string
    cashDifference: string
    riskAdjustedCost: string
    downtimeCost: string
    timeLossTitle: string
    saveDecision: string
    savedDecisions: string
    exportPng: string
    share: string
    copied: string
    copySummary: string
    resetAll: string
    howItWorks: string
    rule50Percent: string
    rule50PercentDesc: string
    disclaimer: string
    privacyNotice: string
  }
  verdicts: {
    repairTitle: string
    repairDesc: string
    replaceTitle: string
    replaceDesc: string
    waitTitle: string
    waitDesc: string
  }
  faqs: RepairFaq[]
}

export const REPAIR_TOOL_I18N: Record<RepairLangCode, RepairToolContent> = {
  "en": {
    "locale": "en",
    "localeName": "English",
    "dir": "ltr",
    "title": "Repair vs Replace Calculator – Compare Costs & Risks | IndiaTools",
    "metaDescription": "Evaluate repair vs replace decisions for smartphones, laptops, appliances, vehicles, and furniture. Transparent lifecycle costs, break-even months, and risk heuristics.",
    "h1": "Repair vs Replace Decision Engine",
    "subtitle": "Data-driven financial and practical evaluation to decide whether to repair your old item or buy a replacement.",
    "introText": "Make objective, risk-adjusted decisions. Compares immediate cash outlay, 36-month equalized lifecycle cost, break-even timeline, downtime inconvenience, and failure risk.",
    "steps": {
      "step1": "1. Item & Problem",
      "step2": "2. Costs & Financials",
      "step3": "3. Life & Future Outlook",
      "step4": "4. Risk & Preferences",
      "results": "5. Decision Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "Calculate Decision",
      "resultsTitle": "Decision Dashboard",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This engine offers financial and risk modeling based on user inputs and empirical failure rates. It does not replace physical inspection by a certified technician.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "What is the 50% Rule in repair vs replace decisions?",
        "answer": "The 50% Rule states that if the repair cost exceeds 50% of the cost of a new replacement, AND the item has already lived through more than 50% of its expected lifespan, replacement is almost always the smarter financial decision."
      },
      {
        "question": "How is the 36-month equal-horizon lifecycle cost calculated?",
        "answer": "Because repaired items usually last fewer months than brand new items, a direct upfront cost comparison is misleading. We normalize both options across a 36-month baseline, including anticipated secondary repairs and ongoing monthly maintenance."
      },
      {
        "question": "Does the calculator store my financial inputs?",
        "answer": "No. All calculations, comparisons, and PNG generation happen 100% locally in your browser. No data is transmitted to servers or third-party analytics."
      },
      {
        "question": "How is downtime and inconvenience cost calculated?",
        "answer": "Downtime cost calculates your personal time value during repair shop visits and days without the product, multiplied by your optional hourly rate. It is displayed as a separate hassle metric and never mixed into pure cash outlays."
      }
    ]
  },
  "hi": {
    "locale": "hi",
    "localeName": "Hindi",
    "dir": "ltr",
    "title": "रिपेयर बनाम रिप्लेस कैलकुलेटर – खर्च और जोखिम तुलना | IndiaTools",
    "metaDescription": "स्मार्टफोन, लैपटॉप, होम अप्लायंसेज और गाड़ियों के लिए रिपेयर बनाम रिप्लेस निर्णय कैलकुलेटर। 36 महीने का कुल खर्च और सटीक ब्रेक-ईवन विश्लेषण।",
    "h1": "रिपेयर बनाम रिप्लेस निर्णय इंजन",
    "subtitle": "डेटा और अर्थशास्त्र आधारित कैलकुलेटर जो तय करता है कि पुरानी वस्तु की मरम्मत कराएं या नया खरीदें।",
    "introText": "बिना किसी पक्षपात के सटीक निर्णय लें। यह तुरंत होने वाला खर्च, 36 महीने का जीवनचक्र खर्च, ब्रेक-ईवन समय और दोबारा खराब होने का जोखिम आंकता है।",
    "steps": {
      "step1": "1. वस्तु और खराबी",
      "step2": "2. मरम्मत और लागत",
      "step3": "3. आयु और भविष्य",
      "step4": "4. जोखिम और पसंद",
      "results": "5. अंतिम निर्णय"
    },
    "categories": {
      "smartphone": "स्मार्टफोन / मोबाइल",
      "laptop": "लैपटॉप / कंप्यूटर",
      "appliance": "होम अप्लायंसेज (AC, फ्रिज, वॉशिंग मशीन)",
      "vehicle": "वाहन (कार, बाइक, स्कूटर)",
      "furniture": "फर्नीचर और होम डेकोर",
      "other": "अन्य उपकरण"
    },
    "criticalityLevels": {
      "essential": "अत्यावश्यक (दैनिक आजीविका व काम निर्भर)",
      "important": "महत्वपूर्ण (नियमित दैनिक उपयोग)",
      "nice_to_have": "सामान्य (कभी-कभार उपयोग)"
    },
    "riskToleranceLevels": {
      "low": "कम (शांति प्रिय, बार-बार खराबी से बचना चाहते हैं)",
      "medium": "मध्यम (संतुलित दृष्टिकोण)",
      "high": "उच्च (पैसे बचाने के लिए थोड़ा जोखिम लेने को तैयार)"
    },
    "preferenceOptions": {
      "prefer_repair": "मरम्मत प्राथमिकता (बजट बचत व पर्यावरण हित)",
      "neutral": "तटस्थ (जो भी आर्थिक रूप से बेहतर हो)",
      "prefer_replace": "नया खरीदना प्राथमिकता (नई वारंटी और फीचर्स चाहिए)"
    },
    "confidenceLevels": {
      "high": "उच्च (अधिकृत ब्रांड सर्विस सेंटर व ओरिजिनल पार्ट्स)",
      "moderate": "मध्यम (विश्वसनीय लोकल मैकेनिक)",
      "low": "कम (अनिश्चित खराबी या थर्ड-पार्टी पार्ट्स)"
    },
    "presetsTitle": "त्वरित उदाहरण",
    "presets": {
      "smartphone_screen": "स्मार्टफोन की टूटी AMOLED स्क्रीन",
      "laptop_motherboard": "लैपटॉप मदरबोर्ड / पावर फॉल्ट",
      "ac_compressor": "स्प्लिट AC कंप्रेसर रिप्लेसमेंट",
      "car_clutch_gearbox": "कार क्लच व गियरबॉक्स ओवरहाल",
      "sofa_re_upholstery": "सोफा रि-अपहोल्स्ट्री व कुशन"
    },
    "labels": {
      "itemCategory": "वस्तु की श्रेणी",
      "customItemName": "वस्तु का नाम",
      "problemType": "खराबी / समस्या का विवरण",
      "itemAgeMonths": "वस्तु की वर्तमान आयु (महीने)",
      "originalPrice": "मूल खरीद मूल्य (₹)",
      "resaleValue": "वर्तमान रीसेल / स्क्रैप मूल्य (₹)",
      "repairCost": "अनुमानित मरम्मत लागत (₹)",
      "repairVisits": "सर्विस सेंटर के संभावित चक्कर",
      "repairDowntimeHours": "बिना वस्तु के दिन / घंटे",
      "hourlyRate": "आपके समय का मूल्य (₹/घंटा, वैकल्पिक)",
      "replacementPrice": "नए विकल्प की कीमत (₹)",
      "additionalReplacementCost": "अतिरिक्त इंस्टॉलेशन खर्च (₹)",
      "repairLifeMonths": "मरम्मत के बाद संभावित आयु (महीने)",
      "replacementLifeMonths": "नए उपकरण की संभावित आयु (महीने)",
      "repairMonthlyMaintenance": "मरम्मत वाली वस्तु का मासिक मेंटेनेंस (₹)",
      "replacementMonthlyMaintenance": "नई वस्तु का मासिक मेंटेनेंस (₹)",
      "criticality": "दैनिक जीवन में इस वस्तु का महत्व",
      "riskTolerance": "आपकी जोखिम क्षमता",
      "personalPreference": "व्यक्तिगत पसंद",
      "repairConfidence": "सर्विस क्वालिटी व पार्ट्स पर भरोसा",
      "calculateButton": "निर्णय की गणना करें",
      "resultsTitle": "निर्णय परिणाम",
      "recommendation": "सुझाव",
      "breakEven": "ब्रेक-ईवन अवधि",
      "breakEvenDesc": "मरम्मत को आर्थिक रूप से सार्थक बनाने के लिए वस्तु को कितने महीने चलना होगा।",
      "horizonAnalysis": "36 महीने का कुल जीवनचक्र खर्च तुलना",
      "cashDifference": "आर्थिक बचत / अंतर",
      "riskAdjustedCost": "जोखिम समायोजित मरम्मत खर्च",
      "downtimeCost": "समय और असुविधा का मूल्य",
      "timeLossTitle": "समय और असुविधा का प्रभाव",
      "saveDecision": "यह निर्णय सुरक्षित करें",
      "savedDecisions": "सुरक्षित निर्णय सूची",
      "exportPng": "PNG कार्ड डाउनलोड करें",
      "share": "साझा करें",
      "copied": "विवरण क्लिपबोर्ड पर कॉपी हो गया!",
      "copySummary": "कॉपी करें",
      "resetAll": "रीसेट करें",
      "howItWorks": "यह कैलकुलेटर कैसे गणना करता है?",
      "rule50Percent": "50% नियम बेंचमार्क",
      "rule50PercentDesc": "यदि मरम्मत की लागत नए की कीमत के 50% से अधिक है और वस्तु 50% से अधिक उम्र पार कर चुकी है, तो नया खरीदना बेहतर है।",
      "disclaimer": "यह उपकरण केवल वित्तीय और सांख्यिकीय मार्गदर्शन प्रदान करता है। किसी प्रमाणित मैकेनिक की राय अवश्य लें।",
      "privacyNotice": "100% प्राइवेट: आपका कोई भी वित्तीय डेटा किसी सर्वर पर नहीं भेजा जाता।"
    },
    "verdicts": {
      "repairTitle": "सलाह: मरम्मत (REPAIR) कराएं",
      "repairDesc": "आर्थिक रूप से मरम्मत कराना सबसे समझदारी भरा विकल्प है। इससे आपके पैसे बचेंगे और वस्तु पर्याप्त समय तक चलेगी।",
      "replaceTitle": "सलाह: नया (REPLACE) खरीदें",
      "replaceDesc": "नया खरीदना बेहतर विकल्प है। भारी मरम्मत खर्च और दोबारा खराब होने का जोखिम मरम्मत को नुकसानदेह बनाता है।",
      "waitTitle": "सलाह: थोड़ा रुकें और निगरानी करें",
      "waitDesc": "मरम्मत और नए के बीच खर्च लगभग बराबर है। दूसरा कोटेशन लें या आगामी सेल/डिस्काउंट का इंतजार करें।"
    },
    "faqs": [
      {
        "question": "रिपेयर बनाम रिप्लेस का 50% नियम क्या है?",
        "answer": "यदि मरम्मत खर्च नए उत्पाद की कीमत के 50% से अधिक हो और वह अपने जीवनकाल का 50% पूरा कर चुका हो, तो नया खरीदना अधिक फायदेमंद होता है।"
      },
      {
        "question": "36 महीने की तुलना क्यों की जाती है?",
        "answer": "रिपेयर की गई वस्तु नए जैसी लंबी नहीं चलती। 36 महीने की समान अवधि पर दोनों विकल्पों की तुलना करने से सही तस्वीर सामने आती है।"
      }
    ]
  },
  "ml": {
    "locale": "ml",
    "localeName": "Malayalam",
    "dir": "ltr",
    "title": "റിപ്പയർ ചെയ്യണോ പുതിയത് വാങ്ങണോ? ചെലവ് കാൽക്കുലേറ്റർ | IndiaTools",
    "metaDescription": "സ്മാർട്ട്ഫോൺ, ലാപ്‌ടോപ്പ്, വാഹനം, വീട്ടുപകരണങ്ങൾ എന്നിവ റിപ്പയർ ചെയ്യണോ അതോ പുതിയത് വാങ്ങണോ എന്ന് കൃത്യമായി കണക്കുകൂട്ടാൻ സഹായിക്കുന്ന ടൂൾ.",
    "h1": "റിപ്പയർ vs റീപ്ലേസ് ഡിസിഷൻ കാൽക്കുലേറ്റർ",
    "subtitle": "പഴയ ഉപകരണം നന്നാക്കണോ പുതിയത് വാങ്ങണോ എന്ന് കൃത്യമായ സാമ്പത്തിക വിശകലനത്തിലൂടെ കണ്ടെത്തുക.",
    "introText": "പണച്ചെലവ്, 36 മാസത്തെ ആകെ മെയിന്റനൻസ്, വീണ്ടും കേടാകാനുള്ള സാധ്യത എന്നിവ മുൻനിർത്തി ശരിയായ തീരുമാനം എടുക്കൂ.",
    "steps": {
      "step1": "1. ഉപകരണം & തകരാർ",
      "step2": "2. ചെലവുകൾ",
      "step3": "3. ആയുസ്സും ഭാവിയും",
      "step4": "4. റിസ്കും മുൻഗണനയും",
      "results": "5. അന്തിമ തീരുമാനം"
    },
    "categories": {
      "smartphone": "സ്മാർട്ട്ഫോൺ / മൊബൈൽ",
      "laptop": "ലാപ്‌ടോപ്പ് / പിസി",
      "appliance": "ഹോം അപ്ലയൻസ് (AC, ഫ്രിഡ്ജ്, വാഷിംഗ് മെഷീൻ)",
      "vehicle": "വാഹനം (കാർ, ബൈക്ക്, സ്കൂട്ടർ)",
      "furniture": "ഫർണിച്ചർ",
      "other": "മറ്റു ഉപകരണങ്ങൾ"
    },
    "criticalityLevels": {
      "essential": "അത്യാവശ്യം (ദൈനംദിന വരുമാനത്തിന് അത്യന്താപേക്ഷിതം)",
      "important": "പ്രധാനം (സ്ഥിരമായ ഉപയോഗം)",
      "nice_to_have": "സാധാരണം (എപ്പോഴെങ്കിലും മാത്രം)"
    },
    "riskToleranceLevels": {
      "low": "കുറവ് (വീണ്ടും പണിമുടക്കുകൾ ഒഴിവാക്കാൻ ആഗ്രഹിക്കുന്നു)",
      "medium": "ഇടത്തരം (തുല്യമായ സമീപനം)",
      "high": "കൂടുതൽ (പണം ലാഭിക്കാൻ റിസ്ക് എടുക്കാം)"
    },
    "preferenceOptions": {
      "prefer_repair": "റിപ്പയർ ചെയ്യാൻ താല്പര്യം (പണം ലാഭിക്കാം)",
      "neutral": "സാമ്പത്തിക ലാഭം മാത്രം പ്രധാനം",
      "prefer_replace": "പുതിയത് വാങ്ങാൻ താല്പര്യം (വാറന്റിയും പുതിയ ഫീച്ചറുകളും)"
    },
    "confidenceLevels": {
      "high": "ഉയർന്നത് (കമ്പനി ഒറിജിനൽ സർവീസ് സെന്റർ & പാർട്സുകൾ)",
      "moderate": "ഇടത്തരം (നല്ല ലോക്കൽ വർക്ക്‌ഷോപ്പ്)",
      "low": "കുറവ് (വ്യക്തതയില്ലാത്ത തകരാർ / വ്യാജ പാർട്സുകൾ)"
    },
    "presetsTitle": "ഉദാഹരണങ്ങൾ",
    "presets": {
      "smartphone_screen": "മൊബൈൽ ഫോൺ ഡിസ്‌പ്ലേ തകരാർ",
      "laptop_motherboard": "ലാപ്‌ടോപ്പ് മദർബോർഡ് പ്രശ്നം",
      "ac_compressor": "സ്പ്ലിറ്റ് എസി കംപ്രസ്സർ മാറ്റൽ",
      "car_clutch_gearbox": "കാർ ക്ലച്ച് & ഗിയർബോക്സ് ഓവർഹോൾ",
      "sofa_re_upholstery": "സോഫ റി-അപ്ഹോൾസ്റ്ററി"
    },
    "labels": {
      "itemCategory": "ഉപകരണ വിഭാഗം",
      "customItemName": "ഉപകരണത്തിന്റെ പേര്",
      "problemType": "തകരാർ വിവരങ്ങൾ",
      "itemAgeMonths": "ഉപകരണത്തിന്റെ പ്രായം (മാസങ്ങൾ)",
      "originalPrice": "വാങ്ങിയ വില (₹)",
      "resaleValue": "നിലവിലെ റീസെയിൽ / സ്ക്രാപ്പ് വില (₹)",
      "repairCost": "റിപ്പയർ ചെയ്യാനുള്ള ചെലവ് (₹)",
      "repairVisits": "വർക്ക്ഷോപ്പ് സന്ദർശനങ്ങൾ",
      "repairDowntimeHours": "ഉപകരണം ഇല്ലാത്ത ദിവസങ്ങൾ / മണിക്കൂറുകൾ",
      "hourlyRate": "നിങ്ങളുടെ സമയമൂല്യം (₹/മണിക്കൂർ, ഐച്ഛികം)",
      "replacementPrice": "പുതിയതിന്റെ വില (₹)",
      "additionalReplacementCost": "അധിക ഫിറ്റിംഗ് ചെലവ് (₹)",
      "repairLifeMonths": "റിപ്പയറിന് ശേഷം പ്രതീക്ഷിക്കുന്ന ആയുസ്സ് (മാസങ്ങൾ)",
      "replacementLifeMonths": "പുതിയ ഉപകരണത്തിന്റെ ആയുസ്സ് (മാസങ്ങൾ)",
      "repairMonthlyMaintenance": "റിപ്പയർ ചെയ്തതിന്റെ മാസ മെയിന്റനൻസ് (₹)",
      "replacementMonthlyMaintenance": "പുതിയതിന്റെ മാസ മെയിന്റനൻസ് (₹)",
      "criticality": "നിങ്ങളുടെ ജീവിതത്തിൽ ഇതിന്റെ പ്രാധാന്യം",
      "riskTolerance": "നിങ്ങളുടെ റിസ്ക് പരിധി",
      "personalPreference": "വ്യക്തിഗത താല്പര്യം",
      "repairConfidence": "സർവീസ് ക്വാളിറ്റിയിലുള്ള വിശ്വാസം",
      "calculateButton": "തീരുമാനം കണ്ടെത്തൂ",
      "resultsTitle": "തീരുമാനം & വിശകലനം",
      "recommendation": "നിർദ്ദേശം",
      "breakEven": "ബ്രേക്ക്-ഈവൻ കാലയളവ്",
      "breakEvenDesc": "റിപ്പയർ ചെയ്ത ചെലവ് മുതലാവാൻ ഉപകരണം എത്ര മാസം നിലനിൽക്കണം.",
      "horizonAnalysis": "36 മാസത്തെ ആകെ ചെലവ് താരതമ്യം",
      "cashDifference": "സാമ്പത്തിക വ്യത്യാസം",
      "riskAdjustedCost": "റിസ്ക് കണക്കാക്കിയ റിപ്പയർ ചെലവ്",
      "downtimeCost": "സമയനഷ്ടവും ബുദ്ധിമുട്ടും",
      "timeLossTitle": "സമയനഷ്ടത്തിന്റെ ആഘാതം",
      "saveDecision": "ഈ തീരുമാനം സേവ് ചെയ്യുക",
      "savedDecisions": "സേവ് ചെയ്ത വിവരങ്ങൾ",
      "exportPng": "PNG കാർഡ് ഡൗൺലോഡ്",
      "share": "പങ്കുവെക്കുക",
      "copied": "വിവരങ്ങൾ കോപ്പി ചെയ്തു!",
      "copySummary": "കോപ്പി ചെയ്യുക",
      "resetAll": "റീസെറ്റ് ചെയ്യുക",
      "howItWorks": "ഈ കാൽക്കുലേറ്റർ എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
      "rule50Percent": "50% റൂൾ നിയമം",
      "rule50PercentDesc": "റിപ്പയർ തുക പുതിയതിന്റെ 50 ശതമാനത്തിൽ കൂടുതലാണെങ്കിൽ പുതിയത് വാങ്ങുന്നതാണ് ഉചിതം.",
      "disclaimer": "ഇത് സാമ്പത്തിക വിവരങ്ങളുടെ അടിസ്ഥാനത്തിലുള്ള നിർദ്ദേശം മാത്രമാണ്. വിദഗ്ദ്ധ മെക്കാനിക്കിന്റെ അഭിപ്രായം തേടുക.",
      "privacyNotice": "100% സ്വകാര്യം: നിങ്ങളുടെ വിവരങ്ങൾ നിങ്ങളുടെ ഫോണിൽ മാത്രം സൂക്ഷിക്കുന്നു."
    },
    "verdicts": {
      "repairTitle": "നിർദ്ദേശം: റിപ്പയർ ചെയ്യുക (REPAIR)",
      "repairDesc": "സാമ്പത്തികമായി ലാഭകരം നന്നാക്കി ഉപയോഗിക്കുന്നതാണ്. ചെലവ് ന്യായമായ പരിധിയിലാണ്.",
      "replaceTitle": "നിർദ്ദേശം: പുതിയത് വാങ്ങുക (REPLACE)",
      "replaceDesc": "പുതിയത് വാങ്ങുന്നതാണ് കൂടുതൽ ബുദ്ധിപരം. വലിയ റിപ്പയർ ചെലവും വീണ്ടും കേടാകാനുള്ള സാധ്യതയും കൂടുതൽ പണച്ചെലവുണ്ടാക്കും.",
      "waitTitle": "നിർദ്ദേശം: കുറച്ചുകൂടി നിരീക്ഷിച്ച് തീരുമാനിക്കുക",
      "waitDesc": "രണ്ടു വഴികൾക്കും തുല്യ സാമ്പത്തിക സാധ്യതയാണുള്ളത്. മറ്റൊരു ടെക്നീഷ്യന്റെ അഭിപ്രായം തേടുകയോ ഓഫറുകൾക്കായി കാത്തിരിക്കുകയോ ചെയ്യാം."
    },
    "faqs": [
      {
        "question": "എന്താണ് 50% റൂൾ?",
        "answer": "പഴയ ഉപകരണം നന്നാക്കാനുള്ള തുക പുതിയ ഒരെണ്ണം വാങ്ങാനുള്ള വിലയുടെ 50%ൽ കൂടുതലാണെങ്കിൽ പുതിയത് വാങ്ങുന്നതാണ് നല്ലത്."
      }
    ]
  },
  "ta": {
    "locale": "ta",
    "localeName": "Tamil",
    "dir": "ltr",
    "title": "பழுதுபார்ப்பு vs புதியது வாங்குதல் கால்குலேட்டர் | IndiaTools",
    "metaDescription": "பழுதுபார்ப்பு vs புதியது வாங்குதல் கால்குலேட்டர். பழுதுபார்ப்பு vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Tamil.",
    "h1": "பழுதுபார்ப்பு vs புதியது வாங்குதல் கால்குலேட்டர்",
    "subtitle": "பழுதுபார்ப்பு vs புதியது வாங்குதல் கால்குலேட்டர் – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (தமிழ்)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "பழுதுபார்ப்பு / Replace Calculate",
      "resultsTitle": "பழுதுபார்ப்பு Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Tamil Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "te": {
    "locale": "te",
    "localeName": "Telugu",
    "dir": "ltr",
    "title": "మరమ్మత్తు vs కొత్తది కొనుగోలు కాలిక్యులేటర్ | IndiaTools",
    "metaDescription": "మరమ్మత్తు vs కొత్తది కొనుగోలు కాలిక్యులేటర్. మరమ్మత్తు vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Telugu.",
    "h1": "మరమ్మత్తు vs కొత్తది కొనుగోలు కాలిక్యులేటర్",
    "subtitle": "మరమ్మత్తు vs కొత్తది కొనుగోలు కాలిక్యులేటర్ – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (తెలుగు)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "మరమ్మత్తు / Replace Calculate",
      "resultsTitle": "మరమ్మత్తు Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Telugu Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "kn": {
    "locale": "kn",
    "localeName": "Kannada",
    "dir": "ltr",
    "title": "ರಿಪೇರಿ vs ಹೊಸದನ್ನು ಖರೀದಿಸುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | IndiaTools",
    "metaDescription": "ರಿಪೇರಿ vs ಹೊಸದನ್ನು ಖರೀದಿಸುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್. ರಿಪೇರಿ vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Kannada.",
    "h1": "ರಿಪೇರಿ vs ಹೊಸದನ್ನು ಖರೀದಿಸುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    "subtitle": "ರಿಪೇರಿ vs ಹೊಸದನ್ನು ಖರೀದಿಸುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್ – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (ಕನ್ನಡ)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "ರಿಪೇರಿ / Replace Calculate",
      "resultsTitle": "ರಿಪೇರಿ Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Kannada Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "bn": {
    "locale": "bn",
    "localeName": "Bengali",
    "dir": "ltr",
    "title": "মেরামত বনাম নতুন কেনা ক্যালকুলেটর | IndiaTools",
    "metaDescription": "মেরামত বনাম নতুন কেনা ক্যালকুলেটর. মেরামত vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Bengali.",
    "h1": "মেরামত বনাম নতুন কেনা ক্যালকুলেটর",
    "subtitle": "মেরামত বনাম নতুন কেনা ক্যালকুলেটর – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (বাংলা)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "মেরামত / Replace Calculate",
      "resultsTitle": "মেরামত Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Bengali Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "mr": {
    "locale": "mr",
    "localeName": "Marathi",
    "dir": "ltr",
    "title": "दुरुस्ती विरुद्ध नवीन खरेदी कॅल्क्युलेटर | IndiaTools",
    "metaDescription": "दुरुस्ती विरुद्ध नवीन खरेदी कॅल्क्युलेटर. दुरुस्ती vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Marathi.",
    "h1": "दुरुस्ती विरुद्ध नवीन खरेदी कॅल्क्युलेटर",
    "subtitle": "दुरुस्ती विरुद्ध नवीन खरेदी कॅल्क्युलेटर – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (मराठी)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "दुरुस्ती / Replace Calculate",
      "resultsTitle": "दुरुस्ती Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Marathi Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "gu": {
    "locale": "gu",
    "localeName": "Gujarati",
    "dir": "ltr",
    "title": "રીપેર વિરુદ્ધ નવું ખરીદવું કેલ્ક્યુલેટર | IndiaTools",
    "metaDescription": "રીપેર વિરુદ્ધ નવું ખરીદવું કેલ્ક્યુલેટર. રીપેર vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Gujarati.",
    "h1": "રીપેર વિરુદ્ધ નવું ખરીદવું કેલ્ક્યુલેટર",
    "subtitle": "રીપેર વિરુદ્ધ નવું ખરીદવું કેલ્ક્યુલેટર – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (ગુજરાતી)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "રીપેર / Replace Calculate",
      "resultsTitle": "રીપેર Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Gujarati Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "pa": {
    "locale": "pa",
    "localeName": "Punjabi",
    "dir": "ltr",
    "title": "ਮੁਰੰਮਤ ਬਨਾਮ ਨਵਾਂ ਖਰੀਦਣ ਦਾ ਕੈਲਕੁਲੇਟਰ | IndiaTools",
    "metaDescription": "ਮੁਰੰਮਤ ਬਨਾਮ ਨਵਾਂ ਖਰੀਦਣ ਦਾ ਕੈਲਕੁਲੇਟਰ. ਮੁਰੰਮਤ vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Punjabi.",
    "h1": "ਮੁਰੰਮਤ ਬਨਾਮ ਨਵਾਂ ਖਰੀਦਣ ਦਾ ਕੈਲਕੁਲੇਟਰ",
    "subtitle": "ਮੁਰੰਮਤ ਬਨਾਮ ਨਵਾਂ ਖਰੀਦਣ ਦਾ ਕੈਲਕੁਲੇਟਰ – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (ਪੰਜਾਬੀ)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "ਮੁਰੰਮਤ / Replace Calculate",
      "resultsTitle": "ਮੁਰੰਮਤ Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Punjabi Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "or": {
    "locale": "or",
    "localeName": "Odia",
    "dir": "ltr",
    "title": "ମରାମତି ବନାମ ନୂଆ କିଣିବା କ୍ୟାଲକୁଲେଟର | IndiaTools",
    "metaDescription": "ମରାମତି ବନାମ ନୂଆ କିଣିବା କ୍ୟାଲକୁଲେଟର. ମରାମତି vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Odia.",
    "h1": "ମରାମତି ବନାମ ନୂଆ କିଣିବା କ୍ୟାଲକୁଲେଟର",
    "subtitle": "ମରାମତି ବନାମ ନୂଆ କିଣିବା କ୍ୟାଲକୁଲେଟର – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (ଓଡ଼ିଆ)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "ମରାମତି / Replace Calculate",
      "resultsTitle": "ମରାମତି Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Odia Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "as": {
    "locale": "as",
    "localeName": "Assamese",
    "dir": "ltr",
    "title": "মেৰামতি বনাম নতুন ক্ৰয় কেলকুলেটৰ | IndiaTools",
    "metaDescription": "মেৰামতি বনাম নতুন ক্ৰয় কেলকুলেটৰ. মেৰামতি vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Assamese.",
    "h1": "মেৰামতি বনাম নতুন ক্ৰয় কেলকুলেটৰ",
    "subtitle": "মেৰামতি বনাম নতুন ক্ৰয় কেলকুলেটৰ – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (অসমীয়া)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "মেৰামতি / Replace Calculate",
      "resultsTitle": "মেৰামতি Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Assamese Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "ur": {
    "locale": "ur",
    "localeName": "Urdu",
    "dir": "rtl",
    "title": "مرمت بمقابلہ نیا خریدنا کیلکولیٹر | IndiaTools",
    "metaDescription": "مرمت بمقابلہ نیا خریدنا کیلکولیٹر. مرمت vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Urdu.",
    "h1": "مرمت بمقابلہ نیا خریدنا کیلکولیٹر",
    "subtitle": "مرمت بمقابلہ نیا خریدنا کیلکولیٹر – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. چیز اور خرابی",
      "step2": "2. اخراجات",
      "step3": "3. عمر اور مستقبل",
      "step4": "4. ترجیحات",
      "results": "5. فیصلہ"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (اردو)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "مرمت / Replace Calculate",
      "resultsTitle": "مرمت Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Urdu Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "sa": {
    "locale": "sa",
    "localeName": "Sanskrit",
    "dir": "ltr",
    "title": "परिमार्जनं वा नूतनक्रयणं वा निर्णयगणकम् | IndiaTools",
    "metaDescription": "परिमार्जनं वा नूतनक्रयणं वा निर्णयगणकम्. परिमार्जनम् vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Sanskrit.",
    "h1": "परिमार्जनं वा नूतनक्रयणं वा निर्णयगणकम्",
    "subtitle": "परिमार्जनं वा नूतनक्रयणं वा निर्णयगणकम् – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (संस्कृतम्)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "परिमार्जनम् / Replace Calculate",
      "resultsTitle": "परिमार्जनम् Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Sanskrit Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "kok": {
    "locale": "kok",
    "localeName": "Konkani",
    "dir": "ltr",
    "title": "दुरुस्ती विरूध्द नवें घेवप कॅल्क्युलेटर | IndiaTools",
    "metaDescription": "दुरुस्ती विरूध्द नवें घेवप कॅल्क्युलेटर. दुरुस्ती vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Konkani.",
    "h1": "दुरुस्ती विरूध्द नवें घेवप कॅल्क्युलेटर",
    "subtitle": "दुरुस्ती विरूध्द नवें घेवप कॅल्क्युलेटर – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (कोंकणी)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "दुरुस्ती / Replace Calculate",
      "resultsTitle": "दुरुस्ती Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Konkani Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "mai": {
    "locale": "mai",
    "localeName": "Maithili",
    "dir": "ltr",
    "title": "मरम्मत बनाम नव क्रय कैलकुलेटर | IndiaTools",
    "metaDescription": "मरम्मत बनाम नव क्रय कैलकुलेटर. मरम्मत vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Maithili.",
    "h1": "मरम्मत बनाम नव क्रय कैलकुलेटर",
    "subtitle": "मरम्मत बनाम नव क्रय कैलकुलेटर – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (मैथिली)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "मरम्मत / Replace Calculate",
      "resultsTitle": "मरम्मत Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Maithili Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "ne": {
    "locale": "ne",
    "localeName": "Nepali",
    "dir": "ltr",
    "title": "मर्मत वा नयाँ खरिद निर्णय क्याल्कुलेटर | IndiaTools",
    "metaDescription": "मर्मत वा नयाँ खरिद निर्णय क्याल्कुलेटर. मर्मत vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Nepali.",
    "h1": "मर्मत वा नयाँ खरिद निर्णय क्याल्कुलेटर",
    "subtitle": "मर्मत वा नयाँ खरिद निर्णय क्याल्कुलेटर – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (नेपाली)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "मर्मत / Replace Calculate",
      "resultsTitle": "मर्मत Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Nepali Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "ks": {
    "locale": "ks",
    "localeName": "Kashmiri",
    "dir": "rtl",
    "title": "مرمت یا نوٚو خریدنُک کیلکولیٹر | IndiaTools",
    "metaDescription": "مرمت یا نوٚو خریدنُک کیلکولیٹر. مرمت vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Kashmiri.",
    "h1": "مرمت یا نوٚو خریدنُک کیلکولیٹر",
    "subtitle": "مرمت یا نوٚو خریدنُک کیلکولیٹر – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. چیز اور خرابی",
      "step2": "2. اخراجات",
      "step3": "3. عمر اور مستقبل",
      "step4": "4. ترجیحات",
      "results": "5. فیصلہ"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (कॉशुर / کٲشُر)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "مرمت / Replace Calculate",
      "resultsTitle": "مرمت Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Kashmiri Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "sd": {
    "locale": "sd",
    "localeName": "Sindhi",
    "dir": "rtl",
    "title": "مرمت بمقابله نئون خريدڻ جو ڪيلڪيوليٽر | IndiaTools",
    "metaDescription": "مرمت بمقابله نئون خريدڻ جو ڪيلڪيوليٽر. مرمت vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Sindhi.",
    "h1": "مرمت بمقابله نئون خريدڻ جو ڪيلڪيوليٽر",
    "subtitle": "مرمت بمقابله نئون خريدڻ جو ڪيلڪيوليٽر – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. چیز اور خرابی",
      "step2": "2. اخراجات",
      "step3": "3. عمر اور مستقبل",
      "step4": "4. ترجیحات",
      "results": "5. فیصلہ"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (سنڌي / सिन्धी)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "مرمت / Replace Calculate",
      "resultsTitle": "مرمت Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Sindhi Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "doi": {
    "locale": "doi",
    "localeName": "Dogri",
    "dir": "ltr",
    "title": "मरम्मत बनाम नमां खरीदो कैलकुलेटर | IndiaTools",
    "metaDescription": "मरम्मत बनाम नमां खरीदो कैलकुलेटर. मरम्मत vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Dogri.",
    "h1": "मरम्मत बनाम नमां खरीदो कैलकुलेटर",
    "subtitle": "मरम्मत बनाम नमां खरीदो कैलकुलेटर – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (डोगरी)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "मरम्मत / Replace Calculate",
      "resultsTitle": "मरम्मत Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Dogri Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "mni": {
    "locale": "mni",
    "localeName": "Manipuri (Meitei)",
    "dir": "ltr",
    "title": "শেমজিনবা নত্রগা অনৌবা লৈবা ৱারেপ কেলকুলেটর | IndiaTools",
    "metaDescription": "শেমজিনবা নত্রগা অনৌবা লৈবা ৱারেপ কেলকুলেটর. শেমজিনবা vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Manipuri (Meitei).",
    "h1": "শেমজিনবা নত্রগা অনৌবা লৈবা ৱারেপ কেলকুলেটর",
    "subtitle": "শেমজিনবা নত্রগা অনৌবা লৈবা ৱারেপ কেলকুলেটর – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (মৈতৈলোন্)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "শেমজিনবা / Replace Calculate",
      "resultsTitle": "শেমজিনবা Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Manipuri (Meitei) Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "brx": {
    "locale": "brx",
    "localeName": "Bodo",
    "dir": "ltr",
    "title": "फाहामनाय एबा गोदान बायनाय सानखान्थि | IndiaTools",
    "metaDescription": "फाहामनाय एबा गोदान बायनाय सानखान्थि. फाहामनाय vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Bodo.",
    "h1": "फाहामनाय एबा गोदान बायनाय सानखान्थि",
    "subtitle": "फाहामनाय एबा गोदान बायनाय सानखान्थि – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (बर’)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "फाहामनाय / Replace Calculate",
      "resultsTitle": "फाहामनाय Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Bodo Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  },
  "sat": {
    "locale": "sat",
    "localeName": "Santali",
    "dir": "ltr",
    "title": "ᱡᱩᱛ ᱥᱮ ᱱᱟᱣᱟ ᱦᱟᱛᱟᱣ ᱴᱩᱞ | IndiaTools",
    "metaDescription": "ᱡᱩᱛ ᱥᱮ ᱱᱟᱣᱟ ᱦᱟᱛᱟᱣ ᱴᱩᱞ. ᱡᱩᱛ vs Replace analytics for smartphones, laptops, appliances, vehicles, and furniture in Santali.",
    "h1": "ᱡᱩᱛ ᱥᱮ ᱱᱟᱣᱟ ᱦᱟᱛᱟᱣ ᱴᱩᱞ",
    "subtitle": "ᱡᱩᱛ ᱥᱮ ᱱᱟᱣᱟ ᱦᱟᱛᱟᱣ ᱴᱩᱞ – 100% Private, Data-driven Decision Engine.",
    "introText": "Accurate financial lifecycle assessment to help you decide between repair and replacement. Evaluates 36-month total cost of ownership and break-even timeline.",
    "steps": {
      "step1": "1. Item & Issue",
      "step2": "2. Costs & Budget",
      "step3": "3. Lifespan & Future",
      "step4": "4. Risk & Preferences",
      "results": "5. Verdict"
    },
    "categories": {
      "smartphone": "Smartphone / Mobile",
      "laptop": "Laptop / PC",
      "appliance": "Home Appliance (AC, Fridge, Washing Machine)",
      "vehicle": "Vehicle (Car, Scooter, Bike)",
      "furniture": "Furniture & Living",
      "other": "Other Equipment"
    },
    "criticalityLevels": {
      "essential": "Essential (Daily work / livelihood dependent)",
      "important": "Important (Regular daily use)",
      "nice_to_have": "Nice to have (Casual / occasional use)"
    },
    "riskToleranceLevels": {
      "low": "Low (Prefer peace of mind, avoid repeat breakdowns)",
      "medium": "Medium (Balanced approach)",
      "high": "High (Willing to take chances to save money)"
    },
    "preferenceOptions": {
      "prefer_repair": "Prefer Repair (Budget saving / eco-friendly)",
      "neutral": "Neutral (Purely best economic decision)",
      "prefer_replace": "Prefer Replace (Want modern features / warranty)"
    },
    "confidenceLevels": {
      "high": "High (Certified brand center / genuine OEM parts)",
      "moderate": "Moderate (Reputable local third-party repair)",
      "low": "Low (Uncertain diagnosis / unknown parts)"
    },
    "presetsTitle": "Quick Presets",
    "presets": {
      "smartphone_screen": "Smartphone Broken AMOLED Screen",
      "laptop_motherboard": "Laptop Power / Motherboard Failure",
      "ac_compressor": "Split AC Compressor Replacement",
      "car_clutch_gearbox": "Car Clutch & Gearbox Overhaul",
      "sofa_re_upholstery": "Sofa Re-upholstery & Cushioning"
    },
    "labels": {
      "itemCategory": "Item Category (ᱥᱟᱱᱛᱟᱲᱤ)",
      "customItemName": "Custom Item Name",
      "problemType": "Problem / Failure Description",
      "itemAgeMonths": "Current Item Age (Months)",
      "originalPrice": "Original Purchase Price (₹)",
      "resaleValue": "Current Resale / Scrap Value (₹)",
      "repairCost": "Estimated Repair Cost (₹)",
      "repairVisits": "Expected Service Trips / Visits",
      "repairDowntimeHours": "Estimated Downtime (Days / Hours Without Item)",
      "hourlyRate": "Your Value of Time (₹/hour, Optional)",
      "replacementPrice": "New Replacement Price (₹)",
      "additionalReplacementCost": "Extra Setup / Accessories Cost (₹)",
      "repairLifeMonths": "Expected Life After Repair (Months)",
      "replacementLifeMonths": "Expected Life of New Item (Months)",
      "repairMonthlyMaintenance": "Est. Monthly Maintenance - Repaired Item (₹)",
      "replacementMonthlyMaintenance": "Est. Monthly Maintenance - New Item (₹)",
      "criticality": "Item Criticality to Your Life",
      "riskTolerance": "Your Risk Tolerance",
      "personalPreference": "Personal Preference",
      "repairConfidence": "Repair Shop Confidence & Part Quality",
      "calculateButton": "ᱡᱩᱛ / Replace Calculate",
      "resultsTitle": "ᱡᱩᱛ Decision Results",
      "recommendation": "Recommendation",
      "breakEven": "Break-Even Period",
      "breakEvenDesc": "Time the repaired item must survive to economically justify the repair cost vs buying new.",
      "horizonAnalysis": "36-Month Horizon Lifecycle Comparison",
      "cashDifference": "Net Financial Difference",
      "riskAdjustedCost": "Risk-Adjusted Repair Outlay",
      "downtimeCost": "Inconvenience & Time Value",
      "timeLossTitle": "Time & Hassle Impact",
      "saveDecision": "Save This Decision",
      "savedDecisions": "Saved Decisions History",
      "exportPng": "Export PNG Decision Card",
      "share": "Share Verdict",
      "copied": "Summary copied to clipboard!",
      "copySummary": "Copy Summary",
      "resetAll": "Reset Form",
      "howItWorks": "How the Algorithm Computes Your Decision",
      "rule50Percent": "The 50% Rule Benchmark",
      "rule50PercentDesc": "If repair exceeds 50% of the replacement price AND item has surpassed 50% of typical lifespan, replacement is generally recommended.",
      "disclaimer": "This tool provides indicative financial projections. Always consult an authorized technician before high-voltage or vehicle safety repairs.",
      "privacyNotice": "100% Private In-Browser Calculation: No financial or personal data ever leaves your device."
    },
    "verdicts": {
      "repairTitle": "RECOMMENDATION: REPAIR",
      "repairDesc": "Economically sound choice with high expected savings. The initial repair is well within budget thresholds and delivers adequate remaining life.",
      "replaceTitle": "RECOMMENDATION: REPLACE",
      "replaceDesc": "Buying new is the superior long-term decision. High repair cost, cumulative maintenance, and elevated failure probability make repairing uneconomical.",
      "waitTitle": "RECOMMENDATION: WAIT & MONITOR / RE-EVALUATE",
      "waitDesc": "The economics are borderline between repair and replace. Consider minor workarounds, obtain a second repair quote, or defer until major discounts occur."
    },
    "faqs": [
      {
        "question": "How does the Santali Repair vs Replace decision work?",
        "answer": "It compares initial cash expense, failure risk probability, time value, and 36-month equalized lifecycle costs to deliver a completely unbiased recommendation."
      },
      {
        "question": "Is my financial or product data private?",
        "answer": "Yes, 100% private. All computations run in your web browser. No inputs or results are uploaded to servers."
      }
    ]
  }
}

export function getRepairToolTranslation(code: string): RepairToolContent {
  if (isRepairLocale(code)) {
    return REPAIR_TOOL_I18N[code]
  }
  return REPAIR_TOOL_I18N.en
}
