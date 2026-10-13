export type { ScannerLocale } from './types'
import { ScannerLocale } from './types'

export interface ScannerTranslation {
  title: string
  subtitle: string
  badgeFree: string
  badgePrivate: string
  badgeEngine: string
  dropTitle: string
  dropHint: string
  openCamera: string
  autoDetect: string
  resetCorners: string
  processWarp: string
  warping: string
  detecting: string
  filterColor: string
  filterMagic: string
  filterGray: string
  filterOriginal: string
  downloadPdf: string
  downloadImage: string
  retake: string
  adjustCorners: string
  exportOptions: string
  resolution: string
  faqs: Array<{ q: string; a: string }>
}

export const SCANNER_LOCALES: Record<
  ScannerLocale,
  { name: string; nativeName: string; code: ScannerLocale }
> = {
  en: { name: 'English', nativeName: 'English', code: 'en' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', code: 'te' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', code: 'bn' },
}

export const SCANNER_TRANSLATIONS: Record<ScannerLocale, ScannerTranslation> = {
  en: {
    title: 'Smart Document Scanner & Perspective Warp',
    subtitle: 'Auto-detect paper boundaries, un-skew angled photos with 4-point projective homography, and enhance text with CamScanner-style filters. 100% private in-browser computer vision.',
    badgeFree: '100% Free & Unlimited',
    badgePrivate: 'Zero Upload • 100% Private',
    badgeEngine: 'Client-Side CV Engine',
    dropTitle: 'Drop document photo here or click to browse',
    dropHint: 'Supports high-res JPG, PNG, WebP (Mobile camera shots, receipts, bills, certificates, ID cards)',
    openCamera: 'Scan with Camera',
    autoDetect: 'Auto-Detect Edges',
    resetCorners: 'Reset Boundary',
    processWarp: 'Straighten & Warp Document',
    warping: 'Warping Projective Geometry...',
    detecting: 'Scanning Edges with Sobel Gradient...',
    filterColor: 'Color Document',
    filterMagic: 'B&W Magic (Shadow Eraser)',
    filterGray: 'Grayscale Photocopy',
    filterOriginal: 'Original Raw',
    downloadPdf: 'Download Clean PDF (A4)',
    downloadImage: 'Download Image',
    retake: 'Scan Another Page',
    adjustCorners: 'Drag the 4 corner handles with the magnified loupe for pixel-perfect edge alignment',
    exportOptions: 'Export Settings & Filter Mode',
    resolution: 'Resolution',
    faqs: [
      {
        q: 'How does the perspective warp straighten angled documents?',
        a: 'The engine solves an 8-variable projective homography matrix between the 4 selected corner pins and a perfect rectangle. It backward-maps every destination pixel using sub-pixel bilinear interpolation, eliminating perspective distortion without blurring.'
      },
      {
        q: 'Does it remove shadows and table backgrounds?',
        a: 'Yes. The B&W Magic Filter calculates local background luminance across the document using fast integral-image spatial filtering, bleaching out uneven room shadows while boosting ink contrast.'
      },
      {
        q: 'Are any document photos uploaded to a cloud server?',
        a: 'Never. All computer vision, Canny/Sobel edge detection, homography matrix math, and PDF generation execute 100% locally in your device memory via HTML5 Canvas.'
      },
      {
        q: 'Can I scan multi-page documents directly using my phone camera?',
        a: 'Yes. Tap "Scan with Camera" on any mobile browser or laptop webcam to capture photos directly without third-party app installations.'
      }
    ]
  },
  ml: {
    title: 'സ്മാർട്ട് ഡോക്യുമെന്റ് സ്കാനർ & പെർസ്പെക്റ്റീവ് വാർപ്പ്',
    subtitle: 'മൊബൈലിൽ എടുത്ത ചരിഞ്ഞ ഫോട്ടോകൾ നേരെയാക്കാനും, നിഴലുകൾ മാറ്റി വ്യക്തമായ സ്കാൻ കോപ്പിയാക്കാനും ഉള്ള ബ്രൗസർ അധിഷ്ഠിത ടൂൾ. 100% സുരക്ഷിതം.',
    badgeFree: '100% സൗജന്യം & പരിധിയില്ലാത്തത്',
    badgePrivate: 'സീറോ അപ്‌ലോഡ് • 100% പ്രൈവറ്റ്',
    badgeEngine: 'ബ്രൗസർ CV എഞ്ചിൻ',
    dropTitle: 'ഡോക്യുമെന്റ് ഫോട്ടോ ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക',
    dropHint: 'മൊബൈൽ ഫോട്ടോകൾ, സർട്ടിഫിക്കറ്റുകൾ, ബില്ലുകൾ, ഐഡി കാർഡുകൾ എന്നിവ പിന്തുണയ്ക്കുന്നു',
    openCamera: 'ക്യാമറ വഴി സ്കാൻ ചെയ്യുക',
    autoDetect: 'ഓട്ടോ-ഡിറ്റക്റ്റ് അരികുകൾ',
    resetCorners: 'അതിരുകൾ പുനഃക്രമീകരിക്കുക',
    processWarp: 'ഡോക്യുമെന്റ് നേരെയാക്കുക',
    warping: 'പ്രോസസ്സിംഗ് നടക്കുന്നു...',
    detecting: 'അതിരുകൾ കണ്ടെത്തുന്നു...',
    filterColor: 'കളർ ഡോക്യുമെന്റ്',
    filterMagic: 'ബി&ഡബ്ല്യു മാജിക് (നിഴൽ മാറ്റൽ)',
    filterGray: 'ഫോട്ടോസ്റ്റാറ്റ് കോപ്പി',
    filterOriginal: 'യഥാർത്ഥ ഫോട്ടോ',
    downloadPdf: 'ക്ലീൻ PDF ഡൗൺലോഡ് ചെയ്യുക',
    downloadImage: 'ചിത്രമായി ഡൗൺലോഡ് ചെയ്യുക',
    retake: 'മറ്റൊരു പേജ് സ്കാൻ ചെയ്യുക',
    adjustCorners: 'കൃത്യത ഉറപ്പാക്കാൻ 4 കോണുകൾ ഡ്രാഗ് ചെയ്ത് അഡ്ജസ്റ്റ് ചെയ്യുക',
    exportOptions: 'എക്‌സ്‌പോർട്ട് ഓപ്ഷനുകൾ',
    resolution: 'റെസല്യൂഷൻ',
    faqs: [
      {
        q: 'ചരിഞ്ഞ ഫോട്ടോകൾ എങ്ങനെ നേരെയാക്കാം?',
        a: 'ഹോമോഗ്രഫി മാട്രിക്സ് കണക്കുകൂട്ടലുകൾ ഉപയോഗിച്ച് ചരിഞ്ഞ നാല് കോണുകൾ തിരിച്ചറിഞ്ഞ് കൃത്യമായ ചതുരാകൃതിയിലേക്ക് മാറ്റുന്നു.'
      },
      {
        q: 'എന്റെ രേഖകൾ സെർവറിലേക്ക് അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നുണ്ടോ?',
        a: 'ഇല്ല. നിങ്ങളുടെ ഫോട്ടോകൾ പൂർണ്ണമായും നിങ്ങളുടെ ഫോണിലോ കമ്പ്യൂട്ടറിലോ മാത്രമാണ് പ്രോസസ്സ് ചെയ്യുന്നത്.'
      }
    ]
  },
  hi: {
    title: 'स्मार्ट डॉक्यूमेंट स्कैनर और पर्सपेक्टिव वार्प',
    subtitle: 'तिरछी तस्वीरों को सीधा करें, किनारों को पहचानें और छाया हटाकर साफ स्कैन कॉपी बनाएं। 100% सुरक्षित और इन-ब्राउज़र।',
    badgeFree: '100% मुफ्त और असीमित',
    badgePrivate: 'शून्य अपलोड • 100% निजी',
    badgeEngine: 'क्लाइंट-साइड सीवी इंजन',
    dropTitle: 'डॉक्यूमेंट फोटो यहाँ छोड़ें या चुनें',
    dropHint: 'मोबाइल तस्वीरें, रसीदें, प्रमाण पत्र, आधार/आईडी कार्ड समर्थित',
    openCamera: 'कैमरे से स्कैन करें',
    autoDetect: 'किनारे स्वतः पहचानें',
    resetCorners: 'सीमा रीसेट करें',
    processWarp: 'दस्तावेज़ सीधा और क्रॉप करें',
    warping: 'दस्तावेज़ सीधा हो रहा है...',
    detecting: 'किनारों की पहचान हो रही है...',
    filterColor: 'रंगीन दस्तावेज़',
    filterMagic: 'बी&डब्ल्यू मैजिक (छाया हटाएं)',
    filterGray: 'फोटोकॉपी मोड',
    filterOriginal: 'मूल तस्वीर',
    downloadPdf: 'साफ PDF डाउनलोड करें',
    downloadImage: 'छवि डाउनलोड करें',
    retake: 'नया पेज स्कैन करें',
    adjustCorners: 'सटीक क्रॉप के लिए चारों कोनों को मैग्निफायर से सेट करें',
    exportOptions: 'निर्यात विकल्प व फ़िल्टर',
    resolution: 'रिज़ॉल्यूशन',
    faqs: [
      {
        q: 'यह छाया कैसे हटाता है?',
        a: 'बी&डब्ल्यू मैजिक फिल्टर बैकग्राउंड लाइटिंग को पहचानकर छाया हटा देता है और स्याही को गहरा काला कर देता है।'
      }
    ]
  },
  ta: {
    title: 'ஸ்மார்ட் ஆவண ஸ்கேனர் & முன்னோக்கு வார்ப்',
    subtitle: 'சாய்ந்த புகைப்படங்களை நேராக்கவும், நிழல்களை அகற்றி தெளிவான ஸ்கேன் நகலாக மாற்றவும். 100% இலவசம் மற்றும் தனிப்பட்டது.',
    badgeFree: '100% இலவசம் & வரம்பற்றது',
    badgePrivate: 'பதிவேற்றம் இல்லை • 100% தனிப்பட்டது',
    badgeEngine: 'உலாவி CV என்ஜின்',
    dropTitle: 'ஆவண புகைப்படத்தை இங்கே தேர்ந்தெடுக்கவும்',
    dropHint: 'மொபைல் புகைப்படங்கள், சான்றிதழ்கள், பில்கள் ஆதரிக்கப்படுகின்றன',
    openCamera: 'கேமரா மூலம் ஸ்கேன் செய்',
    autoDetect: 'விளிம்புகளை தானாகக் கண்டறி',
    resetCorners: 'மீட்டமை',
    processWarp: 'ஆவணத்தை நேராக்கு',
    warping: 'செயலாக்குகிறது...',
    detecting: 'விளிம்புகளைத் தேடுகிறது...',
    filterColor: 'வண்ண ஆவணம்',
    filterMagic: 'பி&டபிள்யூ மேஜிக் (நிழல் நீக்கி)',
    filterGray: 'நகல் பயன்முறை',
    filterOriginal: 'அசல் புகைப்படம்',
    downloadPdf: 'PDF பதிவிறக்கவும்',
    downloadImage: 'படத்தை பதிவிறக்கவும்',
    retake: 'மற்றொரு பக்கத்தை ஸ்கேன் செய்',
    adjustCorners: 'நான்கு மூலைகளையும் துல்லியமாக நகர்த்தவும்',
    exportOptions: 'ஏற்றுமதி விருப்பங்கள்',
    resolution: 'தெளிவுத்திறன்',
    faqs: [
      {
        q: 'இது எவ்வாறு செயல்படுகிறது?',
        a: 'ஹோமோகிராபி கணிதம் மூலம் சாய்ந்த படங்களை துல்லியமாக நேராக்குகிறது.'
      }
    ]
  },
  te: {
    title: 'స్మార్ట్ డాక్యుమెంట్ స్కానర్ & పర్స్పెక్టివ్ వార్ప్',
    subtitle: 'వంగిన ఫోటోలను నిఠారుగా మార్చండి, నీడలను తొలగించి స్పష్టమైన స్కాన్ కాపీని పొందండి. 100% ప్రైవేట్.',
    badgeFree: '100% ఉచితం & అపరిమితం',
    badgePrivate: 'అప్‌లోడ్ అవసరం లేదు • 100% ప్రైవేట్',
    badgeEngine: 'బ్రౌజర్ CV ఇంజిన్',
    dropTitle: 'డాక్యుమెంట్ ఫోటోను ఇక్కడ ఉంచండి',
    dropHint: 'మొబైల్ ఫోటోలు, సర్టిఫికెట్లు, బిల్లులు సపోర్ట్ చేయబడతాయి',
    openCamera: 'కెమెరాతో స్కాన్ చేయండి',
    autoDetect: 'అంచులను గుర్తించండి',
    resetCorners: 'రీసెట్ చేయండి',
    processWarp: 'డాక్యుమెంట్‌ను నిఠారుగా చేయండి',
    warping: 'ప్రాసెస్ అవుతోంది...',
    detecting: 'అంచుల గుర్తింపు...',
    filterColor: 'కలర్ డాక్యుమెంట్',
    filterMagic: 'బి&డబ్ల్యు మ్యాజిక్ (నీడల తొలగింపు)',
    filterGray: 'ఫోటోకాపీ మోడ్',
    filterOriginal: 'అసలు ఫోటో',
    downloadPdf: 'PDF డౌన్‌లోడ్ చేయండి',
    downloadImage: 'ఇమేజ్ డౌన్‌లోడ్ చేయండి',
    retake: 'మరొక పేజీ స్కాన్ చేయండి',
    adjustCorners: 'నాలుగు మూలలను సరిచేయండి',
    exportOptions: 'ఎగుమతి ఎంపికలు',
    resolution: 'రిజల్యూషన్',
    faqs: [
      {
        q: 'ఇది ఎలా పనిచేస్తుంది?',
        a: 'హోమోగ్రఫీ ప్రొజెక్షన్ ద్వారా వంగిన పేజీలను చదునుగా చేస్తుంది.'
      }
    ]
  },
  kn: {
    title: 'ಸ್ಮಾರ್ಟ್ ಡಾಕ್ಯುಮೆಂಟ್ ಸ್ಕ್ಯಾನರ್ & ಪರ್ಸ್ಪೆಕ್ಟಿವ್ ವಾರ್ಪ್',
    subtitle: 'ಓರೆಯಾದ ಫೋಟೋಗಳನ್ನು ನೇರಗೊಳಿಸಿ, ನೆರಳುಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಸ್ವಚ್ಛವಾದ ಸ್ಕ್ಯಾನ್ ಪ್ರತಿಯನ್ನು ಪಡೆಯಿರಿ.',
    badgeFree: '100% ಉಚಿತ & ಅನಿಯಮಿತ',
    badgePrivate: 'ಯಾವುದೇ ಅಪ್‌ಲೋಡ್ ಇಲ್ಲ • 100% ಖಾಸಗಿ',
    badgeEngine: 'ಬ್ರೌಸರ್ CV ಎಂಜಿನ್',
    dropTitle: 'ಡಾಕ್ಯುಮೆಂಟ್ ಫೋಟೋವನ್ನು ಇಲ್ಲಿ ಬಿಡಿ',
    dropHint: 'ಮೊಬೈಲ್ ಫೋಟೋಗಳು, ಪ್ರಮಾಣಪತ್ರಗಳು, ಬಿಲ್‌ಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ',
    openCamera: 'ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    autoDetect: 'ಅಂಚುಗಳನ್ನು ಸ್ವಯಂ ಪತ್ತೆಹಚ್ಚಿ',
    resetCorners: 'ಮರುಹೊಂದಿಸಿ',
    processWarp: 'ದಾಖಲೆಯನ್ನು ನೇರಗೊಳಿಸಿ',
    warping: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    detecting: 'ಅಂಚುಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    filterColor: 'ಬಣ್ಣದ ದಾಖಲೆ',
    filterMagic: 'ಬಿ&ಡಬ್ಲ್ಯೂ ಮ್ಯಾಜಿಕ್ (ನೆರಳು ತೆಗೆಯುವಿಕೆ)',
    filterGray: 'ಫೋಟೋಕಾಪಿ ಮೋಡ್',
    filterOriginal: 'ಮೂಲ ಫೋಟೋ',
    downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    downloadImage: 'ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    retake: 'ಮತ್ತೊಂದು ಪುಟ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    adjustCorners: 'ನಾಲ್ಕು ಮೂಲೆಗಳನ್ನು ಸರಿಹೊಂದಿಸಿ',
    exportOptions: 'ರಫ್ತು ಆಯ್ಕೆಗಳು',
    resolution: 'ರೆಸಲ್ಯೂಶನ್',
    faqs: [
      {
        q: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
        a: 'ಗಣಿತದ ಪ್ರೊಜೆಕ್ಷನ್ ಮೂಲಕ ಓರೆಯಾದ ಪುಟಗಳನ್ನು ನೇರಗೊಳಿಸುತ್ತದೆ.'
      }
    ]
  },
  bn: {
    title: 'স্মার্ট ডকুমেন্ট স্ক্যানার এবং পারসপেক্টিভ ওয়ার্প',
    subtitle: 'বাঁকা ছবি সোজা করুন, ছায়া দূর করুন এবং পরিষ্কার স্ক্যান কপি তৈরি করুন। ১০০% নিরাপদ ও ব্রাউজার-ভিত্তিক।',
    badgeFree: '১০০% বিনামূল্যে ও সীমাহীন',
    badgePrivate: 'কোনো আপলোড নেই • ১০০% ব্যক্তিগত',
    badgeEngine: 'ক্লায়েন্ট-সাইড সিভি ইঞ্জিন',
    dropTitle: 'ডকুমেন্ট ছবি এখানে ড্রপ করুন',
    dropHint: 'মোবাইল ছবি, সার্টিফিকেট, রসিদ, আইডি কার্ড সমর্থিত',
    openCamera: 'ক্যামেরা দিয়ে স্ক্যান করুন',
    autoDetect: 'প্রান্তগুলি স্বয়ংক্রিয়ভাবে শনাক্ত করুন',
    resetCorners: 'সীমানা পুনরায় সেট করুন',
    processWarp: 'ডকুমেন্ট সোজা ও ক্রপ করুন',
    warping: 'প্রক্রিয়াকরণ চলছে...',
    detecting: 'প্রান্ত শনাক্ত করা হচ্ছে...',
    filterColor: 'রঙিন ডকুমেন্ট',
    filterMagic: 'বি&ডাব্লিউ ম্যাজিক (ছায়া মোছার ফিল্টার)',
    filterGray: 'ফটোকপি মোড',
    filterOriginal: 'আসল ছবি',
    downloadPdf: 'পরিষ্কার PDF ডাউনলোড করুন',
    downloadImage: 'ছবি ডাউনলোড করুন',
    retake: 'আরেকটি পৃষ্ঠা স্ক্যান করুন',
    adjustCorners: 'ম্যাগনিফায়ার দিয়ে চারটি কোণ সুনির্দিষ্ট করুন',
    exportOptions: 'রপ্তানি বিকল্প',
    resolution: 'রেজোলিউশন',
    faqs: [
      {
        q: 'এটি কীভাবে কাজ করে?',
        a: 'হোমোগ্রাফি ম্যাট্রিক্সের সাহায্যে বাঁকা কোণ সোজা ও চারকোনা করে।'
      }
    ]
  }
}

export function getScannerTranslation(locale: ScannerLocale): ScannerTranslation {
  return SCANNER_TRANSLATIONS[locale] || SCANNER_TRANSLATIONS.en
}
