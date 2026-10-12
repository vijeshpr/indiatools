import { SupportedLocale } from './locales'

export interface UITranslations {
  [key: string]: string
  // Navigation & Header
  'nav.home': string
  'nav.allTools': string
  'nav.categories': string
  'nav.chequeStudio': string
  'nav.about': string
  'nav.search': string
  'nav.exploreTools': string
  'nav.selectLanguage': string

  // Hero Section
  'hero.featured': string
  'hero.featuredCheque': string
  'hero.eyebrow': string
  'hero.precisionUtilities': string
  'hero.titleLine1': string
  'hero.titleLine2': string
  'hero.description': string
  'hero.searchPlaceholder': string
  'hero.searchPlaceholderMobile': string
  'hero.popular': string
  'hero.exploreButton': string
  'hero.tryLiveButton': string
  'hero.companionTagline': string
  'hero.badgePrivate': string
  'hero.badgePrivateSub': string
  'hero.badgeCategories': string
  'hero.badgeLanguages': string
  'hero.badgeLanguagesSub': string

  // Categories
  'cat.all': string
  'cat.drive.title': string
  'cat.drive.subtitle': string
  'cat.drive.desc': string
  'cat.build.title': string
  'cat.build.subtitle': string
  'cat.build.desc': string
  'cat.power.title': string
  'cat.power.subtitle': string
  'cat.power.desc': string
  'cat.money.title': string
  'cat.money.subtitle': string
  'cat.money.desc': string
  'cat.land.title': string
  'cat.land.subtitle': string
  'cat.land.desc': string
  'cat.work.title': string
  'cat.work.subtitle': string
  'cat.work.desc': string
  'cat.create.title': string
  'cat.create.subtitle': string
  'cat.create.desc': string
  'cat.exploreAll': string

  // Tool Page Layout & Common Actions
  'action.reset': string
  'action.copy': string
  'action.share': string
  'action.calculate': string
  'action.download': string
  'action.copied': string
  'tool.clientSideBadge': string
  'tool.howItWorks': string
  'tool.assumptions': string
  'tool.practicalExample': string
  'tool.inputs': string
  'tool.outputs': string
  'tool.faqs': string
  'tool.relatedTools': string
  'tool.relatedSubtitle': string
  'tool.viewAll': string

  // Footer
  'footer.tagline': string
  'footer.privacyTitle': string
  'footer.privacyDesc': string
  'footer.featuredTools': string
  'footer.categories': string
  'footer.platform': string
  'footer.about': string
  'footer.contact': string
  'footer.privacy': string
  'footer.terms': string
  'footer.backToTop': string
  'footer.copyright': string
  'footer.engineBadge': string
}

