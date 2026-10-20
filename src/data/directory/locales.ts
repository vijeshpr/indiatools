import type { DirectoryLangCode, DirectoryLocaleMeta, DirectoryPageUi } from './types.ts'

export const DIRECTORY_LOCALES: Record<DirectoryLangCode, DirectoryLocaleMeta> = {
  en: { code: 'en', bcp47: 'en-IN', name: 'English', nativeName: 'English', script: 'Latin', dir: 'ltr' },
  hi: { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', dir: 'ltr' },
  ml: { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', dir: 'ltr' },
  ta: { code: 'ta', bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', dir: 'ltr' },
  te: { code: 'te', bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', dir: 'ltr' },
  kn: { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', dir: 'ltr' },
  bn: { code: 'bn', bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', dir: 'ltr' },
  mr: { code: 'mr', bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', dir: 'ltr' },
  gu: { code: 'gu', bcp47: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', dir: 'ltr' },
  pa: { code: 'pa', bcp47: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', dir: 'ltr' },
  or: { code: 'or', bcp47: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', dir: 'ltr' },
  as: { code: 'as', bcp47: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', dir: 'ltr' },
  ur: { code: 'ur', bcp47: 'ur-IN', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', dir: 'rtl' },
  sa: { code: 'sa', bcp47: 'sa-IN', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', dir: 'ltr' },
  kok: { code: 'kok', bcp47: 'kok-IN', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', dir: 'ltr' },
  mai: { code: 'mai', bcp47: 'mai-IN', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', dir: 'ltr' },
  ne: { code: 'ne', bcp47: 'ne-IN', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', dir: 'ltr' },
  ks: { code: 'ks', bcp47: 'ks-IN', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', script: 'Arabic-Devanagari', dir: 'rtl' },
  sd: { code: 'sd', bcp47: 'sd-IN', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', script: 'Arabic-Devanagari', dir: 'rtl' },
  doi: { code: 'doi', bcp47: 'doi-IN', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', dir: 'ltr' },
  mni: { code: 'mni', bcp47: 'mni-IN', name: 'Manipuri', nativeName: 'মৈতৈলোন্ / মণিপুরি', script: 'Bengali-Meitei', dir: 'ltr' },
  brx: { code: 'brx', bcp47: 'brx-IN', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', dir: 'ltr' },
  sat: { code: 'sat', bcp47: 'sat-IN', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', dir: 'ltr' }
}

export const DIRECTORY_LANG_CODES = Object.keys(DIRECTORY_LOCALES) as DirectoryLangCode[]

export function isDirectoryLangCode(code: string): code is DirectoryLangCode {
  return code in DIRECTORY_LOCALES
}

export const DIRECTORY_UI: Record<DirectoryLangCode, DirectoryPageUi> = {
  en: {
    title: 'All IndiaTools – Directory of All 68 Tools in 22 Indian Languages | IndiaTools',
    metaDescription: 'Browse the complete multilingual directory of IndiaTools: 68 practical online calculators and useful tools across 22 official Indian languages. Fast, client-side, and private.',
    h1: 'All IndiaTools — All Tools in Indian Languages',
    subtitle: 'Comprehensive directory of 68 practical calculators, civil estimators, power utilities, image converters, and creative tools accessible in 22 official Indian languages.',
    searchPlaceholder: 'Search 68 tools by name, description, or keyword...',
    allCategoriesLabel: 'All Categories',
    categoryLabels: {
      drive: 'Drive & Vehicles',
      build: 'Build & Construction',
      power: 'Power & Energy',
      money: 'Salary & Finance',
      land: 'Land & Survey',
      work: 'Career & Work',
      create: 'Create & Media Tools'
    },
    openToolLabel: 'Open Tool',
    noResultsFound: 'No tools found matching your search',
    noResultsSuggestion: 'Try a different search query or clear category filters to view all tools.',
    clearSearchLabel: 'Clear Search',
    totalToolsLabel: '68 Tools Available',
    availableLanguagesBadge: '22 Indian Languages Supported',
    breadcrumbs: {
      home: 'Home',
      directory: 'All Tools Directory'
    },
    featuredSectionTitle: 'Explore Tools by Category',
    multilingualBadge: 'Multilingual'
  },
  hi: {
    title: 'सभी इंडियाटूल्स – 22 भारतीय भाषाओं में सभी 68 टूल्स की डायरेक्टरी | IndiaTools',
    metaDescription: 'इंडियाटूल्स के सभी 68 उपयोगी ऑनलाइन कैलकुलेटर और टूल्स की सम्पूर्ण डायरेक्टरी देखें। वाहन माइलेज, निर्माण लागत, बिजली बिल, सैलरी और फोटो टूल्स हिन्दी में।',
    h1: 'सभी इंडियाटूल्स — भारतीय भाषाओं में सभी टूल्स',
    subtitle: '22 आधिकारिक भारतीय भाषाओं में 68 व्यावहारिक कैलकुलेटर, निर्माण एस्टीमेटर, बिजली टूल्स, दस्तावेज़ और मीडिया टूल्स की विस्तृत निर्देशिका।',
    searchPlaceholder: 'नाम या विवरण से 68 टूल्स खोजें...',
    allCategoriesLabel: 'सभी श्रेणियां',
    categoryLabels: {
      drive: 'वाहन एवं यात्रा',
      build: 'निर्माण एवं सामग्री',
      power: 'बिजली एवं ऊर्जा',
      money: 'सैलरी एवं वित्त',
      land: 'जमीन एवं नाप',
      work: 'करियर एवं अनुभव',
      create: 'क्रिएटिव एवं मीडिया टूल्स'
    },
    openToolLabel: 'टूल खोलें',
    noResultsFound: 'आपकी खोज से मेल खाता कोई टूल नहीं मिला',
    noResultsSuggestion: 'कृपया अलग शब्द खोजें या फ़िल्टर हटाकर सभी टूल्स देखें।',
    clearSearchLabel: 'सर्च हटाएं',
    totalToolsLabel: '68 टूल्स उपलब्ध',
    availableLanguagesBadge: '22 भारतीय भाषाओं में उपलब्ध',
    breadcrumbs: {
      home: 'होम',
      directory: 'सभी टूल्स डायरेक्टरी'
    },
    featuredSectionTitle: 'श्रेणी अनुसार टूल्स देखें',
    multilingualBadge: 'बहुभाषी'
  },
  ml: {
    title: 'എല്ലാ ഇന്ത്യടൂൾസും – 22 ഇന്ത്യൻ ഭാഷകളിലെ 68 ടൂളുകളുടെ ഡയറക്ടറി | IndiaTools',
    metaDescription: 'ഇന്ത്യടൂൾസിലെ മുഴുവൻ 68 പ്രാക്ടിക്കൽ കാൽക്കുലേറ്ററുകളും ടൂളുകളും മലയാളത്തിലും മറ്റ് 22 ഇന്ത്യൻ ഭാഷകളിലും പരിശോധിക്കൂ. വാഹനം, നിർമ്മാണം, വൈദ്യുതി, ശമ്പളം, ഫോട്ടോ ടൂളുകൾ.',
    h1: 'എല്ലാ ഇന്ത്യടൂൾസും — ഇന്ത്യൻ ഭാഷകളിൽ എല്ലാ ടൂളുകളും',
    subtitle: '22 ഔദ്യോഗിക ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യമായ 68 കാൽക്കുലേറ്ററുകൾ, നിർമ്മാണ കണക്കുകൂട്ടലുകൾ, വൈദ്യുതി, ലാൻഡ് ഏരിയ, ഡോക്യുമെന്റ് ടൂളുകൾ എന്നിവയുടെ സമ്പൂർണ്ണ ഡയറക്ടറി.',
    searchPlaceholder: 'പേരോ വിവരങ്ങളോ നൽകി 68 ടൂളുകൾ തിരയൂ...',
    allCategoriesLabel: 'എല്ലാ വിഭാഗങ്ങളും',
    categoryLabels: {
      drive: 'വാഹനം & യാത്ര',
      build: 'നിർമ്മാണം & സാമഗ്രികൾ',
      power: 'വൈദ്യുതി & ഊർജ്ജം',
      money: 'ശമ്പളം & ധനകാര്യം',
      land: 'ഭൂമി & അളവുകൾ',
      work: 'തൊഴിൽ & പ്രവൃത്തിപരിചയം',
      create: 'ക്രിയേറ്റീവ് & മീഡിയ ടൂളുകൾ'
    },
    openToolLabel: 'ടൂൾ തുറക്കുക',
    noResultsFound: 'തിരഞ്ഞ ടൂളുകൾ ഒന്നും കണ്ടെത്താനായില്ല',
    noResultsSuggestion: 'മറ്റൊരു വാക്ക് നൽകുകയോ ഫിൽട്ടർ മാറ്റി എല്ലാ ടൂളുകളും പരിശോധിക്കുകയോ ചെയ്യുക.',
    clearSearchLabel: 'തിരച്ചിൽ മാറ്റുക',
    totalToolsLabel: '68 ടൂളുകൾ ലഭ്യമാണ്',
    availableLanguagesBadge: '22 ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യമാണ്',
    breadcrumbs: {
      home: 'ഹോം',
      directory: 'എല്ലാ ടൂളുകളുടെ ഡയറക്ടറി'
    },
    featuredSectionTitle: 'വിഭാഗം തിരിച്ച് ടൂളുകൾ പരിശോധിക്കൂ',
    multilingualBadge: 'ബഹുഭാഷ'
  },
  ta: {
    title: 'அனைத்து இந்தியா டூல்ஸ் – 22 இந்திய மொழிகளில் 68 கருவிகளின் அடைவு | IndiaTools',
    metaDescription: 'இந்தியா டூல்ஸின் 68 பயனுள்ள ஆன்லைன் கால்குலேட்டர்கள் மற்றும் கருவிகள். வாகனம், கட்டுமானம், மின்சாரம், சம்பளம், புகைப்படக் கருவிகள் தமிழில்.',
    h1: 'அனைத்து இந்தியா டூல்ஸ் — இந்திய மொழிகளில் அனைத்துக் கருவிகள்',
    subtitle: '22 அதிகாரப்பூர்வ இந்திய மொழிகளில் 68 நடைமுறை கால்குலேட்டர்கள், வாகன மைலேஜ், கட்டுமான மதிப்பீடு, மின் கட்டணம் மற்றும் புகைப்படக் கருவிகளின் முழுமையான அடைவு.',
    searchPlaceholder: 'பெயர் அல்லது விளக்கம் மூலம் 68 கருவிகளைத் தேடுங்கள்...',
    allCategoriesLabel: 'அனைத்து பிரிவுகள்',
    categoryLabels: {
      drive: 'வாகனம் & பயணம்',
      build: 'கட்டுமானம் & பொருட்கள்',
      power: 'மின்சாரம் & ஆற்றல்',
      money: 'சம்பளம் & நிதி',
      land: 'நிலம் & அளவீடு',
      work: 'தொழில் & அனுபவம்',
      create: 'மீடியா & ஆவணக் கருவிகள்'
    },
    openToolLabel: 'கருவியைத் திறக்கவும்',
    noResultsFound: 'பொருந்தும் கருவிகள் எதுவும் கிடைக்கவில்லை',
    noResultsSuggestion: 'வேறு சொல்லைத் தேடவும் அல்லது வடிகட்டியை நீக்கி அனைத்துக் கருவிகளையும் காண்க.',
    clearSearchLabel: 'தேடலை அழிக்கவும்',
    totalToolsLabel: '68 கருவிகள் கிடைக்கின்றன',
    availableLanguagesBadge: '22 இந்திய மொழிகளில் கிடைக்கிறது',
    breadcrumbs: {
      home: 'முகப்பு',
      directory: 'அனைத்து கருவிகள் அடைவு'
    },
    featuredSectionTitle: 'பிரிவு வாரியாகக் கருவிகளை ஆராயுங்கள்',
    multilingualBadge: 'பன்மொழி'
  },
  te: {
    title: 'అన్ని ఇండియాటూల్స్ – 22 భారతీయ భాషలలో 68 టూల్స్ డైరెక్టరీ | IndiaTools',
    metaDescription: 'ఇండియాటూల్స్ లోని 68 ఆన్‌లైన్ కాలిక్యులేటర్లు మరియు టూల్స్ పూర్తి డైరెక్టరీ. మైలేజ్, నిర్మాణం, విద్యుత్ బిల్లు, జీతం, ఫోటో టూల్స్ తెలుగులో.',
    h1: 'అన్ని ఇండియాటూల్స్ — భారతీయ భాషలలో అన్ని టూల్స్',
    subtitle: '22 అధికారిక భారతీయ భాషలలో 68 ప్రాక్టికల్ కాలిక్యులేటర్లు, సివిల్ ఎస్టిమేటర్లు, విద్యుత్ బిల్లులు, డాక్యుమెంట్ మరియు ఫోటో టూల్స్ పూర్తి డైరెక్టరీ.',
    searchPlaceholder: 'పేరు లేదా వివరాలతో 68 టూల్స్ శోధించండి...',
    allCategoriesLabel: 'అన్ని విభాగాలు',
    categoryLabels: {
      drive: 'వాహనం & ప్రయాణం',
      build: 'నిర్మాణం & పదార్థాలు',
      power: 'విద్యుత్ & శక్తి',
      money: 'జీతం & ఫైనాన్స్',
      land: 'భూమి & కొలతలు',
      work: 'కెరీర్ & అనుభవం',
      create: 'క్రియేటివ్ & మీడియా టూల్స్'
    },
    openToolLabel: 'టూల్ తెరవండి',
    noResultsFound: 'మీ శోధనకు తగిన టూల్స్ ఏవీ కనుగొనబడలేదు',
    noResultsSuggestion: 'దయచేసి వేరే పదంతో వెతకండి లేదా ఫిల్టర్లను రీసెట్ చేసి అన్ని టూల్స్ చూడండి.',
    clearSearchLabel: 'శోధన క్లియర్ చేయండి',
    totalToolsLabel: '68 టూల్స్ అందుబాటులో ఉన్నాయి',
    availableLanguagesBadge: '22 భారతీయ భాషలలో అందుబాటులో ఉంది',
    breadcrumbs: {
      home: 'హోమ్',
      directory: 'అన్ని టూల్స్ డైరెక్టరీ'
    },
    featuredSectionTitle: 'విభాగం వారీగా టూల్స్ పరిశీలించండి',
    multilingualBadge: 'బహుభాషా'
  },
  kn: {
    title: 'ಎಲ್ಲಾ ಇಂಡಿಯಾಟೂಲ್ಸ್ – 22 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ 68 ಉಪಕರಣಗಳ ಡೈರೆಕ್ಟರಿ | IndiaTools',
    metaDescription: 'ಇಂಡಿಯಾಟೂಲ್ಸ್‌ನ 68 ಉಪಯುಕ್ತ ಆನ್‌ಲೈನ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು ಮತ್ತು ಟೂಲ್‌ಗಳ ಸಂಪೂರ್ಣ ಡೈರೆಕ್ಟರಿ. ವಾಹನ ಮೈಲೇಜ್, ನಿರ್ಮಾಣ, ವಿದ್ಯುತ್, ಸಂಬಳ, ಫೋಟೋ ಟೂಲ್ಸ್ ಕನ್ನಡದಲ್ಲಿ.',
    h1: 'ಎಲ್ಲಾ ಇಂಡಿಯಾಟೂಲ್ಸ್ — ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಎಲ್ಲಾ ಟೂಲ್ಸ್',
    subtitle: '22 ಅಧಿಕೃತ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿರುವ 68 ಪ್ರಾಯೋಗಿಕ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು, ನಿರ್ಮಾಣ ವೆಚ್ಚ, ವಿದ್ಯುತ್, ಭೂ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಡಾಕ್ಯುಮೆಂಟ್ ಟೂಲ್‌ಗಳ ಡೈರೆಕ್ಟರಿ.',
    searchPlaceholder: 'ಹೆಸರು ಅಥವಾ ವಿವರಣೆಯಿಂದ 68 ಟೂಲ್‌ಗಳನ್ನು ಹುಡುಕಿ...',
    allCategoriesLabel: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    categoryLabels: {
      drive: 'ವಾಹನ & ಪ್ರಯಾಣ',
      build: 'ನಿರ್ಮಾಣ & ಸಾಮಗ್ರಿಗಳು',
      power: 'ವಿದ್ಯುತ್ & ಇಂಧನ',
      money: 'ಸಂಬಳ & ಹಣಕಾಸು',
      land: 'ಭೂಮಿ & ಸರ್ವೇಕ್ಷಣ',
      work: 'ವೃತ್ತಿ & ಅನುಭವ',
      create: 'ಕ್ರಿಯೇಟಿವ್ & ಮೀಡಿಯಾ ಟೂಲ್ಸ್'
    },
    openToolLabel: 'ಟೂಲ್ ತೆರೆಯಿರಿ',
    noResultsFound: 'ಹುಡುಕಾಟಕ್ಕೆ ಸೂಕ್ತವಾದ ಉಪಕರಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noResultsSuggestion: 'ದಯವಿಟ್ಟು ಬೇರೆ ಪದವನ್ನು ಹುಡುಕಿ ಅಥವಾ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ ಎಲ್ಲಾ ಟೂಲ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
    clearSearchLabel: 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ',
    totalToolsLabel: '68 ಟೂಲ್‌ಗಳು ಲಭ್ಯವಿದೆ',
    availableLanguagesBadge: '22 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯ',
    breadcrumbs: {
      home: 'ಮುಖಪುಟ',
      directory: 'ಎಲ್ಲಾ ಟೂಲ್‌ಗಳ ಡೈರೆಕ್ಟರಿ'
    },
    featuredSectionTitle: 'ವರ್ಗವಾರು ಟೂಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    multilingualBadge: 'ಬಹುಭಾಷಿಕ'
  },
  bn: {
    title: 'সমস্ত ইন্ডিয়াটুলস – ২২টি ভারতীয় ভাষায় ৬৮টি টুলের ডিরেক্টরি | IndiaTools',
    metaDescription: 'ইন্ডিয়াটুলসের সমস্ত ৬৮টি বাস্তবমুখী অনলাইন ক্যালকুলেটর ও টুলসের সম্পূর্ণ ডিরেক্টরি। গাড়ির মাইলেজ, নির্মাণ খরচ, বিদ্যুৎ বিল, বেতন ও ছবির টুলস বাংলায়।',
    h1: 'সমস্ত ইন্ডিয়াটুলস — ভারতীয় ভাষায় সমস্ত টুলস',
    subtitle: '২২টি সরকারি ভারতীয় ভাষায় উপলভ্য ৬৮টি ব্যবহারিক ক্যালকুলেটর, নির্মাণ প্রাক্কলন, বিদ্যুৎ, জমি জরিপ ও ডকুমেন্ট টুলসের বিস্তারিত ডিরেক্টরি।',
    searchPlaceholder: 'নাম বা বিবরণ দিয়ে ৬৮টি টুল খুঁজুন...',
    allCategoriesLabel: 'সমস্ত বিভাগ',
    categoryLabels: {
      drive: 'গাড়ি ও যাতায়াত',
      build: 'নির্মাণ ও সামগ্রী',
      power: 'বিদ্যুৎ ও শক্তি',
      money: 'বেতন ও অর্থ',
      land: 'জমি ও পরিমাপ',
      work: 'পেশা ও অভিজ্ঞতা',
      create: 'সৃজনশীল ও মিডিয়া টুলস'
    },
    openToolLabel: 'টুল খুলুন',
    noResultsFound: 'কোনো টুল খুঁজে পাওয়া যায়নি',
    noResultsSuggestion: 'দয়া করে অন্য শব্দ দিয়ে খুঁজুন অথবা ফিল্টার সরিয়ে সমস্ত টুল দেখুন।',
    clearSearchLabel: 'মুছে ফেলুন',
    totalToolsLabel: '৬৮টি টুল উপলব্ধ',
    availableLanguagesBadge: '২২টি ভারতীয় ভাষায় উপলব্ধ',
    breadcrumbs: {
      home: 'হোম',
      directory: 'সমস্ত টুলের ডিরেক্টরি'
    },
    featuredSectionTitle: 'বিভাগ অনুযায়ী টুল দেখুন',
    multilingualBadge: 'বহুভাষিক'
  },
  mr: {
    title: 'सर्व इंडियाटूल्स – २२ भारतीय भाषांमध्ये सर्व ६८ टूल्सची डिरेक्टरी | IndiaTools',
    metaDescription: 'इंडियाटूल्सवरील सर्व ६८ उपयुक्त ऑनलाइन कॅल्क्युलेटर आणि टूल्सची संपूर्ण डिरेक्टरी. वाहन मायलेज, बांधकाम खर्च, वीज बिल, पगार आणि फोटो टूल्स मराठीत.',
    h1: 'सर्व इंडियाटूल्स — भारतीय भाषांमध्ये सर्व टूल्स',
    subtitle: '२२ अधिकृत भारतीय भाषांमध्ये उपलब्ध ६८ व्यावहारिक कॅल्क्युलेटर, बांधकाम अंदाजपत्रक, वीज दर, जमीन मोजणी आणि दस्तऐवज टूल्सची परिपूर्ण डिरेक्टरी.',
    searchPlaceholder: 'नाव किंवा माहितीनुसार ६८ टूल्स शोधा...',
    allCategoriesLabel: 'सर्व श्रेणी',
    categoryLabels: {
      drive: 'वाहन आणि प्रवास',
      build: 'बांधकाम आणि साहित्य',
      power: 'वीज आणि ऊर्जा',
      money: 'पगार आणि वित्त',
      land: 'जमीन आणि मोजणी',
      work: 'करिअर आणि अनुभव',
      create: 'क्रिएटिव्ह आणि मीडिया टूल्स'
    },
    openToolLabel: 'टूल उघडा',
    noResultsFound: 'शोधलेले कोणतेही टूल सापडले नाही',
    noResultsSuggestion: 'कृपया वेगळा शब्द शोधा किंवा फिल्टर काढून सर्व टूल्स पहा.',
    clearSearchLabel: 'शोध साफ करा',
    totalToolsLabel: '६८ टूल्स उपलब्ध',
    availableLanguagesBadge: '२२ भारतीय भाषांमध्ये उपलब्ध',
    breadcrumbs: {
      home: 'मुख्यपृष्ठ',
      directory: 'सर्व टूल्स डिरेक्टरी'
    },
    featuredSectionTitle: 'श्रेणीनुसार टूल्स शोधा',
    multilingualBadge: 'बहुभाषिक'
  },
  gu: {
    title: 'બધા ઇન્ડિયાટૂલ્સ – ૨૨ ભારતીય ભાષાઓમાં તમામ ૬૮ ટૂલ્સની ડિરેક્ટરી | IndiaTools',
    metaDescription: 'ઇન્ડિયાટૂલ્સના તમામ ૬૮ ઉપયોગી ઓનલાઇન કેલ્ક્યુલેટર્સ અને ટૂલ્સની ડિરેક્ટરી. વાહન માઇલેજ, બાંધકામ ખર્ચ, વીજળી બિલ, પગાર અને ફોટો ટૂલ્સ ગુજરાતીમાં.',
    h1: 'બધા ઇન્ડિયાટૂલ્સ — ભારતીય ભાષાઓમાં તમામ ટૂલ્સ',
    subtitle: '૨૨ અધિકૃત ભારતીય ભાષાઓમાં ઉપલબ્ધ ૬૮ વ્યવહારુ કેલ્ક્યુલેટર્સ, બાંધકામ અંદાજ, વીજળી વપરાશ, જમીન માપણી અને દસ્તાવેજ ટૂલ્સની વિસ્તૃત ડિરેક્ટરી.',
    searchPlaceholder: 'નામ અથવા વિગતો દ્વારા ૬૮ ટૂલ્સ શોધો...',
    allCategoriesLabel: 'તમામ કેટેગરી',
    categoryLabels: {
      drive: 'વાહન અને મુસાફરી',
      build: 'બાંધકામ અને સામગ્રી',
      power: 'વીજળી અને ઊર્જા',
      money: 'પગાર અને નાણાં',
      land: 'જમીન અને સર્વેક્ષણ',
      work: 'કારકિર્દી અને અનુભવ',
      create: 'ક્રિએટિવ અને મીડિયા ટૂલ્સ'
    },
    openToolLabel: 'ટૂલ ખોલો',
    noResultsFound: 'શોધ મુજબ કોઈ ટૂલ મળ્યું નથી',
    noResultsSuggestion: 'કૃપા કરીને અન્ય શબ્દથી શોધો અથવા ફિલ્ટર્સ હટાવી બધા ટૂલ્સ જુઓ.',
    clearSearchLabel: 'શોધ સાફ કરો',
    totalToolsLabel: '૬૮ ટૂલ્સ ઉપલબ્ધ',
    availableLanguagesBadge: '૨૨ ભારતીય ભાષાઓમાં ઉપલબ્ધ',
    breadcrumbs: {
      home: 'હોમ',
      directory: 'તમામ ટૂલ્સ ડિરેક્ટરી'
    },
    featuredSectionTitle: 'કેટેગરી મુજબ ટૂલ્સ શોધો',
    multilingualBadge: 'બહુભાષી'
  },
  pa: {
    title: 'ਸਾਰੇ ਇੰਡੀਆਟੂਲਜ਼ – 22 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਸਾਰੇ 68 ਟੂਲਜ਼ ਦੀ ਡਾਇਰੈਕਟਰੀ | IndiaTools',
    metaDescription: 'ਇੰਡੀਆਟੂਲਜ਼ ਦੇ ਸਾਰੇ 68 ਔਨਲਾਈਨ ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਟੂਲਜ਼। ਗੱਡੀ ਮਾਈਲੇਜ, ਉਸਾਰੀ ਲਾਗਤ, ਬਿਜਲੀ ਬਿੱਲ, ਤਨਖਾਹ ਅਤੇ ਫੋਟੋ ਟੂਲਜ਼ ਪੰਜਾਬੀ ਵਿੱਚ।',
    h1: 'ਸਾਰੇ ਇੰਡੀਆਟੂਲਜ਼ — ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਸਾਰੇ ਟੂਲਜ਼',
    subtitle: '22 ਅਧਿਕਾਰਤ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ 68 ਵਿਹਾਰਕ ਕੈਲਕੂਲੇਟਰ, ਉਸਾਰੀ ਲਾਗਤ, ਬਿਜਲੀ, ਜ਼ਮੀਨ ਮਿਣਤੀ ਅਤੇ ਮੀਡੀਆ ਟੂਲਜ਼ ਦੀ ਸੰਪੂਰਨ ਡਾਇਰੈਕਟਰੀ।',
    searchPlaceholder: 'ਨਾਮ ਜਾਂ ਵੇਰਵੇ ਨਾਲ 68 ਟੂਲ ਲੱਭੋ...',
    allCategoriesLabel: 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ',
    categoryLabels: {
      drive: 'ਵਾਹਨ ਅਤੇ ਸਫ਼ਰ',
      build: 'ਉਸਾਰੀ ਅਤੇ ਸਮੱਗਰੀ',
      power: 'ਬਿਜਲੀ ਅਤੇ ਊਰਜਾ',
      money: 'ਤਨਖ਼ਾਹ ਅਤੇ ਵਿੱਤ',
      land: 'ਜ਼ਮੀਨ ਅਤੇ ਮਿਣਤੀ',
      work: 'ਕਰੀਅਰ ਅਤੇ ਤਜਰਬਾ',
      create: 'ਰਚਨਾਤਮਕ ਅਤੇ ਮੀਡੀਆ ਟੂਲਜ਼'
    },
    openToolLabel: 'ਟੂਲ ਖੋਲ੍ਹੋ',
    noResultsFound: 'ਤੁਹਾਡੀ ਖੋਜ ਮੁਤਾਬਕ ਕੋਈ ਟੂਲ ਨਹੀਂ ਮਿਲਿਆ',
    noResultsSuggestion: 'ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਲਿਖੋ ਜਾਂ ਫਿਲਟਰ ਹਟਾ ਕੇ ਸਾਰੇ ਟੂਲ ਵੇਖੋ।',
    clearSearchLabel: 'ਖੋਜ ਹਟਾਓ',
    totalToolsLabel: '68 ਟੂਲ ਉਪਲਬਧ ਹਨ',
    availableLanguagesBadge: '22 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ',
    breadcrumbs: {
      home: 'ਮੁੱਖ ਪੰਨਾ',
      directory: 'ਸਾਰੇ ਟੂਲਜ਼ ਡਾਇਰੈਕਟਰੀ'
    },
    featuredSectionTitle: 'ਸ਼੍ਰੇਣੀ ਮੁਤਾਬਕ ਟੂਲ ਵੇਖੋ',
    multilingualBadge: 'ਬਹੁਭਾਸ਼ੀ'
  },
  or: {
    title: 'ସମସ୍ତ ଇଣ୍ଡିଆଟୁଲ୍ସ – ୨୨ଟି ଭାରତୀୟ ଭାଷାରେ ସମସ୍ତ ୬୮ ଟୁଲ୍ସର ଡିରେକ୍ଟୋରୀ | IndiaTools',
    metaDescription: 'ଇଣ୍ଡିଆଟୁଲ୍ସର ସମସ୍ତ ୬୮ଟି ଉପଯୋଗୀ ଅନଲାଇନ୍ କାଲକୁଲେଟର ଏବଂ ଟୁଲ୍ସ। ଗାଡ଼ି ମାଇଲେଜ୍, ନିର୍ମାଣ ଖର୍ଚ୍ଚ, ବିଜୁଳି ବିଲ୍, ଦରମା ଓ ଫଟୋ ଟୁଲ୍ସ ଓଡ଼ିଆରେ।',
    h1: 'ସମସ୍ତ ଇଣ୍ଡିଆଟୁଲ୍ସ — ଭାରତୀୟ ଭାଷାରେ ସମସ୍ତ ଟୁଲ୍ସ',
    subtitle: '୨୨ଟି ସରକାରୀ ଭାରତୀୟ ଭାଷାରେ ଉପଲବ୍ଧ ୬୮ଟି ବ୍ୟବହାରିକ କାଲକୁଲେଟର, ନିର୍ମାଣ ମୂଲ୍ୟାଙ୍କନ, ବିଜୁଳି ୟୁନିଟ୍, ଜମି ମାପ ଓ ଡକ୍ୟୁମେଣ୍ଟ ଟୁଲ୍ସର ସମ୍ପୂର୍ଣ୍ଣ ଡିରେକ୍ଟୋରୀ।',
    searchPlaceholder: 'ନାମ ବା ବିବରଣୀ ଦ୍ୱାରା ୬୮ଟି ଟୁଲ୍ ଖୋଜନ୍ତୁ...',
    allCategoriesLabel: 'ସମସ୍ତ ବର୍ଗ',
    categoryLabels: {
      drive: 'ଗାଡ଼ି ଓ ଯାତ୍ରା',
      build: 'ନିର୍ମାଣ ଓ ସାମଗ୍ରୀ',
      power: 'ବିଜୁଳି ଓ ଶକ୍ତି',
      money: 'ଦରମା ଓ ଆର୍ଥିକ',
      land: 'ଜମି ଓ ମାପଚୁପ',
      work: 'କ୍ୟାରିଅର୍ ଓ ଅନୁଭୂତି',
      create: 'କ୍ରିଏଟିଭ୍ ଓ ମିଡିଆ ଟୁଲ୍ସ'
    },
    openToolLabel: 'ଟୁଲ୍ ଖୋଲନ୍ତୁ',
    noResultsFound: 'କୌଣସି ଟୁଲ୍ ମିଳିଲା ନାହିଁ',
    noResultsSuggestion: 'ଦୟାକରି ଅନ୍ୟ ଶବ୍ଦ ଖୋଜନ୍ତୁ କିମ୍ବା ଫିଲ୍ଟର୍ ହଟାଇ ସବୁ ଟୁଲ୍ସ ଦେଖନ୍ତୁ।',
    clearSearchLabel: 'ଖୋଜା ସଫା କରନ୍ତୁ',
    totalToolsLabel: '୬୮ଟି ଟୁଲ୍ସ ଉପଲବ୍ଧ',
    availableLanguagesBadge: '୨୨ଟି ଭାରତୀୟ ଭାଷାରେ ଉପଲବ୍ଧ',
    breadcrumbs: {
      home: 'ମୁଖ୍ୟପୃଷ୍ଠା',
      directory: 'ସମସ୍ତ ଟୁଲ୍ସ ଡିରେକ୍ଟୋରୀ'
    },
    featuredSectionTitle: 'ବର୍ଗ ଅନୁଯାୟୀ ଟୁଲ୍ସ ଦେଖନ୍ତୁ',
    multilingualBadge: 'ବହୁଭାଷୀ'
  },
  as: {
    title: 'সকলো ইণ্ডিয়াটুলছ – ২২টা ভাৰতীয় ভাষাত ৬৮টা সঁজুলিৰ ডাইৰেক্টৰি | IndiaTools',
    metaDescription: 'ইণ্ডিয়াটুলছৰ ৬৮টা ব্যৱহাৰিক অনলাইন কেলকুলেটৰ আৰু সঁজুলিৰ সম্পূৰ্ণ ডাইৰেক্টৰি। বাহনৰ মাইলেজ, নিৰ্মাণ খৰচ, বিদ্যুৎ বিল, দৰমহা আৰু ফটো সঁজুলি অসমীয়াত।',
    h1: 'সকলো ইণ্ডিয়াটুলছ — ভাৰতীয় ভাষাত সকলো সঁজুলি',
    subtitle: '২২টা চৰকাৰী ভাৰতীয় ভাষাত উপলব্ধ ৬৮টা ব্যৱহাৰিক কেলকুলেটৰ, নিৰ্মাণ হিচাপ, বিদ্যুৎ শুল্ক, ভূমি জোখ আৰু নথি সঁজুলিৰ সম্পূৰ্ণ ডাইৰেক্টৰি।',
    searchPlaceholder: 'নাম বা বিৱৰণেৰে ৬৮টা সঁজুলি সন্ধান কৰক...',
    allCategoriesLabel: 'সকলো শ্ৰেণী',
    categoryLabels: {
      drive: 'বাহন আৰু যাত্ৰা',
      build: 'নিৰ্মাণ আৰু সামগ্ৰী',
      power: 'বিদ্যুৎ আৰু শক্তি',
      money: 'দৰমহা আৰু বিত্ত',
      land: 'ভূমি আৰু জৰীপ',
      work: 'কেৰিয়াৰ আৰু অভিজ্ঞতা',
      create: 'সৃজনশীল আৰু মিডিয়া সঁজুলি'
    },
    openToolLabel: 'সঁজুলি খোলক',
    noResultsFound: 'কোনো সঁজুলি বিচাৰি পোৱা নগ’ল',
    noResultsSuggestion: 'অনুগ্ৰহ কৰি অন্য শব্দৰে সন্ধান কৰক অথবা ফিল্টাৰ আঁতৰাই সকলো সঁজুলি চাওক।',
    clearSearchLabel: 'সন্ধান পৰিষ্কাৰ কৰক',
    totalToolsLabel: '৬৮টা সঁজুলি উপলব্ধ',
    availableLanguagesBadge: '২২টা ভাৰতীয় ভাষাত উপলব্ধ',
    breadcrumbs: {
      home: 'ঘৰ',
      directory: 'সকলো সঁজুলিৰ ডাইৰেক্টৰি'
    },
    featuredSectionTitle: 'শ্ৰেণী অনুসৰি সঁজুলি অন্বেষণ কৰক',
    multilingualBadge: 'বহুভাষিক'
  },
  ur: {
    title: 'تمام انڈیا ٹولز – 22 ہندوستانی زبانوں میں 68 ٹولز کی ڈائریکٹری | IndiaTools',
    metaDescription: 'انڈیا ٹولز کے تمام 68 عملی آن لائن کیلکولیٹرز اور کارآمد ٹولز۔ گاڑی کا مائلیج، تعمیراتی لاگت، بجلی کا بل، تنخواہ اور فوٹو ٹولز اردو میں۔',
    h1: 'تمام انڈیا ٹولز — ہندوستانی زبانوں میں تمام ٹولز',
    subtitle: '22 سرکاری ہندوستانی زبانوں میں 68 عملی کیلکولیٹرز، گاڑیوں کی معاشیات، تعمیراتی تخمینہ، بجلی، زمین اور دستاویزات کے ٹولز کی جامع ڈائریکٹری۔',
    searchPlaceholder: 'نام یا تفصیل کے ذریعے 68 ٹولز تلاش کریں...',
    allCategoriesLabel: 'تمام زمرے',
    categoryLabels: {
      drive: 'گاڑی اور سفر',
      build: 'تعمیر اور مواد',
      power: 'بجلی اور توانائی',
      money: 'تنخواہ اور مالیات',
      land: 'زمین اور پیمائش',
      work: 'پیشہ اور تجربہ',
      create: 'تخلیقی اور میڈیا ٹولز'
    },
    openToolLabel: 'ٹول کھولیں',
    noResultsFound: 'آپ کی تلاش کے مطابق کوئی ٹول نہیں ملا',
    noResultsSuggestion: 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا فلٹر ہٹا کر تمام ٹولز دیکھیں۔',
    clearSearchLabel: 'تلاش صاف کریں',
    totalToolsLabel: '68 ٹولز دستیاب ہیں',
    availableLanguagesBadge: '22 ہندوستانی زبانوں میں دستیاب',
    breadcrumbs: {
      home: 'ہوم',
      directory: 'تمام ٹولز ڈائریکٹری'
    },
    featuredSectionTitle: 'زمرہ کے لحاظ سے ٹولز دیکھیں',
    multilingualBadge: 'کثیر لسانی'
  },
  sa: {
    title: 'सर्वे इण्डियाटूल्स् – २२ भारतीयभाषासु ६८ उपकरणानां निर्देशिका | IndiaTools',
    metaDescription: 'इण्डियाटूल्स् जालस्थले सर्वेषां ६८ उपकरणानां गणनायन्त्राणां च सम्पूर्णनिर्देशिका। यान-इन्धनम्, निर्माणम्, विद्युत्, वेतनं च संस्कृते उपलभ्यते।',
    h1: 'सर्वे इण्डियाटूल्स् — भारतीयभाषासु सर्वाणि उपकरणानि',
    subtitle: '२२ संविधानमान्य-भारतीयभाषासु उपलब्धानां ६८ व्यावहारिकगणनायन्त्राणां, निर्माण-विद्युत्-भूमि-मापन-माध्यमोपकरणानां च प्रामाणिकी निर्देशिका।',
    searchPlaceholder: 'नाम्ना वर्णनेन वा ६८ उपकरणानि अन्विष्यन्तु...',
    allCategoriesLabel: 'सर्वे वर्गाः',
    categoryLabels: {
      drive: 'यानं यानं च',
      build: 'निर्माणं सामग्री च',
      power: 'विद्युत् ऊर्जा च',
      money: 'वेतनं वित्तं च',
      land: 'भूमिः मापनं च',
      work: 'वृत्तिः अनुभवः च',
      create: 'सृजनात्मक-माध्यमोपकरणानि'
    },
    openToolLabel: 'उपकरणम् उद्घाटयतु',
    noResultsFound: 'किमपि उपकरणं न लब्धम्',
    noResultsSuggestion: 'कृपया भिन्नपदैः अन्वेषणं कुर्वन्तु अथवा सर्वेषां दर्शनाय शोधकं अपनयन्तु।',
    clearSearchLabel: 'अन्वेषणं परिमार्जयतु',
    totalToolsLabel: '६८ उपकरणानि उपलभ्यन्ते',
    availableLanguagesBadge: '२२ भारतीयभाषासु उपलब्धम्',
    breadcrumbs: {
      home: 'मुख्यपृष्ठम्',
      directory: 'सर्वोपकरणनिर्देशिका'
    },
    featuredSectionTitle: 'वर्गक्रमेण उपकरणानि पश्यन्तु',
    multilingualBadge: 'बहुभाषीयम्'
  },
  kok: {
    title: 'सगळे इंडियाटूल्स – २२ भारतीय भासांनी ६८ साधनांची डिरेक्टरी | IndiaTools',
    metaDescription: 'इंडियाटूल्सचे सगळे ६८ ऑनलाइन कॅल्क्युलेटर आनी साधने. गाडी मायलेज, बांधकाम खर्च, वीज बिल, पगार आनी फोटो साधने कोंकणींत.',
    h1: 'सगळे इंडियाटूल्स — भारतीय भासांनी सगळीं साधनां',
    subtitle: '२२ भारतीय भासांनी मेळपी ६८ कॅल्क्युलेटर, बांधकाम अंदाज, वीज दर, जमीन मेजणी आनी दस्तऐवज साधनांची संपूर्ण डिरेक्टरी.',
    searchPlaceholder: 'नांव वा विवरणा वरवीं ६८ साधनां सोधा...',
    allCategoriesLabel: 'सगळे वर्ग',
    categoryLabels: {
      drive: 'गाडी आनी प्रवास',
      build: 'बांधकाम आनी वस्तू',
      power: 'वीज आनी ऊर्जा',
      money: 'पगार आनी वित्त',
      land: 'जमीन आनी मेजणी',
      work: 'नोकरी आनी अणભવ',
      create: 'क्रिएटिव्ह आनी मिडिया साधनां'
    },
    openToolLabel: 'साधन उघडात',
    noResultsFound: 'सोदिल्लें साधन मेळूंक ना',
    noResultsSuggestion: 'उपकार करून वेगळो शब्द सोधात वा फिल्टर काडून सगळीं साधनां पळयात.',
    clearSearchLabel: 'सोद काढा',
    totalToolsLabel: '६८ साधनां उपलब्ध आसात',
    availableLanguagesBadge: '२२ भारतीय भासांनी उपलब्ध',
    breadcrumbs: {
      home: 'घर',
      directory: 'सगळ्या साधनांची डिरेक्टरी'
    },
    featuredSectionTitle: 'वर्गा प्रमाण साधनां पळयात',
    multilingualBadge: 'बहुभाशिक'
  },
  mai: {
    title: 'सबहि इंडियाटूल्स – २२ भारतीय भाषामे ६८ टूल्सक निर्देशिका | IndiaTools',
    metaDescription: 'इंडियाटूल्सक सबहि ६८ उपयोगी ऑनलाइन कैलकुलेटर आ टूल्सक सम्पूर्ण निर्देशिका। गाड़ी माइलेज, निर्माण लागत, बिजली बिल, वेतन आ फोटो टूल्स मैथिलीमे।',
    h1: 'सबहि इंडियाटूल्स — भारतीय भाषामे सबहि टूल्स',
    subtitle: '२२ आधिकारिक भारतीय भाषामे उपलब्ध ६८ व्यावहारिक कैलकुलेटर, निर्माण आकलन, बिजली बिल, जमीन नापी आ फोटो टूल्सक निर्देशिका।',
    searchPlaceholder: 'नाम वा विवरणसँ ६८ टूल्स खोजू...',
    allCategoriesLabel: 'सबहि श्रेणी',
    categoryLabels: {
      drive: 'गाड़ी आ यात्रा',
      build: 'निर्माण आ सामग्री',
      power: 'बिजली आ ऊर्जा',
      money: 'वेतन आ वित्त',
      land: 'जमीन आ नापी',
      work: 'करियर आ अनुभव',
      create: 'क्रिएटिव आ मीडिया टूल्स'
    },
    openToolLabel: 'टूल खोलू',
    noResultsFound: 'कोनो टूल नहि भेटल',
    noResultsSuggestion: 'कृपया दोसर शब्दसँ खोजू वा फिल्टर हटाकए सबहि टूल्स देखू।',
    clearSearchLabel: 'सर्च हटाउ',
    totalToolsLabel: '६८ टूल्स उपलब्ध अछि',
    availableLanguagesBadge: '२२ भारतीय भाषामे उपलब्ध',
    breadcrumbs: {
      home: 'घर',
      directory: 'सबहि टूल्स निर्देशिका'
    },
    featuredSectionTitle: 'श्रेणी अनुसार टूल्स देखू',
    multilingualBadge: 'बहुभाषी'
  },
  ne: {
    title: 'सबै इन्डियाटूल्स – २२ भारतीय भाषाहरूमा ६८ टूल्सको डाइरेक्टरी | IndiaTools',
    metaDescription: 'इन्डियाटूल्सका सबै ६८ उपयोगी अनलाइन क्याल्कुलेटर र टूल्सहरूको डाइरेक्टरी। सवारी माइलेज, निर्माण लागत, बिजुली बिल, तलब र फोटो टूल्स नेपालीमा।',
    h1: 'सबै इन्डियाटूल्स — भारतीय भाषाहरूमा सबै टूल्स',
    subtitle: '२२ आधिकारिक भारतीय भाषाहरूमा उपलब्ध ६८ व्यावहारिक क्याल्कुलेटरहरू, निर्माण लागत, बिजुली, जग्गा नापी र मिडिया टूल्सको विस्तृत डाइरेक्टरी।',
    searchPlaceholder: 'नाम वा विवरण अनुसार ६८ टूल्स खोज्नुहोस्...',
    allCategoriesLabel: 'सबै श्रेणीहरू',
    categoryLabels: {
      drive: 'सवारी र यात्रा',
      build: 'निर्माण र सामग्री',
      power: 'बिजुली र ऊर्जा',
      money: 'तलब र वित्त',
      land: 'जग्गा र नापी',
      work: 'पेशा र अनुभव',
      create: 'सृजनात्मक र मिडिया टूल्स'
    },
    openToolLabel: 'टूल खोल्नुहोस्',
    noResultsFound: 'खोजिएको कुनै टूल फेला परेन',
    noResultsSuggestion: 'कृपया अर्को शब्द खोज्नुहोस् वा फिल्टर हटाएर सबै टूल्स हेर्नुहोस्।',
    clearSearchLabel: 'खोज हटाउनुहोस्',
    totalToolsLabel: '६८ टूल्स उपलब्ध छन्',
    availableLanguagesBadge: '२२ भारतीय भाषाहरूमा उपलब्ध',
    breadcrumbs: {
      home: 'गृहपृष्ठ',
      directory: 'सबै टूल्स डाइरेक्टरी'
    },
    featuredSectionTitle: 'श्रेणी अनुसार टूल्स अन्वेषण गर्नुहोस्',
    multilingualBadge: 'बहुभाषिक'
  },
  ks: {
    title: 'سٲری انڈیا ٹوٗلز – 22 ہِندوستٲنؠ زبانن مَنٛز 68 ٹوٗلن ہٕنٛز ڈائرکٹری | IndiaTools',
    metaDescription: 'انڈیا ٹوٗلزکؠ سٲری 68 کٲم لَگن وٲلؠ کیلکولیٹر۔ گٲڑِ ہُنٛد مائیلیج، تعمیٖر، بیجلی بِل، تنخواہ تہٕ فوٹو ٹوٗلز کٲشُر زبان مَنٛز۔',
    h1: 'سٲری انڈیا ٹوٗلز — ہِندوستٲنؠ زبانن مَنٛز سٲری ٹوٗلز',
    subtitle: '22 سرکٲری ہِندوستٲنؠ زبانن مَنٛز دٔستیاب 68 کٲم ین وٲلؠ کیلکولیٹر، گٲڑِ، تعمیٖر، بیجلی تہٕ دستاویز ٹوٗلن ہٕنٛز ڈائرکٹری۔',
    searchPlaceholder: 'ناو یا تفصیٖل سٟتؠ ژھانٛڈِو 68 ٹوٗلز...',
    allCategoriesLabel: 'سٲری زمرہ جات',
    categoryLabels: {
      drive: 'گٲڑِ تہٕ سفر',
      build: 'تعمیٖر تہٕ سامان',
      power: 'بیجلی تہٕ توانٲئی',
      money: 'تنخواہ تہٕ مالِیاتھ',
      land: 'زمین تہٕ پؠمٲئش',
      work: 'پیشہٕ تہٕ تجربہٕ',
      create: 'میڈیا تہٕ تخلیقی ٹوٗلز'
    },
    openToolLabel: 'ٹوٗل کھولِو',
    noResultsFound: 'تُہنٛزِ تلاشہٕ مُطٲبِق کانٛہہ ٹوٗل آو نہٕ لبنہٕ',
    noResultsSuggestion: 'مہر Ships ژھانٛڈِو کانٛہہ بیٛاکھ لفظ یا فلٹر ہٹٲوِتھ وُچھِو سٲری ٹوٗلز۔',
    clearSearchLabel: 'تلاش صاف کٔرِو',
    totalToolsLabel: '68 ٹوٗلز چھِ دٔستیاب',
    availableLanguagesBadge: '22 ہِندوستٲنؠ زبانن مَنٛز دٔستیاب',
    breadcrumbs: {
      home: 'ہوم',
      directory: 'سٲری ٹوٗلز ڈائرکٹری'
    },
    featuredSectionTitle: 'زمرہ کِس حِسابہٕ وُچھِو ٹوٗلز',
    multilingualBadge: 'واریاہ زبانن مَنٛز'
  },
  sd: {
    title: 'سڀ انڊيا ٽولز – 22 هندستاني ٻولين ۾ 68 ٽولز جي ڊائريڪٽري | IndiaTools',
    metaDescription: 'انڊيا ٽولز جا سڀ 68 ڪارآمد آن لائن ڪيلڪيوليٽرس. گاڏي جو مائليج، اڏاوت، بجلي بل، پگهار ۽ تصويرن جا ٽولز سنڌي ۾۔',
    h1: 'سڀ انڊيا ٽولز — هندستاني ٻولين ۾ سڀ ٽولز',
    subtitle: '22 سرڪاري هندستاني ٻولين ۾ موجود 68 ڪارآمد ڪيلڪيوليٽرز، اڏاوت، بجلي، زمين ۽ ميڊيا ٽولز جي مڪمل ڊائريڪٽري۔',
    searchPlaceholder: 'نالي يا تفصيل سان 68 ٽولز ڳوليو...',
    allCategoriesLabel: 'سڀ درجا',
    categoryLabels: {
      drive: 'گاڏي ۽ سفر',
      build: 'اڏاوت ۽ سامان',
      power: 'بجلي ۽ توانائي',
      money: 'پگهار ۽ مالي معاملا',
      land: 'زمين ۽ ماپ',
      work: 'پيشو ۽ تجربو',
      create: 'ميڊيا ۽ تخليقي ٽولز'
    },
    openToolLabel: 'ٽول کوليو',
    noResultsFound: 'توهان جي ڳولا موجب ڪو ٽول نه مليو',
    noResultsSuggestion: 'مهرباني ڪري ٻيو لفظ ڳوليو يا فلٽر هٽائي سڀ ٽولز ڏسو۔',
    clearSearchLabel: 'ڳولا صاف ڪريو',
    totalToolsLabel: '68 ٽولز موجود آهن',
    availableLanguagesBadge: '22 هندستاني ٻولين ۾ موجود',
    breadcrumbs: {
      home: 'هوم',
      directory: 'سڀ ٽولز ڊائريڪٽري'
    },
    featuredSectionTitle: 'درجي مطابق ٽولز ڏسو',
    multilingualBadge: 'گھڻ-ٻوليائي'
  },
  doi: {
    title: 'सारे इंडियाटूल्स – २२ भारती भाशाएं च ६८ टूल्सें दी डायरेक्टरी | IndiaTools',
    metaDescription: 'इंडियाटूल्स दे सारे ६८ उपयोगी ऑनलाइन कैलकुलेटर ते टूल्स। गड्डी माइलेज, निर्माण लागत, बिजली बिल, तनखाह ते फोटो टूल्स डोगरी च।',
    h1: 'सारे इंडियाटूल्स — भारती भाशाएं च सारे टूल्स',
    subtitle: '२२ सरकारी भारती भाशाएं च उपलब्ध ६८ व्यावहारिक कैलकुलेटर, निर्माण आकलन, बिजली बिल, जमीन नपाई ते फोटो टूल्सें दी डायरेक्टरी।',
    searchPlaceholder: 'नांअ या विवरण कन्नै ६८ टूल्स लभो...',
    allCategoriesLabel: 'सारियां श्रेणियां',
    categoryLabels: {
      drive: 'गड्डी ते सफर',
      build: 'निर्माण ते सामग्री',
      power: 'बिजली ते ऊर्जा',
      money: 'तनखाह ते वित्त',
      land: 'जमीन ते नपाई',
      work: 'रोजगार ते तजरबा',
      create: 'क्रिएटिव ते मीडिया टूल्स'
    },
    openToolLabel: 'टूल खोल्लो',
    noResultsFound: 'तुंदी खोज मुताबिक कोई टूल नेईं लभ्या',
    noResultsSuggestion: 'कृपया कोई दूआ शब्द लभो या फिल्टर हटाई ते सारे टूल्स दिक्खो।',
    clearSearchLabel: 'खोज साफ करो',
    totalToolsLabel: '६८ टूल्स उपलब्ध न',
    availableLanguagesBadge: '२२ भारती भाशाएं च उपलब्ध',
    breadcrumbs: {
      home: 'होम',
      directory: 'सारे टूल्स डायरेक्टरी'
    },
    featuredSectionTitle: 'श्रेणी दे हिसाब कन्नै टूल्स दिक्खो',
    multilingualBadge: 'बहुभाशी'
  },
  mni: {
    title: 'ভারতকী তুল পুম্নমক – ভারতকী লোন ২২দা টুল ৬৮গী দাইরেক্তরি | IndiaTools',
    metaDescription: 'ইন্দিয়াতুলসকী কান্নবা অনলাইন কেলকুলেতর অমসুং তুল ৬৮গী মপুংফাবা দাইরেক্তরি। গারীগী মাইলেজ, শাবা-শাগৎপগী থবক, মৈগী বিল অমসুং ফোতো তুল মণিপুরোলদা।',
    h1: 'ইন্দিয়াতুলস পুম্নমক — ভারতকী লোনশিংদা তুল পুম্নমক',
    subtitle: 'ভারতকী চৎনবা লোন ২২দা ফংবা কান্নবা কেলকুলেতর ৬৮, ময়ুম শাগৎপা, মৈ শিজিন্নবা, লম য়েংবা অমসুং দোকুমেন্ত তুলশিংগী মপুংফাবা দাইরেক্তরি।',
    searchPlaceholder: 'মিং নত্রগা মরোলনা টুল ৬৮ থিবীয়ু...',
    allCategoriesLabel: 'কাংলুপ পুম্নমক',
    categoryLabels: {
      drive: 'গারী অমসুং চৎ-থোক',
      build: 'শাবা-শাগৎপা অমসুং পোৎলম',
      power: 'মৈ অমসুং পাঙ্গল',
      money: 'তলব অমসুং শেল-থুম',
      land: 'লম অমসুং চাং য়েংবা',
      work: 'থবক অমসুং এক্সপরিয়েন্স',
      create: 'ক্রিয়েতিভ অমসুং মেদিয়া তুলশিং'
    },
    openToolLabel: 'তুল হাংদোকউ',
    noResultsFound: 'অদোমগী থিবগা চানবা টুল অমত্তা ফংদে',
    noResultsSuggestion: 'চানবীদুনা অতোপ্পা ৱাহৈ অমনা থিবীয়ু নত্রগা ফিল্তর লৌথোক্লগা টুল পুম্নমক য়েংবীয়ু।',
    clearSearchLabel: 'থিবা ক্লিয়ার তৌউ',
    totalToolsLabel: 'টুল ৬৮ ফংই',
    availableLanguagesBadge: 'ভারতকী লোন ২২দা ফংই',
    breadcrumbs: {
      home: 'য়ুম',
      directory: 'টুল পুম্নমক্কী দাইরেক্তরি'
    },
    featuredSectionTitle: 'কাংলুপকী মতুংইন্না তুলশিং য়েংবীয়ু',
    multilingualBadge: 'লোন কয়াদা'
  },
  brx: {
    title: 'गासैबो इन्डियाटुलस – भारतनि २२ रावफोराव ६८ आयजेंफोरनि डाइरेक्टरी | IndiaTools',
    metaDescription: 'इन्डियियाटुलसनि गासैबो ६८ मोजां अनलाइन कालकुलेटर आरो आयजेंफोर। गारि माइलेज, लुनाय खरसा, बारगुलि बिल, बेथन आरो फोटो आयजेंफोर बड़’ रावाव।',
    h1: 'गासैबो इन्डियाटुलस — भारतनि रावफोराव गासैबो आयजेंफोर',
    subtitle: 'भारतनि २२ सरासनस्रा रावफोराव मोननो हानाय ६८ कालकुलेटर, लुनाय, बारगुलि बिल, हा सुनाव आरो मिडिया आयजेंफोरनि गोथौ डाइरेक्टरी।',
    searchPlaceholder: 'मुं एबा बिबरणजों ६८ आयजें नागिर...',
    allCategoriesLabel: 'गासै थाखोफोर',
    categoryLabels: {
      drive: 'गारि आरो दावबायनाय',
      build: 'लुनाय आरो मुवाफोर',
      power: 'बारगुलि आरो शक्ति',
      money: 'बेथन आरो रां-खान्थि',
      land: 'हा आरो सुनाय',
      work: 'हाबा आरो रोंमोनथाय',
      create: 'सोर्जिलु आरो मिडिया आयजेंफोर'
    },
    openToolLabel: 'आयजें खेव',
    noResultsFound: 'नागिरनाय बादि जेबो आयजें मोनासै',
    noResultsSuggestion: 'अननानै गुबुन सोदोब नागिर एबा गासैबो आयजेंफोरखौ नुनो थाखाय फिल्टारखौ गैया खालाम।',
    clearSearchLabel: 'नागिरनाय हुगार',
    totalToolsLabel: '६८ आयजेंफोर दं',
    availableLanguagesBadge: '२२ भारतनि रावफोराव मोननो हायो',
    breadcrumbs: {
      home: 'न’',
      directory: 'गासै आयजेंफोरनि डाइरेक्टरी'
    },
    featuredSectionTitle: 'थाखो बादियै आयजेंफोर नाय',
    multilingualBadge: 'गोबां राव'
  },
  sat: {
    title: 'ᱡᱚᱛᱚ ᱤᱱᱰᱤᱭᱟᱴᱩᱞᱥ – ᱒᱒ ᱵᱷᱟᱨᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱖᱘ ᱴᱩᱞᱥ ᱨᱮᱭᱟᱜ ᱰᱟᱭᱨᱮᱠᱴᱚᱨᱤ | IndiaTools',
    metaDescription: 'ᱤᱱᱰᱤᱭᱟᱴᱩᱞᱥ ᱨᱮᱭᱟᱜ ᱡᱚᱛᱚ ᱖᱘ ᱠᱟᱹᱢᱤᱭᱟᱱ ᱚᱱᱞᱟᱭᱤᱱ ᱠᱮᱞᱠᱩᱞᱮᱴᱟᱨ ᱟᱨ ᱴᱩᱞᱥ᱾ ᱜᱟᱹᱰᱤ ᱢᱟᱭᱞᱮᱡᱽ, ᱵᱮᱱᱟᱣ ᱠᱷᱚᱨᱚᱪ, ᱵᱤᱡᱽᱞᱤ ᱵᱤᱞ, ᱠᱩᱲᱟᱹᱭ ᱟᱨ ᱯᱷᱚᱴᱚ ᱴᱩᱞᱥ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ᱾',
    h1: 'ᱡᱚᱛᱚ ᱤᱱᱰᱤᱭᱟᱴᱩᱞᱥ — ᱵᱷᱟᱨᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱡᱚᱛᱚ ᱴᱩᱞᱥ',
    subtitle: '᱒᱒ ᱥᱚᱨᱠᱟᱨᱤ ᱵᱷᱟᱨᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱧᱟᱢᱚᱜ ᱠᱟᱱ ᱖᱘ ᱠᱮᱞᱠᱩᱞᱮᱴᱟᱨ, ᱚᱲᱟᱜ ᱵᱮᱱᱟᱣ, ᱵᱤᱡᱽᱞᱤ, ᱦᱟᱥᱟ ᱡᱚᱠᱷᱟ ᱟᱨ ᱰᱚᱠᱩᱢᱮᱱᱴ ᱴᱩᱞᱥ ᱨᱮᱭᱟᱜ ᱯᱩᱨᱟᱹ ᱰᱟᱭᱨᱮᱠᱴᱚᱨᱤ᱾',
    searchPlaceholder: 'ᱧᱩᱛᱩᱢ ᱥᱮ ᱵᱤᱵᱚᱨᱚᱱ ᱛᱮ ᱖᱘ ᱴᱩᱞ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    allCategoriesLabel: 'ᱡᱚᱛᱚ ᱛᱷᱚᱠ',
    categoryLabels: {
      drive: 'ᱜᱟᱹᱰᱤ ᱟᱨ ᱥᱟᱸᱜᱷᱟᱨ',
      build: 'ᱵᱮᱱᱟᱣ ᱟᱨ ᱥᱟᱢᱟᱱ',
      power: 'ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱫᱟᱲᱮ',
      money: 'ᱠᱩᱲᱟᱹᱭ ᱟᱨ ᱠᱟᱹᱣᱰᱤ',
      land: 'ᱦᱟᱥᱟ ᱟᱨ ᱡᱚᱠᱷᱟ',
      work: 'ᱠᱟᱹᱢᱤ ᱟᱨ ᱦᱩᱱᱟᱹᱨ',
      create: 'ᱥᱤᱨᱡᱚᱱ ᱟᱨ ᱢᱤᱰᱤᱭᱟ ᱴᱩᱞᱥ'
    },
    openToolLabel: 'ᱴᱩᱞ ᱡᱷᱤᱡᱽ ᱢᱮ',
    noResultsFound: 'ᱥᱮᱸᱫᱽᱨᱟ ᱞᱮᱠᱟᱱ ᱴᱩᱞ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ',
    noResultsSuggestion: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱮᱴᱟᱜ ᱟᱹᱲᱟᱹ ᱛᱮ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ ᱥᱮ ᱯᱷᱤᱞᱴᱟᱨ ᱚᱪᱚᱜ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱴᱩᱞ ᱧᱮᱞ ᱢᱮ᱾',
    clearSearchLabel: 'ᱥᱮᱸᱫᱽᱨᱟ ᱥᱟᱯᱷᱟᱭ ᱢᱮ',
    totalToolsLabel: '᱖᱘ ᱴᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ',
    availableLanguagesBadge: '᱒᱒ ᱵᱷᱟᱨᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱧᱟᱢᱚᱜᱼᱟ',
    breadcrumbs: {
      home: 'ᱚᱲᱟᱜ',
      directory: 'ᱡᱚᱛᱚ ᱴᱩᱞ ᱰᱟᱭᱨᱮᱠᱴᱚᱨᱤ'
    },
    featuredSectionTitle: 'ᱛᱷᱚᱠ ᱞᱮᱠᱟᱛᱮ ᱴᱩᱞᱥ ᱧᱮᱞ ᱢᱮ',
    multilingualBadge: 'ᱟᱭᱢᱟ ᱯᱟᱹᱨᱥᱤ'
  }
}
