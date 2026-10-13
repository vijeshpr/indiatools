import type { BatchWatermarkLocale } from './types'
export type { BatchWatermarkLocale }

export interface FAQItem {
  q: string
  a: string
}

export interface BatchWatermarkTranslation {
  title: string
  subtitle: string
  badgeFree: string
  badgePrivacy: string
  badgeSpeed: string
  dropTitle: string
  dropSubtitle: string
  dropBrowse: string
  tabText: string
  tabLogo: string
  tabDual: string
  textLabel: string
  fontFamily: string
  fontSize: string
  color: string
  opacity: string
  rotation: string
  shadow: string
  bold: string
  italic: string
  allCaps: string
  tilingLabel: string
  tilingDescription: string
  tileSpacingX: string
  tileSpacingY: string
  positionAnchor: string
  paddingX: string
  paddingY: string
  uploadLogo: string
  changeLogo: string
  logoScale: string
  blendMode: string
  queueTitle: string
  queueCount: string
  clearAll: string
  emptyQueue: string
  selectPhoto: string
  processBatch: string
  processing: string
  downloadZip: string
  downloadCurrent: string
  format: string
  quality: string
  successStatus: string
  readyStatus: string
  errorStatus: string
  anchors: {
    topLeft: string
    topCenter: string
    topRight: string
    midLeft: string
    center: string
    midRight: string
    botLeft: string
    botCenter: string
    botRight: string
  }
  blendModes: {
    normal: string
    multiply: string
    screen: string
    overlay: string
    softLight: string
    hardLight: string
    luminosity: string
    difference: string
  }
  faqs: FAQItem[]
}

export const BATCH_LOCALES: Record<
  BatchWatermarkLocale,
  { name: string; nativeName: string; flag: string }
> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
}