export const UI_TRANSLATIONS: Record<SupportedLocale, UITranslations> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.allTools': 'All Tools',
    'nav.categories': 'Categories',
    'nav.chequeStudio': 'Cheque Studio',
    'nav.about': 'About',
    'nav.search': 'Search',
    'nav.exploreTools': 'Explore Tools',
    'nav.selectLanguage': 'Select Language',

    // Hero
    'hero.featured': 'FEATURED',
    'hero.featuredCheque': 'Indian Cheque Studio (13 Languages & CTS-2010 Specimen)',
    'hero.eyebrow': "INDIA'S EVERYDAY DIGITAL TOOLBOX",
    'hero.precisionUtilities': 'Precision Utilities',
    'hero.titleLine1': 'Smart tools for real-life calculations.',
    'hero.titleLine2': 'Built specifically for India.',
    'hero.description': 'Calculate, compare, convert and plan with practical tools built for everyday Indian needs. Free to use, fast to access, and designed for your phone or desktop.',
    'hero.searchPlaceholder': 'Search tools (e.g. UPI QR code, JCB diesel, cheque, cent to sqft)...',
    'hero.searchPlaceholderMobile': 'Search tools (QR, JCB, cheque, 50kb)...',
    'hero.popular': 'Popular:',
    'hero.exploreButton': 'Explore All Tools',
    'hero.tryLiveButton': 'Try Live Calculators',
    'hero.companionTagline': 'Your friendly interactive companion for everyday Indian math.',
    'hero.badgePrivate': '100% Private',
    'hero.badgePrivateSub': 'Zero Cloud Uploads',
    'hero.badgeCategories': 'Categories',
    'hero.badgeLanguages': '13 Languages',
    'hero.badgeLanguagesSub': 'Indian Cheque Words',

    // Categories
    'cat.all': 'All Categories',
    'cat.drive.title': 'Drive',
    'cat.drive.subtitle': 'Automotive & Travel',
    'cat.drive.desc': 'Fuel costs, vehicle mileage, trip budget splitters, and tyre pressure guides.',
    'cat.build.title': 'Build',
    'cat.build.subtitle': 'Civil & Construction',
    'cat.build.desc': 'JCB excavator hourly rates, concrete mix ratios, brickwork counts, and steel weight calculators.',
    'cat.power.title': 'Power',
    'cat.power.subtitle': 'Electricity & Solar',
    'cat.power.desc': 'State electricity board slab bills, solar PM Surya Ghar subsidies, and borewell pump calculations.',
    'cat.money.title': 'Money',
    'cat.money.subtitle': 'Finance, Gold & Banking',
    'cat.money.desc': 'Gold jewellery bill breakdown, cheque word converter, Chit Fund returns, and GST calculators.',
    'cat.land.title': 'Land',
    'cat.land.subtitle': 'Area & Property Survey',
    'cat.land.desc': 'Cent to Square Feet, Guntha, Bigha, Acre, and regional Indian plot dimension converters.',
    'cat.work.title': 'Work',
    'cat.work.subtitle': 'Salary, Tax & Business',
    'cat.work.desc': 'In-hand salary breakups, daily wage calculations, and business profit margin planners.',
    'cat.create.title': 'Create',
    'cat.create.subtitle': 'Design, Photo & PDF',
    'cat.create.desc': 'UPI QR payment standees, 50KB govt exam photo resizer, and background removal tools.',
    'cat.exploreAll': 'Explore All Tools',

    // Layout & Actions
    'action.reset': 'Reset',
    'action.copy': 'Copy',
    'action.share': 'Share',
    'action.calculate': 'Calculate',
    'action.download': 'Download',
    'action.copied': 'Copied to clipboard!',
    'tool.clientSideBadge': '100% Client-Side',
    'tool.howItWorks': 'How It Works & Calculation Logic',
    'tool.assumptions': 'Standards & Assumptions:',
    'tool.practicalExample': 'Practical Example',
    'tool.inputs': 'Inputs:',
    'tool.outputs': 'Outputs:',
    'tool.faqs': 'Frequently Asked Questions',
    'tool.relatedTools': 'Related Practical Tools',
    'tool.relatedSubtitle': 'Frequently paired together for deeper calculations',
    'tool.viewAll': 'View all',

    // Footer
    'footer.tagline': '"Smart tools for real-life calculations." A fast, browser-native utility platform for everyday automotive, civil construction, power tariffs, land area, salary, and educational cheque specimens in India.',
    'footer.privacyTitle': '100% Client-Side Privacy',
    'footer.privacyDesc': 'All calculations and photo resizing execute inside your browser. Zero cloud tracking.',
    'footer.featuredTools': 'Featured Tools',
    'footer.categories': 'Categories',
    'footer.platform': 'Platform',
    'footer.about': 'About the Project',
    'footer.contact': 'Contact & Feedback',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.backToTop': 'Back to Top',
    'footer.copyright': 'IndiaTools. Free open technology for India.',
    'footer.engineBadge': '100% Client-Side Engine',
  },

  ml: {
    // Nav
    'nav.home': 'ഹോം',
    'nav.allTools': 'എല്ലാ ടൂളുകളും',
    'nav.categories': 'വിഭാഗങ്ങൾ',
    'nav.chequeStudio': 'ചെക്ക് സ്റ്റുഡിയോ',
    'nav.about': 'ഞങ്ങളെക്കുറിച്ച്',
    'nav.search': 'തിരയുക',
    'nav.exploreTools': 'ടൂളുകൾ കാണുക',
    'nav.selectLanguage': 'ഭാഷ തിരഞ്ഞെടുക്കുക',

    // Hero
    'hero.featured': 'പ്രത്യേകം',
    'hero.featuredCheque': 'ഇന്ത്യൻ ചെക്ക് സ്റ്റുഡിയോ (13 ഭാഷകളും CTS-2010 മാതൃകയും)',
    'hero.eyebrow': 'ഇന്ത്യയുടെ നിത്യോപയോഗ ഡിജിറ്റൽ ടൂൾബോക്സ്',
    'hero.precisionUtilities': 'കൃത്യമായ ടൂളുകൾ',
    'hero.titleLine1': 'നിത്യജീവിതത്തിലെ കണക്കുകൂട്ടലുകൾക്ക്',
    'hero.titleLine2': 'ഇന്ത്യക്കായി പ്രത്യേകം നിർമ്മിച്ചത്.',
    'hero.description': 'ഇന്ത്യക്കാരുടെ ദൈനംദിന ആവശ്യങ്ങൾക്കായുള്ള ലളിതവും കൃത്യവുമായ കാൽക്കുലേറ്ററുകൾ. തികച്ചും സൗജന്യം, വേഗതയേറിയത്, നിങ്ങളുടെ ഫോണിലും കമ്പ്യൂട്ടറിലും സുരക്ഷിതം.',
    'hero.searchPlaceholder': 'ടൂളുകൾ തിരയുക (ഉദാ: UPI QR, JCB ഡീസൽ, ചെക്ക്, സെന്റ് Sq.ft)...',
    'hero.searchPlaceholderMobile': 'തിരയുക (QR, JCB, ചെക്ക്, ഫോട്ടോ)...',
    'hero.popular': 'ജനപ്രിയമായവ:',
    'hero.exploreButton': 'എല്ലാ ടൂളുകളും കാണുക',
    'hero.tryLiveButton': 'തത്സമയ കാൽക്കുലേറ്റർ',
    'hero.companionTagline': 'ഇന്ത്യൻ കണക്കുകൂട്ടലുകൾ ലളിതമാക്കാൻ നിങ്ങളുടെ വിശ്വസ്ത കൂട്ടുകാരൻ.',
    'hero.badgePrivate': '100% സ്വകാര്യം',
    'hero.badgePrivateSub': 'ക്ലൗഡ് അപ്‌ലോഡുകൾ ഇല്ല',
    'hero.badgeCategories': 'വിഭാഗങ്ങൾ',
    'hero.badgeLanguages': '13 ഭാഷകൾ',
    'hero.badgeLanguagesSub': 'ചെക്ക് വാക്കുകൾ',

    // Categories
    'cat.all': 'എല്ലാ വിഭാഗങ്ങളും',
    'cat.drive.title': 'വാഹനം & യാത്ര',
    'cat.drive.subtitle': 'ഡ്രൈവ് & മൈലേജ്',
    'cat.drive.desc': 'ഇന്ധന ചെലവ്, വാഹന മൈലേജ്, യാത്രാ ബജറ്റ് വിഭജനം, ടയർ പ്രഷർ കണക്കുകൂട്ടലുകൾ.',
    'cat.build.title': 'നിർമ്മാണം',
    'cat.build.subtitle': 'സിവിൽ & കൺസ്ട്രക്ഷൻ',
    'cat.build.desc': 'ജെസിബി വാടക, കോൺക്രീറ്റ് മിശ്രിത അനുപാതം, ഇഷ്ടിക കണക്ക്, സ്റ്റീൽ ഭാരം എന്നിവ.',
    'cat.power.title': 'വൈദ്യുതി & സോളാർ',
    'cat.power.subtitle': 'ഊർജ്ജം & താരിഫ്',
    'cat.power.desc': 'വൈദ്യുതി ബിൽ നിരക്കുകൾ, പിഎം സൂര്യ ഘർ സബ്‌സിഡി, ബോർവെൽ പമ്പ് കണക്കുകൂട്ടലുകൾ.',
    'cat.money.title': 'ധനകാര്യം & സ്വർണ്ണം',
    'cat.money.subtitle': 'ബാങ്കിംഗ് & പണം',
    'cat.money.desc': 'സ്വർണ്ണാഭരണ ബിൽ പരിശോധന, ചെക്ക് അക്ഷരങ്ങളിലേക്ക് മാറ്റൽ, ചിട്ടി ലാഭം, ജിഎസ്ടി.',
    'cat.land.title': 'ഭൂമി അളവ്',
    'cat.land.subtitle': 'സ്ഥലം & സർവ്വേ',
    'cat.land.desc': 'സെന്റ് സ്ക്വയർ ഫീറ്റിലേക്ക്, ഗുന്ത, ഏക്കർ, തുടങ്ങിയ ഇന്ത്യൻ ഭൂമി അളവ് മാറ്റങ്ങൾ.',
    'cat.work.title': 'ജോലി & ശമ്പളം',
    'cat.work.subtitle': 'വേതനം & ബിസിനസ്സ്',
    'cat.work.desc': 'കയ്യിൽ കിട്ടുന്ന ശമ്പളം (In-hand), ദിവസക്കൂലി, ബിസിനസ് ലാഭം എന്നിവ.',
    'cat.create.title': 'രൂപകൽപ്പന & ഫോട്ടോ',
    'cat.create.subtitle': 'ഡിസൈൻ & രേഖകൾ',
    'cat.create.desc': 'യുപിഐ ക്യുആർ സ്റ്റാൻഡ് പോസ്റ്റർ, പരീക്ഷാ അപേക്ഷകൾക്കുള്ള 50KB ഫോട്ടോ റീസൈസർ.',
    'cat.exploreAll': 'എല്ലാ ടൂളുകളും കാണുക',

    // Layout & Actions
    'action.reset': 'പുനഃക്രമീകരിക്കുക',
    'action.copy': 'പകർത്തുക',
    'action.share': 'പങ്കുവെക്കുക',
    'action.calculate': 'കണക്കാക്കുക',
    'action.download': 'ഡൗൺലോഡ്',
    'action.copied': 'ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തി!',
    'tool.clientSideBadge': '100% ക്ലയന്റ്-സൈഡ്',
    'tool.howItWorks': 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു & കണക്കുകൂട്ടൽ രീതി',
    'tool.assumptions': 'മാനദണ്ഡങ്ങളും അനുമാനങ്ങളും:',
    'tool.practicalExample': 'പ്രായോഗിക ഉദാഹരണം',
    'tool.inputs': 'ഇൻപുട്ടുകൾ:',
    'tool.outputs': 'ഫലങ്ങൾ:',
    'tool.faqs': 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ',
    'tool.relatedTools': 'അനുബന്ധ ടൂളുകൾ',
    'tool.relatedSubtitle': 'കൂടുതൽ കണക്കുകൂട്ടലുകൾക്കായി ഒരുമിച്ച് ഉപയോഗിക്കാവുന്നത്',
    'tool.viewAll': 'എല്ലാം കാണുക',

    // Footer
    'footer.tagline': '"നിത്യജീവിതത്തിലെ കണക്കുകൂട്ടലുകൾക്ക് ലളിതമായ ടൂളുകൾ." വാഹനം, നിർമ്മാണം, വൈദ്യുതി, ഭൂമി, സ്വർണ്ണം, ബാങ്കിംഗ് എന്നിവയ്ക്കായുള്ള അതിവേഗ ഓൺലൈൻ പ്ലാറ്റ്‌ഫോം.',
    'footer.privacyTitle': '100% പൂർണ്ണ സ്വകാര്യത',
    'footer.privacyDesc': 'എല്ലാ കണക്കുകൂട്ടലുകളും ഫോട്ടോ റീസൈസിംഗും നിങ്ങളുടെ ബ്രൗസറിനുള്ളിൽ തന്നെ നടക്കുന്നു. വിവരങ്ങൾ ശേഖരിക്കുന്നില്ല.',
    'footer.featuredTools': 'പ്രധാന ടൂളുകൾ',
    'footer.categories': 'വിഭാഗങ്ങൾ',
    'footer.platform': 'പ്ലാറ്റ്‌ഫോം',
    'footer.about': 'ഈ സംരംഭത്തെക്കുറിച്ച്',
    'footer.contact': 'ബന്ധപ്പെടുക & അഭിപ്രായങ്ങൾ',
    'footer.privacy': 'സ്വകാര്യതാ നയം',
    'footer.terms': 'ഉപയോഗ നിബന്ധനകൾ',
    'footer.backToTop': 'മുകളിലേക്ക് പോകുക',
    'footer.copyright': 'ഇന്ത്യാടൂൾസ്. ഇന്ത്യക്കായുള്ള സൗജന്യ ഓപ്പൺ സാങ്കേതികവിദ്യ.',
    'footer.engineBadge': '100% ക്ലയന്റ്-സൈഡ് എഞ്ചിൻ',
  },

  hi: {
    // Nav
    'nav.home': 'होम',
    'nav.allTools': 'सभी टूल्स',
    'nav.categories': 'श्रेणियाँ',
    'nav.chequeStudio': 'चेक स्टूडियो',
    'nav.about': 'हमारे बारे में',
    'nav.search': 'खोजें',
    'nav.exploreTools': 'टूल्स देखें',
    'nav.selectLanguage': 'भाषा चुनें',

    // Hero
    'hero.featured': 'विशेष',
    'hero.featuredCheque': 'इंडियन चेक स्टूडियो (13 भाषाएं और CTS-2010 प्रारूप)',
    'hero.eyebrow': 'भारत का रोज़मर्रा का डिजिटल टूलबॉक्स',
    'hero.precisionUtilities': 'सटीक टूल्स',
    'hero.titleLine1': 'रोज़मर्रा की ज़िंदगी के हिसाब-किताब के लिए',
    'hero.titleLine2': 'खास भारत के लिए निर्मित।',
    'hero.description': 'भारतीय ज़रूरतों के लिए बनाए गए उपयोगी कैलकुलेटर और टूल्स। पूरी तरह मुफ़्त, तेज़ और आपके फ़ोन व कंप्यूटर पर सुरक्षित।',
    'hero.searchPlaceholder': 'टूल्स खोजें (जैसे UPI QR, जेसीबी डीज़ल, चेक, सेंट से वर्ग फीट)...',
    'hero.searchPlaceholderMobile': 'खोजें (QR, JCB, चेक, 50kb फोटो)...',
    'hero.popular': 'लोकप्रिय:',
    'hero.exploreButton': 'सभी टूल्स देखें',
    'hero.tryLiveButton': 'लाइव कैलकुलेटर आज़माएं',
    'hero.companionTagline': 'दैनिक भारतीय गणनाओं को आसान बनाने वाला आपका डिजिटल साथी।',
    'hero.badgePrivate': '100% निजी',
    'hero.badgePrivateSub': 'कोई सर्वर अपलोड नहीं',
    'hero.badgeCategories': 'श्रेणियाँ',
    'hero.badgeLanguages': '13 भाषाएं',
    'hero.badgeLanguagesSub': 'चेक शब्द',

    // Categories
    'cat.all': 'सभी श्रेणियाँ',
    'cat.drive.title': 'वाहन और यात्रा',
    'cat.drive.subtitle': 'ड्राइव और माइलेज',
    'cat.drive.desc': 'ईंधन खर्च, वाहन माइलेज, यात्रा बजट विभाजन और टायर प्रेशर गाइड।',
    'cat.build.title': 'निर्माण कार्य',
    'cat.build.subtitle': 'सिविल और कंस्ट्रक्शन',
    'cat.build.desc': 'जेसीबी प्रति घंटा किराया, कंक्रीट मिश्रण, ईंटों की संख्या और सरिया का वज़न।',
    'cat.power.title': 'बिजली और सौर ऊर्जा',
    'cat.power.subtitle': 'ऊर्जा और टैरिफ',
    'cat.power.desc': 'बिजली बिल स्लैब, पीएम सूर्य घर सब्सिडी और बोरवेल पंप की गणना।',
    'cat.money.title': 'वित्त और सोना',
    'cat.money.subtitle': 'बैंकिंग और आभूषण',
    'cat.money.desc': 'सोने के गहनों का बिल, चेक के शब्दों में बदलना, चिट फंड लाभ और जीएसटी।',
    'cat.land.title': 'ज़मीन और क्षेत्रफल',
    'cat.land.subtitle': 'प्रॉपर्टी और सर्वे',
    'cat.land.desc': 'सेंट से वर्ग फीट, गुंठा, बीघा, एकड़ और भारतीय ज़मीन रूपांतरण।',
    'cat.work.title': 'नौकरी और व्यापार',
    'cat.work.subtitle': 'वेतन और मुनाफा',
    'cat.work.desc': 'हाथ में आने वाला वेतन (In-hand), दैनिक मजदूरी और व्यापार लाभ मार्जिन।',
    'cat.create.title': 'डिज़ाइन और दस्तावेज़',
    'cat.create.subtitle': 'फोटो और पीडीएफ',
    'cat.create.desc': 'यूपीआई क्यूआर स्टैंडी पोस्टर, सरकारी परीक्षा हेतु 50KB फोटो रीसाइज़र।',
    'cat.exploreAll': 'सभी टूल्स देखें',

    // Layout & Actions
    'action.reset': 'रीसेट करें',
    'action.copy': 'कॉपी करें',
    'action.share': 'शेयर करें',
    'action.calculate': 'गणना करें',
    'action.download': 'डाउनलोड करें',
    'action.copied': 'क्लिपबोर्ड पर कॉपी किया गया!',
    'tool.clientSideBadge': '100% क्लाइंट-साइड',
    'tool.howItWorks': 'यह कैसे काम करता है और गणना का तर्क',
    'tool.assumptions': 'मानक और धारणाएं:',
    'tool.practicalExample': 'व्यावहारिक उदाहरण',
    'tool.inputs': 'इनपुट:',
    'tool.outputs': 'परिणाम:',
    'tool.faqs': 'अक्सर पूछे जाने वाले सवाल',
    'tool.relatedTools': 'संबंधित उपयोगी टूल्स',
    'tool.relatedSubtitle': 'बेहतर गणना के लिए साथ में उपयोग किए जाने वाले टूल्स',
    'tool.viewAll': 'सभी देखें',

    // Footer
    'footer.tagline': '"रोज़मर्रा की ज़िंदगी के हिसाब-किताब के लिए स्मार्ट टूल्स।" वाहन, निर्माण, बिजली, ज़मीन और बैंकिंग के लिए एक तेज़ भारतीय यूटिलिटी प्लेटफॉर्म।',
    'footer.privacyTitle': '100% पूर्ण गोपनीयता',
    'footer.privacyDesc': 'सभी गणनाएं और फोटो रीसाइज़िंग सीधे आपके ब्राउज़र में होती हैं। कोई डेटा सेव नहीं होता।',
    'footer.featuredTools': 'प्रमुख टूल्स',
    'footer.categories': 'श्रेणियाँ',
    'footer.platform': 'प्लेटफ़ॉर्म',
    'footer.about': 'परियोजना के बारे में',
    'footer.contact': 'संपर्क और सुझाव',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'उपयोग की शर्तें',
    'footer.backToTop': 'ऊपर जाएं',
    'footer.copyright': 'इंडियाटूल्स। भारत के लिए निःशुल्क खुली तकनीक।',
    'footer.engineBadge': '100% क्लाइंट-साइड इंजन',
  },

  ta: {
    // Nav
    'nav.home': 'முகப்பு',
    'nav.allTools': 'அனைத்து கருவிகள்',
    'nav.categories': 'பிரிவுகள்',
    'nav.chequeStudio': 'செக் ஸ்டுடியோ',
    'nav.about': 'எங்களை பற்றி',
    'nav.search': 'தேடுக',
    'nav.exploreTools': 'கருவிகளை பார்க்க',
    'nav.selectLanguage': 'மொழியை தேர்வு செய்க',

    // Hero
    'hero.featured': 'சிறப்பு',
    'hero.featuredCheque': 'இந்திய காசோலை ஸ்டுடியோ (13 மொழிகள் மற்றும் CTS-2010 மாதிரி)',
    'hero.eyebrow': 'இந்தியாவின் அன்றாட டிஜிட்டல் டூல்பாக்ஸ்',
    'hero.precisionUtilities': 'துல்லியமான கருவிகள்',
    'hero.titleLine1': 'அன்றாட கணக்கீடுகளுக்கு எளிய கருவிகள்.',
    'hero.titleLine2': 'இந்தியாவிற்காக பிரத்யேகமாக உருவாக்கப்பட்டது.',
    'hero.description': 'இந்திய அன்றாட தேவைகளுக்கான நடைமுறை கால்குலேட்டர்கள். முற்றிலும் இலவசம், அதிவேகமானது, உங்கள் போன் மற்றும் கணினியில் பாதுகாப்பானது.',
    'hero.searchPlaceholder': 'கருவிகளைத் தேடுக (எ.கா. UPI QR, JCB டீசல், செக், சென்ட் Sq.ft)...',
    'hero.searchPlaceholderMobile': 'தேடுக (QR, JCB, செக், 50kb)...',
    'hero.popular': 'பிரபலமானவை:',
    'hero.exploreButton': 'அனைத்து கருவிகளையும் பார்க்க',
    'hero.tryLiveButton': 'லைவ் கால்குலேட்டர்',
    'hero.companionTagline': 'இந்திய அன்றாட கணக்குகளுக்கு உங்கள் நம்பகமான துணைவன்.',
    'hero.badgePrivate': '100% தனிப்பட்டது',
    'hero.badgePrivateSub': 'கிளவுட் பதிவேற்றங்கள் இல்லை',
    'hero.badgeCategories': 'பிரிவுகள்',
    'hero.badgeLanguages': '13 மொழிகள்',
    'hero.badgeLanguagesSub': 'காசோலை சொற்கள்',

    // Categories
    'cat.all': 'அனைத்து பிரிவுகள்',
    'cat.drive.title': 'வாகனம் & பயணம்',
    'cat.drive.subtitle': 'டிரைவ் & மைலேஜ்',
    'cat.drive.desc': 'எரிபொருள் செலவு, வாகன மைலேஜ், பயண செலவு பகிர்வு மற்றும் டயர் பிரஷர் வழிகாட்டி.',
    'cat.build.title': 'கட்டுமானம்',
    'cat.build.subtitle': 'சிவில் & கன்ஸ்ட்ரக்ஷன்',
    'cat.build.desc': 'ஜேசிபி வாடகை, கான்கிரீட் கலவை விகிதம், செங்கல் எண்ணிக்கை மற்றும் கம்பி எடை.',
    'cat.power.title': 'மின்சாரம் & சோலார்',
    'cat.power.subtitle': 'ஆற்றல் & கட்டணம்',
    'cat.power.desc': 'மின்சார கட்டண கணக்கீடு, பிஎம் சூர்யா கர் மானியம், போர்வெல் மோட்டார் பம்ப் அளவு.',
    'cat.money.title': 'பணம் & தங்கம்',
    'cat.money.subtitle': 'வங்கி & நகை',
    'cat.money.desc': 'தங்க நகை பில் சரிபார்ப்பு, செக் சொற்களாக மாற்றுதல், சீட்டு நிதி லாபம், ஜிஎஸ்டி.',
    'cat.land.title': 'நில அளவீடு',
    'cat.land.subtitle': 'மனை & சர்வே',
    'cat.land.desc': 'சென்ட் முதல் சதுர அடி, குந்தா, ஏக்கர் மற்றும் இந்திய நில பரப்பளவு மாற்றங்கள்.',
    'cat.work.title': 'வேலை & ஊதியம்',
    'cat.work.subtitle': 'சம்பளம் & வணிகம்',
    'cat.work.desc': 'கைக்கு வரும் சம்பளம் (In-hand), தினசரி கூலி மற்றும் வணிக லாப வரம்பு.',
    'cat.create.title': 'வடிவமைப்பு & ஆவணம்',
    'cat.create.subtitle': 'டிசைன் & புகைப்படம்',
    'cat.create.desc': 'யுபிஐ க்யூஆர் ஸ்டாண்ட் போஸ்டர், அரசு தேர்வுக்கான 50KB புகைப்பட அளவு மாற்றி.',
    'cat.exploreAll': 'அனைத்து கருவிகளையும் பார்க்க',

    // Layout & Actions
    'action.reset': 'மீட்டமைக்க',
    'action.copy': 'நகலெடு',
    'action.share': 'பகிர்க',
    'action.calculate': 'கணக்கிடுக',
    'action.download': 'பதிவிறக்குக',
    'action.copied': 'நகலெடுக்கப்பட்டது!',
    'tool.clientSideBadge': '100% கிளையன்ட்-சைட்',
    'tool.howItWorks': 'இது எவ்வாறு செயல்படுகிறது & கணக்கீட்டு முறை',
    'tool.assumptions': 'தரநிலைகள் மற்றும் அனுமானங்கள்:',
    'tool.practicalExample': 'நடைமுறை உதாரணம்',
    'tool.inputs': 'உள்ளீடுகள்:',
    'tool.outputs': 'வெளியீடுகள்:',
    'tool.faqs': 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    'tool.relatedTools': 'தொடர்புடைய கருவிகள்',
    'tool.relatedSubtitle': 'கூடுதல் கணக்குகளுக்கு ஒன்றாகப் பயன்படுத்தக்கூடியவை',
    'tool.viewAll': 'அனைத்தையும் காண்க',

    // Footer
    'footer.tagline': '"அன்றாட கணக்கீடுகளுக்கு எளிய கருவிகள்." வாகனம், கட்டுமானம், மின்சாரம், நிலம் மற்றும் வங்கிகளுக்கான வேகமான இந்திய பயன்பாட்டு தளம்.',
    'footer.privacyTitle': '100% முழுமையான தனியுரிமை',
    'footer.privacyDesc': 'அனைத்து கணக்கீடுகளும் உங்கள் பிரவுசரிலேயே நடக்கின்றன. சர்வரில் தரவுகள் சேமிக்கப்படுவதில்லை.',
    'footer.featuredTools': 'சிறப்பு கருவிகள்',
    'footer.categories': 'பிரிவுகள்',
    'footer.platform': 'தள விவரம்',
    'footer.about': 'இத்திட்டம் பற்றி',
    'footer.contact': 'தொடர்பு & கருத்துகள்',
    'footer.privacy': 'தனியுரிமைக் கொள்கை',
    'footer.terms': 'பயன்பாட்டு விதிமுறைகள்',
    'footer.backToTop': 'மேலே செல்க',
    'footer.copyright': 'இந்தியாடூல்ஸ். இந்தியாவிற்கான இலவச திறந்த தொழில்நுட்பம்.',
    'footer.engineBadge': '100% கிளையன்ட்-சைட் என்ஜின்',
  },

  te: {
    // Nav
    'nav.home': 'హోమ్',
    'nav.allTools': 'అన్ని సాధనాలు',
    'nav.categories': 'వర్గాలు',
    'nav.chequeStudio': 'చెక్ స్టూడియో',
    'nav.about': 'మా గురించి',
    'nav.search': 'వెతకండి',
    'nav.exploreTools': 'సాధనాలు చూడండి',
    'nav.selectLanguage': 'భాషను ఎంచుకోండి',

    // Hero
    'hero.featured': 'ప్రత్యేకం',
    'hero.featuredCheque': 'ఇండియన్ చెక్ స్టూడియో (13 భాషలు మరియు CTS-2010 నమూనా)',
    'hero.eyebrow': 'భారతదేశ రోజువారీ డిజిటల్ టూల్‌బాక్స్',
    'hero.precisionUtilities': 'ఖచ్చితమైన సాధనాలు',
    'hero.titleLine1': 'రోజువారీ లెక్కల కోసం సరళమైన సాధనాలు.',
    'hero.titleLine2': 'ప్రత్యేకంగా భారతదేశం కోసం రూపొందించబడింది.',
    'hero.description': 'భారతీయుల రోజువారీ అవసరాల కోసం ఖచ్చితమైన కాలిక్యులేటర్లు. పూర్తిగా ఉచితం, వేగవంతమైనది, మీ ఫోన్ మరియు డెస్క్‌టాప్‌లో సురక్షితం.',
    'hero.searchPlaceholder': 'సాధనాలు వెతకండి (ఉదా: UPI QR, JCB డీజిల్, చెక్, సెంట్ నుండి చ.అ)...',
    'hero.searchPlaceholderMobile': 'వెతకండి (QR, JCB, చెక్, 50kb)...',
    'hero.popular': 'ప్రసిద్ధమైనవి:',
    'hero.exploreButton': 'అన్ని సాధనాలు చూడండి',
    'hero.tryLiveButton': 'లైవ్ కాలిక్యులేటర్ ప్రయత్నించండి',
    'hero.companionTagline': 'రోజువారీ భారతీయ లెక్కలను సులభతరం చేసే మీ డిజిటల్ స్నేహితుడు.',
    'hero.badgePrivate': '100% ప్రైవేట్',
    'hero.badgePrivateSub': 'క్లౌడ్ అప్‌లోడ్‌లు లేవు',
    'hero.badgeCategories': 'వర్గాలు',
    'hero.badgeLanguages': '13 భాషలు',
    'hero.badgeLanguagesSub': 'చెక్ పదాలు',

    // Categories
    'cat.all': 'అన్ని వర్గాలు',
    'cat.drive.title': 'వాహనం & ప్రయాణం',
    'cat.drive.subtitle': 'డ్రైవ్ & మైలేజ్',
    'cat.drive.desc': 'ఇంధన ఖర్చు, మైలేజ్, ప్రయాణ ఖర్చుల విభజన మరియు టైర్ ప్రెషర్ గైడ్.',
    'cat.build.title': 'భవన నిర్మాణం',
    'cat.build.subtitle': 'సివిల్ & కన్స్ట్రక్షన్',
    'cat.build.desc': 'జేసీబీ అద్దె, కాంక్రీట్ మిశ్రమ నిష్పత్తి, ఇటుకల సంఖ్య మరియు స్టీల్ బరువు.',
    'cat.power.title': 'విద్యుత్ & సోలార్',
    'cat.power.subtitle': 'శక్తి & టారిఫ్',
    'cat.power.desc': 'విద్యుత్ బిల్లు స్లాబ్‌లు, పీఎం సూర్య ఘర్ సబ్సిడీ మరియు బోర్‌వెల్ పంప్ లెక్కలు.',
    'cat.money.title': 'డబ్బు & బంగారం',
    'cat.money.subtitle': 'బ్యాంకింగ్ & ఫైనాన్స్',
    'cat.money.desc': 'బంగారు ఆభరణాల బిల్లు తనిఖీ, చెక్ అక్షరాల్లోకి మార్చడం, చిట్ ఫండ్ లాభం, జీఎస్టీ.',
    'cat.land.title': 'భూమి కొలతలు',
    'cat.land.subtitle': 'స్థలం & సర్వే',
    'cat.land.desc': 'సెంట్ నుండి చదరపు అడుగులు, గుంట, ఎకరం మరియు భారతీయ భూమి కొలతల మార్పిడి.',
    'cat.work.title': 'ఉద్యోగం & వేతనం',
    'cat.work.subtitle': 'జీతం & వ్యాపారం',
    'cat.work.desc': 'చేతికి వచ్చే జీతం (In-hand), రోజువారీ వేతనం మరియు వ్యాపార లాభ మార్జిన్.',
    'cat.create.title': 'డిజైన్ & డాక్యుమెంట్',
    'cat.create.subtitle': 'ఫోటో & డిజైన్',
    'cat.create.desc': 'యూపీఐ క్యూఆర్ స్టాండీ పోస్టర్, పరీక్షల కోసం 50KB ఫోటో రీసైజర్.',
    'cat.exploreAll': 'అన్ని సాధనాలు చూడండి',

    // Layout & Actions
    'action.reset': 'రీసెట్ చేయండి',
    'action.copy': 'కాపీ చేయండి',
    'action.share': 'షేర్ చేయండి',
    'action.calculate': 'లెక్కించండి',
    'action.download': 'డౌన్‌లోడ్ చేయండి',
    'action.copied': 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    'tool.clientSideBadge': '100% క్లయింట్-సైడ్',
    'tool.howItWorks': 'ఇది ఎలా పనిచేస్తుంది & లెక్కింపు సూత్రం',
    'tool.assumptions': 'ప్రమాణాలు మరియు అంచనాలు:',
    'tool.practicalExample': 'ఆచరణాత్మక ఉదాహరణ',
    'tool.inputs': 'ఇన్‌పుట్‌లు:',
    'tool.outputs': 'ఫలితాలు:',
    'tool.faqs': 'తరచుగా అడిగే ప్రశ్నలు',
    'tool.relatedTools': 'సంబంధిత సాధనాలు',
    'tool.relatedSubtitle': 'మరిన్ని లెక్కల కోసం కలిపి ఉపయోగించగల సాధనాలు',
    'tool.viewAll': 'అన్నీ చూడండి',

    // Footer
    'footer.tagline': '"రోజువారీ లెక్కల కోసం స్మార్ట్ సాధనాలు." వాహనం, నిర్మాణం, విద్యుత్, భూమి మరియు బ్యాంకింగ్ కోసం వేగవంతమైన భారతీయ యుటిలిటీ వేదిక.',
    'footer.privacyTitle': '100% సంపూర్ణ గోప్యత',
    'footer.privacyDesc': 'అన్ని లెక్కలు మీ బ్రౌజర్‌లోనే జరుగుతాయి. సర్వర్‌లో డేటా సేవ్ చేయబడదు.',
    'footer.featuredTools': 'ప్రధాన సాధనాలు',
    'footer.categories': 'వర్గాలు',
    'footer.platform': 'ప్లాట్‌ఫారమ్',
    'footer.about': 'ప్రాజెక్ట్ గురించి',
    'footer.contact': 'సంప్రదించండి & ఫీడ్‌బ్యాక్',
    'footer.privacy': 'గోప్యతా విధానం',
    'footer.terms': 'నిబంధనలు',
    'footer.backToTop': 'పైకి వెళ్ళండి',
    'footer.copyright': 'ఇండియాటూల్స్. భారతదేశం కోసం ఉచిత ఓపెన్ టెక్నాలజీ.',
    'footer.engineBadge': '100% క్లయింట్-సైడ్ ఇంజిన్',
  },

  kn: {
    // Nav
    'nav.home': 'ಮುಖಪುಟ',
    'nav.allTools': 'ಎಲ್ಲಾ ಪರಿಕರಗಳು',
    'nav.categories': 'ವರ್ಗಗಳು',
    'nav.chequeStudio': 'ಚೆಕ್ ಸ್ಟುಡಿಯೋ',
    'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'nav.search': 'ಹುಡುಕಿ',
    'nav.exploreTools': 'ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    'nav.selectLanguage': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',

    // Hero
    'hero.featured': 'ವಿಶೇಷ',
    'hero.featuredCheque': 'ಭಾರತೀಯ ಚೆಕ್ ಸ್ಟುಡಿಯೋ (13 ಭಾಷೆಗಳು ಮತ್ತು CTS-2010 ಮಾದರಿ)',
    'hero.eyebrow': 'ಭಾರತದ ದೈನಂದಿನ ಡಿಜಿಟಲ್ ಟೂಲ್‌ಬಾಕ್ಸ್',
    'hero.precisionUtilities': 'ನಿಖರ ಪರಿಕರಗಳು',
    'hero.titleLine1': 'ದೈನಂದಿನ ಲೆಕ್ಕಾಚಾರಗಳಿಗೆ ಸರಳ ಪರಿಕರಗಳು.',
    'hero.titleLine2': 'ಭಾರತಕ್ಕಾಗಿ ವಿಶೇಷವಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
    'hero.description': 'ದೈನಂದಿನ ಭಾರತೀಯ ಅಗತ್ಯಗಳಿಗಾಗಿ ಉಪಯುಕ್ತ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು. ಸಂಪೂರ್ಣ ಉಚಿತ, ವೇಗವಾದ ಮತ್ತು ಸುರಕ್ಷಿತ.',
    'hero.searchPlaceholder': 'ಪರಿಕರಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: UPI QR, JCB ಡೀಸೆಲ್, ಚೆಕ್, ಸೆಂಟ್ ಚದರ ಅಡಿ)...',
    'hero.searchPlaceholderMobile': 'ಹುಡುಕಿ (QR, JCB, ಚೆಕ್, 50kb)...',
    'hero.popular': 'ಜನಪ್ರಿಯ:',
    'hero.exploreButton': 'ಎಲ್ಲಾ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',
    'hero.tryLiveButton': 'ಲೈವ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಪ್ರಯತ್ನಿಸಿ',
    'hero.companionTagline': 'ದೈನಂದಿನ ಭಾರತೀಯ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಸುಲಭಗೊಳಿಸುವ ನಿಮ್ಮ ಸಹಾಯಕ.',
    'hero.badgePrivate': '100% ಖಾಸಗಿ',
    'hero.badgePrivateSub': 'ಕ್ಲೌಡ್ ಅಪ್‌ಲೋಡ್ ಇಲ್ಲ',
    'hero.badgeCategories': 'ವರ್ಗಗಳು',
    'hero.badgeLanguages': '13 ಭಾಷೆಗಳು',
    'hero.badgeLanguagesSub': 'ಚೆಕ್ ಪದಗಳು',

    // Categories
    'cat.all': 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    'cat.drive.title': 'ವಾಹನ & ಪ್ರಯಾಣ',
    'cat.drive.subtitle': 'ಡ್ರೈವ್ & ಮೈಲೇಜ್',
    'cat.drive.desc': 'ಇಂಧನ ವೆಚ್ಚ, ಮೈಲೇಜ್, ಪ್ರಯಾಣ ವೆಚ್ಚ ಹಂಚಿಕೆ ಮತ್ತು ಟೈರ್ ಪ್ರೆಶರ್ ಗೈಡ್.',
    'cat.build.title': 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ',
    'cat.build.subtitle': 'ಸಿವಿಲ್ & ನಿರ್ಮಾಣ',
    'cat.build.desc': 'ಜೆಸಿಬಿ ಬಾಡಿಗೆ, ಕಾಂಕ್ರೀಟ್ ಮಿಶ್ರಣ, ಇಟ್ಟಿಗೆಗಳ ಎಣಿಕೆ ಮತ್ತು ಸ್ಟೀಲ್ ತೂಕ.',
    'cat.power.title': 'ವಿದ್ಯುತ್ & ಸೋಲಾರ್',
    'cat.power.subtitle': 'ಶಕ್ತಿ & ದರಗಳು',
    'cat.power.desc': 'ವಿದ್ಯುತ್ ಬಿಲ್ ಸ್ಲ್ಯಾಬ್‌ಗಳು, ಪಿಎಂ ಸೂರ್ಯ ಘರ್ ಸಬ್ಸಿಡಿ ಮತ್ತು ಬೋರ್‌ವೆಲ್ ಪಂಪ್ ಲೆಕ್ಕಾಚಾರ.',
    'cat.money.title': 'ಹಣ & ಚಿನ್ನ',
    'cat.money.subtitle': 'ಬ್ಯಾಂಕಿಂಗ್ & ಆಭರಣ',
    'cat.money.desc': 'ಚಿನ್ನದ ಒಡವೆ ಬಿಲ್ ಪರಿಶೀಲನೆ, ಚೆಕ್ ಅಕ್ಷರಗಳಲ್ಲಿ, ಚಿಟ್ ಫಂಡ್ ಲಾಭ, ಜಿಎಸ್‌ಟಿ.',
    'cat.land.title': 'ಭೂಮಿ ಅಳತೆ',
    'cat.land.subtitle': 'ಜಾಗ & ಸಮೀಕ್ಷೆ',
    'cat.land.desc': 'ಸೆಂಟ್‌ನಿಂದ ಚದರ ಅಡಿ, ಗುಂಟೆ, ಎಕರೆ ಮತ್ತು ಭಾರತೀಯ ಭೂಮಿ ಅಳತೆ ಪರಿವರ್ತನೆ.',
    'cat.work.title': 'ಕೆಲಸ & ವೇತನ',
    'cat.work.subtitle': 'ಸಂಬಳ & ವ್ಯಾಪಾರ',
    'cat.work.desc': 'ಕೈಗೆ ಬರುವ ವೇತನ (In-hand), ದಿನಗೂಲಿ ಮತ್ತು ವ್ಯಾಪಾರ ಲಾಭಾಂಶ.',
    'cat.create.title': 'ವಿನ್ಯಾಸ & ದಾಖಲೆ',
    'cat.create.subtitle': 'ಫೋಟೋ & ಡಿಸೈನ್',
    'cat.create.desc': 'ಯುಪಿಐ ಕ್ಯೂಆರ್ ಸ್ಟ್ಯಾಂಡಿ ಪೋಸ್ಟರ್, ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ 50KB ಫೋಟೋ ಮರು-ಗಾತ್ರ.',
    'cat.exploreAll': 'ಎಲ್ಲಾ ಪರಿಕರಗಳನ್ನು ನೋಡಿ',

    // Layout & Actions
    'action.reset': 'ಮರುಹೊಂದಿಸಿ',
    'action.copy': 'ನಕಲಿಸಿ',
    'action.share': 'ಹಂಚಿಕೊಳ್ಳಿ',
    'action.calculate': 'ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ',
    'action.download': 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    'action.copied': 'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲಾಗಿದೆ!',
    'tool.clientSideBadge': '100% ಕ್ಲೈಂಟ್-ಸೈಡ್',
    'tool.howItWorks': 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ & ಲೆಕ್ಕಾಚಾರದ ವಿಧಾನ',
    'tool.assumptions': 'ಮಾನದಂಡಗಳು ಮತ್ತು ಊಹೆಗಳು:',
    'tool.practicalExample': 'ಪ್ರಾಯೋಗಿಕ ಉದಾಹರಣೆ',
    'tool.inputs': 'ಇನ್‌ಪುಟ್‌ಗಳು:',
    'tool.outputs': 'ಫಲಿತಾಂಶಗಳು:',
    'tool.faqs': 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    'tool.relatedTools': 'ಸಂಬಂಧಿತ ಪರಿಕರಗಳು',
    'tool.relatedSubtitle': 'ಹೆಚ್ಚಿನ ಲೆಕ್ಕಾಚಾರಗಳಿಗಾಗಿ ಜತೆಯಾಗಿ ಬಳಸಬಹುದಾದ ಪರಿಕರಗಳು',
    'tool.viewAll': 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',

    // Footer
    'footer.tagline': '"ದೈನಂದಿನ ಲೆಕ್ಕಾಚಾರಗಳಿಗೆ ಸ್ಮಾರ್ಟ್ ಪರಿಕರಗಳು." ವಾಹನ, ನಿರ್ಮಾಣ, ವಿದ್ಯುತ್, ಭೂಮಿ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್‌ಗಾಗಿ ವೇಗದ ಭಾರತೀಯ ವೇದಿಕೆ.',
    'footer.privacyTitle': '100% ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ',
    'footer.privacyDesc': 'ಎಲ್ಲಾ ಲೆಕ್ಕಾಚಾರಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ನಡೆಯುತ್ತವೆ. ಯಾವುದೇ ಡೇಟಾ ಉಳಿಸುವುದಿಲ್ಲ.',
    'footer.featuredTools': 'ಪ್ರಮುಖ ಪರಿಕರಗಳು',
    'footer.categories': 'ವರ್ಗಗಳು',
    'footer.platform': 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    'footer.about': 'ಯೋಜನೆಯ ಬಗ್ಗೆ',
    'footer.contact': 'ಸಂಪರ್ಕ & ಪ್ರತಿಕ್ರಿಯೆ',
    'footer.privacy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
    'footer.terms': 'ಬಳಕೆಯ ನಿಯಮಗಳು',
    'footer.backToTop': 'ಮೇಲಕ್ಕೆ ಹೋಗಿ',
    'footer.copyright': 'ಇಂಡಿಯಾಟೂಲ್ಸ್. ಭಾರತಕ್ಕಾಗಿ ಉಚಿತ ಮುಕ್ತ ತಂತ್ರಜ್ಞಾನ.',
    'footer.engineBadge': '100% ಕ್ಲೈಂಟ್-ಸೈಡ್ ಎಂಜಿನ್',
  },

  bn: {
    // Nav
    'nav.home': 'হোম',
    'nav.allTools': 'সমস্ত টুলস',
    'nav.categories': 'বিভাগসমূহ',
    'nav.chequeStudio': 'চেক স্টুডিও',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.search': 'অনুসন্ধান',
    'nav.exploreTools': 'টুলস দেখুন',
    'nav.selectLanguage': 'ভাষা নির্বাচন করুন',

    // Hero
    'hero.featured': 'বিশেষ',
    'hero.featuredCheque': 'ইন্ডিয়ান চেক স্টুডিও (১৩টি ভাষা ও CTS-2010 নমুনা)',
    'hero.eyebrow': 'ভারতের দৈনন্দিন ডিজিটাল টুলবক্স',
    'hero.precisionUtilities': 'নির্ভুল টুলস',
    'hero.titleLine1': 'দৈনন্দিন হিসেব-নিকেশের সহজ টুলস।',
    'hero.titleLine2': 'বিশেষভাবে ভারতের জন্য তৈরি।',
    'hero.description': 'ভারতীয় দৈনন্দিন প্রয়োজনের জন্য তৈরি নিখুঁত ক্যালকুলেটর। সম্পূর্ণ বিনামূল্যে, দ্রুত এবং সুরক্ষিত।',
    'hero.searchPlaceholder': 'টুল খুঁজুন (যেমন UPI QR, জেসিবি ডিজেল, চেক, শতক থেকে বর্গফুট)...',
    'hero.searchPlaceholderMobile': 'খুঁজুন (QR, JCB, চেক, 50kb)...',
    'hero.popular': 'জনপ্রিয়:',
    'hero.exploreButton': 'সমস্ত টুলস দেখুন',
    'hero.tryLiveButton': 'লাইভ ক্যালকুলেটর দেখুন',
    'hero.companionTagline': 'দৈনন্দিন ভারতীয় গণনার জন্য আপনার বিশ্বস্ত ডিজিটাল সঙ্গী।',
    'hero.badgePrivate': '১০০% ব্যক্তিগত',
    'hero.badgePrivateSub': 'কোনো ক্লাউড আপলোড নেই',
    'hero.badgeCategories': 'বিভাগসমূহ',
    'hero.badgeLanguages': '১৩টি ভাষা',
    'hero.badgeLanguagesSub': 'চেক শব্দ',

    // Categories
    'cat.all': 'সমস্ত বিভাগ',
    'cat.drive.title': 'যানবাহন ও ভ্রমণ',
    'cat.drive.subtitle': 'ড্রাইভ ও মাইলেজ',
    'cat.drive.desc': 'জ্বালানি খরচ, মাইলেজ, ট্রিপের খরচ ভাগাভাগি এবং টায়ার প্রেশার গাইড।',
    'cat.build.title': 'নির্মাণ কাজ',
    'cat.build.subtitle': 'সিভিল ও কনস্ট্রাকশন',
    'cat.build.desc': 'জেসিবি ভাড়া, কংক্রিট মিশ্রণ অনুপাত, ইটের সংখ্যা এবং রডের ওজন।',
    'cat.power.title': 'বিদ্যুৎ ও সৌরশক্তি',
    'cat.power.subtitle': 'শক্তি ও ট্যারিফ',
    'cat.power.desc': 'বিদ্যুৎ বিল স্ল্যাব, পিএম সূর্য ঘর সাবসিডি এবং বোরওয়েল পাম্প হিসাব।',
    'cat.money.title': 'অর্থ ও স্বর্ণ',
    'cat.money.subtitle': 'ব্যাংকিং ও গয়না',
    'cat.money.desc': 'সোনার গয়নার বিল যাচাই, চেক কথায় লেখা, চিট ফান্ড ও জিএসটি।',
    'cat.land.title': 'জমি পরিমাপ',
    'cat.land.subtitle': 'জমি ও জরিপ',
    'cat.land.desc': 'শতক থেকে বর্গফুট, বিঘা, একর এবং ভারতীয় জমি রূপান্তর।',
    'cat.work.title': 'কাজ ও বেতন',
    'cat.work.subtitle': 'বেতন ও ব্যবসা',
    'cat.work.desc': 'হাতে পাওয়া বেতন (In-hand), দৈনিক মজুরি এবং ব্যবসার লাভ।',
    'cat.create.title': 'ডিজাইন ও ডকুমেন্ট',
    'cat.create.subtitle': 'ছবি ও নথি',
    'cat.create.desc': 'ইউপিআই কিউআর স্ট্যান্ড পোস্টার, পরীক্ষার জন্য ৫০ কেবি ছবি সাইজ।',
    'cat.exploreAll': 'সমস্ত টুলস দেখুন',

    // Layout & Actions
    'action.reset': 'রিসেট করুন',
    'action.copy': 'কপি করুন',
    'action.share': 'শেয়ার করুন',
    'action.calculate': 'গণনা করুন',
    'action.download': 'ডাউনলোড করুন',
    'action.copied': 'ক্লিপবোর্ডে কপি করা হয়েছে!',
    'tool.clientSideBadge': '১০০% ক্লায়েন্ট-সাইড',
    'tool.howItWorks': 'এটি কীভাবে কাজ করে এবং গণনার নিয়ম',
    'tool.assumptions': 'মানদণ্ড এবং অনুমান:',
    'tool.practicalExample': 'ব্যবহারিক উদাহরণ',
    'tool.inputs': 'ইনপুট:',
    'tool.outputs': 'ফলাফল:',
    'tool.faqs': 'সাধারণ জিজ্ঞাসা',
    'tool.relatedTools': 'সম্পর্কিত টুলস',
    'tool.relatedSubtitle': 'আরও গভীর গণনার জন্য একত্রে ব্যবহারের উপযুক্ত টুল',
    'tool.viewAll': 'সব দেখুন',

    // Footer
    'footer.tagline': '"দৈনন্দিন গণনার জন্য আধুনিক টুলস।" যানবাহন, নির্মাণ, বিদ্যুৎ, জমি ও ব্যাংকিংয়ের জন্য দ্রুত ভারতীয় প্ল্যাটফর্ম।',
    'footer.privacyTitle': '১০০% সম্পূর্ণ গোপনীয়তা',
    'footer.privacyDesc': 'সমস্ত গণনা আপনার ব্রাউজারেই সম্পন্ন হয়। কোনো ডেটা সেভ করা হয় না।',
    'footer.featuredTools': 'প্রধান টুলস',
    'footer.categories': 'বিভাগসমূহ',
    'footer.platform': 'প্ল্যাটফর্ম',
    'footer.about': 'প্রকল্প সম্পর্কে',
    'footer.contact': 'যোগাযোগ ও মতামত',
    'footer.privacy': 'গোপনীয়তা নীতি',
    'footer.terms': 'ব্যবহারের শর্তাবলী',
    'footer.backToTop': 'উপরে যান',
    'footer.copyright': 'ইন্ডিয়াটুলস। ভারতের জন্য উন্মুক্ত প্রযুক্তি।',
    'footer.engineBadge': '১০০% ক্লায়েন্ট-সাইড ইঞ্জিন',
  },

  mr: {
    // Nav
    'nav.home': 'होम',
    'nav.allTools': 'सर्व टूल्स',
    'nav.categories': 'श्रेणी',
    'nav.chequeStudio': 'चेक स्टुडिओ',
    'nav.about': 'आमच्याबद्दल',
    'nav.search': 'शोधा',
    'nav.exploreTools': 'टूल्स पहा',
    'nav.selectLanguage': 'भाषा निवडा',

    // Hero
    'hero.featured': 'विशेष',
    'hero.featuredCheque': 'इंडियन चेक स्टुडिओ (१३ भाषा आणि CTS-2010 नमुना)',
    'hero.eyebrow': 'भारताचा दैनंदिन डिजिटल टूलबॉक्स',
    'hero.precisionUtilities': 'अचूक टूल्स',
    'hero.titleLine1': 'दैनंदिन हिशोबांसाठी सोपी टूल्स.',
    'hero.titleLine2': 'खास भारतासाठी तयार केलेले.',
    'hero.description': 'दैनंदिन भारतीय गरजांसाठी उपयुक्त कॅल्क्युलेटर. पूर्णपणे विनामूल्य, जलद आणि सुरक्षित.',
    'hero.searchPlaceholder': 'टूल्स शोधा (उदा. UPI QR, जेसीबी डिझेल, चेक, गुंठा ते चौरस फूट)...',
    'hero.searchPlaceholderMobile': 'शोधा (QR, JCB, चेक, 50kb)...',
    'hero.popular': 'लोकप्रिय:',
    'hero.exploreButton': 'सर्व टूल्स पहा',
    'hero.tryLiveButton': 'लाइव्ह कॅल्क्युलेटर पहा',
    'hero.companionTagline': 'दैनंदिन भारतीय गणितांसाठी तुमचा विश्वासू डिजिटल मित्र.',
    'hero.badgePrivate': '१००% खाजगी',
    'hero.badgePrivateSub': 'कोणतेही क्लाउड अपलोड नाही',
    'hero.badgeCategories': 'श्रेणी',
    'hero.badgeLanguages': '१३ भाषा',
    'hero.badgeLanguagesSub': 'चेक शब्द',

    // Categories
    'cat.all': 'सर्व श्रेणी',
    'cat.drive.title': 'वाहन आणि प्रवास',
    'cat.drive.subtitle': 'ड्राइव्ह आणि मायलेज',
    'cat.drive.desc': 'इंधन खर्च, वाहन मायलेज, सहलीचा खर्च वाटप आणि टायर प्रेशर मार्गदर्शक.',
    'cat.build.title': 'बांधकाम',
    'cat.build.subtitle': 'सिव्हिल आणि कन्स्ट्रक्शन',
    'cat.build.desc': 'जेसीबी भाडे, काँक्रीट प्रमाण, विटांची संख्या आणि लोखंडी सळयांचे वजन.',
    'cat.power.title': 'वीज आणि सौरऊर्जा',
    'cat.power.subtitle': 'ऊर्जा आणि दर',
    'cat.power.desc': 'वीज बिल स्लॅब, पीएम सूर्य घर सबसिडी आणि बोअरवेल पंप आकार.',
    'cat.money.title': 'पैसा आणि सोने',
    'cat.money.subtitle': 'बँकिंग आणि दागिने',
    'cat.money.desc': 'सोन्याच्या दागिन्यांचे बिल, चेक अक्षरी रूपांतर, बीसी नफा आणि जीएसटी.',
    'cat.land.title': 'जमीन मोजणी',
    'cat.land.subtitle': 'जागा आणि सर्व्हेक्षण',
    'cat.land.desc': 'गुंठा ते चौरस फूट, एकर, बिघा आणि भारतीय जमीन रूपांतरण.',
    'cat.work.title': 'नोकरी आणि व्यवसाय',
    'cat.work.subtitle': 'पगार आणि नफा',
    'cat.work.desc': 'हातात येणारा पगार (In-hand), रोजंदारी आणि व्यवसाय नफा.',
    'cat.create.title': 'डिझाइन आणि दस्तऐवज',
    'cat.create.subtitle': 'फोटो आणि डिझाइन',
    'cat.create.desc': 'यूपीआय क्यूआर स्टँडी पोस्टर, परीक्षेसाठी ५० केबी फोटो रिसायझर.',
    'cat.exploreAll': 'सर्व टूल्स पहा',

    // Layout & Actions
    'action.reset': 'रीसेट करा',
    'action.copy': 'कॉपी करा',
    'action.share': 'शेअर करा',
    'action.calculate': 'गणना करा',
    'action.download': 'डाउनलोड करा',
    'action.copied': 'क्लिपबोर्डवर कॉपी केले!',
    'tool.clientSideBadge': '१००% क्लायंट-साइड',
    'tool.howItWorks': 'हे कसे कार्य करते आणि गणिताचे तर्क',
    'tool.assumptions': 'मानके आणि गृहीतके:',
    'tool.practicalExample': 'प्रत्यक्ष उदाहरण',
    'tool.inputs': 'इनपुट:',
    'tool.outputs': 'निकाल:',
    'tool.faqs': 'वारंवार विचारले जाणारे प्रश्न',
    'tool.relatedTools': 'संबंधित टूल्स',
    'tool.relatedSubtitle': 'अधिक माहितीसाठी एकत्र वापरण्याजोगी टूल्स',
    'tool.viewAll': 'सर्व पहा',

    // Footer
    'footer.tagline': '"दैनंदिन हिशोबांसाठी स्मार्ट टूल्स." वाहन, बांधकाम, वीज, जमीन आणि बँकिंगसाठी जलद भारतीय प्लॅटफॉर्म.',
    'footer.privacyTitle': '१००% संपूर्ण गोपनीयता',
    'footer.privacyDesc': 'सर्व गणना तुमच्या ब्राउझरमध्येच होतात. कोणताही डेटा साठवला जात नाही.',
    'footer.featuredTools': 'प्रमुख टूल्स',
    'footer.categories': 'श्रेणी',
    'footer.platform': 'प्लॅटफॉर्म',
    'footer.about': 'प्रकल्पाबद्दल',
    'footer.contact': 'संपर्क आणि अभिप्राय',
    'footer.privacy': 'गोपनीयता धोरण',
    'footer.terms': 'वापराच्या अटी',
    'footer.backToTop': 'वर जा',
    'footer.copyright': 'इंडियाटूल्स. भारतासाठी विनामूल्य मुक्त तंत्रज्ञान.',
    'footer.engineBadge': '१००% क्लायंट-साइड इंजिन',
  },

  gu: {
    // Nav
    'nav.home': 'હોમ',
    'nav.allTools': 'બધા ટૂલ્સ',
    'nav.categories': 'કેટેગરીઝ',
    'nav.chequeStudio': 'ચેક સ્ટુડિયો',
    'nav.about': 'અમારા વિશે',
    'nav.search': 'શોધો',
    'nav.exploreTools': 'ટૂલ્સ જુઓ',
    'nav.selectLanguage': 'ભાષા પસંદ કરો',

    // Hero
    'hero.featured': 'વિશેષ',
    'hero.featuredCheque': 'ઇન્ડિયન ચેક સ્ટુડિયો (૧૩ ભાષાઓ અને CTS-2010 નમૂનો)',
    'hero.eyebrow': 'ભારતનું રોજિંદુ ડિજિટલ ટૂલબોક્સ',
    'hero.precisionUtilities': 'સચોટ ટૂલ્સ',
    'hero.titleLine1': 'રોજિંદા હિસાબો માટે સરળ ટૂલ્સ.',
    'hero.titleLine2': 'ખાસ ભારત માટે બનાવેલ.',
    'hero.description': 'ભારતીયોની રોજિંદી જરૂરિયાતો માટે ઉપયોગી કેલ્ક્યુલેટર. તદ્દન મફત, ઝડપી અને સુરક્ષિત.',
    'hero.searchPlaceholder': 'ટૂલ શોધો (દા.ત. UPI QR, જેસીબી ડીઝલ, ચેક, ચોરસ ફૂટ)...',
    'hero.searchPlaceholderMobile': 'શોધો (QR, JCB, ચેક, 50kb)...',
    'hero.popular': 'લોકપ્રિય:',
    'hero.exploreButton': 'બધા ટૂલ્સ જુઓ',
    'hero.tryLiveButton': 'લાઈવ કેલ્ક્યુલેટર જુઓ',
    'hero.companionTagline': 'રોજિંદા ભારતીય હિસાબો માટે તમારો ડિજિટલ સાથી.',
    'hero.badgePrivate': '૧૦૦% ખાનગી',
    'hero.badgePrivateSub': 'કોઈ ક્લાઉડ અપલોડ નહીં',
    'hero.badgeCategories': 'કેટેગરીઝ',
    'hero.badgeLanguages': '૧૩ ભાષાઓ',
    'hero.badgeLanguagesSub': 'ચેક શબ્દો',

    // Categories
    'cat.all': 'બધી કેટેગરીઝ',
    'cat.drive.title': 'વાહન અને મુસાફરી',
    'cat.drive.subtitle': 'ડ્રાઇવ અને માઇલેજ',
    'cat.drive.desc': 'ઇંધણ ખર્ચ, વાહન માઇલેજ, ટ્રિપ ખર્ચ વહેંચણી અને ટાયર પ્રેશર માર્ગદર્શિકા.',
    'cat.build.title': 'બાંધકામ',
    'cat.build.subtitle': 'સિવિલ અને કન્સ્ટ્રક્શન',
    'cat.build.desc': 'જેસીબી ભાડું, કોંક્રિટ મિશ્રણ, ઈંટોની ગણતરી અને સ્ટીલનું વજન.',
    'cat.power.title': 'વીજળી અને સોલાર',
    'cat.power.subtitle': 'ઊર્જા અને ટેરિફ',
    'cat.power.desc': 'વીજળી બિલ સ્લેબ, પીએમ સૂર્ય ઘર સબસિડી અને બોરવેલ પંપ ગણતરી.',
    'cat.money.title': 'નાણાં અને સોનું',
    'cat.money.subtitle': 'બેન્કિંગ અને ઘરેણાં',
    'cat.money.desc': 'સોનાના દાગીના બિલ તપાસ, ચેક શબ્દોમાં, ચિટ ફંડ નફો, જીએસટી.',
    'cat.land.title': 'જમીન માપણી',
    'cat.land.subtitle': 'જમીન અને સર્વે',
    'cat.land.desc': 'ગુંઠા થી ચોરસ ફૂટ, વીઘા, એકર અને ભારતીય જમીન રૂપાંતરણ.',
    'cat.work.title': 'નોકરી અને વ્યવસાય',
    'cat.work.subtitle': 'પગાર અને નફો',
    'cat.work.desc': 'હાથમાં આવતો પગાર (In-hand), દૈનિક મજૂરી અને ધંધાનો નફો.',
    'cat.create.title': 'ડિઝાઇન અને દસ્તાવેજ',
    'cat.create.subtitle': 'ફોટો અને ડિઝાઇન',
    'cat.create.desc': 'યુપીઆઈ ક્યુઆર સ્ટેન્ડી પોસ્ટર, પરીક્ષા માટે ૫૦ કેબી ફોટો રિસાઇઝર.',
    'cat.exploreAll': 'બધા ટૂલ્સ જુઓ',

    // Layout & Actions
    'action.reset': 'રીસેટ કરો',
    'action.copy': 'કૉપિ કરો',
    'action.share': 'શેર કરો',
    'action.calculate': 'ગણતરી કરો',
    'action.download': 'ડાઉનલોડ કરો',
    'action.copied': 'ક્લિપબોર્ડ પર કૉપિ કર્યું!',
    'tool.clientSideBadge': '૧૦૦% ક્લાયન્ટ-સાઇડ',
    'tool.howItWorks': 'આ કેવી રીતે કાર્ય કરે છે & ગણતરી પદ્ધતિ',
    'tool.assumptions': 'ધોરણો અને ધારણાઓ:',
    'tool.practicalExample': 'વ્યવહારુ ઉદાહરણ',
    'tool.inputs': 'ઇનપુટ્સ:',
    'tool.outputs': 'પરિણામો:',
    'tool.faqs': 'વારંવાર પૂછાતા પ્રશ્નો',
    'tool.relatedTools': 'સંબંધિત ટૂલ્સ',
    'tool.relatedSubtitle': 'વધુ ગણતરીઓ માટે સાથે વાપરવા યોગ્ય ટૂલ્સ',
    'tool.viewAll': 'બધા જુઓ',

    // Footer
    'footer.tagline': '"રોજિંદા હિસાબો માટે સ્માર્ટ ટૂલ્સ." વાહન, બાંધકામ, વીજળી, જમીન અને બેન્કિંગ માટેનું ઝડપી ભારતીય પ્લેટફોર્મ.',
    'footer.privacyTitle': '૧૦૦% સંપૂર્ણ ગોપનીયતા',
    'footer.privacyDesc': 'બધી ગણતરીઓ તમારા બ્રાઉઝરમાં જ થાય છે. કોઈ ડેટા સચવાતો નથી.',
    'footer.featuredTools': 'મુખ્ય ટૂલ્સ',
    'footer.categories': 'કેટેગરીઝ',
    'footer.platform': 'પ્લેટફોર્મ',
    'footer.about': 'પ્રોજેક્ટ વિશે',
    'footer.contact': 'સંપર્ક અને પ્રતિસાદ',
    'footer.privacy': 'ગોપનીયતા નીતિ',
    'footer.terms': 'ઉપયોગની શરતો',
    'footer.backToTop': 'ઉપર જાઓ',
    'footer.copyright': 'ઇન્ડિયાટૂલ્સ. ભારત માટે નિઃશુલ્ક ઓપન ટેકનોલોજી.',
    'footer.engineBadge': '૧૦૦% ક્લાયન્ટ-સાઇડ એન્જિન',
  },

  pa: {
    // Nav
    'nav.home': 'ਘਰ',
    'nav.allTools': 'ਸਾਰੇ ਟੂਲਜ਼',
    'nav.categories': 'ਸ਼੍ਰੇਣੀਆਂ',
    'nav.chequeStudio': 'ਚੈੱਕ ਸਟੂਡੀਓ',
    'nav.about': 'ਸਾਡੇ ਬਾਰੇ',
    'nav.search': 'ਖੋਜ ਕਰੋ',
    'nav.exploreTools': 'ਟੂਲਜ਼ ਵੇਖੋ',
    'nav.selectLanguage': 'ਭਾਸ਼ਾ ਚੁਣੋ',

    // Hero
    'hero.featured': 'ਵਿਸ਼ੇਸ਼',
    'hero.featuredCheque': 'ਇੰਡੀਅਨ ਚੈੱਕ ਸਟੂਡੀਓ (13 ਭਾਸ਼ਾਵਾਂ ਅਤੇ CTS-2010 ਨਮੂਨਾ)',
    'hero.eyebrow': 'ਭਾਰਤ ਦਾ ਰੋਜ਼ਾਨਾ ਡਿਜੀਟਲ ਟੂਲਬਾਕਸ',
    'hero.precisionUtilities': 'ਸਟੀਕ ਟੂਲਜ਼',
    'hero.titleLine1': 'ਰੋਜ਼ਾਨਾ ਦੇ ਹਿਸਾਬ-ਕਿਤਾਬ ਲਈ ਆਸਾਨ ਟੂਲਜ਼।',
    'hero.titleLine2': 'ਖਾਸ ਭਾਰਤ ਲਈ ਬਣਾਇਆ ਗਿਆ।',
    'hero.description': 'ਭਾਰਤੀ ਲੋੜਾਂ ਲਈ ਬਣਾਏ ਗਏ ਲਾਭਦਾਇਕ ਕੈਲਕੁਲੇਟਰ। ਬਿਲਕੁਲ ਮੁਫ਼ਤ, ਤੇਜ਼ ਅਤੇ ਸੁਰੱਖਿਅਤ।',
    'hero.searchPlaceholder': 'ਟੂਲ ਖੋਜੋ (ਜਿਵੇਂ UPI QR, ਜੇਸੀਬੀ ਡੀਜ਼ਲ, ਚੈੱਕ, ਮਰਲਾ/ਕਨਾਲ)...',
    'hero.searchPlaceholderMobile': 'ਖੋਜੋ (QR, JCB, ਚੈੱਕ, 50kb)...',
    'hero.popular': 'ਪ੍ਰਸਿੱਧ:',
    'hero.exploreButton': 'ਸਾਰੇ ਟੂਲਜ਼ ਵੇਖੋ',
    'hero.tryLiveButton': 'ਲਾਈਵ ਕੈਲਕੁਲੇਟਰ ਅਜ਼ਮਾਓ',
    'hero.companionTagline': 'ਰੋਜ਼ਾਨਾ ਭਾਰਤੀ ਗਣਨਾਵਾਂ ਨੂੰ ਸਰਲ ਬਣਾਉਣ ਵਾਲਾ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਸਾਥੀ।',
    'hero.badgePrivate': '100% ਨਿੱਜੀ',
    'hero.badgePrivateSub': 'ਕੋਈ ਕਲਾਉਡ ਅੱਪਲੋਡ ਨਹੀਂ',
    'hero.badgeCategories': 'ਸ਼੍ਰੇਣੀਆਂ',
    'hero.badgeLanguages': '13 ਭਾਸ਼ਾਵਾਂ',
    'hero.badgeLanguagesSub': 'ਚੈੱਕ ਸ਼ਬਦ',

    // Categories
    'cat.all': 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ',
    'cat.drive.title': 'ਵਾਹਨ ਅਤੇ ਸਫ਼ਰ',
    'cat.drive.subtitle': 'ਡਰਾਈਵ ਅਤੇ ਮਾਈਲੇਜ',
    'cat.drive.desc': 'ਤੇਲ ਦਾ ਖ਼ਰਚਾ, ਵਾਹਨ ਮਾਈਲੇਜ, ਸਫ਼ਰ ਖ਼ਰਚ ਵੰਡ ਅਤੇ ਟਾਇਰ ਪ੍ਰੈਸ਼ਰ ਗਾਈਡ।',
    'cat.build.title': 'ਉਸਾਰੀ ਦਾ ਕੰਮ',
    'cat.build.subtitle': 'ਸਿਵਲ ਅਤੇ ਕੰਸਟ੍ਰਕਸ਼ਨ',
    'cat.build.desc': 'ਜੇਸੀਬੀ ਕਿਰਾਇਆ, ਕੰਕਰੀਟ ਮਿਸ਼ਰਣ, ਇੱਟਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਰਿਏ ਦਾ ਭਾਰ।',
    'cat.power.title': 'ਬਿਜਲੀ ਅਤੇ ਸੋਲਰ',
    'cat.power.subtitle': 'ਊਰਜਾ ਅਤੇ ਦਰਾਂ',
    'cat.power.desc': 'ਬਿਜਲੀ ਬਿੱਲ ਸਲੈਬ, ਪੀਐਮ ਸੂਰਯ ਘਰ ਸਬਸਿਡੀ ਅਤੇ ਬੋਰਵੈੱਲ ਪੰਪ ਗਣਨਾ।',
    'cat.money.title': 'ਪੈਸਾ ਅਤੇ ਸੋਨਾ',
    'cat.money.subtitle': 'ਬੈਂਕਿੰਗ ਅਤੇ ਗਹਿਣੇ',
    'cat.money.desc': 'ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ ਦਾ ਬਿੱਲ, ਚੈੱਕ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਚਿੱਟ ਫੰਡ ਮੁਨਾਫ਼ਾ, ਜੀਐਸਟੀ।',
    'cat.land.title': 'ਜ਼ਮੀਨ ਮਿਣਤੀ',
    'cat.land.subtitle': 'ਜ਼ਮੀਨ ਅਤੇ ਸਰਵੇ',
    'cat.land.desc': 'ਮਰਲਾ, ਕਨਾਲ, ਏਕੜ, ਬਿਘਾ ਅਤੇ ਭਾਰਤੀ ਜ਼ਮੀਨ ਪਰਿਵਰਤਨ।',
    'cat.work.title': 'ਕੰਮ ਅਤੇ ਤਨਖਾਹ',
    'cat.work.subtitle': 'ਤਨਖਾਹ ਅਤੇ ਮੁਨਾਫ਼ਾ',
    'cat.work.desc': 'ਹੱਥ ਆਉਣ ਵਾਲੀ ਤਨਖਾਹ (In-hand), ਦਿਹਾੜੀ ਅਤੇ ਕਾਰੋਬਾਰੀ ਮੁਨਾਫ਼ਾ।',
    'cat.create.title': 'ਡਿਜ਼ਾਈਨ ਅਤੇ ਦਸਤਾਵੇਜ਼',
    'cat.create.subtitle': 'ਫੋਟੋ ਅਤੇ ਦਸਤਾਵੇਜ਼',
    'cat.create.desc': 'ਯੂਪੀਆਈ ਕਿਊਆਰ ਸਟੈਂਡੀ ਪੋਸਟਰ, ਪ੍ਰੀਖਿਆਵਾਂ ਲਈ 50KB ਫੋਟੋ ਰੀਸਾਈਜ਼ਰ।',
    'cat.exploreAll': 'ਸਾਰੇ ਟੂਲਜ਼ ਵੇਖੋ',

    // Layout & Actions
    'action.reset': 'ਰੀਸੈੱਟ ਕਰੋ',
    'action.copy': 'ਕਾਪੀ ਕਰੋ',
    'action.share': 'ਸਾਂਝਾ ਕਰੋ',
    'action.calculate': 'ਹਿਸਾਬ ਕਰੋ',
    'action.download': 'ਡਾਊਨਲੋਡ ਕਰੋ',
    'action.copied': 'ਕਲਿੱਪਬੋਰਡ ਤੇ ਕਾਪੀ ਹੋ ਗਿਆ!',
    'tool.clientSideBadge': '100% ਕਲਾਇੰਟ-ਸਾਈਡ',
    'tool.howItWorks': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ & ਗਣਨਾ ਦਾ ਤਰੀਕਾ',
    'tool.assumptions': 'ਮਿਆਰ ਅਤੇ ਧਾਰਨਾਵਾਂ:',
    'tool.practicalExample': 'ਵਿਹਾਰਕ ਉਦਾਹਰਣ',
    'tool.inputs': 'ਇਨਪੁਟ:',
    'tool.outputs': 'ਨਤੀਜੇ:',
    'tool.faqs': 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ',
    'tool.relatedTools': 'ਸੰਬੰਧਿਤ ਟੂਲਜ਼',
    'tool.relatedSubtitle': 'ਹੋਰ ਗਣਨਾਵਾਂ ਲਈ ਇਕੱਠੇ ਵਰਤਣ ਯੋਗ ਟੂਲਜ਼',
    'tool.viewAll': 'ਸਾਰੇ ਵੇਖੋ',

    // Footer
    'footer.tagline': '"ਰੋਜ਼ਾਨਾ ਹਿਸਾਬ-ਕਿਤਾਬ ਲਈ ਸਮਾਰਟ ਟੂਲਜ਼।" ਵਾਹਨ, ਉਸਾਰੀ, ਬਿਜਲੀ, ਜ਼ਮੀਨ ਅਤੇ ਬੈਂਕਿੰਗ ਲਈ ਤੇਜ਼ ਭਾਰਤੀ ਪਲੇਟਫਾਰਮ।',
    'footer.privacyTitle': '100% ਪੂਰੀ ਗੋਪਨੀਯਤਾ',
    'footer.privacyDesc': 'ਸਾਰੀਆਂ ਗਣਨਾਵਾਂ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਹੀ ਹੁੰਦੀਆਂ ਹਨ। ਕੋਈ ਡਾਟਾ ਸੇਵ ਨਹੀਂ ਹੁੰਦਾ।',
    'footer.featuredTools': 'ਮੁੱਖ ਟੂਲਜ਼',
    'footer.categories': 'ਸ਼੍ਰੇਣੀਆਂ',
    'footer.platform': 'ਪਲੇਟਫਾਰਮ',
    'footer.about': 'ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ',
    'footer.contact': 'ਸੰਪਰਕ ਅਤੇ ਫੀਡਬੈਕ',
    'footer.privacy': 'ਪਰਦੇਦਾਰੀ ਨੀਤੀ',
    'footer.terms': 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ',
    'footer.backToTop': 'ਉੱਪਰ ਜਾਓ',
    'footer.copyright': 'ਇੰਡੀਆਟੂਲਜ਼। ਭਾਰਤ ਲਈ ਮੁਫ਼ਤ ਓਪਨ ਟੈਕਨਾਲੋਜੀ।',
    'footer.engineBadge': '100% ਕਲਾਇੰਟ-ਸਾਈਡ ਇੰਜਣ',
  },

  or: {
    // Nav
    'nav.home': 'ମୂଳପୃଷ୍ଠା',
    'nav.allTools': 'ସମସ୍ତ ଉପକରଣ',
    'nav.categories': 'ବିଭାଗ',
    'nav.chequeStudio': 'ଚେକ୍ ଷ୍ଟୁଡିଓ',
    'nav.about': 'ଆମ ବିଷୟରେ',
    'nav.search': 'ଖୋଜନ୍ତୁ',
    'nav.exploreTools': 'ଉପକରଣ ଦେଖନ୍ତୁ',
    'nav.selectLanguage': 'ଭାଷା ବାଛନ୍ତୁ',

    // Hero
    'hero.featured': 'ବିଶେଷ',
    'hero.featuredCheque': 'ଇଣ୍ଡିଆନ୍ ଚେକ୍ ଷ୍ଟୁଡିଓ (୧୩ଟି ଭାଷା ଓ CTS-2010 ନମୁନା)',
    'hero.eyebrow': 'ଭାରତର ଦୈନନ୍ଦିନ ଡିଜିଟାଲ୍ ଟୁଲ୍‌ବକ୍ସ',
    'hero.precisionUtilities': 'ସଠିକ୍ ଉପକରଣ',
    'hero.titleLine1': 'ଦୈନନ୍ଦିନ ହିସାବ କିତାବ ପାଇଁ ସରଳ ଉପକରଣ।',
    'hero.titleLine2': 'ସ୍ୱତନ୍ତ୍ର ଭାବରେ ଭାରତ ପାଇଁ ନିର୍ମିତ।',
    'hero.description': 'ଭାରତୀୟଙ୍କ ଦୈନନ୍ଦିନ ଆବଶ୍ୟକତା ପାଇଁ ଉପଯୋଗୀ କାଲକୁଲେଟର୍। ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା, ଦ୍ରୁତ ଏବଂ ସୁରକ୍ଷିତ।',
    'hero.searchPlaceholder': 'ଉପକରଣ ଖୋଜନ୍ତୁ (ଯଥା UPI QR, ଜେସିବି ଡିଜେଲ, ଚେକ୍, ବର୍ଗଫୁଟ)...',
    'hero.searchPlaceholderMobile': 'ଖୋଜନ୍ତୁ (QR, JCB, ଚେକ୍, 50kb)...',
    'hero.popular': 'ଲୋକପ୍ରିୟ:',
    'hero.exploreButton': 'ସମସ୍ତ ଉପକରଣ ଦେଖନ୍ତୁ',
    'hero.tryLiveButton': 'ଲାଇଭ୍ କାଲକୁଲେଟର୍ ଦେଖନ୍ତୁ',
    'hero.companionTagline': 'ଦୈନନ୍ଦିନ ଭାରତୀୟ ଗଣନା ପାଇଁ ଆପଣଙ୍କ ବିଶ୍ୱସ୍ତ ସାଥୀ।',
    'hero.badgePrivate': '୧୦୦% ବ୍ୟକ୍ତିଗତ',
    'hero.badgePrivateSub': 'କୌଣସି କ୍ଲାଉଡ୍ ଅପଲୋଡ୍ ନାହିଁ',
    'hero.badgeCategories': 'ବିଭାଗ',
    'hero.badgeLanguages': '୧୩ଟି ଭାଷା',
    'hero.badgeLanguagesSub': 'ଚେକ୍ ଶବ୍ଦ',

    // Categories
    'cat.all': 'ସମସ୍ତ ବିଭାଗ',
    'cat.drive.title': 'ଗାଡ଼ି ଓ ଯାତ୍ରା',
    'cat.drive.subtitle': 'ଡ୍ରାଇଭ୍ ଓ ମାଇଲେଜ୍',
    'cat.drive.desc': 'ଇନ୍ଧନ ଖର୍ଚ୍ଚ, ଗାଡ଼ି ମାଇଲେଜ୍, ଯାତ୍ରା ଖର୍ଚ୍ଚ ଭାଗ ଏବଂ ଟାୟାର ପ୍ରେସର୍ ଗାଇଡ୍।',
    'cat.build.title': 'ନିର୍ମାଣ କାର୍ଯ୍ୟ',
    'cat.build.subtitle': 'ସିଭିଲ୍ ଓ କନଷ୍ଟ୍ରକସନ୍',
    'cat.build.desc': 'ଜେସିବି ଭଡ଼ା, କଂକ୍ରିଟ୍ ମିଶ୍ରଣ, ଇଟା ଗଣନା ଏବଂ ରଡ୍ ଓଜନ।',
    'cat.power.title': 'ବିଦ୍ୟୁତ୍ ଓ ସୌରଶକ୍ତି',
    'cat.power.subtitle': 'ଶକ୍ତି ଓ ଟାରିଫ୍',
    'cat.power.desc': 'ବିଦ୍ୟୁତ୍ ବିଲ୍ ସ୍ଲାବ୍, ପିଏମ୍ ସୂର୍ଯ୍ୟ ଘର ସବସିଡି ଏବଂ ବୋରୱେଲ୍ ପମ୍ପ ଗଣନା।',
    'cat.money.title': 'ଅର୍ଥ ଓ ସୁନା',
    'cat.money.subtitle': 'ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଓ ଅଳଙ୍କାର',
    'cat.money.desc': 'ସୁନା ଗହଣା ବିଲ୍ ଯାଞ୍ଚ, ଚେକ୍ ଅକ୍ଷରରେ ରୂପାନ୍ତର, ଚିଟ୍ ଫଣ୍ଡ ଲାଭ, ଜିଏସଟି।',
    'cat.land.title': 'ଜମି ମାପ',
    'cat.land.subtitle': 'ଜମି ଓ ସର୍ଭେ',
    'cat.land.desc': 'ଡେସିମିଲ୍ ରୁ ବର୍ଗଫୁଟ, ଗୁଣ୍ଠ, ଏକର ଏବଂ ଭାରତୀୟ ଜମି ରୂପାନ୍ତର।',
    'cat.work.title': 'କାର୍ଯ୍ୟ ଓ ବେତନ',
    'cat.work.subtitle': 'ଦରମା ଓ ବ୍ୟବସାୟ',
    'cat.work.desc': 'ହାତକୁ ଆସୁଥିବା ଦରମା (In-hand), ଦୈନିକ ମଜୁରୀ ଏବଂ ବ୍ୟବସାୟ ଲାଭ।',
    'cat.create.title': 'ଡିଜାଇନ୍ ଓ ଦସ୍ତାବିଜ',
    'cat.create.subtitle': 'ଫଟୋ ଓ ଡିଜାଇନ୍',
    'cat.create.desc': 'ୟୁପିଆଇ କ୍ୟୁଆର୍ ଷ୍ଟାଣ୍ଡି ପୋଷ୍ଟର, ପରୀକ୍ଷା ପାଇଁ ୫୦ କେବି ଫଟୋ ରିସାଇଜର୍।',
    'cat.exploreAll': 'ସମସ୍ତ ଉପକରଣ ଦେଖନ୍ତୁ',

    // Layout & Actions
    'action.reset': 'ରିସେଟ୍ କରନ୍ତୁ',
    'action.copy': 'କପି କରନ୍ତୁ',
    'action.share': 'ସେୟାର୍ କରନ୍ତୁ',
    'action.calculate': 'ଗଣନା କରନ୍ତୁ',
    'action.download': 'ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    'action.copied': 'କ୍ଲିପବୋର୍ଡରେ କପି ହୋଇଛି!',
    'tool.clientSideBadge': '୧୦୦% କ୍ଲାଏଣ୍ଟ-ସାଇଡ୍',
    'tool.howItWorks': 'ଏହା କିପରି କାମ କରେ & ଗଣନା ପଦ୍ଧତି',
    'tool.assumptions': 'ମାନଦଣ୍ଡ ଏବଂ ଧାରଣା:',
    'tool.practicalExample': 'ବାସ୍ତବ ଉଦାହରଣ',
    'tool.inputs': 'ଇନପୁଟ୍:',
    'tool.outputs': 'ଫଳାଫଳ:',
    'tool.faqs': 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ',
    'tool.relatedTools': 'ସମ୍ପର୍କିତ ଉପକରଣ',
    'tool.relatedSubtitle': 'ଅଧିକ ଗଣନା ପାଇଁ ଏକତ୍ର ବ୍ୟବହାର ଯୋଗ୍ୟ',
    'tool.viewAll': 'ସମସ୍ତ ଦେଖନ୍ତୁ',

    // Footer
    'footer.tagline': '"ଦୈନନ୍ଦିନ ହିସାବ କିତାବ ପାଇଁ ସ୍ମାର୍ଟ ଉପକରଣ।" ଗାଡ଼ି, ନିର୍ମାଣ, ବିଦ୍ୟୁତ୍, ଜମି ଏବଂ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ପାଇଁ ଦ୍ରୁତ ଭାରତୀୟ ପ୍ଲାଟଫର୍ମ।',
    'footer.privacyTitle': '୧୦୦% ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନୀୟତା',
    'footer.privacyDesc': 'ସମସ୍ତ ଗଣନା ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ହିଁ ହୋଇଥାଏ। କୌଣସି ତଥ୍ୟ ସଂରକ୍ଷଣ ହୁଏ ନାହିଁ।',
    'footer.featuredTools': 'ପ୍ରମୁଖ ଉପକରଣ',
    'footer.categories': 'ବିଭାଗ',
    'footer.platform': 'ପ୍ଲାଟଫର୍ମ',
    'footer.about': 'ପ୍ରକଳ୍ପ ବିଷୟରେ',
    'footer.contact': 'ଯୋଗାଯୋଗ ଓ ମତାମତ',
    'footer.privacy': 'ଗୋପନୀୟତା ନୀତି',
    'footer.terms': 'ବ୍ୟବହାର ସର୍ତ୍ତାବଳୀ',
    'footer.backToTop': 'ଉପରକୁ ଯାଆନ୍ତୁ',
    'footer.copyright': 'ଇଣ୍ଡିଆଟୁଲ୍ସ। ଭାରତ ପାଇଁ ମାଗଣା ମୁକ୍ତ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା।',
    'footer.engineBadge': '୧୦୦% କ୍ଲାଏଣ୍ଟ-ସାଇଡ୍ ଇଞ୍ଜିନ୍',
  },
}

export function getUITranslation(locale: SupportedLocale, key: string, fallback?: string): string {
  const dict = UI_TRANSLATIONS[locale]
  if (dict && dict[key]) {
    return dict[key]
  }
  const enDict = UI_TRANSLATIONS['en']
  if (enDict && enDict[key]) {
    return enDict[key]
  }
  return fallback || key
}
