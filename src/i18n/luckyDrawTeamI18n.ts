/**
 * Comprehensive Localization Dictionary for Lucky Draw Wheel & Random Team Splitter
 * Supports English + all 22 official Eighth Schedule Indian Languages:
 * Assamese (as), Bengali (bn), Bodo (brx), Dogri (doi), Gujarati (gu),
 * Hindi (hi), Kannada (kn), Kashmiri (ks), Konkani (kok), Maithili (mai),
 * Malayalam (ml), Meitei/Manipuri (mni), Marathi (mr), Nepali (ne),
 * Odia (or), Punjabi (pa), Sanskrit (sa), Santali (sat), Sindhi (sd),
 * Tamil (ta), Telugu (te), Urdu (ur), and English (en).
 */

export type LuckyLangCode =
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

export interface LuckyLocaleMeta {
  code: LuckyLangCode
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  bcp47: string
}

export const LUCKY_LOCALES: Record<LuckyLangCode, LuckyLocaleMeta> = {
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

export const ALL_LUCKY_LANG_CODES = Object.keys(LUCKY_LOCALES) as LuckyLangCode[]

export function isLuckyLocale(code: string): code is LuckyLangCode {
  return code in LUCKY_LOCALES
}

export interface LuckyFaq {
  question: string
  answer: string
}

export interface LuckyToolContent {
  locale: LuckyLangCode
  localeName: string
  dir: 'ltr' | 'rtl'
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  modes: {
    wheel: string
    teams: string
  }
  participantLabels: {
    title: string
    placeholder: string
    addName: string
    addPlaceholder: string
    sampleData: string
    clearAll: string
    shuffle: string
    removeDuplicates: string
    totalCount: string
    sampleIPL: string
    sampleOffice: string
    sampleClass: string
    sampleParty: string
  }
  wheelLabels: {
    spinButton: string
    spinning: string
    spinDuration: string
    seconds: string
    soundToggle: string
    soundOn: string
    soundOff: string
    removeWinner: string
    winnerModalTitle: string
    winnerLabel: string
    spinAgain: string
    copyWinner: string
    winnerHistory: string
    noWinnersYet: string
    clearHistory: string
    tooManyWarning: string
    gameOver?: string
    lastRemaining?: string
    finalRoundComplete?: string
    resetRoster?: string
    viewResults?: string
  }
  teamLabels: {
    splitBy: string
    byTeams: string
    bySize: string
    numTeamsLabel: string
    teamSizeLabel: string
    splitButton: string
    reshuffle: string
    copyTeams: string
    exportPng: string
    printTeams: string
    moveToTeam: string
    editTeamName: string
    noParticipants: string
  }
  faqs: LuckyFaq[]
  disclaimer: string
  privacyNotice: string
}

export const LUCKY_TOOL_I18N: Record<LuckyLangCode, LuckyToolContent> = {
  "en": {
    "locale": "en",
    "localeName": "English",
    "dir": "ltr",
    "title": "Lucky Draw Wheel & Random Team Generator | IndiaTools",
    "metaDescription": "Spin a colorful lucky draw wheel to pick a random winner or split names into balanced teams. Free online random name picker for classrooms, clubs, parties and events.",
    "h1": "Lucky Draw Wheel & Random Team Splitter",
    "subtitle": "Free interactive spinning wheel and balanced random team generator. 100% private, client-side randomness for classrooms, sports, parties, and office contests.",
    "modes": {
      "wheel": "Lucky Draw Wheel",
      "teams": "Random Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel.",
      "gameOver": "GAME OVER",
      "lastRemaining": "Final Remaining Participant",
      "finalRoundComplete": "Final Round Complete!",
      "resetRoster": "Play Again (Reset Roster)",
      "viewResults": "Finish Game & View Standings"
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How is the lucky draw winner selected?",
        "answer": "The winner is chosen using browser-native cryptographically strong randomness (crypto.getRandomValues). The wheel stopping angle is calculated so that the needle accurately points to the selected segment."
      },
      {
        "question": "How does the random team splitter balance groups?",
        "answer": "It uses a round-robin algorithm over a freshly shuffled list. Team sizes never differ by more than one participant, ensuring maximum fairness."
      },
      {
        "question": "Are participant names stored or sent to any server?",
        "answer": "No. All names, wheel physics, and team splits are processed entirely in your web browser. Nothing is ever uploaded or tracked."
      },
      {
        "question": "Can I remove the winner from subsequent spins?",
        "answer": "Yes! Toggle the \"Remove winner from wheel for next spin\" option. When enabled, the winning name is automatically excluded from the wheel for subsequent draws."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "hi": {
    "locale": "hi",
    "localeName": "Hindi",
    "dir": "ltr",
    "title": "लकी ड्रॉ व्हील और रैंडम टीम जनरेटर | IndiaTools",
    "metaDescription": "रंगीन लकी ड्रॉ व्हील घुमाकर विजेता चुनें या नामों को संतुलित टीमों में विभाजित करें। क्लासरूम, पार्टी, स्पोर्ट्स और ऑफिस गेम्स के लिए फ्री ऑनलाइन टूल।",
    "h1": "लकी ड्रॉ व्हील और रैंडम टीम स्प्लिटर",
    "subtitle": "मुफ्त इंटरैक्टिव स्पिनिंग व्हील और संतुलित रैंडम टीम मेकर। 100% प्राइवेट, स्कूल, कॉलेज, ऑफिस और पार्टी गेम्स के लिए उपयुक्त।",
    "modes": {
      "wheel": "लकी ड्रॉ व्हील",
      "teams": "रैंडम टीम स्प्लिटर"
    },
    "participantLabels": {
      "title": "प्रतिभागियों की सूची",
      "placeholder": "यहाँ नाम पेस्ट करें (प्रति पंक्ति एक नाम)...",
      "addName": "नाम जोड़ें",
      "addPlaceholder": "नाम लिखकर Enter दबाएं...",
      "sampleData": "नमूना सूची लोड करें",
      "clearAll": "सभी नाम हटाएं",
      "shuffle": "क्रम बदलें",
      "removeDuplicates": "डुप्लीकेट हटाएं",
      "totalCount": "कुल प्रतिभागी",
      "sampleIPL": "IPL क्रिकेट टीम (15)",
      "sampleOffice": "ऑफिस टीम (12)",
      "sampleClass": "कक्षा रोल नंबर (20)",
      "sampleParty": "पार्टी गेम्स (10)"
    },
    "wheelLabels": {
      "spinButton": "पहिया घुमाएं (SPIN)",
      "spinning": "घूम रहा है...",
      "spinDuration": "स्पिन समय",
      "seconds": "सेकंड",
      "soundToggle": "ध्वनि प्रभाव",
      "soundOn": "ध्वनि चालू",
      "soundOff": "म्यूट",
      "removeWinner": "अगले ड्रॉ के लिए विजेता का नाम हटा दें",
      "winnerModalTitle": "🎉 हमारे पास विजेता है!",
      "winnerLabel": "चुना गया विजेता",
      "spinAgain": "फिर से घुमाएं",
      "copyWinner": "विजेता कॉपी करें",
      "winnerHistory": "विजेता इतिहास",
      "noWinnersYet": "अभी तक कोई विजेता नहीं चुना गया है।",
      "clearHistory": "इतिहास मिटाएं",
      "tooManyWarning": "40 से अधिक नाम होने पर पहिए पर नाम संक्षिप्त दिखते हैं। पूरी सूची बगल में उपलब्ध है।",
      "gameOver": "गेम ओवर (GAME OVER)",
      "lastRemaining": "अंतिम शेष प्रतिभागी",
      "finalRoundComplete": "अंतिम राउंड समाप्त!",
      "resetRoster": "फिर से खेलें (रोस्टर रीसेट करें)",
      "viewResults": "गेम समाप्त करें और परिणाम देखें"
    },
    "teamLabels": {
      "splitBy": "विभाजन का तरीका",
      "byTeams": "टीमों की संख्या द्वारा",
      "bySize": "प्रति टीम सदस्यों की संख्या द्वारा",
      "numTeamsLabel": "टीमों की कुल संख्या",
      "teamSizeLabel": "प्रति टीम सदस्य",
      "splitButton": "टीमें बनाएं",
      "reshuffle": "दोबारा बांटें",
      "copyTeams": "टीमें कॉपी करें",
      "exportPng": "PNG कार्ड डाउनलोड करें",
      "printTeams": "प्रिंट सूची",
      "moveToTeam": "दूसरी टीम में भेजें",
      "editTeamName": "नाम बदलने के लिए क्लिक करें",
      "noParticipants": "टीमें बनाने के लिए ऊपर कम से कम 2 नाम जोड़ें।"
    },
    "faqs": [
      {
        "question": "लकी ड्रॉ का विजेता कैसे चुना जाता है?",
        "answer": "विजेता ब्राउज़र के सुरक्षित रैंडम एल्गोरिदम (crypto.getRandomValues) द्वारा चुना जाता है और पहिया ठीक उसी नाम पर रुकता है।"
      },
      {
        "question": "टीम स्प्लिटर टीमों को कैसे संतुलित करता है?",
        "answer": "यह सभी नामों को शफल करके राउंड-रॉबिन तरीके से बांटता है, जिससे किसी भी टीम में 1 से अधिक सदस्य का अंतर नहीं रहता।"
      }
    ],
    "disclaimer": "अस्वीकरण: यह उपकरण केवल मनोरंजन, स्कूल, स्पोर्ट्स और घरेलू खेलों के लिए है। यह कोई सरकारी लॉटरी या जुआ प्रणाली नहीं है।",
    "privacyNotice": "100% सुरक्षित और प्राइवेट: आपके नाम किसी भी सर्वर पर नहीं भेजे जाते।"
  },
  "ml": {
    "locale": "ml",
    "localeName": "Malayalam",
    "dir": "ltr",
    "title": "ലക്കി ഡ്രോ വീലും റാൻഡം ടീം സ്പ്ലിറ്ററും | IndiaTools",
    "metaDescription": "ഭാഗ്യശാലിയെ കണ്ടെത്താൻ ലക്കി ഡ്രോ വീൽ കറക്കൂ, അല്ലെങ്കിൽ സുഹൃത്തുക്കളെ തുല്യ ടീമുകളായി തിരിക്കൂ. സൗജന്യ ഓൺലൈൻ റാൻഡം നെയിം പിക്കർ.",
    "h1": "ലക്കി ഡ്രോ വീലും റാൻഡം ടീം സ്പ്ലിറ്ററും",
    "subtitle": "സൗജന്യ ഇന്ററാക്ടീവ് സ്പിന്നിംഗ് വീലും റാൻഡം ടീം ജനറേറ്ററും. ക്ലാസ്സ്റൂം, സ്പോർട്സ്, പാർട്ടി ഗെയിമുകൾക്ക് അനുയോജ്യം.",
    "modes": {
      "wheel": "ലക്കി ഡ്രോ വീൽ",
      "teams": "റാൻഡം ടീം സ്പ്ലിറ്റർ"
    },
    "participantLabels": {
      "title": "പങ്കെടുക്കുന്നവരുടെ ലിസ്റ്റ്",
      "placeholder": "പേരുകൾ ഇവിടെ നൽകുക (ഒരു വരിയിൽ ഒരു പേര്)...",
      "addName": "പേര് ചേർക്കുക",
      "addPlaceholder": "പേര് നൽകി Enter അമർത്തുക...",
      "sampleData": "സാമ്പിൾ ലിസ്റ്റ്",
      "clearAll": "എല്ലാം നീക്കം ചെയ്യുക",
      "shuffle": "ക്രമം മാറ്റുക",
      "removeDuplicates": "ഡ്യൂപ്ലിക്കേറ്റുകൾ ഒഴിവാക്കുക",
      "totalCount": "ആകെ ആളുകൾ",
      "sampleIPL": "IPL ക്രിക്കറ്റ് ടീം (15)",
      "sampleOffice": "ഓഫീസ് ടീം (12)",
      "sampleClass": "ക്ലാസ്സ് റോൾ ലിസ്റ്റ് (20)",
      "sampleParty": "പാർട്ടി ഗെയിംസ് (10)"
    },
    "wheelLabels": {
      "spinButton": "വീൽ കറക്കുക (SPIN)",
      "spinning": "കറങ്ങുന്നു...",
      "spinDuration": "സമയം",
      "seconds": "സെക്കൻഡ്",
      "soundToggle": "ശബ്ദം",
      "soundOn": "ശബ്ദം ഓൺ",
      "soundOff": "മ്യൂട്ട്",
      "removeWinner": "അടുത്ത കറക്കത്തിൽ വിജയിയുടെ പേര് ഒഴിവാക്കുക",
      "winnerModalTitle": "🎉 വിജയിയെ തിരഞ്ഞെടുത്തു!",
      "winnerLabel": "തിരഞ്ഞെടുക്കപ്പെട്ട വിജയി",
      "spinAgain": "വീണ്ടും കറക്കുക",
      "copyWinner": "വിജയിയുടെ പേര് കോപ്പി ചെയ്യുക",
      "winnerHistory": "വിജയികളുടെ വിവരങ്ങൾ",
      "noWinnersYet": "ഇതുവരെ ആരും തിരഞ്ഞെടുക്കപ്പെട്ടിട്ടില്ല.",
      "clearHistory": "ചരിത്രം മായ്ക്കുക",
      "tooManyWarning": "40ൽ കൂടുതൽ ആളുകളുണ്ടെങ്കിൽ വീലിൽ പേരുകൾ ചുരുക്കി കാണിക്കും.",
      "gameOver": "ഗെയിം ഓവർ (GAME OVER)",
      "lastRemaining": "അവസാനം അവശേഷിച്ചയാൾ",
      "finalRoundComplete": "അവസാന റൗണ്ട് പൂർത്തിയായി!",
      "resetRoster": "വീണ്ടും കളിക്കുക (ലിസ്റ്റ് പുനഃസ്ഥാപിക്കുക)",
      "viewResults": "ഗെയിം പൂർത്തിയാക്കി ഫലം കാണുക"
    },
    "teamLabels": {
      "splitBy": "ടീം തിരിക്കുന്ന വിധം",
      "byTeams": "ടീമുകളുടെ എണ്ണം അനുസരിച്ച്",
      "bySize": "ഒരു ടീമിലെ ആളുകളുടെ എണ്ണം അനുസരിച്ച്",
      "numTeamsLabel": "ആകെ ടീമുകൾ",
      "teamSizeLabel": "ഒരു ടീമിലെ ആളുകൾ",
      "splitButton": "ടീമുകൾ ഉണ്ടാക്കുക",
      "reshuffle": "വീണ്ടും മാറ്റുക",
      "copyTeams": "ടീമുകൾ കോപ്പി ചെയ്യുക",
      "exportPng": "PNG കാർഡ് ഡൗൺലോഡ്",
      "printTeams": "പ്രിന്റ് ചെയ്യുക",
      "moveToTeam": "മറ്റൊരു ടീമിലേക്ക് മാറ്റുക",
      "editTeamName": "പേര് മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക",
      "noParticipants": "ടീം ഉണ്ടാക്കാൻ കുറഞ്ഞത് 2 പേരുകൾ ചേർക്കുക."
    },
    "faqs": [
      {
        "question": "വിജയിയെ എങ്ങനെയാണ് തിരഞ്ഞെടുക്കുന്നത്?",
        "answer": "ബ്രൗസറിലെ ക്രിപ്റ്റോ റാൻഡം സിസ്റ്റം ഉപയോഗിച്ചാണ് വിജയിയെ തിരഞ്ഞെടുക്കുന്നത്. വീൽ കൃത്യമായി ആ പേരിൽ തന്നെ നിൽക്കുന്നു."
      }
    ],
    "disclaimer": "ശ്രദ്ധിക്കുക: ഇതൊരു വിനോദോപാധി മാത്രമാണ്. ഔദ്യോഗിക ലോട്ടറി സംവിധാനമല്ല.",
    "privacyNotice": "100% സുരക്ഷിതം: പേരുകൾ നിങ്ങളുടെ ഫോണിൽ മാത്രം സൂക്ഷിക്കുന്നു."
  },
  "ta": {
    "locale": "ta",
    "localeName": "Tamil",
    "dir": "ltr",
    "title": "லக்கி டிரா வீல் & ரேண்டம் குழு பிரிப்பான் | IndiaTools",
    "metaDescription": "லக்கி டிரா வீல் & ரேண்டம் குழு பிரிப்பான். Spin a colorful wheel to pick winners or split random teams in Tamil. Free, 100% private, client-side tool.",
    "h1": "லக்கி டிரா வீல் & ரேண்டம் குழு பிரிப்பான்",
    "subtitle": "லக்கி டிரா வீல் & ரேண்டம் குழு பிரிப்பான் – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "லக்கி டிரா வீல் & ரேண்டம் குழு பிரிப்பான் (Wheel)",
      "teams": "Tamil Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (தமிழ்)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Tamil lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Tamil?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "te": {
    "locale": "te",
    "localeName": "Telugu",
    "dir": "ltr",
    "title": "లక్కీ డ్రా వీల్ & రాండమ్ టీమ్ స్ప్లిట్టర్ | IndiaTools",
    "metaDescription": "లక్కీ డ్రా వీల్ & రాండమ్ టీమ్ స్ప్లిట్టర్. Spin a colorful wheel to pick winners or split random teams in Telugu. Free, 100% private, client-side tool.",
    "h1": "లక్కీ డ్రా వీల్ & రాండమ్ టీమ్ స్ప్లిట్టర్",
    "subtitle": "లక్కీ డ్రా వీల్ & రాండమ్ టీమ్ స్ప్లిట్టర్ – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "లక్కీ డ్రా వీల్ & రాండమ్ టీమ్ స్ప్లిట్టర్ (Wheel)",
      "teams": "Telugu Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (తెలుగు)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Telugu lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Telugu?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "kn": {
    "locale": "kn",
    "localeName": "Kannada",
    "dir": "ltr",
    "title": "ಲಕ್ಕಿ ಡ್ರಾ ವ್ಹೀಲ್ & ರಾಂಡಮ್ ತಂಡ ವಿಭಾಜಕ | IndiaTools",
    "metaDescription": "ಲಕ್ಕಿ ಡ್ರಾ ವ್ಹೀಲ್ & ರಾಂಡಮ್ ತಂಡ ವಿಭಾಜಕ. Spin a colorful wheel to pick winners or split random teams in Kannada. Free, 100% private, client-side tool.",
    "h1": "ಲಕ್ಕಿ ಡ್ರಾ ವ್ಹೀಲ್ & ರಾಂಡಮ್ ತಂಡ ವಿಭಾಜಕ",
    "subtitle": "ಲಕ್ಕಿ ಡ್ರಾ ವ್ಹೀಲ್ & ರಾಂಡಮ್ ತಂಡ ವಿಭಾಜಕ – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "ಲಕ್ಕಿ ಡ್ರಾ ವ್ಹೀಲ್ & ರಾಂಡಮ್ ತಂಡ ವಿಭಾಜಕ (Wheel)",
      "teams": "Kannada Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (ಕನ್ನಡ)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Kannada lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Kannada?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "bn": {
    "locale": "bn",
    "localeName": "Bengali",
    "dir": "ltr",
    "title": "লাকি ড্র হুইল ও র‍্যান্ডম দল বিভাজন | IndiaTools",
    "metaDescription": "লাকি ড্র হুইল ও র‍্যান্ডম দল বিভাজন. Spin a colorful wheel to pick winners or split random teams in Bengali. Free, 100% private, client-side tool.",
    "h1": "লাকি ড্র হুইল ও র‍্যান্ডম দল বিভাজন",
    "subtitle": "লাকি ড্র হুইল ও র‍্যান্ডম দল বিভাজন – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "লাকি ড্র হুইল ও র‍্যান্ডম দল বিভাজন (Wheel)",
      "teams": "Bengali Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (বাংলা)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Bengali lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Bengali?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "mr": {
    "locale": "mr",
    "localeName": "Marathi",
    "dir": "ltr",
    "title": "लकी ड्रॉ व्हील आणि रँडम टीम स्प्लिटर | IndiaTools",
    "metaDescription": "लकी ड्रॉ व्हील आणि रँडम टीम स्प्लिटर. Spin a colorful wheel to pick winners or split random teams in Marathi. Free, 100% private, client-side tool.",
    "h1": "लकी ड्रॉ व्हील आणि रँडम टीम स्प्लिटर",
    "subtitle": "लकी ड्रॉ व्हील आणि रँडम टीम स्प्लिटर – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी ड्रॉ व्हील आणि रँडम टीम स्प्लिटर (Wheel)",
      "teams": "Marathi Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (मराठी)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Marathi lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Marathi?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "gu": {
    "locale": "gu",
    "localeName": "Gujarati",
    "dir": "ltr",
    "title": "લકી ડ્રો વ્હીલ અને રેન્ડમ ટીમ સ્પ્લિટર્સ | IndiaTools",
    "metaDescription": "લકી ડ્રો વ્હીલ અને રેન્ડમ ટીમ સ્પ્લિટર્સ. Spin a colorful wheel to pick winners or split random teams in Gujarati. Free, 100% private, client-side tool.",
    "h1": "લકી ડ્રો વ્હીલ અને રેન્ડમ ટીમ સ્પ્લિટર્સ",
    "subtitle": "લકી ડ્રો વ્હીલ અને રેન્ડમ ટીમ સ્પ્લિટર્સ – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "લકી ડ્રો વ્હીલ અને રેન્ડમ ટીમ સ્પ્લિટર્સ (Wheel)",
      "teams": "Gujarati Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (ગુજરાતી)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Gujarati lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Gujarati?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "pa": {
    "locale": "pa",
    "localeName": "Punjabi",
    "dir": "ltr",
    "title": "ਲੱਕੀ ਡਰਾਅ ਵ੍ਹੀਲ ਅਤੇ ਰੈਂਡਮ ਟੀਮ ਸਪਲਿਟਰ | IndiaTools",
    "metaDescription": "ਲੱਕੀ ਡਰਾਅ ਵ੍ਹੀਲ ਅਤੇ ਰੈਂਡਮ ਟੀਮ ਸਪਲਿਟਰ. Spin a colorful wheel to pick winners or split random teams in Punjabi. Free, 100% private, client-side tool.",
    "h1": "ਲੱਕੀ ਡਰਾਅ ਵ੍ਹੀਲ ਅਤੇ ਰੈਂਡਮ ਟੀਮ ਸਪਲਿਟਰ",
    "subtitle": "ਲੱਕੀ ਡਰਾਅ ਵ੍ਹੀਲ ਅਤੇ ਰੈਂਡਮ ਟੀਮ ਸਪਲਿਟਰ – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "ਲੱਕੀ ਡਰਾਅ ਵ੍ਹੀਲ ਅਤੇ ਰੈਂਡਮ ਟੀਮ ਸਪਲਿਟਰ (Wheel)",
      "teams": "Punjabi Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (ਪੰਜਾਬੀ)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Punjabi lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Punjabi?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "or": {
    "locale": "or",
    "localeName": "Odia",
    "dir": "ltr",
    "title": "ଲକି ଡ୍ର ହ୍ୱିଲ୍ ଓ ରାଣ୍ଡମ ଟିମ୍ ସ୍ପ୍ଲିଟର | IndiaTools",
    "metaDescription": "ଲକି ଡ୍ର ହ୍ୱିଲ୍ ଓ ରାଣ୍ଡମ ଟିମ୍ ସ୍ପ୍ଲିଟର. Spin a colorful wheel to pick winners or split random teams in Odia. Free, 100% private, client-side tool.",
    "h1": "ଲକି ଡ୍ର ହ୍ୱିଲ୍ ଓ ରାଣ୍ଡମ ଟିମ୍ ସ୍ପ୍ଲିଟର",
    "subtitle": "ଲକି ଡ୍ର ହ୍ୱିଲ୍ ଓ ରାଣ୍ଡମ ଟିମ୍ ସ୍ପ୍ଲିଟର – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "ଲକି ଡ୍ର ହ୍ୱିଲ୍ ଓ ରାଣ୍ଡମ ଟିମ୍ ସ୍ପ୍ଲିଟର (Wheel)",
      "teams": "Odia Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (ଓଡ଼ିଆ)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Odia lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Odia?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "as": {
    "locale": "as",
    "localeName": "Assamese",
    "dir": "ltr",
    "title": "লাকী ড্ৰ হুইল আৰু ৰেণ্ডম দল বিভাজক | IndiaTools",
    "metaDescription": "লাকী ড্ৰ হুইল আৰু ৰেণ্ডম দল বিভাজক. Spin a colorful wheel to pick winners or split random teams in Assamese. Free, 100% private, client-side tool.",
    "h1": "লাকী ড্ৰ হুইল আৰু ৰেণ্ডম দল বিভাজক",
    "subtitle": "লাকী ড্ৰ হুইল আৰু ৰেণ্ডম দল বিভাজক – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "লাকী ড্ৰ হুইল আৰু ৰেণ্ডম দল বিভাজক (Wheel)",
      "teams": "Assamese Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (অসমীয়া)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Assamese lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Assamese?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "ur": {
    "locale": "ur",
    "localeName": "Urdu",
    "dir": "rtl",
    "title": "لکی ڈرا وہیل اور رینڈم ٹیم جنریٹر | IndiaTools",
    "metaDescription": "لکی ڈرا وہیل اور رینڈم ٹیم جنریٹر. Spin a colorful wheel to pick winners or split random teams in Urdu. Free, 100% private, client-side tool.",
    "h1": "لکی ڈرا وہیل اور رینڈم ٹیم جنریٹر",
    "subtitle": "لکی ڈرا وہیل اور رینڈم ٹیم جنریٹر – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "لکی ڈرا وہیل اور رینڈم ٹیم جنریٹر (Wheel)",
      "teams": "Urdu Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (اردو)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "پہیہ گھمائیں",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Urdu lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Urdu?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "sa": {
    "locale": "sa",
    "localeName": "Sanskrit",
    "dir": "ltr",
    "title": "भाग्यचक्रं यादृच्छिकगणविभाजकश्च | IndiaTools",
    "metaDescription": "भाग्यचक्रं यादृच्छिकगणविभाजकश्च. Spin a colorful wheel to pick winners or split random teams in Sanskrit. Free, 100% private, client-side tool.",
    "h1": "भाग्यचक्रं यादृच्छिकगणविभाजकश्च",
    "subtitle": "भाग्यचक्रं यादृच्छिकगणविभाजकश्च – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "भाग्यचक्रं यादृच्छिकगणविभाजकश्च (Wheel)",
      "teams": "Sanskrit Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (संस्कृतम्)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Sanskrit lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Sanskrit?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "kok": {
    "locale": "kok",
    "localeName": "Konkani",
    "dir": "ltr",
    "title": "लकी ड्रॉ व्हील आनी रँडम पंगड | IndiaTools",
    "metaDescription": "लकी ड्रॉ व्हील आनी रँडम पंगड. Spin a colorful wheel to pick winners or split random teams in Konkani. Free, 100% private, client-side tool.",
    "h1": "लकी ड्रॉ व्हील आनी रँडम पंगड",
    "subtitle": "लकी ड्रॉ व्हील आनी रँडम पंगड – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी ड्रॉ व्हील आनी रँडम पंगड (Wheel)",
      "teams": "Konkani Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (कोंकणी)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Konkani lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Konkani?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "mai": {
    "locale": "mai",
    "localeName": "Maithili",
    "dir": "ltr",
    "title": "लकी ड्रॉ चक्र आ यादृच्छिक दल विभाजक | IndiaTools",
    "metaDescription": "लकी ड्रॉ चक्र आ यादृच्छिक दल विभाजक. Spin a colorful wheel to pick winners or split random teams in Maithili. Free, 100% private, client-side tool.",
    "h1": "लकी ड्रॉ चक्र आ यादृच्छिक दल विभाजक",
    "subtitle": "लकी ड्रॉ चक्र आ यादृच्छिक दल विभाजक – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी ड्रॉ चक्र आ यादृच्छिक दल विभाजक (Wheel)",
      "teams": "Maithili Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (मैथिली)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Maithili lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Maithili?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "ne": {
    "locale": "ne",
    "localeName": "Nepali",
    "dir": "ltr",
    "title": "लकी ड्र व्हील र अनियमित टोली विभाजक | IndiaTools",
    "metaDescription": "लकी ड्र व्हील र अनियमित टोली विभाजक. Spin a colorful wheel to pick winners or split random teams in Nepali. Free, 100% private, client-side tool.",
    "h1": "लकी ड्र व्हील र अनियमित टोली विभाजक",
    "subtitle": "लकी ड्र व्हील र अनियमित टोली विभाजक – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी ड्र व्हील र अनियमित टोली विभाजक (Wheel)",
      "teams": "Nepali Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (नेपाली)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Nepali lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Nepali?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "ks": {
    "locale": "ks",
    "localeName": "Kashmiri",
    "dir": "rtl",
    "title": "لکی ڈرا وہیل تہٕ رینڈم ٹیم تقسیم کار | IndiaTools",
    "metaDescription": "لکی ڈرا وہیل تہٕ رینڈم ٹیم تقسیم کار. Spin a colorful wheel to pick winners or split random teams in Kashmiri. Free, 100% private, client-side tool.",
    "h1": "لکی ڈرا وہیل تہٕ رینڈم ٹیم تقسیم کار",
    "subtitle": "لکی ڈرا وہیل تہٕ رینڈم ٹیم تقسیم کار – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "لکی ڈرا وہیل تہٕ رینڈم ٹیم تقسیم کار (Wheel)",
      "teams": "Kashmiri Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (कॉशुर / کٲشُر)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "پہیہ گھمائیں",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Kashmiri lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Kashmiri?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "sd": {
    "locale": "sd",
    "localeName": "Sindhi",
    "dir": "rtl",
    "title": "لڪي ڊرا وهيل ۽ بي ترتيب ٽيم ورهاڱو | IndiaTools",
    "metaDescription": "لڪي ڊرا وهيل ۽ بي ترتيب ٽيم ورهاڱو. Spin a colorful wheel to pick winners or split random teams in Sindhi. Free, 100% private, client-side tool.",
    "h1": "لڪي ڊرا وهيل ۽ بي ترتيب ٽيم ورهاڱو",
    "subtitle": "لڪي ڊرا وهيل ۽ بي ترتيب ٽيم ورهاڱو – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "لڪي ڊرا وهيل ۽ بي ترتيب ٽيم ورهاڱو (Wheel)",
      "teams": "Sindhi Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (سنڌي / सिन्धी)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "پہیہ گھمائیں",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Sindhi lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Sindhi?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "doi": {
    "locale": "doi",
    "localeName": "Dogri",
    "dir": "ltr",
    "title": "लकी ड्रा व्हील ते रैंडम टीम विभाजक | IndiaTools",
    "metaDescription": "लकी ड्रा व्हील ते रैंडम टीम विभाजक. Spin a colorful wheel to pick winners or split random teams in Dogri. Free, 100% private, client-side tool.",
    "h1": "लकी ड्रा व्हील ते रैंडम टीम विभाजक",
    "subtitle": "लकी ड्रा व्हील ते रैंडम टीम विभाजक – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी ड्रा व्हील ते रैंडम टीम विभाजक (Wheel)",
      "teams": "Dogri Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (डोगरी)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Dogri lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Dogri?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "mni": {
    "locale": "mni",
    "localeName": "Manipuri (Meitei)",
    "dir": "ltr",
    "title": "লকি দ্রো হুইল অমসুং তিম খেদোকপা | IndiaTools",
    "metaDescription": "লকি দ্রো হুইল অমসুং তিম খেদোকপা. Spin a colorful wheel to pick winners or split random teams in Manipuri (Meitei). Free, 100% private, client-side tool.",
    "h1": "লকি দ্রো হুইল অমসুং তিম খেদোকপা",
    "subtitle": "লকি দ্রো হুইল অমসুং তিম খেদোকপা – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "লকি দ্রো হুইল অমসুং তিম খেদোকপা (Wheel)",
      "teams": "Manipuri (Meitei) Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (মৈতৈলোন্)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Manipuri (Meitei) lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Manipuri (Meitei)?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "brx": {
    "locale": "brx",
    "localeName": "Bodo",
    "dir": "ltr",
    "title": "लकी द्र चका आरो हानजा राननाय | IndiaTools",
    "metaDescription": "लकी द्र चका आरो हानजा राननाय. Spin a colorful wheel to pick winners or split random teams in Bodo. Free, 100% private, client-side tool.",
    "h1": "लकी द्र चका आरो हानजा राननाय",
    "subtitle": "लकी द्र चका आरो हानजा राननाय – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "लकी द्र चका आरो हानजा राननाय (Wheel)",
      "teams": "Bodo Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (बर’)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Bodo lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Bodo?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  },
  "sat": {
    "locale": "sat",
    "localeName": "Santali",
    "dir": "ltr",
    "title": "ᱞᱟᱠᱤ ᱰᱨᱚ ᱪᱟᱠᱷᱟ ᱟᱨ ᱫᱚᱲ ᱦᱟᱹᱴᱤᱧ | IndiaTools",
    "metaDescription": "ᱞᱟᱠᱤ ᱰᱨᱚ ᱪᱟᱠᱷᱟ ᱟᱨ ᱫᱚᱲ ᱦᱟᱹᱴᱤᱧ. Spin a colorful wheel to pick winners or split random teams in Santali. Free, 100% private, client-side tool.",
    "h1": "ᱞᱟᱠᱤ ᱰᱨᱚ ᱪᱟᱠᱷᱟ ᱟᱨ ᱫᱚᱲ ᱦᱟᱹᱴᱤᱧ",
    "subtitle": "ᱞᱟᱠᱤ ᱰᱨᱚ ᱪᱟᱠᱷᱟ ᱟᱨ ᱫᱚᱲ ᱦᱟᱹᱴᱤᱧ – 100% Free, Private In-Browser Spinning Wheel & Balanced Team Generator.",
    "modes": {
      "wheel": "ᱞᱟᱠᱤ ᱰᱨᱚ ᱪᱟᱠᱷᱟ ᱟᱨ ᱫᱚᱲ ᱦᱟᱹᱴᱤᱧ (Wheel)",
      "teams": "Santali Team Splitter"
    },
    "participantLabels": {
      "title": "Participants List (ᱥᱟᱱᱛᱟᱲᱤ)",
      "placeholder": "Paste names here, one per line...",
      "addName": "Add Name",
      "addPlaceholder": "Type single name & press Enter...",
      "sampleData": "Load Sample List",
      "clearAll": "Clear All Names",
      "shuffle": "Shuffle Order",
      "removeDuplicates": "Remove Duplicates",
      "totalCount": "Total Participants",
      "sampleIPL": "IPL Cricket Squad (15)",
      "sampleOffice": "Tech Office Team (12)",
      "sampleClass": "Classroom Roll Call (20)",
      "sampleParty": "Weekend Party Games (10)"
    },
    "wheelLabels": {
      "spinButton": "SPIN THE WHEEL",
      "spinning": "Spinning...",
      "spinDuration": "Spin Duration",
      "seconds": "seconds",
      "soundToggle": "Sound Effects",
      "soundOn": "Sound ON",
      "soundOff": "Muted",
      "removeWinner": "Remove winner from wheel for next spin",
      "winnerModalTitle": "🎉 We Have a Winner!",
      "winnerLabel": "Selected Winner",
      "spinAgain": "Spin Again",
      "copyWinner": "Copy Winner",
      "winnerHistory": "Draw History",
      "noWinnersYet": "No winners drawn yet in this session.",
      "clearHistory": "Clear History",
      "tooManyWarning": "When list exceeds 40 names, wheel labels are optimized for clarity. Full roster appears beside the wheel."
    },
    "teamLabels": {
      "splitBy": "Split Method",
      "byTeams": "By Number of Teams",
      "bySize": "By People per Team",
      "numTeamsLabel": "Number of Teams",
      "teamSizeLabel": "Target Members per Team",
      "splitButton": "Generate Random Teams",
      "reshuffle": "Reshuffle Teams",
      "copyTeams": "Copy Teams",
      "exportPng": "Download PNG Card",
      "printTeams": "Print Team Roster",
      "moveToTeam": "Move to Team",
      "editTeamName": "Click name to edit",
      "noParticipants": "Add at least 2 participants above to generate random teams."
    },
    "faqs": [
      {
        "question": "How does the Santali lucky draw wheel pick a winner?",
        "answer": "It uses cryptographically secure client-side randomness (crypto.getRandomValues). The wheel physically rotates to the exact chosen slice."
      },
      {
        "question": "How are random teams balanced in Santali?",
        "answer": "The team splitter uses a balanced round-robin shuffle ensuring team counts never differ by more than 1 participant."
      }
    ],
    "disclaimer": "Disclaimer: This tool is designed for casual entertainment, educational classrooms, office games, and community drawings. It is not a certified or cryptographically auditable state lottery system.",
    "privacyNotice": "100% Client-Side Privacy: No participant names are transmitted or stored remotely."
  }
}

export function getLuckyToolTranslation(code: string): LuckyToolContent {
  if (isLuckyLocale(code)) {
    return LUCKY_TOOL_I18N[code]
  }
  return LUCKY_TOOL_I18N.en
}