export const BATCH_TRANSLATIONS: Record<BatchWatermarkLocale, BatchWatermarkTranslation> = {
  en: {
    title: 'Batch Image Watermarker & Multi-Stamp Engine',
    subtitle: 'Apply custom text or logo watermarks to hundreds of photos in seconds. 100% private in-browser batch processing with instant ZIP export.',
    badgeFree: '100% Free & Unlimited',
    badgePrivacy: 'Zero Upload • 100% Private',
    badgeSpeed: 'High-Speed Batch Engine',
    dropTitle: 'Drag & drop photos here to batch watermark',
    dropSubtitle: 'Supports JPG, PNG, WebP, AVIF up to 100+ high-res images at once',
    dropBrowse: 'Browse Photos',
    tabText: 'Text Watermark',
    tabLogo: 'Logo Stamp',
    tabDual: 'Dual Stamp',
    textLabel: 'Watermark Text',
    fontFamily: 'Typography Font',
    fontSize: 'Font Scale (%)',
    color: 'Text Color',
    opacity: 'Opacity (%)',
    rotation: 'Rotation Angle',
    shadow: 'Drop Shadow',
    bold: 'Bold',
    italic: 'Italic',
    allCaps: 'ALL CAPS',
    tilingLabel: 'Diagonal Tiling Grid (Anti-Theft)',
    tilingDescription: 'Repeats watermark diagonally across the full image to prevent unauthorized cropping',
    tileSpacingX: 'Horizontal Gap',
    tileSpacingY: 'Vertical Gap',
    positionAnchor: 'Position Anchor (9-Point Grid)',
    paddingX: 'Horizontal Margin (%)',
    paddingY: 'Vertical Margin (%)',
    uploadLogo: 'Upload Brand Logo (PNG / JPG / SVG)',
    changeLogo: 'Change Logo',
    logoScale: 'Logo Scale (%)',
    blendMode: 'Blend Mode',
    queueTitle: 'Batch Photo Queue',
    queueCount: 'images ready',
    clearAll: 'Clear All',
    emptyQueue: 'No images in queue. Upload photos above to preview and process.',
    selectPhoto: 'Click any photo in the queue to preview live',
    processBatch: 'Process Batch',
    processing: 'Processing Images...',
    downloadZip: 'Download All as ZIP',
    downloadCurrent: 'Download This Image',
    format: 'Output Format',
    quality: 'Compression Quality',
    successStatus: 'Ready for export',
    readyStatus: 'Queued',
    errorStatus: 'Failed',
    anchors: {
      topLeft: 'Top Left',
      topCenter: 'Top Center',
      topRight: 'Top Right',
      midLeft: 'Middle Left',
      center: 'Center',
      midRight: 'Middle Right',
      botLeft: 'Bottom Left',
      botCenter: 'Bottom Center',
      botRight: 'Bottom Right',
    },
    blendModes: {
      normal: 'Normal (Standard)',
      multiply: 'Multiply (Darken)',
      screen: 'Screen (Lighten)',
      overlay: 'Overlay (Vibrant)',
      softLight: 'Soft Light (Subtle)',
      hardLight: 'Hard Light (High Contrast)',
      luminosity: 'Luminosity (Monochrome)',
      difference: 'Difference (Invert)',
    },
    faqs: [
      {
        q: 'How many photos can I watermark simultaneously?',
        a: 'There are no artificial limits. You can drag and drop 100+ high-resolution camera photos at once. Processing runs in parallel using modern browser multi-threading.',
      },
      {
        q: 'Are my private photographs uploaded to any cloud server?',
        a: 'Never. All watermarking, font rendering, logo blending, and ZIP packaging execute 100% locally in your browser memory. Zero bytes leave your device.',
      },
      {
        q: 'Does IndiaTools add any watermark or logo of its own?',
        a: 'Absolutely not. Only your specified custom text or uploaded brand logo will appear on the processed photos.',
      },
      {
        q: 'How does the anti-theft diagonal tiling watermark work?',
        a: 'When diagonal tiling is enabled, your text or logo is repeated diagonally across the entire surface of each photograph. This prevents thieves from cropping out corner watermarks.',
      },
      {
        q: 'Can I download all processed images in a single ZIP file?',
        a: 'Yes. Once batch processing completes, click "Download All as ZIP" to receive a clean, organized ZIP archive containing all stamped photos with original or custom formats.',
      },
    ],
  },
  ml: {
    title: 'ബാച്ച് ഇമേജ് വാട്ടർമാർക്കർ & മൾട്ടി-സ്റ്റാമ്പ് എഞ്ചിൻ',
    subtitle: 'ഒറ്റ ക്ലിക്കിൽ നൂറുകണക്കിന് ഫോട്ടോകളിൽ ഒരേസമയം ലോഗോയും വാട്ടർമാർക്കും ചേർക്കൂ. പൂർണ്ണമായും പ്രൈവറ്റ്, സെർവർ അപ്‌ലോഡുകൾ ആവശ്യമില്ല.',
    badgeFree: '100% സൗജന്യം • അൺലിമിറ്റഡ്',
    badgePrivacy: 'സീറോ അപ്‌ലോഡ് • 100% പ്രൈവറ്റ്',
    badgeSpeed: 'ഹൈ-സ്പീഡ് ബാച്ച് എഞ്ചിൻ',
    dropTitle: 'ഫോട്ടോകൾ ഇവിടെ ഡ്രാഗ് & ഡ്രോപ്പ് ചെയ്യുക',
    dropSubtitle: 'JPG, PNG, WebP ഫയലുകൾ 100+ വരെ ഒരുമിച്ച് തിരഞ്ഞെടുക്കാം',
    dropBrowse: 'ഫോട്ടോകൾ തിരഞ്ഞെടുക്കുക',
    tabText: 'ടെക്സ്റ്റ് വാട്ടർമാർക്ക്',
    tabLogo: 'ലോഗോ സ്റ്റാമ്പ്',
    tabDual: 'ഡ്യുവൽ സ്റ്റാമ്പ്',
    textLabel: 'വാട്ടർമാർക്ക് വാചകം',
    fontFamily: 'ഫോണ്ട് ശൈലി',
    fontSize: 'ഫോണ്ട് വലിപ്പം (%)',
    color: 'ടെക്സ്റ്റ് നിറം',
    opacity: 'സുതാര്യത (Opacity %)',
    rotation: 'റൊട്ടേഷൻ ആംഗിൾ',
    shadow: 'നിഴൽ പ്രഭാവം (Shadow)',
    bold: 'ബോൾഡ്',
    italic: 'ഇറ്റാലിക്',
    allCaps: 'വലിയ അക്ഷരങ്ങൾ',
    tilingLabel: 'ടൈലിംഗ് ഗ്രിഡ് (മോഷണവിരുദ്ധ പാറ്റേൺ)',
    tilingDescription: 'ഫോട്ടോയിലുടനീളം ഡയഗണലായി ആവർത്തിക്കുന്ന വാട്ടർമാർക്ക് പാറ്റേൺ',
    tileSpacingX: 'തിരശ്ചീന അകലം',
    tileSpacingY: 'ലംബ അകലം',
    positionAnchor: 'സ്ഥാന നിർണ്ണയം (9-പോയിന്റ് ഗ്രിഡ്)',
    paddingX: 'തിരശ്ചീന മാർജിൻ (%)',
    paddingY: 'ലംബ മാർജിൻ (%)',
    uploadLogo: 'ലോഗോ അപ്‌ലോഡ് ചെയ്യുക (PNG / JPG)',
    changeLogo: 'ലോഗോ മാറ്റുക',
    logoScale: 'ലോഗോ വലിപ്പം (%)',
    blendMode: 'ബ്ലെൻഡ് മോഡ്',
    queueTitle: 'ഫോട്ടോ ക്യൂ',
    queueCount: 'ഫോട്ടോകൾ തയ്യാറാണ്',
    clearAll: 'എല്ലാം നീക്കം ചെയ്യുക',
    emptyQueue: 'ക്യൂവിൽ ഫോട്ടോകളൊന്നുമില്ല. മുകളിൽ ഫോട്ടോകൾ ചേർക്കുക.',
    selectPhoto: 'തത്സമയ പ്രിവ്യൂ കാണാൻ ഫോട്ടോയിൽ ക്ലിക്ക് ചെയ്യുക',
    processBatch: 'ബാച്ച് പ്രോസസ്സ് ചെയ്യുക',
    processing: 'പ്രോസസ്സിംഗ് നടക്കുന്നു...',
    downloadZip: 'ZIP ആയി ഡൗൺലോഡ് ചെയ്യുക',
    downloadCurrent: 'ഈ ചിത്രം ഡൗൺലോഡ് ചെയ്യുക',
    format: 'ഔട്ട്പുട്ട് ഫോർമാറ്റ്',
    quality: 'ഗുണനിലവാരം',
    successStatus: 'തയ്യാറാണ്',
    readyStatus: 'ക്യൂവിലുണ്ട്',
    errorStatus: 'പരാജയപ്പെട്ടു',
    anchors: {
      topLeft: 'മുകളിൽ ഇടത്',
      topCenter: 'മുകളിൽ നടുവിൽ',
      topRight: 'മുകളിൽ വലത്',
      midLeft: 'ഇടത് നടുവിൽ',
      center: 'മധ്യഭാഗം',
      midRight: 'വലത് നടുവിൽ',
      botLeft: 'താഴെ ഇടത്',
      botCenter: 'താഴെ നടുവിൽ',
      botRight: 'താഴെ വലത്',
    },
    blendModes: {
      normal: 'സാധാരണ (Normal)',
      multiply: 'മൾട്ടിപ്ലൈ (Multiply)',
      screen: 'സ്ക്രീൻ (Screen)',
      overlay: 'ഓവർലേ (Overlay)',
      softLight: 'സോഫ്റ്റ് ലൈറ്റ് (Soft Light)',
      hardLight: 'ഹാർഡ് ലൈറ്റ് (Hard Light)',
      luminosity: 'ലൂമിനോസിറ്റി (Luminosity)',
      difference: 'ഡിഫറൻസ് (Difference)',
    },
    faqs: [
      {
        q: 'ഒറ്റത്തവണ എത്ര ഫോട്ടോകളിൽ വാട്ടർമാർക്ക് ചേർക്കാം?',
        a: 'യാതൊരു പരിധിയുമില്ല. 100-ലധികം ഫോട്ടോകൾ ഒരേസമയം ഡ്രാഗ് ചെയ്ത് ചേർക്കാം. ഹൈ-സ്പീഡ് മൾട്ടി-ത്രെഡിംഗ് വഴി ബ്രൗസറിൽ വളരെ വേഗത്തിൽ പ്രോസസ്സ് ചെയ്യുന്നു.',
      },
      {
        q: 'ഫോട്ടോകൾ എന്തെങ്കിലും സെർവറിലേക്ക് അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നുണ്ടോ?',
        a: 'ഒരിക്കലുമില്ല. എല്ലാ ഫോട്ടോകളും 100% നിങ്ങളുടെ കമ്പ്യൂട്ടറിലോ ഫോണിലോ മാത്രമാണ് പ്രോസസ്സ് ചെയ്യുന്നത്. പൂർണ്ണ സുരക്ഷ ഉറപ്പ്.',
      },
      {
        q: 'IndiaTools-ന്റെ സ്വന്തം വാട്ടർമാർക്ക് ഫോട്ടോകളിൽ വരുമോ?',
        a: 'ഇല്ല, ഒരിക്കലുമില്ല. നിങ്ങൾ നൽകുന്ന പേരോ ലോഗോയോ മാത്രമേ ഫോട്ടോകളിൽ ചേർക്കൂ.',
      },
      {
        q: 'ഡയഗണൽ ടൈലിംഗ് വാട്ടർമാർക്ക് എങ്ങനെയാണ് സഹായിക്കുന്നത്?',
        a: 'ഫോട്ടോയുടെ ഒരു കോണിൽ മാത്രം പേര് വെച്ചാൽ മറ്റുള്ളവർ അത് ക്രോപ്പ് ചെയ്ത് മാറ്റാൻ സാധ്യതയുണ്ട്. ടൈലിംഗ് ഫോട്ടോ മുഴുവൻ പരന്നുകിടക്കുന്നതിനാൽ ഇത് തടയാൻ സാധിക്കുന്നു.',
      },
      {
        q: 'എല്ലാ ഫോട്ടോകളും ഒരൊറ്റ ZIP ഫയലായി ഡൗൺലോഡ് ചെയ്യാൻ കഴിയുമോ?',
        a: 'അതെ. പ്രോസസ്സിംഗ് കഴിഞ്ഞ ശേഷം "ZIP ആയി ഡൗൺലോഡ് ചെയ്യുക" ക്ലിക്ക് ചെയ്താൽ എല്ലാ ചിത്രങ്ങളും ഒറ്റ ഫയലായി ലഭിക്കും.',
      },
    ],
  },
  hi: {
    title: 'बैच इमेज वॉटरमार्कर और मल्टी-स्टैम्प इंजन',
    subtitle: 'सैकड़ों तस्वीरों पर एक साथ अपना लोगो या टेक्स्ट वॉटरमार्क लगाएं। 100% सुरक्षित और मुफ्त इन-ब्राउज़र प्रोसेसिंग व ZIP डाउनलोड।',
    badgeFree: '100% मुफ्त व असीमित',
    badgePrivacy: 'जीरो अपलोड • 100% निजी',
    badgeSpeed: 'हाई-स्पीड बैच इंजन',
    dropTitle: 'फ़ोटो यहाँ ड्रैग और ड्रॉप करें',
    dropSubtitle: 'JPG, PNG, WebP फ़ॉर्मेट में 100+ तस्वीरें एक साथ जोड़ें',
    dropBrowse: 'फ़ोटो चुनें',
    tabText: 'टेक्स्ट वॉटरमार्क',
    tabLogo: 'लोगो स्टैम्प',
    tabDual: 'दोहरा स्टैम्प',
    textLabel: 'वॉटरमार्क टेक्स्ट',
    fontFamily: 'फॉन्ट शैली',
    fontSize: 'फॉन्ट आकार (%)',
    color: 'टेक्स्ट रंग',
    opacity: 'पारदर्शिता (Opacity %)',
    rotation: 'घुमाव कोण',
    shadow: 'टेक्स्ट छाया (Shadow)',
    bold: 'बोल्ड',
    italic: 'इटैलिक',
    allCaps: 'बड़े अक्षर',
    tilingLabel: 'डायगोनल टाइलिंग ग्रिड (सुरक्षा पैटर्न)',
    tilingDescription: 'चोरी रोकने के लिए पूरी तस्वीर पर तिरछा दोहरावदार वॉटरमार्क',
    tileSpacingX: 'क्षैतिज अंतर',
    tileSpacingY: 'लंबवत अंतर',
    positionAnchor: 'स्थान निर्धारण (9-बिंदु ग्रिड)',
    paddingX: 'क्षैतिज मार्जिन (%)',
    paddingY: 'लंबवत मार्जिन (%)',
    uploadLogo: 'लोगो अपलोड करें (PNG / JPG)',
    changeLogo: 'लोगो बदलें',
    logoScale: 'लोगो आकार (%)',
    blendMode: 'ब्लेंड मोड',
    queueTitle: 'फ़ोटो कतार',
    queueCount: 'फ़ोटो तैयार हैं',
    clearAll: 'सभी हटाएं',
    emptyQueue: 'कतार खाली है। लाइव प्रीव्यू के लिए फ़ोटो अपलोड करें।',
    selectPhoto: 'लाइव देखने के लिए किसी भी फ़ोटो पर क्लिक करें',
    processBatch: 'बैच प्रोसेस करें',
    processing: 'प्रोसेसिंग जारी है...',
    downloadZip: 'ZIP डाउनलोड करें',
    downloadCurrent: 'यह फ़ोटो डाउनलोड करें',
    format: 'आउटपुट प्रारूप',
    quality: 'गुणवत्ता',
    successStatus: 'सफलतापूर्वक तैयार',
    readyStatus: 'कतार में',
    errorStatus: 'विफल',
    anchors: {
      topLeft: 'ऊपर बाएँ',
      topCenter: 'ऊपर मध्य',
      topRight: 'ऊपर दाएँ',
      midLeft: 'मध्य बाएँ',
      center: 'केंद्र',
      midRight: 'मध्य दाएँ',
      botLeft: 'नीचे बाएँ',
      botCenter: 'नीचे मध्य',
      botRight: 'नीचे दाएँ',
    },
    blendModes: {
      normal: 'सामान्य (Normal)',
      multiply: 'मल्टीप्लाई (Multiply)',
      screen: 'स्क्रीन (Screen)',
      overlay: 'ओवरले (Overlay)',
      softLight: 'सॉफ्ट लाइट (Soft Light)',
      hardLight: 'हार्ड लाइट (Hard Light)',
      luminosity: 'ल्यूमिनोसिटी (Luminosity)',
      difference: 'डिफरेंस (Difference)',
    },
    faqs: [
      {
        q: 'एक साथ कितनी तस्वीरों पर वॉटरमार्क लगा सकते हैं?',
        a: 'कोई सीमा नहीं है। आप 100 से अधिक उच्च-रिज़ॉल्यूशन वाली तस्वीरें एक साथ जोड़कर प्रोसेस कर सकते हैं।',
      },
      {
        q: 'क्या मेरी तस्वीरें किसी सर्वर पर अपलोड होती हैं?',
        a: 'बिल्कुल नहीं। सभी कार्य 100% आपके ब्राउज़र की मेमोरी में होते हैं। शून्य डेटा सर्वर पर जाता है।',
      },
      {
        q: 'क्या टूल अपना कोई वॉटरमार्क लगाता है?',
        a: 'नहीं। केवल आपका चुना हुआ टेक्स्ट या लोगो ही तस्वीरों पर लगाया जाएगा।',
      },
      {
        q: 'डायगोनल टाइलिंग वॉटरमार्क क्यों उपयोगी है?',
        a: 'टाइलिंग से पूरी तस्वीर पर तिरछा पैटर्न बन जाता है, जिससे कोई भी वॉटरमार्क को क्रॉप करके चोरी नहीं कर सकता।',
      },
      {
        q: 'क्या सभी फ़ोटो एक साथ ZIP में डाउनलोड कर सकते हैं?',
        a: 'हाँ, प्रोसेसिंग पूरी होने के बाद "ZIP डाउनलोड करें" बटन दबाकर एक क्लिक में पूरी फ़ाइल प्राप्त करें।',
      },
    ],
  },
  ta: {
    title: 'பேட்ச் இமேஜ் வாட்டர்மார்க்கர் & மல்டி-ஸ்டாம்ப் எஞ்சின்',
    subtitle: 'ஒரே நேரத்தில் நூற்றுக்கணக்கான புகைப்படங்களில் உங்களின் லோகோ அல்லது பெயரை வாட்டர்மார்க்காக இணையுங்கள். 100% பாதுகாப்பானது.',
    badgeFree: '100% இலவசம் • வரம்பற்றது',
    badgePrivacy: 'ஜீரோ அப்லோட் • 100% தனிப்பட்டது',
    badgeSpeed: 'வேகமான பேட்ச் எஞ்சின்',
    dropTitle: 'புகைப்படங்களை இங்கே இழுத்து விடவும்',
    dropSubtitle: 'JPG, PNG, WebP வடிவத்தில் 100+ புகைப்படங்கள் வரை ஆதரிக்கப்படும்',
    dropBrowse: 'புகைப்படங்களை தேர்வு செய்க',
    tabText: 'உரை வாட்டர்மார்க்',
    tabLogo: 'லோகோ ஸ்டாம்ப்',
    tabDual: 'இரட்டை ஸ்டாம்ப்',
    textLabel: 'வாட்டர்மார்க் உரை',
    fontFamily: 'எழுத்துரு பாணி',
    fontSize: 'எழுத்துரு அளவு (%)',
    color: 'உரை வண்ணம்',
    opacity: 'வெளிப்படைத்தன்மை (%)',
    rotation: 'சுழற்சி கோணம்',
    shadow: 'நிழல் விளைவு',
    bold: 'தடிமன்',
    italic: 'சாய்வு',
    allCaps: 'பெரிய எழுத்துக்கள்',
    tilingLabel: 'மூலைவிட்ட டைலிங் கிரிட் (பாதுகாப்பு முறை)',
    tilingDescription: 'படத்தை வெட்டுவதைத் தடுக்க முழு புகைப்படத்திலும் பரவும் முறை',
    tileSpacingX: 'கிடைமட்ட இடைவெளி',
    tileSpacingY: 'செங்குத்து இடைவெளி',
    positionAnchor: 'நிலை கட்டம் (9-புள்ளி கிரிட்)',
    paddingX: 'கிடைமட்ட விளிம்பு (%)',
    paddingY: 'செங்குத்து விளிம்பு (%)',
    uploadLogo: 'லோகோ பதிவேற்றவும் (PNG / JPG)',
    changeLogo: 'லோகோ மாற்றவும்',
    logoScale: 'லோகோ அளவு (%)',
    blendMode: 'பிளெண்ட் முறை',
    queueTitle: 'புகைப்பட வரிசை',
    queueCount: 'படங்கள் தயார்',
    clearAll: 'அனைத்தையும் நீக்குக',
    emptyQueue: 'வரிசையில் படங்கள் இல்லை. மேலே புகைப்படங்களை சேர்க்கவும்.',
    selectPhoto: 'நேரலை மாதிரியைக் காண ஏதேனும் புகைப்படத்தை கிளிக் செய்க',
    processBatch: 'செயலாக்குக',
    processing: 'செயலாக்கம் நடைபெறுகிறது...',
    downloadZip: 'ZIP கோப்பாக பதிவிறக்குக',
    downloadCurrent: 'இந்த படத்தை பதிவிறக்குக',
    format: 'வெளியீட்டு வடிவம்',
    quality: 'தரம்',
    successStatus: 'தயாராக உள்ளது',
    readyStatus: 'வரிசையில்',
    errorStatus: 'தோல்வி',
    anchors: {
      topLeft: 'மேல் இடது',
      topCenter: 'மேல் மையம்',
      topRight: 'மேல் வலது',
      midLeft: 'நடு இடது',
      center: 'மையம்',
      midRight: 'நடு வலது',
      botLeft: 'கீழ் இடது',
      botCenter: 'கீழ் மையம்',
      botRight: 'கீழ் வலது',
    },
    blendModes: {
      normal: 'இயல்பானது (Normal)',
      multiply: 'மல்டிப்ளை (Multiply)',
      screen: 'ஸ்கிரீன் (Screen)',
      overlay: 'ஓவர்லே (Overlay)',
      softLight: 'சாஃப்ட் லைட் (Soft Light)',
      hardLight: 'ஹார்ட் லைட் (Hard Light)',
      luminosity: 'லுமினோசிட்டி (Luminosity)',
      difference: 'டிஃபரன்ஸ் (Difference)',
    },
    faqs: [
      {
        q: 'ஒரே நேரத்தில் எத்தனை புகைப்படங்களில் வாட்டர்மார்க் சேர்க்கலாம்?',
        a: 'எந்த வரம்பும் இல்லை. 100-க்கும் மேற்பட்ட உயர் தெளிவுத்திறன் புகைப்படங்களை ஒரே நேரத்தில் சேர்க்கலாம்.',
      },
      {
        q: 'எனது புகைப்படங்கள் ஏதேனும் சர்வரில் பதிவேற்றப்படுமா?',
        a: 'இல்லை, ஒருபோதும் இல்லை. உங்கள் உலாவியிலேயே 100% பாதுகாப்பாக செயலாக்கப்படுகிறது.',
      },
      {
        q: 'கருவியின் சொந்த வாட்டர்மார்க் புகைப்படங்களில் வருமா?',
        a: 'இல்லை, நீங்கள் தேர்வு செய்யும் பெயர் அல்லது லோகோ மட்டுமே சேர்க்கப்படும்.',
      },
      {
        q: 'டைலிங் முறை எவ்வாறு பாதுகாக்கிறது?',
        a: 'புகைப்படம் முழுவதும் மூலைவிட்ட வடிவில் வாட்டர்மார்க் பரவுவதால், யாரும் புகைப்படத்தை வெட்டி பயன்படுத்த முடியாது.',
      },
      {
        q: 'அனைத்து படங்களையும் ஒரே ZIP கோப்பாக பதிவிறக்க முடியுமா?',
        a: 'ஆம், செயலாக்கம் முடிந்ததும் "ZIP கோப்பாக பதிவிறக்குக" என்பதை கிளிக் செய்து பெறலாம்.',
      },
    ],
  },
  te: {
    title: 'బ్యాచ్ ఇమేజ్ వాటర్‌మార్కర్ & మల్టీ-స్టాంప్ ఇంజిన్',
    subtitle: 'వందలాది ఫోటోలపై ఒకేసారి మీ లోగో లేదా వాటర్‌మార్క్ వేయండి. బ్రౌజర్‌లోనే 100% ఉచితంగా మరియు సురక్షితంగా ZIP డౌన్‌లోడ్ చేసుకోండి.',
    badgeFree: '100% ఉచితం • అపరిమితం',
    badgePrivacy: 'జీరో అప్‌లోడ్ • 100% ప్రైవేట్',
    badgeSpeed: 'హై-స్పీడ్ బ్యాచ్ ఇంజిన్',
    dropTitle: 'ఫోటోలను ఇక్కడ డ్రాగ్ & డ్రాప్ చేయండి',
    dropSubtitle: 'JPG, PNG, WebP ఫైళ్లు 100+ వరకు ఒకేసారి జోడించవచ్చు',
    dropBrowse: 'ఫోటోలను ఎంచుకోండి',
    tabText: 'టెక్స్ట్ వాటర్‌మార్క్',
    tabLogo: 'లోగో స్టాంప్',
    tabDual: 'డ్యూయల్ స్టాంప్',
    textLabel: 'వాటర్‌మార్క్ టెక్స్ట్',
    fontFamily: 'ఫాంట్ శైలి',
    fontSize: 'ఫాంట్ సైజు (%)',
    color: 'టెక్స్ట్ రంగు',
    opacity: 'పారదర్శకత (%)',
    rotation: 'భ్రమణ కోణం',
    shadow: 'నీడ ప్రభావం',
    bold: 'బోల్డ్',
    italic: 'ఇటాలిక్',
    allCaps: 'పెద్ద అక్షరాలు',
    tilingLabel: 'డయాగోనల్ టైలింగ్ గ్రిడ్ (రక్షణ పద్ధతి)',
    tilingDescription: 'చిత్రం అంతటా విస్తరించే వాటర్‌మార్క్ పాటర్న్',
    tileSpacingX: 'క్షితిజ సమాంతర ఖాళీ',
    tileSpacingY: 'నిలువు ఖాళీ',
    positionAnchor: 'స్థానం (9-పాయింట్ గ్రిడ్)',
    paddingX: 'క్షితిజ సమాంతర మార్జిన్ (%)',
    paddingY: 'నిలువు మార్జిన్ (%)',
    uploadLogo: 'లోగో అప్‌లోడ్ చేయండి (PNG / JPG)',
    changeLogo: 'లోగో మార్చండి',
    logoScale: 'లోగో సైజు (%)',
    blendMode: 'బ్లెండ్ మోడ్',
    queueTitle: 'ఫోటోల క్యూ',
    queueCount: 'చిత్రాలు సిద్ధంగా ఉన్నాయి',
    clearAll: 'అన్నీ తొలగించు',
    emptyQueue: 'క్యూలో ఫోటోలు లేవు. పైన ఫోటోలు చేర్చండి.',
    selectPhoto: 'లైవ్ ప్రివ్యూ కోసం ఫోటోపై క్లిక్ చేయండి',
    processBatch: 'ప్రాసెస్ చేయండి',
    processing: 'ప్రాసెసింగ్ జరుగుతోంది...',
    downloadZip: 'ZIP డౌన్‌లోడ్ చేయండి',
    downloadCurrent: 'ఈ ఫోటో డౌన్‌లోడ్ చేయండి',
    format: 'అవుట్‌పుట్ ఫార్మాట్',
    quality: 'నాణ్యత',
    successStatus: 'సిద్ధంగా ఉంది',
    readyStatus: 'క్యూలో ఉంది',
    errorStatus: 'విఫలమైంది',
    anchors: {
      topLeft: 'ఎగువ ఎడమ',
      topCenter: 'ఎగువ మధ్య',
      topRight: 'ఎగువ కుడి',
      midLeft: 'మధ్య ఎడమ',
      center: 'మధ్య భాగం',
      midRight: 'మధ్య కుడి',
      botLeft: 'దిగువ ఎడమ',
      botCenter: 'దిగువ మధ్య',
      botRight: 'దిగువ కుడి',
    },
    blendModes: {
      normal: 'సాధారణ (Normal)',
      multiply: 'మల్టిప్లై (Multiply)',
      screen: 'స్క్రీన్ (Screen)',
      overlay: 'ఓవర్‌లే (Overlay)',
      softLight: 'సాఫ్ట్ లైట్ (Soft Light)',
      hardLight: 'హార్డ్ లైట్ (Hard Light)',
      luminosity: 'ల్యూమినోసిటీ (Luminosity)',
      difference: 'డిఫరెన్స్ (Difference)',
    },
    faqs: [
      {
        q: 'ఒకేసారి ఎన్ని ఫోటోలపై వాటర్‌మార్క్ వేయవచ్చు?',
        a: 'ఎటువంటి పరిమితి లేదు. మీరు 100 కంటే ఎక్కువ ఫోటోలను ఒకేసారి జోడించి ప్రాసెస్ చేయవచ్చు.',
      },
      {
        q: 'నా ఫోటోలు ఏవైనా సర్వర్‌కి అప్‌లోడ్ అవుతాయా?',
        a: 'ఎప్పటికీ కాదు. ప్రాసెసింగ్ మొత్తం 100% మీ బ్రౌజర్ మెమరీలోనే జరుగుతుంది.',
      },
      {
        q: 'ఈ టూల్ దాని సొంత వాటర్‌మార్క్‌ని జోడిస్తుందా?',
        a: 'లేదు, మీరు ఎంచుకున్న టెక్స్ట్ లేదా లోగో మాత్రమే ఫోటోలపై కనిపిస్తుంది.',
      },
      {
        q: 'టైలింగ్ విధానం ఎందుకు ఉపయోగపడుతుంది?',
        a: 'చిత్రం అంతటా వాటర్‌మార్క్ పరుచుకోవడం వల్ల ఎవరూ ఫోటోను కత్తిరించి దొంగిలించలేరు.',
      },
      {
        q: 'అన్ని ఫోటోలను ఒకే ZIP ఫైల్‌గా డౌన్‌లోడ్ చేయవచ్చా?',
        a: 'అవును, "ZIP డౌన్‌లోడ్ చేయండి" బటన్‌పై క్లిక్ చేయడం ద్వారా అన్నింటినీ ఒకేసారి పొందవచ్చు.',
      },
    ],
  },
  kn: {
    title: 'ಬ್ಯಾಚ್ ಇಮೇಜ್ ವಾಟರ್‌ಮಾರ್ಕರ್ & ಮಲ್ಟಿ-ಸ್ಟ್ಯಾಂಪ್ ಇಂಜಿನ್',
    subtitle: 'ನೂರಾರು ಫೋಟೋಗಳ ಮೇಲೆ ಏಕಕಾಲದಲ್ಲಿ ನಿಮ್ಮ ಲೋಗೋ ಅಥವಾ ವಾಟರ್‌ಮಾರ್ಕ್ ಸೇರಿಸಿ. ಯಾವುದೇ ಅಪ್‌ಲೋಡ್ ಇಲ್ಲದೆ 100% ಖಾಸಗಿ ಮತ್ತು ಉಚಿತ.',
    badgeFree: '100% ಉಚಿತ • ಅನಿಯಮಿತ',
    badgePrivacy: 'ಶೂನ್ಯ ಅಪ್‌ಲೋಡ್ • 100% ಖಾಸಗಿ',
    badgeSpeed: 'ಹೈ-ಸ್ಪೀಡ್ ಬ್ಯಾಚ್ ಇಂಜಿನ್',
    dropTitle: 'ಫೋಟೋಗಳನ್ನು ಇಲ್ಲಿ ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಮಾಡಿ',
    dropSubtitle: 'JPG, PNG, WebP 100+ ಫೋಟೋಗಳನ್ನು ಒಮ್ಮೆಲೇ ಬೆಂಬಲಿಸುತ್ತದೆ',
    dropBrowse: 'ಫೋಟೋಗಳನ್ನು ಆರಿಸಿ',
    tabText: 'ಪಠ್ಯ ವಾಟರ್‌ಮಾರ್ಕ್',
    tabLogo: 'ಲೋಗೋ ಸ್ಟ್ಯಾಂಪ್',
    tabDual: 'ಡ್ಯುಯಲ್ ಸ್ಟ್ಯಾಂಪ್',
    textLabel: 'ವಾಟರ್‌ಮಾರ್ಕ್ ಪಠ್ಯ',
    fontFamily: 'ಫಾಂಟ್ ಶೈಲಿ',
    fontSize: 'ಫಾಂಟ್ ಗಾತ್ರ (%)',
    color: 'ಪಠ್ಯ ಬಣ್ಣ',
    opacity: 'ಪಾರದರ್ಶಕತೆ (%)',
    rotation: 'ತಿರುಗುವಿಕೆ ಕೋನ',
    shadow: 'ನೆರಳು ಪರಿಣಾಮ',
    bold: 'ದಪ್ಪಕ್ಷರ',
    italic: 'ಓರೆ ಅಕ್ಷರ',
    allCaps: 'ದೊಡ್ಡಕ್ಷರಗಳು',
    tilingLabel: 'ಟೈಲಿಂಗ್ ಗ್ರಿಡ್ (ಕಳ್ಳತನ-ವಿರೋಧಿ ಮಾದರಿ)',
    tilingDescription: 'ಚಿತ್ರದಾದ್ಯಂತ ಓರೆಯಾಗಿ ಪುನರಾವರ್ತನೆಯಾಗುವ ಮಾದರಿ',
    tileSpacingX: 'ಅಡ್ಡಲಾದ ಅಂತರ',
    tileSpacingY: 'ಲಂಬವಾದ ಅಂತರ',
    positionAnchor: 'ಸ್ಥಾನ (9-ಬಿಂದು ಗ್ರಿಡ್)',
    paddingX: 'ಅಡ್ಡಲಾದ ಅಂಚು (%)',
    paddingY: 'ಲಂಬವಾದ ಅಂಚು (%)',
    uploadLogo: 'ಲೋಗೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (PNG / JPG)',
    changeLogo: 'ಲೋಗೋ ಬದಲಾಯಿಸಿ',
    logoScale: 'ಲೋಗೋ ಗಾತ್ರ (%)',
    blendMode: 'ಬ್ಲೆಂಡ್ ಮೋಡ್',
    queueTitle: 'ಫೋಟೋ ಸರದಿ',
    queueCount: 'ಚಿತ್ರಗಳು ಸಿದ್ಧವಾಗಿವೆ',
    clearAll: 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ',
    emptyQueue: 'ಸರದಿಯಲ್ಲಿ ಚಿತ್ರಗಳಿಲ್ಲ. ಮೇಲೆ ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ.',
    selectPhoto: 'ಲೈವ್ ಪ್ರಿವ್ಯೂ ನೋಡಲು ಫೋಟೋ ಕ್ಲಿಕ್ ಮಾಡಿ',
    processBatch: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ',
    processing: 'ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...',
    downloadZip: 'ZIP ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    downloadCurrent: 'ಈ ಫೋಟೋ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    format: 'ಔಟ್‌ಪುಟ್ ಸ್ವರೂಪ',
    quality: 'ಗುಣಮಟ್ಟ',
    successStatus: 'ಸಿದ್ಧವಾಗಿದೆ',
    readyStatus: 'ಸರದಿಯಲ್ಲಿದೆ',
    errorStatus: 'ವಿಫಲವಾಗಿದೆ',
    anchors: {
      topLeft: 'ಮೇಲಿನ ಎಡ',
      topCenter: 'ಮೇಲಿನ ಮಧ್ಯ',
      topRight: 'ಮೇಲಿನ ಬಲ',
      midLeft: 'ಮಧ್ಯದ ಎಡ',
      center: 'ಮಧ್ಯ',
      midRight: 'ಮಧ್ಯದ ಬಲ',
      botLeft: 'ಕೆಳಗಿನ ಎಡ',
      botCenter: 'ಕೆಳಗಿನ ಮಧ್ಯ',
      botRight: 'ಕೆಳಗಿನ ಬಲ',
    },
    blendModes: {
      normal: 'ಸಾಮಾನ್ಯ (Normal)',
      multiply: 'ಮಲ್ಟಿಪ್ಲೈ (Multiply)',
      screen: 'ಸ್ಕ್ರೀನ್ (Screen)',
      overlay: 'ಓವರ್‌ಲೇ (Overlay)',
      softLight: 'ಸಾಫ್ಟ್ ಲೈಟ್ (Soft Light)',
      hardLight: 'ಹಾರ್ಡ್ ಲೈಟ್ (Hard Light)',
      luminosity: 'ಲ್ಯೂಮಿನೋಸಿಟಿ (Luminosity)',
      difference: 'ಡಿಫರೆನ್ಸ್ (Difference)',
    },
    faqs: [
      {
        q: 'ಒಮ್ಮೆ ಎಷ್ಟು ಫೋಟೋಗಳಿಗೆ ವಾಟರ್‌ಮಾರ್ಕ್ ಹಾಕಬಹುದು?',
        a: 'ಯಾವುದೇ ಮಿತಿಯಿಲ್ಲ. 100 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಫೋಟೋಗಳನ್ನು ಒಮ್ಮೆಲೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಬಹುದು.',
      },
      {
        q: 'ಫೋಟೋಗಳು ಸರ್ವರ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತವೆಯೇ?',
        a: 'ಇಲ್ಲ, ಎಲ್ಲವೂ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಖಾಸಗಿಯಾಗಿ ನಡೆಯುತ್ತದೆ.',
      },
      {
        q: 'ಉಚಿತವಾಗಿ ZIP ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದೇ?',
        a: 'ಹೌದು, ಪ್ರಕ್ರಿಯೆ ಮುಗಿದ ನಂತರ ಎಲ್ಲವನ್ನೂ ಒಂದೇ ZIP ಫೈಲ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.',
      },
      {
        q: 'ಲೋಗೋ ವಾಟರ್‌ಮಾರ್ಕ್ ಬೆಂಬಲಿಸುತ್ತದೆಯೇ?',
        a: 'ಹೌದು, ಪಾರದರ್ಶಕ PNG ಅಥವಾ SVG ಲೋಗೋಗಳನ್ನು ಸುಲಭವಾಗಿ ಬಳಸಬಹುದು.',
      },
      {
        q: 'ಟೈಲಿಂಗ್ ಮಾದರಿಯ ಪ್ರಯೋಜನವೇನು?',
        a: 'ಇದು ಫೋಟೋವನ್ನು ಕ್ರಾಪ್ ಮಾಡಿ ಬಳಸುವುದನ್ನು ತಡೆಯುತ್ತದೆ.',
      },
    ],
  },
  bn: {
    title: 'ব্যাচ ইমেজ ওয়াটারমার্কার এবং মাল্টি-স্ট্যাম্প ইঞ্জিন',
    subtitle: 'একসাথে শত শত ছবিতে নিজের লোগো বা টেক্সট ওয়াটারমার্ক যুক্ত করুন। ১০০% নিরাপদ ও বিনামূল্যে ব্রাউজারে প্রসেসিং ও ZIP ডাউনলোড।',
    badgeFree: '১০০% বিনামূল্যে • আনলিমিটেড',
    badgePrivacy: 'জিরো আপলোড • ১০০% ব্যক্তিগত',
    badgeSpeed: 'উচ্চ-গতির ব্যাচ ইঞ্জিন',
    dropTitle: 'এখানে ছবি ড্র্যাগ ও ড্রপ করুন',
    dropSubtitle: 'JPG, PNG, WebP ফরম্যাটে ১০০+ ছবি একসাথে যুক্ত করুন',
    dropBrowse: 'ছবি নির্বাচন করুন',
    tabText: 'টেক্সট ওয়াটারমার্ক',
    tabLogo: 'লোগো স্ট্যাম্প',
    tabDual: 'ডুয়াল স্ট্যাম্প',
    textLabel: 'ওয়াটারমার্ক টেক্সট',
    fontFamily: 'ফন্ট স্টাইল',
    fontSize: 'ফন্ট সাইজ (%)',
    color: 'টেক্সটের রঙ',
    opacity: 'স্বচ্ছতা (Opacity %)',
    rotation: 'ঘূর্ণন কোণ',
    shadow: 'ড্রপ শ্যাডো',
    bold: 'বোল্ড',
    italic: 'ইটালিক',
    allCaps: 'বড় হাতের অক্ষর',
    tilingLabel: 'ডায়াগোনাল টাইলিং গ্রিড (চুরি বিরোধী প্যাটার্ন)',
    tilingDescription: 'ছবি চুরি ঠেকাতে পুরো ছবি জুড়ে তির্যকভাবে পুনরাবৃত্ত ওয়াটারমার্ক',
    tileSpacingX: 'অনুভূমিক ব্যবধান',
    tileSpacingY: 'উল্লম্ব ব্যবধান',
    positionAnchor: 'অবস্থান (৯-বিন্দু গ্রিড)',
    paddingX: 'অনুভূমিক মার্জিন (%)',
    paddingY: 'উল্লম্ব মার্জিন (%)',
    uploadLogo: 'লোগো আপলোড করুন (PNG / JPG)',
    changeLogo: 'লোগো পরিবর্তন করুন',
    logoScale: 'লোগো সাইজ (%)',
    blendMode: 'ব্লেন্ড মোড',
    queueTitle: 'ছবি কিউ',
    queueCount: 'ছবি প্রস্তুত',
    clearAll: 'সব মুছুন',
    emptyQueue: 'কিউতে কোনো ছবি নেই। লাইভ প্রিভিউ দেখতে উপরে ছবি যুক্ত করুন।',
    selectPhoto: 'লাইভ প্রিভিউ দেখতে যেকোনো ছবিতে ক্লিক করুন',
    processBatch: 'ব্যাচ প্রসেস করুন',
    processing: 'প্রসেসিং চলছে...',
    downloadZip: 'ZIP ডাউনলোড করুন',
    downloadCurrent: 'এই ছবিটি ডাউনলোড করুন',
    format: 'আউটপুট ফরম্যাট',
    quality: 'মান',
    successStatus: 'সফলভাবে প্রস্তুত',
    readyStatus: 'কিউতে আছে',
    errorStatus: 'ব্যর্থ হয়েছে',
    anchors: {
      topLeft: 'উপরে বামে',
      topCenter: 'উপরে মাঝে',
      topRight: 'উপরে ডানে',
      midLeft: 'মাঝে বামে',
      center: 'কেন্দ্র',
      midRight: 'মাঝে ডানে',
      botLeft: 'নিচে বামে',
      botCenter: 'নিচে মাঝে',
      botRight: 'নিচে ডানে',
    },
    blendModes: {
      normal: 'স্বাভাবিক (Normal)',
      multiply: 'মাল্টিপ্লাই (Multiply)',
      screen: 'স্ক্রিন (Screen)',
      overlay: 'ওভারলে (Overlay)',
      softLight: 'সফট লাইট (Soft Light)',
      hardLight: 'হার্ড লাইট (Hard Light)',
      luminosity: 'লুমিনোসিটি (Luminosity)',
      difference: 'ডিফারেন্স (Difference)',
    },
    faqs: [
      {
        q: 'একসাথে কত ছবিতে ওয়াটারমার্ক করা যায়?',
        a: 'কোনো সীমা নেই। ১০০টিরও বেশি উচ্চ রেজোলিউশনের ছবি একসাথে যুক্ত করতে পারেন।',
      },
      {
        q: 'আমার ছবি কি কোনো সার্ভারে আপলোড হয়?',
        a: 'কখনোই না। সমস্ত প্রসেসিং আপনার ব্রাউজারের মেমরিতে ১০০% সুরক্ষিতভাবে সম্পন্ন হয়।',
      },
      {
        q: 'টুল কি তার নিজস্ব কোনো ওয়াটারমার্ক যোগ করে?',
        a: 'না, শুধু আপনার দেওয়া নাম বা লোগো যুক্ত হবে।',
      },
      {
        q: 'টেইলিং গ্রিড কীভাবে সাহায্য করে?',
        a: 'এটি পুরো ছবিতে ওয়াটারমার্ক ছড়িয়ে দেয় যাতে কেউ ক্রপ করে চুরি না করতে পারে।',
      },
      {
        q: 'সব ছবি একসাথে ZIP হিসেবে ডাউনলোড করা যায়?',
        a: 'হ্যাঁ, এক ক্লিকেই সম্পূর্ণ ZIP ফাইল ডাউনলোড করতে পারবেন।',
      },
    ],
  },
}

export function getBatchWatermarkTranslation(
  locale: BatchWatermarkLocale
): BatchWatermarkTranslation {
  return BATCH_TRANSLATIONS[locale] || BATCH_TRANSLATIONS.en
}
