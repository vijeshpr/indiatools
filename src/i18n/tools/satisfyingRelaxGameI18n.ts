import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface SatisfyingRelaxGameUI {
  modesTitle: string
  modeBubble: string
  modeSand: string
  modeFluid: string
  bubblePoppedText: string
  popCountLabel: string
  resetButton: string
  fullscreenButton: string
  exitFullscreen: string
  volumeLabel: string
  muteButton: string
  unmuteButton: string
  themeLabel: string
  themeNeon: string
  themePastel: string
  themeGold: string
  themeEmerald: string
  bubbleHint: string
  sandHint: string
  fluidHint: string
  hapticNotice: string
  zenDisclaimer: string
}

export const satisfyingRelaxGameTranslations: ToolLocaleMap<SatisfyingRelaxGameUI> = {
  en: {
    meta: {
      title: 'Oddly Satisfying Zen Game Online – Bubble Wrap Popper & Sand Slicer | IndiaTools',
      metaDescription: 'Play an oddly satisfying relaxation sandbox online for free. Pop endless bubble wrap with realistic ASMR sounds, slice kinetic sand, and relax with fluid physics in your browser.',
      h1: 'Oddly Satisfying & Relaxation Physics Sandbox',
      subtitle: 'Free interactive zen physics playground with infinite bubble wrap, ASMR kinetic sand slicing, and soothing fluid wave ripples.',
    },
    ui: {
      modesTitle: 'Relaxation Modes',
      modeBubble: 'Bubble Wrap',
      modeSand: 'Kinetic Sand',
      modeFluid: 'Fluid Ripples',
      bubblePoppedText: 'Bubbles Popped',
      popCountLabel: 'Popped',
      resetButton: 'Reset Canvas',
      fullscreenButton: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      volumeLabel: 'Volume',
      muteButton: 'Mute Audio',
      unmuteButton: 'Enable Audio',
      themeLabel: 'Zen Atmosphere',
      themeNeon: 'Neon Glow',
      themePastel: 'Pastel Calm',
      themeGold: 'Liquid Gold',
      themeEmerald: 'Dark Emerald',
      bubbleHint: 'Click, tap, hover, or drag across the bubbles to pop them with ASMR synthesizer sound.',
      sandHint: 'Drag across the textured sand block to slice kinetic voxels with gravity physics.',
      fluidHint: 'Move your pointer or touch to generate glowing fluid trails and harmonic dampening waves.',
      hapticNotice: 'Mobile device vibration enabled on tap for supported browsers.',
      zenDisclaimer: 'Interactive physics and ambient audio provide an engaging sensory experience intended for leisure and relaxation, not medical stress treatment.',
    },
    formulaExplanation: 'Interactive physics simulates elasticity, particle gravity trajectories (y = y0 + vy·t + 0.5·g·t²), and harmonic fluid damping. Web Audio API synthesizes pops and resonant chimes client-side without external media assets.',
    assumptions: [
      '100% in-browser audio synthesis and physics computation with zero network requests.',
      'Web Audio initializes upon first user interaction conforming to browser autoplay policies.',
      'Canvas renders smoothly with adaptive DPI scaling and reduced-motion considerations.',
    ],
    example: {
      title: 'Relaxation Sandbox Modes',
      inputs: {
        'Bubble Wrap': 'Infinite responsive bubbles with dual-frequency pitch synthesis',
        'Kinetic Sand': '1,200 gravity particles with slice collision detection',
        'Fluid Ripples': 'Multi-trail particle damping with glow physics',
      },
      outputs: {
        'Sensory Feedback': 'Synthesized acoustic pops, vibration, and visual particle dissipation',
        'Privacy': 'Completely local without data transmission',
      },
      explanation: 'Designed for quick breaks, micro-stress relief, and pleasant ASMR sensory interaction directly on desktop or mobile browsers.',
    },
    faqs: [
      {
        question: 'How does the oddly satisfying sandbox help with relaxation and stress relief?',
        answer: 'Repetitive tactile interactions like bubble wrap popping and kinetic particle slicing stimulate visual and auditory sensory focus. This gentle engagement may encourage mindful pauses and relaxation during busy workdays, though it is intended purely for recreational leisure rather than clinical medical treatment.',
      },
      {
        question: 'Does this game work smoothly on mobile smartphones and touch tablets?',
        answer: 'Yes! The sandbox includes multi-touch drag gestures, responsive HTML5 canvas scaling, and subtle mobile vibration haptics via the Navigator Vibration API on supported Android and mobile browsers.',
      },
      {
        question: 'Does the game require downloads, plugins, or an active internet connection?',
        answer: 'No downloads, accounts, or external audio files are needed. All animations and sound effects are synthesized 100% client-side in your web browser using HTML5 Canvas and the Web Audio API.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'ഓഡ്‌ലി സാറ്റിസ്‌ഫയിങ് സെൻ ഗെയിം | ബബിൾ പോപ്പറും കൈനറ്റിക് സാൻഡും | IndiaTools',
      metaDescription: 'സൗജന്യ റിലാക്സേഷൻ ഗെയിം ഓൺലൈനായി കളിക്കൂ. അനന്തമായ ബബിൾ റാപ്പുകൾ പൊട്ടിക്കുക, കൈനറ്റിക് മണൽ മുറിക്കുക, ഫ്ലൂയിഡ് തരംഗങ്ങൾ ആസ്വദിക്കുക.',
      h1: 'ഓഡ്‌ലി സാറ്റിസ്‌ഫയിങ് റിലാക്സേഷൻ ഫിസിക്‌സ് സാൻഡ്‌ബോക്സ്',
      subtitle: 'അനന്തമായ ബബിൾ റാപ്പ് പൊട്ടിക്കൽ, കൈനറ്റിക് സാൻഡ് സ്ലൈസിംഗ്, ഫ്ലൂയിഡ് വേവ് തരംഗങ്ങൾ എന്നിവയുള്ള മനസ്സിന് കുളിർമയേകുന്ന ഓൺലൈൻ ഗെയിം.',
    },
    ui: {
      modesTitle: 'ഗെയിം മോഡുകൾ',
      modeBubble: 'ബബിൾ റാപ്പ്',
      modeSand: 'കൈനറ്റിക് മണൽ',
      modeFluid: 'ഫ്ലൂയിഡ് റിപ്പിൾസ്',
      bubblePoppedText: 'പൊട്ടിച്ച ബബിളുകൾ',
      popCountLabel: 'പൊട്ടിച്ചത്',
      resetButton: 'റീസെറ്റ് ചെയ്യുക',
      fullscreenButton: 'ഫുൾ സ്ക്രീൻ',
      exitFullscreen: 'ഫുൾ സ്ക്രീൻ മാറ്റുക',
      volumeLabel: 'ശബ്ദം',
      muteButton: 'ശബ്ദം നിശബ്ദമാക്കുക',
      unmuteButton: 'ശബ്ദം നൽകുക',
      themeLabel: 'കളർ തീം',
      themeNeon: 'നിയോൺ ഗ്ലോ',
      themePastel: 'പാസ്റ്റൽ കാം',
      themeGold: 'ലിക്വിഡ് ഗോൾഡ്',
      themeEmerald: 'ഡാർക്ക് എമറാൾഡ്',
      bubbleHint: 'ബബിളുകൾ പൊട്ടിക്കാൻ ക്ലിക്ക് ചെയ്യുകയോ സ്വൈപ്പ് ചെയ്യുകയോ ചെയ്യുക.',
      sandHint: 'മണൽക്കട്ടകളിൽ വിരലോടിച്ച് കഷ്ണങ്ങളാക്കി വീഴ്ത്തുക.',
      fluidHint: 'മനോഹരമായ വർണ്ണ കണികാ തരംഗങ്ങൾ സൃഷ്ടിക്കാൻ വിരലോടിക്കുക.',
      hapticNotice: 'പിന്തുണയ്ക്കുന്ന ഫോണുകളിൽ വൈബ്രേഷൻ ഫീഡ്‌ബാക്ക് ലഭ്യമാണ്.',
      zenDisclaimer: 'ഈ ഗെയിം വിനോദത്തിനും മാനസിക ഉല്ലാസത്തിനുമായി മാത്രം നൽകിയിട്ടുള്ളതാണ്.',
    },
    formulaExplanation: 'എലാസ്റ്റിക് ബബിൾ മോഡലിംഗ്, ഗ്രാവിറ്റി പാർട്ടിക്കിൾ ഫിസിക്സ്, ഹാർമോണിക് ഫ്ലൂയിഡ് വേവ് സമവാക്യങ്ങൾ അടിസ്ഥാനമാക്കി വെബ് ബ്രൗസറിൽ തത്സമയം പ്രവർത്തിക്കുന്നു.',
    assumptions: ['100% ബ്രൗസറിനുള്ളിൽ തന്നെ സിന്തസൈസ് ചെയ്യുന്ന ശബ്ദവും ഗ്രാഫിക്സും.'],
    example: {
      title: 'റിലാക്സേഷൻ മോഡുകൾ',
      inputs: {
        'ബബിൾ റാപ്പ്': 'ASMR സിന്തസൈസ്ഡ് ശബ്ദമുള്ള ബബിളുകൾ',
        'കൈനറ്റിക് മണൽ': 'ഗുരുത്വാകർഷണ ഫിസിക്‌സുള്ള മണൽ കണികകൾ',
        'ഫ്ലൂയിഡ് തരംഗങ്ങൾ': 'വർണ്ണ കണികാ തരംഗങ്ങൾ',
      },
      outputs: {
        'ഫീഡ്‌ബാക്ക്': 'ശബ്ദം, വൈബ്രേഷൻ, കാഴ്ചാനുഭവം',
        'സുരക്ഷിതത്വം': 'പൂർണ്ണമായും ഓഫ്‌ലൈൻ ബ്രൗസർ സാങ്കേതികവിദ്യ',
      },
      explanation: 'ജോലിത്തിരക്കുകൾക്കിടയിൽ മനസ്സിന് ലളിതമായ വിശ്രമം നൽകാൻ അനുയോജ്യമായ മിനി-ഗെയിം.',
    },
    faqs: [
      {
        question: 'ഈ ഗെയിം മനസ്സിന് വിശ്രമം നൽകാൻ എങ്ങനെ സഹായിക്കുന്നു?',
        answer: 'ബബിൾ റാപ്പ് പൊട്ടിക്കുന്നതും കണികകൾ മുറിക്കുന്നതുമായ ലളിതമായ പ്രവർത്തനങ്ങൾ മനസ്സിന് ശാന്തമായ ശ്രദ്ധ നൽകാൻ സഹായിച്ചേക്കാം. ഇത് ഒരു വിനോദ അനുഭവം മാത്രമാണ്.',
      },
      {
        question: 'ഇത് മൊബൈൽ ഫോണുകളിൽ ടച്ച് സ്ക്രീനിൽ പ്രവർത്തിക്കുമോ?',
        answer: 'അതെ, മൊബൈൽ ടച്ച് ആംഗ്യങ്ങൾ, മൾട്ടി-ടച്ച്, ആൻഡ്രോയിഡ് ഫോണുകളിലെ വൈബ്രേഷൻ ഫീഡ്‌ബാക്ക് എന്നിവ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്.',
      },
      {
        question: 'ഇതിന് ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യേണ്ടതുണ്ടോ?',
        answer: 'ഇല്ല. യാതൊരു ആപ്പുകളും ഡൗൺലോഡ് ചെയ്യാതെ തന്നെ ബ്രൗസറിൽ നേരിട്ട് സൗജന്യമായി കളിക്കാം.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'ऑडली सेटिस्फाइंग ज़ेन गेम ऑनलाइन – बबल रैप व काइनेटिक सैंड | IndiaTools',
      metaDescription: 'मुफ्त में आरामदायक ऑनलाइन फिजिक्स सैंडबॉक्स खेलें। बबल रैप फोड़ें, काइनेटिक सैंड काटें और शांत तरंगों का आनंद लें।',
      h1: 'ऑडली सेटिस्फाइंग व रिलैक्सेशन फिजिक्स सैंडबॉक्स',
      subtitle: 'बबल रैप पॉपिंग, काइनेटिक सैंड स्लाइसिंग और सुखदायक फ्लुइड रिपल्स के साथ तनाव-मुक्त ऑनलाइन गेम।',
    },
    ui: {
      modesTitle: 'रिलैक्सेशन मोड',
      modeBubble: 'बबल रैप',
      modeSand: 'काइनेटिक सैंड',
      modeFluid: 'फ्लुइड रिपल्स',
      bubblePoppedText: 'फूटे हुए बबल्स',
      popCountLabel: 'पॉप्ड',
      resetButton: 'रीसेट करें',
      fullscreenButton: 'फुलस्क्रीन',
      exitFullscreen: 'फुलस्क्रीन हटाएं',
      volumeLabel: 'वॉल्यूम',
      muteButton: 'म्यूट करें',
      unmuteButton: 'आवाज़ चालू करें',
      themeLabel: 'कलर थीम',
      themeNeon: 'नियॉन ग्लो',
      themePastel: 'पेस्टल काम',
      themeGold: 'लिक्विड गोल्ड',
      themeEmerald: 'डार्क एमराल्ड',
      bubbleHint: 'बबल्स को फोड़ने के लिए क्लिक, टैप या ड्रैग करें।',
      sandHint: 'काइनेटिक रेत को काटने के लिए स्क्रीन पर उंगली फिराएं।',
      fluidHint: 'चमकती तरंगें और रंगीन ट्रेल्स बनाने के लिए टच करें।',
      hapticNotice: 'समर्थित फोन पर हल्का वाइब्रेशन अनुभव उपलब्ध है।',
      zenDisclaimer: 'यह गेम केवल मनोरंजन और फुरसत के पलों में विश्राम के लिए है।',
    },
    formulaExplanation: 'ब्राउज़र में HTML5 कैनवास और वेब ऑडियो एपीआई के माध्यम से कण भौतिकी और ध्वनि संश्लेषण द्वारा संचालित।',
    assumptions: ['पूरी तरह से सुरक्षित व निजी 100% क्लाइंट-साइड निष्पादन।'],
    example: {
      title: 'सैंडबॉक्स मोड',
      inputs: {
        'बबल रैप': 'यथार्थवादी ASMR पॉप ध्वनि',
        'काइनेटिक रेत': 'कण गुरुत्वाकर्षण भौतिकी',
        'तरंगें': 'आरामदायक फ्लुइड मोशन',
      },
      outputs: {
        'अनुभव': 'ध्वनि, स्पर्श और दृश्य विश्राम',
      },
      explanation: 'काम के बीच छोटे ब्रेक और मानसिक सुकून के लिए उपयुक्त वेब गेम।',
    },
    faqs: [
      {
        question: 'यह गेम तनाव मुक्ति में कैसे मदद कर सकता है?',
        answer: 'बबल फोड़ना और काइनेटिक रेत काटना ध्यान केंद्रित करने और मानसिक शांति महसूस करने में मदद कर सकता है। यह केवल मनोरंजन के लिए है।',
      },
      {
        question: 'क्या यह स्मार्टफोन पर ठीक से काम करता है?',
        answer: 'हाँ, यह मोबाइल टच, स्वाइप और समर्थित ब्राउज़रों पर हैप्टिक वाइब्रेशन के साथ सुचारू रूप से चलता है।',
      },
      {
        question: 'क्या इसके लिए किसी ऐप या इंटरनेट डाउनलोड की आवश्यकता है?',
        answer: 'नहीं, यह सीधे आपके ब्राउज़र में बिना किसी डाउनलोड के पूरी तरह मुफ्त चलता है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'ஆட்லி சாட்டிஸ்ஃபையிங் ஜென் கேம் | பப்பில் ரேப் & சாண்ட் ஸ்லைசர் | IndiaTools',
      metaDescription: 'இலவச ஆன்லைன் அமைதி விளையாட்டு. பப்பில் ரேப் உடைக்கவும், கைனடிக் மணல் வெட்டவும், திரவ அலைகளை உருவாக்கவும்.',
      h1: 'ஆட்லி சாட்டிஸ்ஃபையிங் & அமைதி இயற்பியல் சாண்ட்பாக்ஸ்',
      subtitle: 'முடிவற்ற பப்பில் ரேப், ASMR கைனடிக் மணல் வெட்டுதல் மற்றும் அமைதியான திரவ அலைகளுடன் கூடிய ஆன்லைன் விளையாட்டு.',
    },
    ui: {
      modesTitle: 'விளையாட்டு முறைகள்',
      modeBubble: 'பப்பில் ரேப்',
      modeSand: 'கைனடிக் மணல்',
      modeFluid: 'திரவ அலைகள்',
      bubblePoppedText: 'உடைத்த குமிழ்கள்',
      popCountLabel: 'உடைத்தது',
      resetButton: 'மீட்டமை',
      fullscreenButton: 'முழுத்திரை',
      exitFullscreen: 'முழுத்திரை நீக்கு',
      volumeLabel: 'ஒலி அளவு',
      muteButton: 'ஒலியடக்கு',
      unmuteButton: 'ஒலியை இயக்கு',
      themeLabel: 'வண்ண தீம்',
      themeNeon: 'நியோன் க்ளோ',
      themePastel: 'பாஸ்டல் அமைதி',
      themeGold: 'தங்க திரவம்',
      themeEmerald: 'மரகதம்',
      bubbleHint: 'குமிழ்களை உடைக்க கிளிக் அல்லது தேய்க்கவும்.',
      sandHint: 'மணலை துண்டுகளாக்க திரையில் விரலை நகர்த்தவும்.',
      fluidHint: 'ஒளிரும் வண்ண அலைகளை உருவாக்க தொடவும்.',
      hapticNotice: 'ஆதரிக்கும் போன்களில் அதிர்வு உணர்வு உள்ளது.',
      zenDisclaimer: 'இது பொழுதுபோக்கு மற்றும் மன அமைதிக்காக மட்டுமே வழங்கப்படுகிறது.',
    },
    formulaExplanation: 'HTML5 கேன்வாஸ் மற்றும் வெப் ஆடியோ ஏபிஐ மூலம் உலாவியிலேயே நேரடியாக இயங்குகிறது.',
    assumptions: ['100% பாதுகாப்பான சாதன இயக்கம்.'],
    example: {
      title: 'விளையாட்டு முறைகள்',
      inputs: {
        'பப்பில் ரேப்': 'ASMR ஒலி குமிழ்கள்',
        'கைனடிக் மணல்': 'ஈர்ப்பு இயற்பியல் துகள்கள்',
        'திரவ அலைகள்': 'மென்மையான அலை துகள்கள்',
      },
      outputs: {
        'அனுபவம்': 'ஒலி, அதிர்வு மற்றும் காட்சி இன்பம்',
      },
      explanation: 'வேலைக்கு இடையே மன அமைதி பெற எளிய உலாவிய விளையாட்டு.',
    },
    faqs: [
      {
        question: 'இந்த விளையாட்டு அமைதி பெற எவ்வாறு உதவுகிறது?',
        answer: 'குமிழ்களை உடைப்பதும் துகள்களை வெட்டுவதும் கவனத்தை ஒருமுகப்படுத்தி மன அமைதி பெற உதவக்கூடும்.',
      },
      {
        question: 'இது ஸ்மார்ட்போன்களில் இயங்குமா?',
        answer: 'ஆம், மொபைல் டச் மற்றும் அதிர்வு ஆதரவுடன் சீராக இயங்கும்.',
      },
      {
        question: 'இதற்கு செயலிகள் பதிவிறக்க வேண்டுமா?',
        answer: 'இல்லை, உலாவியிலேயே நேரடியாக இலவசமாக விளையாடலாம்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'ఆడ్లీ శాటిస్‌ఫైయింగ్ జెన్ గేమ్ | బబుల్ ర్యాప్ & కైనెటిక్ సాండ్ | IndiaTools',
      metaDescription: 'ఉచిత ఆన్‌లైన్ రిలాక్సేషన్ గేమ్. బబుల్ ర్యాప్ పగలగొట్టండి, కైనెటిక్ ఇసుక కోయండి, ప్రశాంతమైన తరంగాలను ఆస్వాదించండి.',
      h1: 'ఆడ్లీ శాటిస్‌ఫైయింగ్ & రిలాక్సేషన్ ఫిజిక్స్ శాండ్‌బాక్స్',
      subtitle: 'బబుల్ ర్యాప్, కైనెటిక్ సాండ్ స్లైసింగ్ మరియు ప్రశాంతమైన ఫ్లూయిడ్ అలలతో కూడిన ఆన్‌లైన్ గేమ్.',
    },
    ui: {
      modesTitle: 'ఆట రకాలు',
      modeBubble: 'బబుల్ ర్యాప్',
      modeSand: 'కైనెటిక్ ఇసుక',
      modeFluid: 'ఫ్లూయిడ్ తరంగాలు',
      bubblePoppedText: 'పగిలిన బుడగలు',
      popCountLabel: 'పగిలినవి',
      resetButton: 'రీసెట్ చేయండి',
      fullscreenButton: 'ఫుల్ స్క్రీన్',
      exitFullscreen: 'సాధారణ స్క్రీన్',
      volumeLabel: 'వాల్యూమ్',
      muteButton: 'మ్యూట్ చేయండి',
      unmuteButton: 'శబ్దం ఆన్ చేయండి',
      themeLabel: 'కలర్ థీమ్',
      themeNeon: 'నియాన్ గ్లో',
      themePastel: 'పాస్టెల్ కామ్',
      themeGold: 'లిక్విడ్ గోల్డ్',
      themeEmerald: 'డార్క్ ఎమరాల్డ్',
      bubbleHint: 'బుడగలను పగలగొట్టడానికి క్లిక్ చేయండి లేదా తాకండి.',
      sandHint: 'ఇసుకను కోయడానికి స్క్రీన్ పై వేలు కదపండి.',
      fluidHint: 'రంగుల కాంతి తరంగాలను సృష్టించడానికి తాకండి.',
      hapticNotice: 'మద్దతు ఉన్న ఫోన్లలో వైబ్రేషన్ అనుభూతి లభిస్తుంది.',
      zenDisclaimer: 'ఇది కేవలం వినోదం మరియు విశ్రాంతి కోసం ఉద్దేశించబడింది.',
    },
    formulaExplanation: 'బ్రౌజర్‌లోనే క్లయింట్-సైడ్ ఫిజిక్స్ మరియు వెబ్ ఆడియో ద్వారా సింథసైజ్ చేయబడింది.',
    assumptions: ['100% ఆఫ్‌లైన్ బ్రౌజర్ ఆధారితం.'],
    example: {
      title: 'శాండ్‌బాక్స్ రకాలు',
      inputs: {
        'బబుల్ ర్యాప్': 'ASMR శబ్దాలతో కూడిన బుడగలు',
        'కైనెటిక్ ఇసుక': 'కణాల గురుత్వాకర్షణ',
        'ఫ్లూయిడ్ అలలు': 'కాంతి తరంగాలు',
      },
      outputs: {
        'అనుభవం': 'శబ్దం, స్పర్శ మరియు దృశ్య విశ్రాంతి',
      },
      explanation: 'పని ఒత్తిడి నుండి విరామం తీసుకోవడానికి అనువైన ఆట.',
    },
    faqs: [
      {
        question: 'ఈ గేమ్ ప్రశాంతతకు ఎలా తోడ్పడుతుంది?',
        answer: 'బుడగలు పగలగొట్టడం వంటి సులువైన స్పర్శలు మనస్సును ఆహ్లాదపరచడంలో సహాయపడతాయి.',
      },
      {
        question: 'ఇది మొబైల్ ఫోన్లలో పనిచేస్తుందా?',
        answer: 'అవును, మొబైల్ టచ్ మరియు వైబ్రేషన్‌తో సజావుగా పనిచేస్తుంది.',
      },
      {
        question: 'యాప్‌లు డౌన్‌లోడ్ చేసుకోవాలా?',
        answer: 'అవసరం లేదు, బ్రౌజర్‌లోనే ఉచితంగా నేరుగా ఆడవచ్చు.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಆಡ್ಲಿ ಸ್ಯಾಟಿಸ್ಫೈಯಿಂಗ್ ಝೆನ್ ಗೇಮ್ | ಬಬಲ್ ರ್ಯಾಪ್ & ಕೈನೆಟಿಕ್ ಸ್ಯಾಂಡ್ | IndiaTools',
      metaDescription: 'ಉಚಿತ ಆನ್‌ಲೈನ್ ವಿಶ್ರಾಂತಿ ಆಟ. ಬಬಲ್ ರ್ಯಾಪ್ ಒಡೆಯಿರಿ, ಕೈನೆಟಿಕ್ ಮರಳು ಕತ್ತರಿಸಿ, ಶಾಂತ ತರಂಗಗಳನ್ನು ಆನಂದಿಸಿ.',
      h1: 'ಆಡ್ಲಿ ಸ್ಯಾಟಿಸ್ಫೈಯಿಂಗ್ & ರಿಲ್ಯಾಕ್ಸೇಶನ್ ಫಿಸಿಕ್ಸ್ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್',
      subtitle: 'ಬಬಲ್ ರ್ಯಾಪ್ ಒಡೆಯುವುದು, ಕೈನೆಟಿಕ್ ಮರಳು ಸ್ಲೈಸಿಂಗ್ ಮತ್ತು ಶಾಂತಿಯುತ ತರಂಗಗಳೊಂದಿಗೆ ಒತ್ತಡ-ಮುಕ್ತ ಆಟ.',
    },
    ui: {
      modesTitle: 'ಆಟದ ವಿಧಾನಗಳು',
      modeBubble: 'ಬಬಲ್ ರ್ಯಾಪ್',
      modeSand: 'ಕೈನೆಟಿಕ್ ಮರಳು',
      modeFluid: 'ದ್ರವ ತರಂಗಗಳು',
      bubblePoppedText: 'ಒಡೆದ ಗುಳ್ಳೆಗಳು',
      popCountLabel: 'ಒಡೆದದ್ದು',
      resetButton: 'ಮರುಹೊಂದಿಸಿ',
      fullscreenButton: 'ಪೂರ್ಣ ಪರದೆ',
      exitFullscreen: 'ಸಾಮಾನ್ಯ ಪರದೆ',
      volumeLabel: 'ಧ್ವನಿ ಮಟ್ಟ',
      muteButton: 'ಮ್ಯೂಟ್ ಮಾಡಿ',
      unmuteButton: 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ',
      themeLabel: 'ಬಣ್ಣದ ಥೀಮ್',
      themeNeon: 'ನಿಯಾನ್ ಗ್ಲೋ',
      themePastel: 'ಪಾಸ್ಟೆಲ್ ಶಾಂತತೆ',
      themeGold: 'ದ್ರವ ಚಿನ್ನ',
      themeEmerald: 'ಗಾಢ ಪಚ್ಚೆ',
      bubbleHint: 'ಗುಳ್ಳೆಗಳನ್ನು ಒಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಸ್ಪರ್ಶಿಸಿ.',
      sandHint: 'ಮರಳನ್ನು ಕತ್ತರಿಸಲು ಪರದೆಯ ಮೇಲೆ ಬೆರಳು ಸರಿಸಿ.',
      fluidHint: 'ಬೆಳಕಿನ ತರಂಗಗಳನ್ನು ಸೃಷ್ಟಿಸಲು ಸ್ಪರ್ಶಿಸಿ.',
      hapticNotice: 'ಬೆಂಬಲಿತ ಫೋನ್‌ಗಳಲ್ಲಿ ವೈಬ್ರೇಶನ್ ಲಭ್ಯವಿದೆ.',
      zenDisclaimer: 'ಇದು ಕೇವಲ ಮನರಂಜನೆ ಮತ್ತು ಮಾನಸಿಕ ವಿಶ್ರಾಂತಿಗಾಗಿ ಮಾತ್ರ.',
    },
    formulaExplanation: 'HTML5 ಕ್ಯಾನ್ವಾಸ್ ಮತ್ತು ವೆಬ್ ಆಡಿಯೊ ತಂತ್ರಜ್ಞಾನದಿಂದ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ಸಂಪೂರ್ಣವಾಗಿ ಚಲಿಸುತ್ತದೆ.',
    assumptions: ['100% ಆಫ್‌ಲೈನ್ ಬ್ರೌಸರ್ ಆಧಾರಿತ ಕಾರ್ಯಾಚರಣೆ.'],
    example: {
      title: 'ವಿಶ್ರಾಂತಿ ವಿಧಾನಗಳು',
      inputs: {
        'ಬಬಲ್ ರ್ಯಾಪ್': 'ASMR ಧ್ವನಿಯ ಗುಳ್ಳೆಗಳು',
        'ಕೈನೆಟಿಕ್ ಮರಳು': 'ಕಣ ಭೌತಶಾಸ್ತ್ರ',
        'ದ್ರವ ತರಂಗಗಳು': 'ಶಾಂತ ತರಂಗ ಕಣಗಳು',
      },
      outputs: {
        'ಅನುಭವ': 'ಧ್ವನಿ, ಸ್ಪರ್ಶ ಮತ್ತು ದೃಶ್ಯ ವಿಶ್ರಾಂತಿ',
      },
      explanation: 'ಕೆಲಸದ ನಡುವೆ ಸಣ್ಣ ವಿರಾಮ ಮತ್ತು ವಿಶ್ರಾಂತಿಗೆ ಸೂಕ್ತವಾದ ಆಟ.',
    },
    faqs: [
      {
        question: 'ಈ ಆಟವು ವಿಶ್ರಾಂತಿಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?',
        answer: 'ಗುಳ್ಳೆಗಳನ್ನು ಒಡೆಯುವಂತಹ ಪುನರಾವರ್ತಿತ ಕ್ರಿಯೆಗಳು ಮನಸ್ಸಿಗೆ ಶಾಂತಿಯುತ ಗಮನವನ್ನು ನೀಡಲು ನೆರವಾಗಬಹುದು.',
      },
      {
        question: 'ಇದು ಮೊಬೈಲ್ ಫೋನ್‌ಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆಯೇ?',
        answer: 'ಹೌದು, ಮೊಬೈಲ್ ಟಚ್ ಮತ್ತು ವೈಬ್ರೇಶನ್ ಬೆಂಬಲದೊಂದಿಗೆ ಸರಾಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
      },
      {
        question: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿದೆಯೇ?',
        answer: 'ಇಲ್ಲ, ಯಾವುದೇ ಡೌನ್‌ಲೋಡ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ಆಡಬಹುದು.',
      },
    ],
  },
}

registerToolTranslations('satisfying-relax-game', satisfyingRelaxGameTranslations)
