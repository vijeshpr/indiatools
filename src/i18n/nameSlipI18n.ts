/**
 * Comprehensive Localization Dictionary for Name Slip Maker for Kids
 * Supports English + all 22 official Eighth Schedule Indian Languages:
 * Assamese (as), Bengali (bn), Bodo (brx), Dogri (doi), Gujarati (gu),
 * Hindi (hi), Kannada (kn), Kashmiri (ks), Konkani (kok), Maithili (mai),
 * Malayalam (ml), Meitei/Manipuri (mni), Marathi (mr), Nepali (ne),
 * Odia (or), Punjabi (pa), Sanskrit (sa), Santali (sat), Sindhi (sd),
 * Tamil (ta), Telugu (te), Urdu (ur), and English (en).
 */

export type NameSlipLangCode =
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

export interface NameSlipLocaleMeta {
  code: NameSlipLangCode
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  bcp47: string
}

export const NAME_SLIP_LOCALES: Record<NameSlipLangCode, NameSlipLocaleMeta> = {
  en: { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', bcp47: 'en-IN' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', bcp47: 'hi-IN' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr', bcp47: 'ml-IN' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr', bcp47: 'ta-IN' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr', bcp47: 'te-IN' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr', bcp47: 'kn-IN' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', bcp47: 'bn-IN' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', dir: 'ltr', bcp47: 'mr-IN' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr', bcp47: 'gu-IN' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr', bcp47: 'pa-IN' },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', dir: 'ltr', bcp47: 'or-IN' },
  as: { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', dir: 'ltr', bcp47: 'as-IN' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', bcp47: 'ur-IN' },
  sa: { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', dir: 'ltr', bcp47: 'sa-IN' },
  kok: { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', dir: 'ltr', bcp47: 'kok-IN' },
  mai: { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', dir: 'ltr', bcp47: 'mai-IN' },
  ne: { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', dir: 'ltr', bcp47: 'ne-IN' },
  ks: { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', dir: 'rtl', bcp47: 'ks-IN' },
  sd: { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', dir: 'rtl', bcp47: 'sd-IN' },
  doi: { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', dir: 'ltr', bcp47: 'doi-IN' },
  mni: { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', dir: 'ltr', bcp47: 'mni-IN' },
  brx: { code: 'brx', name: 'Bodo', nativeName: 'बर’', dir: 'ltr', bcp47: 'brx-IN' },
  sat: { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', dir: 'ltr', bcp47: 'sat-IN' }
}

export const ALL_NAME_SLIP_LANG_CODES = Object.keys(NAME_SLIP_LOCALES) as NameSlipLangCode[]

export function isNameSlipLocale(code: string): code is NameSlipLangCode {
  return code in NAME_SLIP_LOCALES
}

export interface NameSlipFaq {
  question: string
  answer: string
}

export interface NameSlipToolContent {
  locale: NameSlipLangCode
  localeName: string
  dir: 'ltr' | 'rtl'
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  steps: {
    details: string
    template: string
    arrange: string
    print: string
  }
  labels: {
    studentName: string
    classSection: string
    schoolName: string
    rollNo: string
    bloodGroup: string
    phone: string
    subject: string
    customLine: string
    copies: string
    photoUpload: string
    removeBg: string
    bgRemoved: string
    original: string
    cropZoom: string
    shape: string
    templates: string
    colors: string
    slipSize: string
    cuttingGuides: string
    printButton: string
    downloadPdf: string
    downloadPng: string
    addStudent: string
    loadSample: string
    privacyBadge: string
  }
  faqs: NameSlipFaq[]
  disclaimer: string
}

export const NAME_SLIP_TOOL_I18N: Record<NameSlipLangCode, NameSlipToolContent> = {
  en: {
    locale: 'en',
    localeName: 'English',
    dir: 'ltr',
    title: 'Free Name Slip Maker for Kids – School Name Label Generator Online India | IndiaTools',
    metaDescription: 'Create beautiful printable school name slips for kids notebooks, textbooks and bags. Multiple photo upload, 1-click background removal, 12+ cute templates and perfect A4 PDF layout.',
    h1: 'Name Slip Maker for Kids – Free School Name Label Generator',
    subtitle: 'Design cute, personalized school name labels with your child’s photo, school name, class, and roll number. Arrange perfectly on A4 sheets for high-quality printing.',
    steps: {
      details: '1. Student & Photos',
      template: '2. Choose Design',
      arrange: '3. A4 Page Layout',
      print: '4. Print & Download'
    },
    labels: {
      studentName: 'Student Full Name',
      classSection: 'Class & Section',
      schoolName: 'School Name',
      rollNo: 'Roll Number',
      bloodGroup: 'Blood Group',
      phone: 'Parent Phone Number',
      subject: 'Subject / Book Type',
      customLine: 'House / Bus Route / Custom Note',
      copies: 'Number of Slips to Print',
      photoUpload: 'Upload Student Photos (1 to 30)',
      removeBg: 'Remove Photo Background',
      bgRemoved: 'Transparent BG',
      original: 'Original Photo',
      cropZoom: 'Crop & Zoom Photo',
      shape: 'Photo Shape',
      templates: '12+ Premium Kid Templates',
      colors: 'Theme Colors & Patterns',
      slipSize: 'Label Slip Size',
      cuttingGuides: 'Show Scissor Cut Lines',
      printButton: 'Print A4 Sheet Directly',
      downloadPdf: 'Download Printable PDF',
      downloadPng: 'Download High-Res PNG',
      addStudent: '+ Add Another Student',
      loadSample: 'Load Sample Data',
      privacyBadge: '100% In-Browser Privacy • Photos Never Leave Your Device'
    },
    faqs: [
      {
        question: 'How many name slips fit on a single A4 sheet?',
        answer: 'Depending on the size selected, you can fit 21 Small slips (65×35mm), 10 Standard Medium slips (80×45mm), or 8 Large slips (95×55mm) with perfect 5mm cutting margins.'
      },
      {
        question: 'How does client-side background removal work?',
        answer: 'Background removal runs directly inside your web browser using WebAssembly. No photos are ever uploaded to cloud servers, guaranteeing 100% data privacy for your child.'
      },
      {
        question: 'Can I print name slips for multiple children at once?',
        answer: 'Yes! Click "Add Another Student" to customize labels for siblings or classmates. All slips are neatly arranged sequentially onto A4 pages for bulk printing.'
      },
      {
        question: 'Does this name slip maker support Indian regional languages?',
        answer: 'Yes, all fields fully support Hindi, Malayalam, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Punjabi, Odia, Urdu, and English.'
      }
    ],
    disclaimer: 'IndiaTools Name Slip Maker is a free educational utility for parents, students, and teachers. All designs and layout calculations happen entirely in your local browser.'
  },
  hi: {
    locale: 'hi',
    localeName: 'Hindi',
    dir: 'ltr',
    title: 'बच्चों के लिए स्कूल नेम स्लिप मेकर – फ्री लेबल जनरेटर | IndiaTools',
    metaDescription: 'बच्चों की स्कूल नोटबुक और किताबों के लिए सुंदर नेम स्लिप बनाएं। फोटो बैकग्राउंड रिमूवल, 12+ आकर्षक टेम्पलेट और A4 प्रिंट लेआउट बिल्कुल मुफ्त।',
    h1: 'बच्चों के लिए स्कूल नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'बच्चे की फोटो, स्कूल का नाम, कक्षा और रोल नंबर के साथ सुंदर नेम स्लिप बनाएं और A4 शीट पर सीधे प्रिंट करें।',
    steps: {
      details: '1. छात्र और फोटो',
      template: '2. डिज़ाइन चुनें',
      arrange: '3. A4 पेज लेआउट',
      print: '4. प्रिंट व डाउनलोड'
    },
    labels: {
      studentName: 'छात्र का पूरा नाम',
      classSection: 'कक्षा और सेक्शन',
      schoolName: 'स्कूल का नाम',
      rollNo: 'रोल नंबर',
      bloodGroup: 'ब्लड ग्रुप',
      phone: 'माता-पिता का फोन नंबर',
      subject: 'विषय / पुस्तक',
      customLine: 'हाउस / बस रूट / विशेष नोट',
      copies: 'स्लिप्स की संख्या',
      photoUpload: 'फोटो अपलोड करें (1 से 30)',
      removeBg: 'बैकग्राउंड हटाएं',
      bgRemoved: 'ट्रांसपेरेंट बैकग्राउंड',
      original: 'मूल फोटो',
      cropZoom: 'क्रॉप व ज़ूम करें',
      shape: 'फोटो का आकार',
      templates: '12+ आकर्षक टेम्पलेट्स',
      colors: 'थीम रंग व पैटर्न',
      slipSize: 'स्लिप का साइज़',
      cuttingGuides: 'कटिंग गाइडलाइन्स दिखाएं',
      printButton: 'A4 शीट प्रिंट करें',
      downloadPdf: 'प्रिंट योग्य PDF डाउनलोड करें',
      downloadPng: 'हाई-रेज़ोल्यूशन PNG डाउनलोड करें',
      addStudent: '+ दूसरा छात्र जोड़ें',
      loadSample: 'नमूना डेटा लोड करें',
      privacyBadge: '100% सुरक्षित: आपकी फोटो किसी सर्वर पर नहीं भेजी जाती'
    },
    faqs: [
      {
        question: 'एक A4 शीट पर कितनी नेम स्लिप प्रिंट होती हैं?',
        answer: 'साइज़ के अनुसार एक A4 पेज पर 21 छोटी स्लिप्स (65×35mm), 10 मीडियम स्लिप्स (80×45mm) या 8 बड़ी स्लिप्स (95×55mm) प्रिंट की जा सकती हैं।'
      },
      {
        question: 'क्या यह सभी भारतीय भाषाओं में काम करता है?',
        answer: 'हाँ, आप हिन्दी, अंग्रेजी, मलयालम, तमिल आदि किसी भी भाषा में नाम और स्कूल का विवरण टाइप कर सकते हैं।'
      }
    ],
    disclaimer: 'अस्वीकरण: यह टूल माता-पिता और शिक्षकों की सुविधा के लिए 100% फ्री है। सभी फोटो प्रोसेसिंग आपके अपने डिवाइस पर होती है।'
  },
  ml: {
    locale: 'ml',
    localeName: 'Malayalam',
    dir: 'ltr',
    title: 'സ്കൂൾ നെയിം സ്ലിപ്പ് മേക്കർ – കുട്ടികൾക്കായുള്ള സൗജന്യ നെയിം ലേബൽ | IndiaTools',
    metaDescription: 'കുട്ടികളുടെ സ്കൂൾ പുസ്തകങ്ങൾക്കും നോട്ട്ബുക്കുകൾക്കുമായി ഫോട്ടോ സഹിതം മനോഹരമായ നെയിം സ്ലിപ്പുകൾ നിർമ്മിക്കൂ. പശ്ചാത്തലം മാറ്റാം, A4 പ്രിന്റ് ഷീറ്റും PDF ഉം സൗജന്യം.',
    h1: 'കുട്ടികൾക്കായുള്ള സ്കൂൾ നെയിം സ്ലിപ്പ് മേക്കർ (Name Slip Maker)',
    subtitle: 'കുട്ടിയുടെ ഫോട്ടോ, സ്കൂളിന്റെ പേര്, ക്ലാസ്സ്, റോൾ നമ്പർ എന്നിവ ഉൾപ്പെടുത്തി ആകർഷകമായ നെയിം സ്ലിപ്പുകൾ നിർമ്മിച്ച് A4 പേപ്പറിൽ പ്രിന്റ് ചെയ്യാം.',
    steps: {
      details: '1. വിവരങ്ങളും ഫോട്ടോയും',
      template: '2. ഡിസൈൻ തിരഞ്ഞെടുക്കുക',
      arrange: '3. A4 പേജ് ലേഔട്ട്',
      print: '4. പ്രിന്റും ഡൗൺലോഡും'
    },
    labels: {
      studentName: 'വിദ്യാർത്ഥിയുടെ പേര്',
      classSection: 'ക്ലാസ്സും ഡിവിഷനും',
      schoolName: 'സ്കൂളിന്റെ പേര്',
      rollNo: 'റോൾ നമ്പർ',
      bloodGroup: 'ബ്ലഡ് ഗ്രൂപ്പ്',
      phone: 'രക്ഷിതാവിന്റെ ഫോൺ നമ്പർ',
      subject: 'വിഷയം / നോട്ട്ബുക്ക്',
      customLine: 'ഹൗസ് / ബസ്സ് റൂട്ട് / കുറിപ്പ്',
      copies: 'ആവശ്യമായ സ്ലിപ്പുകളുടെ എണ്ണം',
      photoUpload: 'ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക (1 മുതൽ 30 വരെ)',
      removeBg: 'ഫോട്ടോയുടെ പശ്ചാത്തലം ഒഴിവാക്കുക',
      bgRemoved: 'ബാക്ക്ഗ്രൗണ്ട് നീക്കം ചെയ്തത്',
      original: 'യഥാർത്ഥ ഫോട്ടോ',
      cropZoom: 'ക്രോപ്പും സൂമും',
      shape: 'ഫോട്ടോയുടെ ആകൃതി',
      templates: '12+ മനോഹരമായ ഡിസൈനുകൾ',
      colors: 'നിറങ്ങളും പാറ്റേണുകളും',
      slipSize: 'സ്ലിപ്പിന്റെ വലിപ്പം',
      cuttingGuides: 'മുറിക്കാനുള്ള മാർജിൻ വരകൾ കാണിക്കുക',
      printButton: 'നേരിട്ട് A4 പ്രിന്റ് ചെയ്യുക',
      downloadPdf: 'പ്രിന്റബിൾ PDF ഡൗൺലോഡ് ചെയ്യുക',
      downloadPng: 'PNG കാർഡ് ഡൗൺലോഡ് ചെയ്യുക',
      addStudent: '+ മറ്റൊരു കുട്ടിയെ ചേർക്കുക',
      loadSample: 'മാതൃകാ വിവരങ്ങൾ കാണുക',
      privacyBadge: '100% സ്വകാര്യം: ഫോട്ടോകൾ നിങ്ങളുടെ ഉപകരണത്തിൽ മാത്രം പ്രോസസ്സ് ചെയ്യുന്നു'
    },
    faqs: [
      {
        question: 'ഒരു A4 ഷീറ്റിൽ എത്ര നെയിം സ്ലിപ്പുകൾ പ്രിന്റ് ചെയ്യാം?',
        answer: 'തിരഞ്ഞെടുക്കുന്ന വലിപ്പത്തിനനുസരിച്ച് ഒരു A4 പേപ്പറിൽ 21 ചെറിയ സ്ലിപ്പുകൾ (65×35mm), 10 സ്റ്റാൻഡേർഡ് സ്ലിപ്പുകൾ (80×45mm), അല്ലെങ്കിൽ 8 വലിയ സ്ലിപ്പുകൾ (95×55mm) ഒതുങ്ങും.'
      },
      {
        question: 'മലയാളത്തിൽ പേരുകൾ ടൈപ്പ് ചെയ്യാൻ സാധിക്കുമോ?',
        answer: 'തീർച്ചയായും! വിദ്യാർത്ഥിയുടെ പേര്, സ്കൂൾ, ക്ലാസ്സ് എന്നിവ മലയാളത്തിലും മറ്റ് ഇന്ത്യൻ ഭാഷകളിലും പൂർണ്ണമായി ടൈപ്പ് ചെയ്യാം.'
      }
    ],
    disclaimer: 'അറിയിപ്പ്: മാതാപിതാക്കൾക്കും അധ്യാപകർക്കുമായി തികച്ചും സൗജന്യമായ ഉപകരണം. ഫോട്ടോകളോ വിവരങ്ങളോ ഒരു സെർവറിലേക്കും അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നില്ല.'
  },
  ta: {
    locale: 'ta',
    localeName: 'Tamil',
    dir: 'ltr',
    title: 'பள்ளி பெயர் சீட்டு தயாரிப்பாளர் – இலவச Name Slip Maker | IndiaTools',
    metaDescription: 'குழந்தைகளின் பள்ளி நோட்டுப் புத்தகங்களுக்கு அழகான பெயர் சீட்டுகளை உருவாக்குங்கள். புகைப்பட பின்னணி நீக்கம், 12+ டெம்ப்ளேட்டுகள் மற்றும் A4 அச்சு வடிவமைப்பு.',
    h1: 'குழந்தைகளுக்கான பள்ளி பெயர் சீட்டு மேக்கர் (Name Slip Maker)',
    subtitle: 'புகைப்படம், பள்ளி பெயர், வகுப்பு மற்றும் ரோல் எண்ணுடன் வண்ணமயமான பெயர் சீட்டுகளை உருவாக்கி A4 தாளில் அச்சிடுங்கள்.',
    steps: {
      details: '1. மாணவர் விவரம்',
      template: '2. வடிவமைப்பு',
      arrange: '3. A4 பக்க அமைப்பு',
      print: '4. அச்சிடு / பதிவிறக்கு'
    },
    labels: {
      studentName: 'மாணவர் முழு பெயர்',
      classSection: 'வகுப்பு & பிரிவு',
      schoolName: 'பள்ளி பெயர்',
      rollNo: 'வரிசை எண் (Roll No)',
      bloodGroup: 'இரத்த வகை (Blood Group)',
      phone: 'பெற்றோர் தொலைபேசி எண்',
      subject: 'பாடம்',
      customLine: 'ஹவுஸ் / பேருந்து வழித்தடம்',
      copies: 'சீட்டுகளின் எண்ணிக்கை',
      photoUpload: 'புகைப்படங்களை பதிவேற்றவும்',
      removeBg: 'பின்னணியை நீக்கு',
      bgRemoved: 'பின்னணி நீக்கப்பட்டது',
      original: 'அசல் புகைப்படம்',
      cropZoom: 'பயிர்த்தல் & பெரிதாக்குதல்',
      shape: 'புகைப்பட வடிவம்',
      templates: '12+ அழகான டெம்ப்ளேட்கள்',
      colors: 'வண்ணங்கள்',
      slipSize: 'சீட்டின் அளவு',
      cuttingGuides: 'வெட்டு வழிகாட்டி கோடுகள்',
      printButton: 'A4 தாளில் அச்சிடுக',
      downloadPdf: 'PDF பதிவிறக்கம்',
      downloadPng: 'PNG பதிவிறக்கம்',
      addStudent: '+ அடுத்த மாணவரைச் சேர்க்க',
      loadSample: 'மாதிரி தகவல் ஏற்றுக',
      privacyBadge: '100% தனிப்பட்டது: புகைப்படங்கள் உங்கள் சாதனத்தில் மட்டுமே இருக்கும்'
    },
    faqs: [
      {
        question: 'ஒரு A4 தாளில் எத்தனை பெயர் சீட்டுகள் வரும்?',
        answer: 'அளவைப் பொறுத்து 21 சிறிய சீட்டுகள், 10 நடுத்தர சீட்டுகள் அல்லது 8 பெரிய சீட்டுகள் அச்சிடலாம்.'
      }
    ],
    disclaimer: 'பெற்றோர்கள் மற்றும் ஆசிரியர்களுக்கான இலவச ஆன்லைன் கருவி.'
  },
  te: {
    locale: 'te',
    localeName: 'Telugu',
    dir: 'ltr',
    title: 'పిల్లల స్కూల్ నేమ్ స్లిప్ మేకర్ – ఉచిత లేబుల్ జనరేటర్ | IndiaTools',
    metaDescription: 'పిల్లల నోట్‌బుక్స్ కోసం ఫోటోతో అందమైన స్కూల్ నేమ్ స్లిప్స్ తయారు చేయండి. 12+ టెంప్లేట్లు மற்றும் A4 ప్రింట్ ఉచితం.',
    h1: 'పిల్లల స్కూల్ నేమ్ స్లిప్ మేకర్ (Name Slip Maker)',
    subtitle: 'ఫోటో, స్కూల్ పేరు, క్లాస్ మరియు రోల్ నంబర్‌తో ఆకర్షణీయమైన నేమ్ స్లిప్స్ డిజైన్ చేసి A4 పేపర్‌పై ప్రింట్ తీసుకోండి.',
    steps: {
      details: '1. వివరాలు & ఫోటో',
      template: '2. డిజైన్ ఎంపిక',
      arrange: '3. A4 పేజీ అమరిక',
      print: '4. ప్రింట్ & డౌన్‌లోడ్'
    },
    labels: {
      studentName: 'విద్యార్థి పూర్తి పేరు',
      classSection: 'తరగతి & సెక్షన్',
      schoolName: 'పాఠశాల పేరు',
      rollNo: 'రోల్ నంబర్',
      bloodGroup: 'బ్లడ్ గ్రూప్',
      phone: 'తల్లిదండ్రుల ఫోన్ నంబర్',
      subject: 'సబ్జెక్ట్',
      customLine: 'హౌస్ / బస్సు రూట్ / నోట్',
      copies: 'స్లిప్పుల సంఖ్య',
      photoUpload: 'ఫోటోలు అప్‌లోడ్ చేయండి',
      removeBg: 'బ్యాక్‌గ్రౌండ్ తొలగించు',
      bgRemoved: 'తొలగించిన నేపథ్యం',
      original: 'అసలు ఫోటో',
      cropZoom: 'క్రాప్ & జూమ్',
      shape: 'ఫోటో ఆకారం',
      templates: '12+ కిడ్స్ టెంప్లేట్లు',
      colors: 'రంగులు & థీమ్స్',
      slipSize: 'స్లిప్ సైజు',
      cuttingGuides: 'కటింగ్ లైన్లు చూపించు',
      printButton: 'A4 పేపర్‌పై ప్రింట్ చేయండి',
      downloadPdf: 'PDF డౌన్‌లోడ్ చేయండి',
      downloadPng: 'PNG డౌన్‌లోడ్ చేయండి',
      addStudent: '+ మరొక విద్యార్థిని జోడించు',
      loadSample: 'శాంపిల్ డేటా లోడ్ చేయి',
      privacyBadge: '100% సురక్షితం: మీ ఫోటోలు సర్వర్‌కు వెళ్లవు'
    },
    faqs: [
      {
        question: 'ఒక A4 షీట్‌లో ఎన్ని స్లిప్పులు వస్తాయి?',
        answer: 'సైజును బట్టి 21 చిన్నవి, 10 మీడియం లేదా 8 పెద్ద స్లిప్పులు సరిపోతాయి.'
      }
    ],
    disclaimer: 'ఉచిత విద్యా ప్రయోజన సాధనం. ఫోటోలు సురక్షితంగా మీ పరికరంలోనే ప్రాసెస్ అవుతాయి.'
  },
  kn: {
    locale: 'kn',
    localeName: 'Kannada',
    dir: 'ltr',
    title: 'ಮಕ್ಕಳ ಶಾಲಾ ನೇಮ್ ಸ್ಲಿಪ್ ಮೇಕರ್ – ಉಚಿತ ಲೇಬಲ್ ಜನರೇಟರ್ | IndiaTools',
    metaDescription: 'ಮಕ್ಕಳ ಶಾಲಾ ನೋಟ್‌ಬುಕ್‌ಗಳಿಗಾಗಿ ಸುಂದರವಾದ ನೇಮ್ ಸ್ಲಿಪ್‌ಗಳನ್ನು ರಚಿಸಿ. ಫೋಟೋ ಹಿನ್ನೆಲೆ ತೆಗೆಯುವುದು ಮತ್ತು A4 ಪ್ರಿಂಟ್ ಸೌಲಭ್ಯ.',
    h1: 'ಮಕ್ಕಳ ಶಾಲಾ ನೇಮ್ ಸ್ಲಿಪ್ ಮೇಕರ್ (Name Slip Maker)',
    subtitle: 'ಫೋಟೋ, ಶಾಲೆಯ ಹೆಸರು ಮತ್ತು ತರಗತಿಯೊಂದಿಗೆ ಸುಂದರವಾದ ಲೇಬಲ್‌ಗಳನ್ನು ತಯಾರಿಸಿ A4 ಹಾಳೆಯಲ್ಲಿ ಮುದ್ರಿಸಿ.',
    steps: {
      details: '1. ವಿದ್ಯಾರ್ಥಿ ವಿವರ',
      template: '2. ವಿನ್ಯಾಸ ಆಯ್ಕೆ',
      arrange: '3. A4 ಪುಟ ಜೋಡಣೆ',
      print: '4. ಪ್ರಿಂಟ್ & ಡೌನ್‌ಲೋಡ್'
    },
    labels: {
      studentName: 'ವಿದ್ಯಾರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು',
      classSection: 'ತರಗತಿ & ವಿಭಾಗ',
      schoolName: 'ಶಾಲೆಯ ಹೆಸರು',
      rollNo: 'ರೋಲ್ ನಂಬರ್',
      bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
      phone: 'ಪೋಷಕರ ಫೋನ್ ಸಂಖ್ಯೆ',
      subject: 'ವಿಷಯ',
      customLine: 'ಹೌಸ್ / ಬಸ್ ಮಾರ್ಗ',
      copies: 'ಸ್ಲಿಪ್‌ಗಳ ಸಂಖ್ಯೆ',
      photoUpload: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      removeBg: 'ಹಿನ್ನೆಲೆ ತೆಗೆದುಹಾಕಿ',
      bgRemoved: 'ಹಿನ್ನೆಲೆ ರಹಿತ',
      original: 'ಮೂಲ ಫೋಟೋ',
      cropZoom: 'ಕ್ರಾಪ್ & ಜೂಮ್',
      shape: 'ಫೋಟೋ ಆಕಾರ',
      templates: '12+ ಸುಂದರ ವಿನ್ಯಾಸಗಳು',
      colors: 'ಬಣ್ಣಗಳು',
      slipSize: 'ಸ್ಲಿಪ್ ಗಾತ್ರ',
      cuttingGuides: 'ಕತ್ತರಿಸುವ ಮಾರ್ಗದರ್ಶಿ ಗೆರೆಗಳು',
      printButton: 'A4 ಪ್ರಿಂಟ್ ಮಾಡಿ',
      downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್',
      downloadPng: 'PNG ಡೌನ್‌ಲೋಡ್',
      addStudent: '+ ಇನ್ನೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿ ಸೇರಿಸಿ',
      loadSample: 'ಮಾದರಿ ಮಾಹಿತಿ',
      privacyBadge: '100% ಗೌಪ್ಯತೆ: ಫೋಟೋಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಇರುತ್ತವೆ'
    },
    faqs: [
      {
        question: 'ಒಂದು A4 ಪುಟದಲ್ಲಿ ಎಷ್ಟು ಸ್ಲಿಪ್‌ಗಳು ಮುದ್ರಿಸಬಹುದು?',
        answer: 'ಗಾತ್ರಕ್ಕೆ ತಕ್ಕಂತೆ 21 ಸಣ್ಣ, 10 ಮಧ್ಯಮ ಅಥವಾ 8 ದೊಡ್ಡ ಸ್ಲಿಪ್‌ಗಳನ್ನು ಮುದ್ರಿಸಬಹುದು.'
      }
    ],
    disclaimer: 'ಪೋಷಕರು ಮತ್ತು ಶಿಕ್ಷಕರಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ ಸಾಧನ.'
  },
  bn: {
    locale: 'bn',
    localeName: 'Bengali',
    dir: 'ltr',
    title: 'বাচ্চাদের স্কুল নেম স্লিপ মেকার – ফ্রি লেবেল জেনারেটর | IndiaTools',
    metaDescription: 'বাচ্চাদের স্কুলের খাতা ও বইয়ের জন্য ছবির সাথে সুন্দর নেম স্লিপ তৈরি করুন। ব্যাকগ্রাউন্ড রিমুভাল ও A4 প্রিন্ট লেআউট একদম ফ্রি।',
    h1: 'বাচ্চাদের স্কুল নেম স্লিপ মেকার (Name Slip Maker)',
    subtitle: 'ছবি, স্কুলের নাম, ক্লাস ও রোল নম্বর দিয়ে আকর্ষণীয় নেম স্লিপ তৈরি করে সরাসরি A4 কাগজে প্রিন্ট করুন।',
    steps: {
      details: '১. ছাত্রের তথ্য ও ছবি',
      template: '২. ডিজাইন পছন্দ করুন',
      arrange: '৩. A4 পেজ সাজানো',
      print: '৪. প্রিন্ট ও ডাউনলোড'
    },
    labels: {
      studentName: 'ছাত্র/ছাত্রীর পুরো নাম',
      classSection: 'শ্রেণী ও বিভাগ',
      schoolName: 'স্কুলের নাম',
      rollNo: 'রোল নম্বর',
      bloodGroup: 'রক্তের গ্রুপ',
      phone: 'অভিভাবকের ফোন নম্বর',
      subject: 'বিষয় / বইয়ের নাম',
      customLine: 'হাউস / বাস রুট / মন্তব্য',
      copies: 'স্লিপের সংখ্যা',
      photoUpload: 'ছবি আপলোড করুন',
      removeBg: 'ব্যাকগ্রাউন্ড মুছুন',
      bgRemoved: 'স্বচ্ছ ব্যাকগ্রাউন্ড',
      original: 'মূল ছবি',
      cropZoom: 'ক্রপ ও জুম',
      shape: 'ছবির আকার',
      templates: '১২+ সুন্দর টেমপ্লেট',
      colors: 'রং ও প্যাটার্ন',
      slipSize: 'স্লিপের সাইজ',
      cuttingGuides: 'কাটার দাগ দেখান',
      printButton: 'A4 পেজ প্রিন্ট করুন',
      downloadPdf: 'PDF ডাউনলোড করুন',
      downloadPng: 'PNG ডাউনলোড করুন',
      addStudent: '+ অন্য ছাত্র যোগ করুন',
      loadSample: 'নমুনা তথ্য লোড করুন',
      privacyBadge: '১০০% নিরাপদ: ছবি আপনার ডিভাইসেই সংরক্ষিত থাকে'
    },
    faqs: [
      {
        question: 'একটি A4 পেজে কতগুলি নেম স্লিপ হবে?',
        answer: 'সাইজ অনুযায়ী ২১টি ছোট, ১০টি মাঝারি বা ৮টি বড় স্লিপ সহজে প্রিন্ট করা যায়।'
      }
    ],
    disclaimer: 'অভিভাবক ও শিক্ষকদের জন্য সম্পূর্ণ বিনামূল্যে প্রস্তুত।'
  },
  mr: {
    locale: 'mr',
    localeName: 'Marathi',
    dir: 'ltr',
    title: 'मुलांसाठी स्कूल नेम स्लिप मेकर – मोफत लेबल जनरेटर | IndiaTools',
    metaDescription: 'शालेय वह्या आणि पुस्तकांसाठी फोटोसह आकर्षक नेम स्लिप्स बनवा. बॅकग्राउंड रिमूव्हल आणि A4 प्रिंट लेआउट मोफत.',
    h1: 'शालेय मुलांसाठी नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'मुलांचा फोटो, शाळेचे नाव, इयत्ता आणि हजेरी क्रमांकासह सुंदर नेम लेबल्स तयार करा आणि A4 पानावर प्रिंट करा.',
    steps: {
      details: '१. माहिती व फोटो',
      template: '२. डिझाइन निवडा',
      arrange: '३. A4 मांडणी',
      print: '४. प्रिंट व डाऊनलोड'
    },
    labels: {
      studentName: 'विद्यार्थ्याचे पूर्ण नाव',
      classSection: 'इयत्ता व तुकडी',
      schoolName: 'शाळेचे नाव',
      rollNo: 'हजेरी क्रमांक (Roll No)',
      bloodGroup: 'रक्तगट',
      phone: 'पालकांचा फोन नंबर',
      subject: 'विषय',
      customLine: 'हाउस / बस रूट',
      copies: 'स्लिप्स संख्या',
      photoUpload: 'फोटो अपलोड करा',
      removeBg: 'बॅकग्राउंड काढा',
      bgRemoved: 'बॅकग्राउंड विरहित',
      original: 'मूळ फोटो',
      cropZoom: 'क्रॉप व झूम',
      shape: 'फोटोचा आकार',
      templates: '१२+ सुंदर डिझाइन्स',
      colors: 'रंग व नक्षी',
      slipSize: 'स्लिपचा आकार',
      cuttingGuides: 'कापण्यासाठी रेषा दाखवा',
      printButton: 'A4 शीट प्रिंट करा',
      downloadPdf: 'PDF डाऊनलोड करा',
      downloadPng: 'PNG डाऊनलोड करा',
      addStudent: '+ दुसरा विद्यार्थी जोडा',
      loadSample: 'नमुना माहिती भरा',
      privacyBadge: '१००% खाजगी: फोटो डिव्हाइसबाहेर जात नाहीत'
    },
    faqs: [
      {
        question: 'एका A4 पानावर किती स्लिप्स बसतात?',
        answer: 'आकारानुसार २१ लहान, १० मध्यम किंवा ८ मोठ्या स्लिप्स सहज बसतात.'
      }
    ],
    disclaimer: 'पालकांसाठी मोफत उपयुक्त साधन.'
  },
  gu: {
    locale: 'gu',
    localeName: 'Gujarati',
    dir: 'ltr',
    title: 'બાળકો માટે સ્કૂલ નેમ સ્લિપ મેકર – ફ્રી લેબલ જનરેટર | IndiaTools',
    metaDescription: 'બાળકોની સ્કૂલ નોટબુક અને ચોપડીઓ માટે ફોટો સાથે સુંદર નેમ સ્લિપ બનાવો. 12+ ટેમ્પલેટ અને A4 પ્રિન્ટ લેઆઉટ.',
    h1: 'બાળકો માટે સ્કૂલ નેમ સ્લિપ મેકર (Name Slip Maker)',
    subtitle: 'ફોટો, શાળાનું નામ, ધોરણ અને રોલ નંબર સાથે આકર્ષક નેમ સ્લિપ બનાવો અને A4 શીટ પર પ્રિન્ટ કરો.',
    steps: {
      details: '૧. વિગત અને ફોટો',
      template: '૨. ડિઝાઇન પસંદ કરો',
      arrange: '૩. A4 ગોઠવણી',
      print: '૪. પ્રિન્ટ અને ડાઉનલોડ'
    },
    labels: {
      studentName: 'વિદ્યાર્થીનું પૂરું નામ',
      classSection: 'ધોરણ અને વર્ગ',
      schoolName: 'શાળાનું નામ',
      rollNo: 'રોલ નંબર',
      bloodGroup: 'બ્લડ ગ્રૂપ',
      phone: 'વાલીનો ફોન નંબર',
      subject: 'વિષય',
      customLine: 'હાઉસ / બસ રૂટ',
      copies: 'સ્લિપની સંખ્યા',
      photoUpload: 'ફોટો અપલોડ કરો',
      removeBg: 'બેકગ્રાઉન્ડ દૂર કરો',
      bgRemoved: 'બેકગ્રાઉન્ડ વિના',
      original: 'ઓરિજિનલ ફોટો',
      cropZoom: 'ક્રોપ અને ઝૂમ',
      shape: 'ફોટો આકાર',
      templates: '૧૨+ સુંદર ટેમ્પલેટ્સ',
      colors: 'કલર્સ',
      slipSize: 'સ્લિપ સાઇઝ',
      cuttingGuides: 'કાપવા માટેની ગાઇડલાઇન',
      printButton: 'A4 પ્રિન્ટ કરો',
      downloadPdf: 'PDF ડાઉનલોડ',
      downloadPng: 'PNG ડાઉનલોડ',
      addStudent: '+ અન્ય બાળક ઉમેરો',
      loadSample: 'નમૂના ડેટા લોડ કરો',
      privacyBadge: '૧૦૦% પ્રાઇવેટ: તમારા ફોટા ડિવાઇસમાં જ સુરક્ષિત છે'
    },
    faqs: [
      {
        question: 'એક A4 શીટ પર કેટલી સ્લિપ પ્રિન્ટ થાય?',
        answer: 'સાઇઝ પ્રમાણે ૨૧ નાની, ૧૦ મધ્યમ અથવા ૮ મોટી સ્લિપ પ્રિન્ટ કરી શકાય છે.'
      }
    ],
    disclaimer: 'વાલીઓ અને શિક્ષકો માટે ૧૦૦% મફત ઓનલાઇન ટૂલ.'
  },
  pa: {
    locale: 'pa',
    localeName: 'Punjabi',
    dir: 'ltr',
    title: 'ਬੱਚਿਆਂ ਲਈ ਸਕੂਲ ਨੇਮ ਸਲਿੱਪ ਮੇਕਰ – ਮੁਫਤ ਲੇਬਲ ਜਨਰੇਟਰ | IndiaTools',
    metaDescription: 'ਬੱਚਿਆਂ ਦੀਆਂ ਕਿਤਾਬਾਂ ਤੇ ਕਾਪੀਆਂ ਲਈ ਫੋਟੋ ਵਾਲੀਆਂ ਸੁੰਦਰ ਨੇਮ ਸਲਿੱਪਾਂ ਬਣਾਓ। A4 ਪ੍ਰਿੰਟ ਅਤੇ ਬੈਕਗਰਾਊਂਡ ਰਿਮੂਵਲ ਮੁਫਤ।',
    h1: 'ਬੱਚਿਆਂ ਲਈ ਸਕੂਲ ਨੇਮ ਸਲਿੱਪ ਮੇਕਰ (Name Slip Maker)',
    subtitle: 'ਫੋਟੋ, ਸਕੂਲ ਦਾ ਨਾਮ, ਜਮਾਤ ਅਤੇ ਰੋਲ ਨੰਬਰ ਨਾਲ ਪਿਆਰੀਆਂ ਨੇਮ ਸਲਿੱਪਾਂ ਬਣਾਓ ਅਤੇ A4 ਸ਼ੀਟ ਤੇ ਪ੍ਰਿੰਟ ਕਰੋ।',
    steps: {
      details: '1. ਵਿਦਿਆਰਥੀ ਜਾਣਕਾਰੀ',
      template: '2. ਡਿਜ਼ਾਈਨ ਚੁਣੋ',
      arrange: '3. A4 ਪੰਨਾ ਸੈਟਿੰਗ',
      print: '4. ਪ੍ਰਿੰਟ ਤੇ ਡਾਊਨਲੋਡ'
    },
    labels: {
      studentName: 'ਵਿਦਿਆਰਥੀ ਦਾ ਪੂਰਾ ਨਾਮ',
      classSection: 'ਜਮਾਤ ਅਤੇ ਸੈਕਸ਼ਨ',
      schoolName: 'ਸਕੂਲ ਦਾ ਨਾਮ',
      rollNo: 'ਰੋਲ ਨੰਬਰ',
      bloodGroup: 'ਬਲੱਡ ਗਰੁੱਪ',
      phone: 'ਮਾਪਿਆਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ',
      subject: 'ਵਿਸ਼ਾ',
      customLine: 'ਹਾਊਸ / ਬੱਸ ਰੂਟ',
      copies: 'ਸਲਿੱਪਾਂ ਦੀ ਗਿਣਤੀ',
      photoUpload: 'ਫੋਟੋਆਂ ਅੱਪਲੋਡ ਕਰੋ',
      removeBg: 'ਬੈਕਗ੍ਰਾਊਂਡ ਹਟਾਓ',
      bgRemoved: 'ਬਿਨਾਂ ਬੈਕਗ੍ਰਾਊਂਡ',
      original: 'ਅਸਲ ਫੋਟੋ',
      cropZoom: 'ਕ੍ਰੌਪ ਤੇ ਜ਼ੂਮ',
      shape: 'ਫੋਟੋ ਸ਼ੇਪ',
      templates: '12+ ਸੁੰਦਰ ਡਿਜ਼ਾਈਨ',
      colors: 'ਰੰਗ',
      slipSize: 'ਸਲਿੱਪ ਦਾ ਸਾਈਜ਼',
      cuttingGuides: 'ਕਟਿੰਗ ਲਾਈਨਾਂ ਦਿਖਾਓ',
      printButton: 'A4 ਪ੍ਰਿੰਟ ਕਰੋ',
      downloadPdf: 'PDF ਡਾਊਨਲੋਡ',
      downloadPng: 'PNG ਡਾਊਨਲੋਡ',
      addStudent: '+ ਹੋਰ ਵਿਦਿਆਰਥੀ ਜੋੜੋ',
      loadSample: 'ਸੈਂਪਲ ਡਾਟਾ',
      privacyBadge: '100% ਸੁਰੱਖਿਅਤ: ਫੋਟੋਆਂ ਤੁਹਾਡੇ ਫ਼ੋਨ ਵਿੱਚ ਹੀ ਰਹਿੰਦੀਆਂ ਹਨ'
    },
    faqs: [
      {
        question: 'ਇੱਕ A4 ਸ਼ੀਟ ਉੱਤੇ ਕਿੰਨੀਆਂ ਸਲਿੱਪਾਂ ਆਉਂਦੀਆਂ ਹਨ?',
        answer: 'ਸਾਈਜ਼ ਦੇ ਹਿਸਾਬ ਨਾਲ 21 ਛੋਟੀਆਂ, 10 ਦਰਮਿਆਨੀਆਂ ਜਾਂ 8 ਵੱਡੀਆਂ ਸਲਿੱਪਾਂ ਪ੍ਰਿੰਟ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।'
      }
    ],
    disclaimer: 'ਮਾਪਿਆਂ ਅਤੇ ਅਧਿਆਪਕਾਂ ਲਈ ਮੁਫ਼ਤ ਉਪਯੋਗੀ ਸਾਧਨ।'
  },
  or: {
    locale: 'or',
    localeName: 'Odia',
    dir: 'ltr',
    title: 'ପିଲାଙ୍କ ସ୍କୁଲ୍ ନେମ୍ ସ୍ଲିପ୍ ମେକର୍ – ମାଗଣା ଲେବୁଲ୍ ଜେନେରେଟର୍ | IndiaTools',
    metaDescription: 'ପିଲାଙ୍କ ଖାତା ଓ ବହି ପାଇଁ ଫଟୋ ସହିତ ସୁନ୍ଦର ନାମ ସ୍ଲିପ୍ ତିଆରି କରନ୍ତୁ। A4 ପ୍ରିଣ୍ଟ୍ ଏବଂ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ ହଟାଇବା ସୁବିଧା।',
    h1: 'ପିଲାଙ୍କ ସ୍କୁଲ୍ ନେମ୍ ସ୍ଲିପ୍ ମେକର୍ (Name Slip Maker)',
    subtitle: 'ଫଟୋ, ବିଦ୍ୟାଳୟ ନାମ, ଶ୍ରେଣୀ ଓ ରୋଲ୍ ନମ୍ବର ସହିତ ସୁନ୍ଦର ନାମ ସ୍ଲିପ୍ ଡିଜାଇନ୍ କରି A4 କାଗଜରେ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ।',
    steps: {
      details: '୧. ଛାତ୍ର ବିବରଣୀ',
      template: '୨. ଡିଜାଇନ୍ ଚୟନ',
      arrange: '୩. A4 ପୃଷ୍ଠା ସଜାଣି',
      print: '୪. ପ୍ରିଣ୍ଟ୍ ଓ ଡାଉନଲୋଡ୍'
    },
    labels: {
      studentName: 'ଛାତ୍ରଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ',
      classSection: 'ଶ୍ରେଣୀ ଓ ବିଭାଗ',
      schoolName: 'ବିଦ୍ୟାଳୟର ନାମ',
      rollNo: 'ରୋଲ୍ ନମ୍ବର',
      bloodGroup: 'ରକ୍ତ ବର୍ଗ',
      phone: 'ଅଭିଭାବକଙ୍କ ଫୋନ୍ ନମ୍ବର',
      subject: 'ବିଷୟ',
      customLine: 'ହାଉସ୍ / ବସ୍ ରୁଟ୍',
      copies: 'ସ୍ଲିପ୍ ସଂଖ୍ୟା',
      photoUpload: 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
      removeBg: 'ପୃଷ୍ଠଭୂମି ହଟାନ୍ତୁ',
      bgRemoved: 'ପୃଷ୍ଠଭୂମି ବିହୀନ',
      original: 'ମୂଳ ଫଟୋ',
      cropZoom: 'କ୍ରପ୍ ଓ ଜୁମ୍',
      shape: 'ଫଟୋ ଆକୃତି',
      templates: '୧୨+ ସୁନ୍ଦର ଟେମ୍ପଲେଟ୍',
      colors: 'ରଙ୍ଗ',
      slipSize: 'ସ୍ଲିପ୍ ଆକାର',
      cuttingGuides: 'କାଟିବା ଗାଇଡ୍ ଲାଇନ୍',
      printButton: 'A4 ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      downloadPdf: 'PDF ଡାଉନଲୋଡ୍',
      downloadPng: 'PNG ଡାଉନଲୋଡ୍',
      addStudent: '+ ଅନ୍ୟ ଛାତ୍ର ଯୋଡନ୍ତୁ',
      loadSample: 'ନମୁନା ତଥ୍ୟ',
      privacyBadge: '୧୦୦% ସୁରକ୍ଷିତ: ଫଟୋ ଆପଣଙ୍କ ଡିଭାଇସରେ ହିଁ ରହେ'
    },
    faqs: [
      {
        question: 'ଗୋଟିଏ A4 କାଗଜରେ କେତୋଟି ସ୍ଲିପ୍ ଆସିବ?',
        answer: 'ଆକାର ଅନୁଯାୟୀ ୨୧ଟି ଛୋଟ, ୧୦ଟି ମଧ୍ୟମ କିମ୍ବା ୮ଟି ବଡ଼ ସ୍ଲିପ୍ ପ୍ରିଣ୍ଟ୍ ହୋଇପାରିବ।'
      }
    ],
    disclaimer: 'ପିତାମାତା ଓ ଶିକ୍ଷକମାନଙ୍କ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ସେବା।'
  },
  as: {
    locale: 'as',
    localeName: 'Assamese',
    dir: 'ltr',
    title: 'শিশুৰ স্কুল নেম শ্লিপ মেকাৰ – বিনামূলীয়া নাম লেবেল | IndiaTools',
    metaDescription: 'শিশুৰ স্কুলৰ বহী আৰু কিতাপৰ বাবে ফটো সহ সুন্দৰ নেম শ্লিপ তৈয়াৰ কৰক। A4 প্ৰিণ্ট লেআউট আৰু বেকগ্ৰাউণ্ড ৰিমুভ সম্পূৰ্ণ বিনামূলীয়া।',
    h1: 'শিশুৰ বাবে স্কুল নেম শ্লিপ মেকাৰ (Name Slip Maker)',
    subtitle: 'ফটো, বিদ্যালয়ৰ নাম, শ্ৰেণী আৰু ৰোল নম্বৰৰ সৈতে সুন্দৰ লেবেল বনাই A4 কাগজত প্ৰিণ্ট কৰক।',
    steps: {
      details: '১. ছাত্ৰৰ বিৱৰণ',
      template: '২. ডিজাইন বাছক',
      arrange: '৩. A4 পৃষ্ঠা সজোৱা',
      print: '৪. প্ৰিণ্ট আৰু ডাউনল\'ড'
    },
    labels: {
      studentName: 'ছাত্ৰ/ছাত্ৰীৰ সম্পূৰ্ণ নাম',
      classSection: 'শ্ৰেণী আৰু শাখা',
      schoolName: 'বিদ্যালয়ৰ নাম',
      rollNo: 'ৰোল নম্বৰ',
      bloodGroup: 'তেজৰ গ্ৰুপ',
      phone: 'অভিভাৱকৰ ফোন নম্বৰ',
      subject: 'বিষয়',
      customLine: 'হাউচ / বাছ ৰুট',
      copies: 'শ্লিপৰ সংখ্যা',
      photoUpload: 'ফটো আপল\'ড কৰক',
      removeBg: 'বেকগ্ৰাউণ্ড আতঁৰাওক',
      bgRemoved: 'বেকগ্ৰাউণ্ড অবিহনে',
      original: 'মূল ফটো',
      cropZoom: 'ক্ৰপ আৰু জুম',
      shape: 'ফটোৰ আকৃতি',
      templates: '১২+ আকৰ্ষণীয় ডিজাইন',
      colors: 'ৰং',
      slipSize: 'শ্লিপৰ আকাৰ',
      cuttingGuides: 'কাটিব পৰা ৰেখা দেখুৱাওক',
      printButton: 'A4 প্ৰিণ্ট কৰক',
      downloadPdf: 'PDF ডাউনল\'ড',
      downloadPng: 'PNG ডাউনল\'ড',
      addStudent: '+ আন এজন ছাত্ৰ যোগ কৰক',
      loadSample: 'নমুনা তথ্য',
      privacyBadge: '১০০% সুৰক্ষিত: ফটো আপোনাৰ ডিভাইচতে থাকে'
    },
    faqs: [
      {
        question: 'এখন A4 পৃষ্ঠাত কেইখন শ্লিপ ওলাব?',
        answer: 'আকাৰ অনুসৰি ২১খন সৰু, ১০খন মজলীয়া বা ৮খন ডাঙৰ শ্লিপ সহজে প্ৰিণ্ট কৰিব পাৰি।'
      }
    ],
    disclaimer: 'অভিভাৱক আৰু শিক্ষকৰ বাবে বিনামূলীয়া শৈক্ষিক সঁজুলি।'
  },
  ur: {
    locale: 'ur',
    localeName: 'Urdu',
    dir: 'rtl',
    title: 'بچوں کے اسکول نیم سلپ میکر – مفت لیبل جنریٹر | IndiaTools',
    metaDescription: 'بچوں کی اسکول کاپیوں اور کتابوں کے لیے تصویر کے ساتھ خوبصورت نیم سلپس بنائیں۔ بیک گراؤنڈ ریموول اور A4 پرنٹ بالکل مفت۔',
    h1: 'بچوں کے اسکول نیم سلپ میکر (Name Slip Maker)',
    subtitle: 'تصویر، اسکول کا نام، کلاس اور رول نمبر کے ساتھ خوبصورت نیم سلپس بنائیں اور A4 شیٹ پر پرنٹ کریں۔',
    steps: {
      details: '1. معلومات اور تصویر',
      template: '2. ڈیزائن کا انتخاب',
      arrange: '3. A4 پیج سیٹنگ',
      print: '4. پرنٹ اور ڈاؤن لوڈ'
    },
    labels: {
      studentName: 'طالب علم کا مکمل نام',
      classSection: 'کلاس اور سیکشن',
      schoolName: 'اسکول کا نام',
      rollNo: 'رول نمبر',
      bloodGroup: 'بلڈ گروپ',
      phone: 'والدین کا فون نمبر',
      subject: 'مضمون',
      customLine: 'ہاؤس / بس روٹ',
      copies: 'سلپس کی تعداد',
      photoUpload: 'تصاویر اپ لوڈ کریں',
      removeBg: 'پس منظر ہٹائیں',
      bgRemoved: 'شفاف پس منظر',
      original: 'اصل تصویر',
      cropZoom: 'کراپ اور زوم',
      shape: 'تصویر کی شکل',
      templates: '12+ خوبصورت ٹیمپلیٹس',
      colors: 'رنگ',
      slipSize: 'سلپ کا سائز',
      cuttingGuides: 'کاٹنے کی رہنمائی لائنیں',
      printButton: 'A4 شیٹ پرنٹ کریں',
      downloadPdf: 'PDF ڈاؤن لوڈ کریں',
      downloadPng: 'PNG ڈاؤن لوڈ کریں',
      addStudent: '+ دوسرے طالب علم کا اضافہ کریں',
      loadSample: 'نمونہ ڈیٹا',
      privacyBadge: '100% محفوظ: تصاویر آپ کے آلے میں ہی رہتی ہیں'
    },
    faqs: [
      {
        question: 'ایک A4 شیٹ پر کتنی سلپس پرنٹ ہوتی ہیں؟',
        answer: 'سائز کے لحاظ سے 21 چھوٹی، 10 درمیانی یا 8 بڑی سلپس پرنٹ کی جا سکتی ہیں۔'
      }
    ],
    disclaimer: 'والدین اور اساتذہ کے لیے مفت سہولت۔'
  },
  sa: {
    locale: 'sa',
    localeName: 'Sanskrit',
    dir: 'ltr',
    title: 'छात्राणां विद्यालय नामपत्रिका निर्माता – Free School Name Slip | IndiaTools',
    metaDescription: 'पुस्तकानां कृते सचित्र नामपत्रिकां रचयन्तु। A4 मुद्रणाय सज्जम्।',
    h1: 'छात्राणां विद्यालय नामपत्रिका निर्माता (Name Slip Maker)',
    subtitle: 'छात्रस्य चित्रेण, विद्यालयेन, कक्ष्या च सह रमणीयाः नामपत्रिकाः रचयित्वा A4 पत्रे मुद्रयन्तु।',
    steps: {
      details: '१. विवरणं चित्रं च',
      template: '२. प्रारूप चयनम्',
      arrange: '३. A4 पत्र संयोजनम्',
      print: '४. मुद्रणं डाउनलोड् च'
    },
    labels: {
      studentName: 'छात्रस्य पूर्णं नाम',
      classSection: 'कक्ष्या विभागः च',
      schoolName: 'विद्यालयस्य नाम',
      rollNo: 'अनुक्रमाङ्कः',
      bloodGroup: 'रक्तवर्गः',
      phone: 'अभिभावकस्य दूरभाषः',
      subject: 'विषयः',
      customLine: 'गृहम् / मार्गः',
      copies: 'संख्या',
      photoUpload: 'चित्रं योजयतु',
      removeBg: 'पृष्ठभूमिं निष्कासयतु',
      bgRemoved: 'निष्कासित पृष्ठभूमिः',
      original: 'मूल चित्रम्',
      cropZoom: 'कर्तनं वर्धनं च',
      shape: 'चित्रस्य आकारः',
      templates: '१२+ प्रारूपाणि',
      colors: 'वर्णाः',
      slipSize: 'पत्रिकायाः आकारः',
      cuttingGuides: 'कर्तन रेखाः',
      printButton: 'A4 मुद्रयतु',
      downloadPdf: 'PDF डाउनलोड्',
      downloadPng: 'PNG डाउनलोड्',
      addStudent: '+ अन्यं छात्रं योजयतु',
      loadSample: 'आदर्श तथ्यम्',
      privacyBadge: '१००% सुरक्षितम्'
    },
    faqs: [
      {
        question: 'A4 पत्रे कति पत्रिकाः मुद्रयितुं शक्यन्ते?',
        answer: 'परिमाणानुसारं २१ लघवः, १० मध्यमाः अथवा ८ बृहत्यः पत्रिकाः भवन्ति।'
      }
    ],
    disclaimer: 'अभिभावकानां शिक्षकाणां च सौकर्याय निःशुल्कं साधनम्।'
  },
  kok: {
    locale: 'kok',
    localeName: 'Konkani',
    dir: 'ltr',
    title: 'भुरग्यां खातीर स्कूल नेम स्लिप मेकर | IndiaTools',
    metaDescription: 'शाळेच्या पुस्तकां खातीर फोटो सयत बरी नेम स्लिप तयार करात. A4 प्रिंट फुकट.',
    h1: 'भुरग्यां खातीर स्कूल नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'फोटो, शाळेचें नांव, क्लास आनी रोल नंबर घालून नेम स्लिप्स तयार करात.',
    steps: { details: '१. म्हायती', template: '२. डिझाइन', arrange: '३. A4 मांडणी', print: '४. प्रिंट' },
    labels: {
      studentName: 'विद्यार्थ्याचें पुराय नांव',
      classSection: 'क्लास आनी विभाग',
      schoolName: 'शाळेचें नांव',
      rollNo: 'रोल नंबर',
      bloodGroup: 'रगत गट',
      phone: 'फोन नंबर',
      subject: 'विषय',
      customLine: 'खाशेली नोंद',
      copies: 'संख्या',
      photoUpload: 'फोटो चढावा',
      removeBg: 'फाटलो भाग काढात',
      bgRemoved: 'फाटलो भाग काडिल्लो',
      original: 'मूळ फोटो',
      cropZoom: 'क्रॉप आनी झूम',
      shape: 'आकार',
      templates: '१२+ डिझाइन्स',
      colors: 'रंग',
      slipSize: 'स्लिपेचो आकार',
      cuttingGuides: 'कापपाच्यो रेगो',
      printButton: 'A4 प्रिंट करात',
      downloadPdf: 'PDF डावनलोड',
      downloadPng: 'PNG डावनलोड',
      addStudent: '+ आनीक एक विद्यार्थी',
      loadSample: 'नमुनो म्हायती',
      privacyBadge: '१००% सुरक्षित'
    },
    faqs: [{ question: 'A4 पानाचेर कितल्यो स्लिपो बसतात?', answer: 'आकारा प्रमाण २१ ल्हान वा १० मध्यम स्लिपो बसतात.' }],
    disclaimer: 'पालकां खातीर मोफत साधन.'
  },
  mai: {
    locale: 'mai',
    localeName: 'Maithili',
    dir: 'ltr',
    title: 'बच्चा सभक लेल स्कूल नेम स्लिप मेकर | IndiaTools',
    metaDescription: 'किताब-कापीक लेल फोटो संग सुंदर नेम स्लिप बनाउ। A4 प्रिंट बिल्कुल मुफ्त।',
    h1: 'बच्चा सभक लेल स्कूल नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'फोटो, विद्यालयक नाम, वर्ग आ रोल नंबरक संग सुंदर नेम स्लिप बनाउ आ A4 पर प्रिंट करू।',
    steps: { details: '१. छात्र विवरणी', template: '२. डिजाइन', arrange: '३. A4 विन्यास', print: '४. प्रिंट' },
    labels: {
      studentName: 'छात्रक पूरा नाम',
      classSection: 'वर्ग आ खंड',
      schoolName: 'विद्यालयक नाम',
      rollNo: 'क्रमांक',
      bloodGroup: 'रक्त समूह',
      phone: 'फोन नंबर',
      subject: 'विषय',
      customLine: 'विशेष टिप्पणी',
      copies: 'संख्या',
      photoUpload: 'फोटो अपलोड करू',
      removeBg: 'बैकग्राउंड हटाउ',
      bgRemoved: 'हटाओल बैकग्राउंड',
      original: 'मूल फोटो',
      cropZoom: 'क्रॉप आ ज़ूम',
      shape: 'आकार',
      templates: '१२+ डिजाइन',
      colors: 'रंग',
      slipSize: 'आकार',
      cuttingGuides: 'कटिंग रेखा',
      printButton: 'A4 प्रिंट करू',
      downloadPdf: 'PDF डाउनलोड',
      downloadPng: 'PNG डाउनलोड',
      addStudent: '+ आन छात्र जोडू',
      loadSample: 'नमूना',
      privacyBadge: '१००% सुरक्षित'
    },
    faqs: [{ question: 'एक A4 पर कतेक स्लिप प्रिंट होयत?', answer: 'साइज़क अनुसार २१ छोट वा १० मध्यम स्लिप प्रिंट होयत।' }],
    disclaimer: 'अभिभावक आ शिक्षकक लेल निःशुल्क साधन।'
  },
  ne: {
    locale: 'ne',
    localeName: 'Nepali',
    dir: 'ltr',
    title: 'बालबालिकाका लागि स्कूल नेम स्लिप मेकर | IndiaTools',
    metaDescription: 'कापी र किताबका लागि फोटोसहित आकर्षक नेम स्लिप बनाउनुहोस्। A4 प्रिन्ट निःशुल्क।',
    h1: 'बालबालिकाका लागि स्कूल नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'फोटो, विद्यालयको नाम र कक्षासहित राम्रा नेम लेबलहरू बनाउनुहोस् र A4 मा छाप्नुहोस्।',
    steps: { details: '१. विद्यार्थी विवरण', template: '२. डिजाइन छनौट', arrange: '३. A4 मिलाउने', print: '४. प्रिन्ट' },
    labels: {
      studentName: 'विद्यार्थीको पूरा नाम',
      classSection: 'कक्षा र सेक्सन',
      schoolName: 'विद्यालयको नाम',
      rollNo: 'रोल नम्बर',
      bloodGroup: 'रक्त समूह',
      phone: 'अभिभावकको फोन',
      subject: 'विषय',
      customLine: 'थप विवरण',
      copies: 'संख्या',
      photoUpload: 'फोटो हाल्नुहोस्',
      removeBg: 'पृष्ठभूमि हटाउनुहोस्',
      bgRemoved: 'पृष्ठभूमि बिनाको',
      original: 'सक्कली फोटो',
      cropZoom: 'काट्ने र ठूलो बनाउने',
      shape: 'फोटोको आकार',
      templates: '१२+ डिजाइनहरू',
      colors: 'रंगहरू',
      slipSize: 'स्लिप साइज',
      cuttingGuides: 'काट्ने धर्काहरू',
      printButton: 'A4 प्रिन्ट गर्नुहोस्',
      downloadPdf: 'PDF डाउनलोड',
      downloadPng: 'PNG डाउनलोड',
      addStudent: '+ अर्को विद्यार्थी थप्नुहोस्',
      loadSample: 'नमूना',
      privacyBadge: '१००% गोप्य र सुरक्षित'
    },
    faqs: [{ question: 'एउटा A4 मा कतिवटा स्लिप अटाउँछन्?', answer: 'साइज अनुसार २१ वटा साना वा १० वटा मझौला स्लिप अटाउँछन्।' }],
    disclaimer: 'अभिभावक र शिक्षकका लागि निःशुल्क।'
  },
  ks: {
    locale: 'ks',
    localeName: 'Kashmiri',
    dir: 'rtl',
    title: 'شُرؠن خٲطرٕ اۆسکول نیم سلپ میکر | IndiaTools',
    metaDescription: 'شُرؠن ہٕندؠن کتابن خٲطرٕ تصویر سٟتؠ نیم سلپ بنایو۔ A4 پرنٹ مفت۔',
    h1: 'شُرؠن خٲطرٕ اۆسکول نیم سلپ میکر (Name Slip Maker)',
    subtitle: 'تصویر، اسکول ناو تہٕ کلاسن سٟتؠ نیم سلپس بنایو۔',
    steps: { details: '1. معلومات', template: '2. ڈیزائن', arrange: '3. A4 سیٹنگ', print: '4. پرنٹ' },
    labels: {
      studentName: 'طالب علمک پوار ناو',
      classSection: 'کلاس',
      schoolName: 'اسکولک ناو',
      rollNo: 'رول نمبر',
      bloodGroup: 'بلڈ گروپ',
      phone: 'فون نمبر',
      subject: 'مضمون',
      customLine: 'نوٹ',
      copies: 'تعداد',
      photoUpload: 'فوٹو تھاویو',
      removeBg: 'بیک گراؤنڈ ہٹایو',
      bgRemoved: 'بیک گراؤنڈ بغیر',
      original: 'اصل فوٹو',
      cropZoom: 'کراپ تہٕ زوم',
      shape: 'شکل',
      templates: '12+ ٹیمپلیٹ',
      colors: 'رنگ',
      slipSize: 'سائز',
      cuttingGuides: 'کاٹنے چہِ لکیرٕ',
      printButton: 'A4 پرنٹ',
      downloadPdf: 'PDF ڈاؤن لوڈ',
      downloadPng: 'PNG ڈاؤن لوڈ',
      addStudent: '+ بیٛاکھ طالب علم',
      loadSample: 'نمونہ',
      privacyBadge: '100% محفوظ'
    },
    faqs: [{ question: 'A4 شیٹ پؠٹھ کٲژ سلپ یین؟', answer: 'سائز مطٲبق 21 لۄکٹؠ یا 10 منجھلؠ۔' }],
    disclaimer: 'مفت سہولت۔'
  },
  sd: {
    locale: 'sd',
    localeName: 'Sindhi',
    dir: 'rtl',
    title: 'ٻارن لاء اسڪول نيم سلپ ميڪر | IndiaTools',
    metaDescription: 'ٻارن جي اسڪول ڪاپين لاء فوٽو سان گڏ نيم سلپس ٺاهيو۔',
    h1: 'ٻارن لاء اسڪول نيم سلپ ميڪر (Name Slip Maker)',
    subtitle: 'تصوير ۽ اسڪول جي نالي سان خوبصورت نيم سلپس تيار ڪريو۔',
    steps: { details: '1. تفصيل', template: '2. ڊزائن', arrange: '3. A4 سيٽنگ', print: '4. پرنٽ' },
    labels: {
      studentName: 'شاگرد جو پورو نالو',
      classSection: 'ڪلاس',
      schoolName: 'اسڪول جو نالو',
      rollNo: 'رول نمبر',
      bloodGroup: 'بلڊ گروپ',
      phone: 'فون نمبر',
      subject: 'مضمون',
      customLine: 'نوٽ',
      copies: 'تعداد',
      photoUpload: 'فوٽو اپلوڊ ڪريو',
      removeBg: 'پس منظر هٽايو',
      bgRemoved: 'بغير بيڪ گرائونڊ',
      original: 'اصل فوٽو',
      cropZoom: 'ڪراپ ۽ زوم',
      shape: 'شڪل',
      templates: '12+ ڊزائن',
      colors: 'رنگ',
      slipSize: 'سائيز',
      cuttingGuides: 'ڪٽڻ جون لڪيرون',
      printButton: 'A4 پرنٽ',
      downloadPdf: 'PDF ڊائون لوڊ',
      downloadPng: 'PNG ڊائون لوڊ',
      addStudent: '+ ٻيو شاگرد شامل ڪريو',
      loadSample: 'نمونو',
      privacyBadge: '100% محفوظ'
    },
    faqs: [{ question: 'هڪ A4 پيج تي ڪيتريون سلپس اينديون؟', answer: 'سائيز مطابق 21 ننڍيون يا 10 وچوليون۔' }],
    disclaimer: 'مفت آن لائن ٽول۔'
  },
  doi: {
    locale: 'doi',
    localeName: 'Dogri',
    dir: 'ltr',
    title: 'बच्चें लेई स्कूल नेम स्लिप मेकर | IndiaTools',
    metaDescription: 'बच्चें दी कापियें लेई फोटो कन्नै नेम स्लिप बनाओ। A4 प्रिंट मुफ्त।',
    h1: 'स्कूली बच्चें लेई नेम स्लिप मेकर (Name Slip Maker)',
    subtitle: 'फोटो, स्कूल दा नां ते क्लास कन्नै सुंदर नेम स्लिप बनाओ।',
    steps: { details: '१. जानकारी', template: '२. डिजाइन', arrange: '३. A4 लेआउट', print: '४. प्रिंट' },
    labels: {
      studentName: 'विद्यार्थी दा पूरा नां',
      classSection: 'क्लास',
      schoolName: 'स्कूल दा नां',
      rollNo: 'रोल नंबर',
      bloodGroup: 'ब्लड ग्रुप',
      phone: 'फोन नंबर',
      subject: 'विषय',
      customLine: 'नोट',
      copies: 'गिनती',
      photoUpload: 'फोटो पाओ',
      removeBg: 'बैकग्राउंड हटाओ',
      bgRemoved: 'हटाया बैकग्राउंड',
      original: 'असली फोटो',
      cropZoom: 'क्रॉप ते ज़ूम',
      shape: 'आकार',
      templates: '१२+ डिजाइन',
      colors: 'रंग',
      slipSize: 'साइज',
      cuttingGuides: 'कटिंग लाइन',
      printButton: 'A4 प्रिंट करो',
      downloadPdf: 'PDF डाउनलोड',
      downloadPng: 'PNG डाउनलोड',
      addStudent: '+ होर विद्यार्थी जोड़ो',
      loadSample: 'नमूना',
      privacyBadge: '१००% सुरक्षित'
    },
    faqs: [{ question: 'इक A4 शीट पर किन्नियां स्लिप बनंगियां?', answer: 'साइज मताबक २१ निक्कियां जां १० मद्धम।' }],
    disclaimer: 'मुफ्त साधन।'
  },
  mni: {
    locale: 'mni',
    localeName: 'Manipuri (Meitei)',
    dir: 'ltr',
    title: 'অঙাংশিংগী স্কুল নেম স্লিপ মেকার | IndiaTools',
    metaDescription: 'অঙাংশিংগী লাইরিক অমসুং নোটবুক্কীদমক ফোতো য়াওবা নেম স্লিপ শেম্বিয়ু। A4 প্রিন্ট ফ্রী।',
    h1: 'অঙাংশিংগী স্কুল নেম স্লিপ মেকার (Name Slip Maker)',
    subtitle: 'ফোতো, স্কুলগী মিং অমসুং ক্লাস য়াওনা ফজবা নেম স্লিপ শেম্লগা A4 পেপর্দা প্রিন্ট তৌবীয়ু।',
    steps: { details: '১. ৱারোল', template: '২. ডিজাইন', arrange: '৩. A4 লেআউট', print: '৪. প্রিন্ট' },
    labels: {
      studentName: 'মহৈরোইগী অপুনবা মিং',
      classSection: 'ক্লাস',
      schoolName: 'স্কুলগী মিং',
      rollNo: 'রোল নম্বর',
      bloodGroup: 'ই-গী কাংলুপ',
      phone: 'ফোন নম্বর',
      subject: 'সাবজেক্ট',
      customLine: 'অতোপ্পা ৱাফম',
      copies: 'মশীং',
      photoUpload: 'ফোতো হাপ্পীয়ু',
      removeBg: 'বেকগ্রাউণ্ড লৌথোকপু',
      bgRemoved: 'বেকগ্রাউণ্ড য়াওদবা',
      original: 'অশেংবা ফোতো',
      cropZoom: 'ক্রপ অমসুং জুম',
      shape: 'মওং',
      templates: '১২+ ডিজাইন',
      colors: 'মচু',
      slipSize: 'অচাংবা',
      cuttingGuides: 'কক্নবা লাইন',
      printButton: 'A4 প্রিন্ট তৌবীয়ু',
      downloadPdf: 'PDF দাউনলোদ',
      downloadPng: 'PNG দাউনলোদ',
      addStudent: '+ অতোপ্পা মহৈরোই হাপ্পীয়ু',
      loadSample: 'নমুনা',
      privacyBadge: '১০০% শেফগাদবা'
    },
    faqs: [{ question: 'A4 অমদা স্লিপ কয়া য়াওগনি?', answer: 'সাইজগী মতুং ইন্না ২১ নত্রগা ১০ য়াওগনি।' }],
    disclaimer: 'ফ্রী ওইবা তুল।'
  },
  brx: {
    locale: 'brx',
    localeName: 'Bodo',
    dir: 'ltr',
    title: 'गथ’फोरनि फरायसालि मुं स्लिप बानायग्रा | IndiaTools',
    metaDescription: 'गथ’फोरनि फरायसालिनि बिजाबनि थाखाय फोटोजों मोजां मुं स्लिप बानाय। A4 प्रिन्ट फ्रि।',
    h1: 'गथ’फोरनि थाखाय नेम स्लिप बानायग्रा (Name Slip Maker)',
    subtitle: 'फोटो, फरायसालिनि मुं आरो थाखोनि मुंखौ होनानै A4 बिलाइयाव प्रिन्ट खालाम।',
    steps: { details: '१. खौरां', template: '२. सायख’नाय', arrange: '३. A4 महर', print: '४. प्रिन्ट' },
    labels: {
      studentName: 'फरायसुला/फरायसुलिनि मुं',
      classSection: 'थाखो',
      schoolName: 'फरायसालिनि मुं',
      rollNo: 'र’ल नम्बर',
      bloodGroup: 'थै हानजा',
      phone: 'फोन नम्बर',
      subject: 'आयदा',
      customLine: 'गुबुन खौरां',
      copies: 'अनजिमा',
      photoUpload: 'फोटो हर',
      removeBg: 'उनफारिखौ बोखार',
      bgRemoved: 'उनफारि गयि',
      original: 'गुबै फोटो',
      cropZoom: 'क्रप आरो जुम',
      shape: 'महर',
      templates: '१२+ नमुना',
      colors: 'गाब',
      slipSize: 'महर',
      cuttingGuides: 'दानग्रा हांखो',
      printButton: 'A4 प्रिन्ट खालाम',
      downloadPdf: 'PDF दाउनल’द',
      downloadPng: 'PNG दाउनल’द',
      addStudent: '+ गुबुन फरायसुला दाजाब',
      loadSample: 'नमुना',
      privacyBadge: '१००% रैखाथि'
    },
    faqs: [{ question: 'A4 बिलाइयाव बेसेबां स्लिप फैगोन?', answer: 'महर बादियै २१ एबा १० फैगोन।' }],
    disclaimer: 'गथ’फोरनि बिमा-बिफा आरो फोरोंगिरिफोरनि थाखाय फ्रि।'
  },
  sat: {
    locale: 'sat',
    localeName: 'Santali',
    dir: 'ltr',
    title: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱤᱥᱠᱩᱞ ᱧᱩᱛᱩᱢ ᱥᱞᱤᱯ ᱵᱮᱱᱟᱣᱤᱡ | IndiaTools',
    metaDescription: 'ᱯᱩᱛᱷᱤ ᱟᱨ ᱠᱷᱟᱛᱟ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱚᱴᱚ ᱥᱟᱶ ᱪᱚᱨᱚᱠ ᱧᱩᱛᱩᱢ ᱥᱞᱤᱯ ᱵᱮᱱᱟᱣ ᱢᱮ। A4 ᱪᱷᱟᱯᱟ ᱯᱷᱨᱤ।',
    h1: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱤᱥᱠᱩᱞ ᱧᱩᱛᱩᱢ ᱥᱞᱤᱯ ᱵᱮᱱᱟᱣᱤᱡ (Name Slip Maker)',
    subtitle: 'ᱯᱷᱚᱴᱚ, ᱤᱥᱠᱩᱞ ᱧᱩᱛᱩᱢ, ᱠᱞᱟᱥ ᱥᱟᱶ ᱪᱚᱨᱚᱠ ᱥᱞᱤᱯ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ A4 ᱨᱮ ᱪᱷᱟᱯᱟᱭ ᱢᱮ।',
    steps: { details: '᱑. ᱵᱤᱵᱚᱨᱚᱱ', template: '᱒. ᱰᱤᱡᱟᱭᱤᱱ', arrange: '᱓. A4 ᱥᱟᱡᱟᱣ', print: '᱔. ᱪᱷᱟᱯᱟ' },
    labels: {
      studentName: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱣᱟᱜ ᱧᱩᱛᱩᱢ',
      classSection: 'ᱪᱟᱱᱟᱪ',
      schoolName: 'ᱤᱥᱠᱩᱞ ᱧᱩᱛᱩᱢ',
      rollNo: 'ᱨᱳᱞ ᱱᱚᱢᱵᱚᱨ',
      bloodGroup: 'ᱢᱟᱭᱟᱢ ᱦᱟᱹᱴᱤᱧ',
      phone: 'ᱯᱷᱳᱱ ᱱᱚᱢᱵᱚᱨ',
      subject: 'ᱥᱟᱛᱟᱢ',
      customLine: 'ᱵᱤᱥᱮᱥ',
      copies: 'ᱞᱮᱠᱷᱟ',
      photoUpload: 'ᱯᱷᱳᱴᱳ ᱞᱟᱫᱮ',
      removeBg: 'ᱛᱟᱭᱚᱢ ᱥᱟᱦᱟᱭ ᱢᱮ',
      bgRemoved: 'ᱛᱟᱭᱚᱢ ᱵᱟᱹᱱᱩᱜ',
      original: 'ᱟᱥᱚᱞ ᱯᱷᱳᱴᱳ',
      cropZoom: 'ᱜᱮᱫ ᱟᱨ ᱢᱟᱨᱟᱝ',
      shape: 'ᱨᱩᱯ',
      templates: '᱑᱒+ ᱰᱤᱡᱟᱭᱤᱱ',
      colors: 'ᱨᱚᱝ',
      slipSize: 'ᱢᱟᱯ',
      cuttingGuides: 'ᱜᱮᱫ ᱜᱟᱨ',
      printButton: 'A4 ᱪᱷᱟᱯᱟᱭ ᱢᱮ',
      downloadPdf: 'PDF ᱰᱟᱣᱩᱱᱞᱳᱰ',
      downloadPng: 'PNG ᱰᱟᱣᱩᱱᱞᱳᱰ',
      addStudent: '+ ᱮᱴᱟᱜ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱥᱮᱞᱮᱫ',
      loadSample: 'ᱱᱟᱢᱩᱱᱟ',
      privacyBadge: '᱑᱐᱐% ᱫᱟᱱᱟᱝ'
    },
    faqs: [{ question: 'ᱢᱤᱫ A4 ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱞᱤᱯ ᱦᱤᱡᱩᱜᱼᱟ?', answer: 'ᱢᱟᱯ ᱞᱮᱠᱟᱛᱮ ᱒᱑ ᱵᱟᱝᱠᱷᱟᱱ ᱑᱐ ᱜᱚᱴᱟᱝ।' }],
    disclaimer: 'ᱥᱟᱱᱟᱢ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱜᱟᱬᱟ ᱥᱟᱫᱷᱚᱱ।'
  }
}

export function getNameSlipTranslation(langCode: string): NameSlipToolContent {
  if (isNameSlipLocale(langCode)) {
    return NAME_SLIP_TOOL_I18N[langCode]
  }
  return NAME_SLIP_TOOL_I18N.en
}
