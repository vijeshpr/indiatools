import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface TripCostUI {
  journeyLogistics: string
  oneWay: string
  roundTrip: string
  oneWayDistance: string
  totalDistanceLabel: string
  vehicleMileage: string
  kmPerLShort: string
  fuelRate: string
  fastagTolls: string
  parkingMisc: string
  numberOfTravelers: string
  person: string
  people: string
  grandTotalCost: string
  splitPerPerson: string
  fuelShare: string
  tollShare: string
  parkingShare: string
  perKmNet: string
  efficiencyTip: string
  resultSummaryTitle: string
  totalDistanceText: string
  travelersText: string
  fuelText: string
  fastagTollsText: string
  parkingMiscText: string
  grandTotalCostText: string
  costPerTravelerText: string
  calculatedOn: string
}

export const tripCostTranslations: ToolLocaleMap<TripCostUI> = {
  en: {
    meta: {
      title: 'Trip Cost Calculator | Road Trip Fuel, Toll & Expense Split | IndiaTools',
      metaDescription: 'Calculate complete road trip expenses including petrol/diesel, FASTag tolls, parking, and per-person cost split for Indian journeys.',
      h1: 'Trip Cost Calculator',
      subtitle: 'Plan your road trip budget with fuel requirements, FASTag tolls, parking fees, and fair per-person expense splitting.',
    },
    ui: {
      journeyLogistics: 'Journey & Toll Logistics',
      oneWay: 'One-Way',
      roundTrip: 'Round-Trip',
      oneWayDistance: 'One-Way Distance',
      totalDistanceLabel: 'Total',
      vehicleMileage: 'Vehicle Mileage (km/L)',
      kmPerLShort: 'km/L',
      fuelRate: 'Fuel Price (₹ / Litre)',
      fastagTolls: 'Estimated FASTag Tolls (₹)',
      parkingMisc: 'Parking & Misc (₹)',
      numberOfTravelers: 'Number of Travelers (Cost Split)',
      person: 'Person',
      people: 'People',
      grandTotalCost: 'Grand Total Trip Budget',
      splitPerPerson: 'Cost Per Traveler',
      fuelShare: 'Fuel Expense',
      tollShare: 'FASTag Tolls',
      parkingShare: 'Parking & Misc',
      perKmNet: 'Effective Cost / Km',
      efficiencyTip: 'Car pooling and sharing expressway tolls significantly lowers individual commuting emissions and cost.',
      resultSummaryTitle: 'Road Trip Budget & Split:',
      totalDistanceText: 'Total Distance',
      travelersText: 'Travelers',
      fuelText: 'Fuel',
      fastagTollsText: 'FASTag Tolls',
      parkingMiscText: 'Parking/Misc',
      grandTotalCostText: 'Grand Total Cost',
      costPerTravelerText: 'Cost Per Traveler',
      calculatedOn: 'Calculated on IndiaTools',
    },
    formulaExplanation: 'Total Distance = One-way km × (2 for round-trip, 1 for one-way). Fuel Cost = (Total Distance ÷ Mileage) × Fuel Price. Total Trip Expense = Fuel Cost + FASTag Tolls + Parking & Misc. Cost Per Person = Total Trip Expense ÷ Number of Travelers.',
    assumptions: [
      'FASTag tolls and parking fees are shared equally among all passengers.',
      'Constant fuel efficiency on highways and expressways.',
    ],
    example: {
      title: 'Bangalore to Wayanad Weekend Trip',
      inputs: {
        'One-Way Distance': '280 km',
        'Trip Type': 'Round-Trip (560 km)',
        'Vehicle Mileage': '15 km/L',
        'Fuel Price': '₹102/L',
        'Tolls': '₹400',
        'Travelers': '4 Persons',
      },
      outputs: {
        'Total Fuel Cost': '₹3,808',
        'Total Trip Cost': '₹4,508',
        'Cost Per Person': '₹1,127',
      },
      explanation: 'For a 560 km round trip split between 4 friends, total expenditure comes to ₹4,508 or just ₹1,127 per person.',
    },
    faqs: [
      {
        question: 'How do I estimate FASTag tolls in advance?',
        answer: 'You can check estimated toll charges on the NHAI Rajmargyatra portal or Google Maps route overview before starting your trip.',
      },
      {
        question: 'Should maintenance cost be split on a road trip?',
        answer: 'Typically, only direct variable costs like fuel, tolls, and parking are split equally among co-travelers.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'ട്രിപ്പ് ചെലവ് കാൽക്കുലേറ്റർ | റോഡ് ട്രിപ്പ് പെട്രോൾ, ടോൾ & പങ്ക് വെക്കൽ | IndiaTools',
      metaDescription: 'റോഡ് ട്രിപ്പുകളിലെ പെട്രോൾ/ഡീസൽ, ഫാസ്ടാഗ് ടോൾ, പാർക്കിംഗ്, ആളൊന്നിനുള്ള ചെലവ് എന്നിവ എളുപ്പത്തിൽ കണക്കാക്കുക. സൗജന്യം.',
      h1: 'ട്രിപ്പ് ചെലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ഇന്ധനച്ചെലവ്, ഫാസ്ടാഗ് ടോളുകൾ, പാർക്കിംഗ് ഫീസ്, ആളൊന്നിനുള്ള തുല്യ പങ്ക് എന്നിവ കൃത്യമായി മുൻകൂട്ടി കണക്കാക്കുക.',
    },
    ui: {
      journeyLogistics: 'യാത്രയും ടോൾ വിവരങ്ങളും',
      oneWay: 'ഒരു വശം',
      roundTrip: 'ഇരുവശവും',
      oneWayDistance: 'ഒരു വശത്തേക്കുള്ള ദൂരം',
      totalDistanceLabel: 'ആകെ',
      vehicleMileage: 'വാഹന മൈലേജ് (കി.മീ/ലി)',
      kmPerLShort: 'കി.മീ/ലി',
      fuelRate: 'ഇന്ധന വില (₹ / ലിറ്റർ)',
      fastagTolls: 'ഫാസ്ടാഗ് ടോൾ നിരക്കുകൾ (₹)',
      parkingMisc: 'പാർക്കിംഗ് & മറ്റ് ചെലവുകൾ (₹)',
      numberOfTravelers: 'യാത്രക്കാരുടെ എണ്ണം (ചെലവ് പങ്ക്)',
      person: 'ആൾ',
      people: 'ആളുകൾ',
      grandTotalCost: 'ആകെ യാത്രാ ബജറ്റ്',
      splitPerPerson: 'ഒരാൾക്കുള്ള ചെലവ്',
      fuelShare: 'ഇന്ധനച്ചെലവ്',
      tollShare: 'ഫാസ്ടാഗ് ടോളുകൾ',
      parkingShare: 'പാർക്കിംഗ് & മറ്റുള്ളവ',
      perKmNet: 'ഒരു കി.മീറ്ററിനുള്ള ആകെ ചെലവ്',
      efficiencyTip: 'കാർപൂളിംഗും ടോൾ പങ്കുവെക്കലും യാത്രക്കാരുടെ വ്യക്തിഗത യാത്രാച്ചെലവും അന്തരീക്ഷ മലിനീകരണവും ഗണ്യമായി കുറയ്ക്കുന്നു.',
      resultSummaryTitle: 'റോഡ് ട്രിപ്പ് ബജറ്റ് & പങ്ക്:',
      totalDistanceText: 'ആകെ ദൂരം',
      travelersText: 'യാത്രക്കാർ',
      fuelText: 'ഇന്ധനം',
      fastagTollsText: 'ഫാസ്ടാഗ് ടോൾ',
      parkingMiscText: 'പാർക്കിംഗ്/മറ്റുള്ളവ',
      grandTotalCostText: 'ആകെ തുക',
      costPerTravelerText: 'ഒരാൾക്കുള്ള ചെലവ്',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'ആകെ ദൂരം = ഒരു വശത്തേക്കുള്ള ദൂരം × (ഇരുവശവും ആണെങ്കിൽ 2). ഇന്ധനച്ചെലവ് = (ആകെ ദൂരം ÷ മൈലേജ്) × ഇന്ധനവില. ആകെ യാത്രച്ചെലവ് = ഇന്ധനം + ടോൾ + പാർക്കിംഗ്. ഒരാൾക്കുള്ള ചെലവ് = ആകെ യാത്രച്ചെലവ് ÷ യാത്രക്കാരുടെ എണ്ണം.',
    assumptions: [
      'ഫാസ്ടാഗ് ടോളും പാർക്കിംഗും എല്ലാ യാത്രക്കാരും തുല്യമായി പങ്കിടുന്നു.',
      'ഹൈവേയിൽ സ്ഥിരമായ ശരാശരി ഇന്ധനക്ഷമത.',
    ],
    example: {
      title: 'ബാംഗ്ലൂർ - വയനാട് വാരാന്ത്യ യാത്ര',
      inputs: {
        'ഒരു വശത്തേക്കുള്ള ദൂരം': '280 കി.മീ',
        'യാത്രാ രീതി': 'പോക്കും വരവും (560 കി.മീ)',
        'വാഹന മൈലേജ്': '15 കി.മീ/ലിറ്റർ',
        'ഇന്ധന വില': '₹102/ലിറ്റർ',
        'ടോൾ': '₹400',
        'യാത്രക്കാർ': '4 പേർ',
      },
      outputs: {
        'ആകെ ഇന്ധനച്ചെലവ്': '₹3,808',
        'ആകെ യാത്രാച്ചെലവ്': '₹4,508',
        'ഒരാൾക്കുള്ള ചെലവ്': '₹1,127',
      },
      explanation: '4 സുഹൃത്തുക്കൾ ചേർന്ന് നടത്തുന്ന 560 കി.മീ യാത്രയ്ക്ക് ആകെ ₹4,508 ചെലവാകുമ്പോൾ, ഒരാൾക്ക് ₹1,127 മാത്രമാണ് ചെലവ് വരുന്നത്.',
    },
    faqs: [
      {
        question: 'ഫാസ്ടാഗ് ടോൾ നിരക്കുകൾ എങ്ങനെ മുൻകൂട്ടി അറിയാം?',
        answer: 'യാത്ര തിരിക്കുന്നതിന് മുമ്പ് ഗൂഗിൾ മാപ്‌സിലോ NHAI രാജ്മാർഗ് യാത്ര പോർട്ടലിലോ റൂട്ടിലെ ഏകദേശ ടോൾ നിരക്കുകൾ കാണാം.',
      },
      {
        question: 'റോഡ് ട്രിപ്പിൽ വാഹന സർവീസ് ചെലവ് പങ്കിടേണ്ടതുണ്ടോ?',
        answer: 'സാധാരണയായി സുഹൃത്തുക്കളുമൊത്തുള്ള യാത്രകളിൽ ഇന്ധനം, ടോൾ, പാർക്കിംഗ് തുടങ്ങിയ നേരിട്ടുള്ള ചെലവുകൾ മാത്രമാണ് തുല്യമായി പങ്കിടുന്നത്.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'ट्रिप लागत कैलकुलेटर | रोड ट्रिप पेट्रोल, टोल व खर्च विभाजन | IndiaTools',
      metaDescription: 'रोड ट्रिप के लिए ईंधन, फास्टैग टोल, पार्किंग व प्रति व्यक्ति खर्च का सटीक विभाजन करें। त्वरित व मुफ्त बजट कैलकुलेटर।',
      h1: 'ट्रिप लागत कैलकुलेटर',
      subtitle: 'पेट्रोल/डीजल, फास्टैग टोल, पार्किंग शुल्क और प्रति व्यक्ति खर्च के साथ अपनी रोड ट्रिप की आसान योजना बनाएं।',
    },
    ui: {
      journeyLogistics: 'यात्रा व टोल विवरण',
      oneWay: 'एकतरफा',
      roundTrip: 'आना-जाना (राउंड ट्रिप)',
      oneWayDistance: 'एकतरफा दूरी',
      totalDistanceLabel: 'कुल',
      vehicleMileage: 'वाहन माइलेज (किमी/ली)',
      kmPerLShort: 'किमी/ली',
      fuelRate: 'ईंधन दर (₹ / लीटर)',
      fastagTolls: 'अनुमानित फास्टैग टोल (₹)',
      parkingMisc: 'पार्किंग व अन्य खर्च (₹)',
      numberOfTravelers: 'यात्रियों की संख्या (खर्च विभाजन)',
      person: 'व्यक्ति',
      people: 'लोग',
      grandTotalCost: 'कुल ट्रिप बजट',
      splitPerPerson: 'प्रति व्यक्ति खर्च',
      fuelShare: 'ईंधन खर्च',
      tollShare: 'फास्टैग टोल',
      parkingShare: 'पार्किंग व अन्य',
      perKmNet: 'प्रभावी लागत / किमी',
      efficiencyTip: 'कारपूलिंग और टोल खर्च साझा करने से प्रति व्यक्ति यात्रा खर्च और कार्बन उत्सर्जन दोनों में भारी कमी आती है।',
      resultSummaryTitle: 'रोड ट्रिप बजट व विभाजन:',
      totalDistanceText: 'कुल दूरी',
      travelersText: 'यात्री',
      fuelText: 'ईंधन',
      fastagTollsText: 'फास्टैग टोल',
      parkingMiscText: 'पार्किंग/अन्य',
      grandTotalCostText: 'कुल लागत',
      costPerTravelerText: 'प्रति व्यक्ति खर्च',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'कुल दूरी = एकतरफा किमी × (राउंड-ट्रिप के लिए 2, अन्यथा 1)। ईंधन लागत = (कुल दूरी ÷ माइलेज) × ईंधन दर। कुल यात्रा खर्च = ईंधन + टोल + पार्किंग। प्रति व्यक्ति लागत = कुल खर्च ÷ यात्रियों की संख्या।',
    assumptions: [
      'फास्टैग टोल और पार्किंग शुल्क सभी यात्रियों में बराबर बांटे जाते हैं।',
      'राजमार्गों पर एकसमान ईंधन दक्षता।',
    ],
    example: {
      title: 'सप्ताहांत रोड ट्रिप उदाहरण',
      inputs: {
        'एकतरफा दूरी': '280 किमी',
        'ट्रिप प्रकार': 'आना-जाना (560 किमी)',
        'माइलेज': '15 किमी/ली',
        'ईंधन दर': '₹102/ली',
        'टोल': '₹400',
        'यात्री': '4 व्यक्ति',
      },
      outputs: {
        'कुल ईंधन खर्च': '₹3,808',
        'कुल ट्रिप खर्च': '₹4,508',
        'प्रति व्यक्ति खर्च': '₹1,127',
      },
      explanation: '4 दोस्तों के साथ 560 किमी की यात्रा में कुल खर्च ₹4,508 आता है, जिससे प्रति व्यक्ति केवल ₹1,127 खर्च पड़ता है।',
    },
    faqs: [
      {
        question: 'फास्टैग टोल पहले से कैसे पता करें?',
        answer: 'आप यात्रा शुरू करने से पहले Google Maps या NHAI के राजमार्गयात्रा ऐप पर अपने मार्ग के टोल देख सकते हैं।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'பயண செலவு கால்குலேட்டர் | ரோட் ட்ரிப் பெட்ரோல், டோல் & செலவு பகிர்வு | IndiaTools',
      metaDescription: 'சாலைப் பயணத்திற்கான எரிபொருள், பாஸ்டேக் டோல், பார்க்கிங் மற்றும் ஒரு நபருக்கான செலவுப் பகிர்வை உடனடியாகக் கணக்கிடுங்கள்.',
      h1: 'பயண செலவு கால்குலேட்டர்',
      subtitle: 'பெட்ரோல்/டீசல், பாஸ்டேக் டோல் கட்டணம், பார்க்கிங் மற்றும் நபருக்கான செலவு பகிர்வுடன் பயண பட்ஜெட்டை திட்டமிடுங்கள்.',
    },
    ui: {
      journeyLogistics: 'பயணம் மற்றும் டோல் விவரங்கள்',
      oneWay: 'ஒரு வழி',
      roundTrip: 'இரு வழி (சென்று திரும்புதல்)',
      oneWayDistance: 'ஒரு வழி தூரம்',
      totalDistanceLabel: 'மொத்தம்',
      vehicleMileage: 'வாகன மைலேஜ் (கி.மீ/லி)',
      kmPerLShort: 'கி.மீ/லி',
      fuelRate: 'எரிபொருள் விலை (₹ / லிட்டர்)',
      fastagTolls: 'பாஸ்டேக் டோல் கட்டணம் (₹)',
      parkingMisc: 'பார்க்கிங் & இதர செலவுகள் (₹)',
      numberOfTravelers: 'பயணிகள் எண்ணிக்கை (செலவு பகிர்வு)',
      person: 'நபர்',
      people: 'நபர்கள்',
      grandTotalCost: 'மொத்த பயண பட்ஜெட்',
      splitPerPerson: 'ஒரு நபருக்கான செலவு',
      fuelShare: 'எரிபொருள் செலவு',
      tollShare: 'பாஸ்டேக் டோல்',
      parkingShare: 'பார்க்கிங் & இதர',
      perKmNet: 'ஒரு கி.மீ-க்கான நிகர செலவு',
      efficiencyTip: 'நண்பர்களுடன் காரில் பகிர்வாக செல்வது தனிநபர் செலவையும் மாசுவையும் கணிசமாகக் குறைக்கிறது.',
      resultSummaryTitle: 'பயண பட்ஜெட் மற்றும் பகிர்வு:',
      totalDistanceText: 'மொத்த தூரம்',
      travelersText: 'பயணிகள்',
      fuelText: 'எரிபொருள்',
      fastagTollsText: 'பாஸ்டேக் டோல்',
      parkingMiscText: 'பார்க்கிங்/இதர',
      grandTotalCostText: 'மொத்த செலவு',
      costPerTravelerText: 'நபருக்கான செலவு',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'மொத்த தூரம் = ஒரு வழி தூரம் × (இரு வழி என்றால் 2, இல்லையெனில் 1). எரிபொருள் செலவு = (மொத்த தூரம் ÷ மைலேஜ்) × விலை. மொத்த செலவு = எரிபொருள் + டோல் + பார்க்கிங். ஒரு நபருக்கான செலவு = மொத்த செலவு ÷ பயணிகள் எண்ணிக்கை.',
    assumptions: [
      'டோல் மற்றும் பார்க்கிங் கட்டணம் அனைத்து பயணிகளுக்கும் சமமாகப் பிரிக்கப்படுகிறது.',
      'நெடுஞ்சாலைகளில் சீரான மைலேஜ்.',
    ],
    example: {
      title: 'வார இறுதி சாலைப் பயணம்',
      inputs: {
        'ஒரு வழி தூரம்': '280 கி.மீ',
        'பயண வகை': 'சென்று திரும்புதல் (560 கி.மீ)',
        'மைலேஜ்': '15 கி.மீ/லி',
        'எரிபொருள் விலை': '₹102/லி',
        'டோல்': '₹400',
        'பயணிகள்': '4 நபர்கள்',
      },
      outputs: {
        'மொத்த எரிபொருள் செலவு': '₹3,808',
        'மொத்த செலவு': '₹4,508',
        'நபருக்கான செலவு': '₹1,127',
      },
      explanation: '4 நபர்கள் 560 கி.மீ செல்லும்போது மொத்த செலவு ₹4,508 ஆகும், அதாவது ஒருவருக்கு ₹1,127 மட்டுமே.',
    },
    faqs: [
      {
        question: 'டோல் கட்டணத்தை முன்கூட்டியே அறிவது எப்படி?',
        answer: 'பயணத்தைத் தொடங்குவதற்கு முன் கூகிள் மேப்ஸ் அல்லது NHAI போர்ட்டலில் உங்கள் பாதையின் டோல் கட்டணங்களைச் சரிபார்க்கலாம்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'ట్రిప్ ఖర్చు కాలిక్యులేటర్ | రోడ్ ట్రిప్ పెట్రోల్, టోల్ & ఖర్చుల పంపకం | IndiaTools',
      metaDescription: 'రోడ్ ట్రిప్ కోసం పెట్రోల్/డీజిల్, ఫాస్టాగ్ టోల్, పార్కింగ్ మరియు ఒక్కొక్కరికి అయ్యే ఖర్చును ఖచ్చితంగా లెక్కించండి.',
      h1: 'ట్రిప్ ఖర్చు కాలిక్యులేటర్',
      subtitle: 'ఇంధనం, ఫాస్టాగ్ టోల్స్, పార్కింగ్ మరియు ప్రయాణీకుల మధ్య సమాన ఖర్చు పంపకంతో రోడ్ ట్రిప్ బడ్జెట్‌ను ప్లాన్ చేయండి.',
    },
    ui: {
      journeyLogistics: 'ప్రయాణం మరియు టోల్ వివరాలు',
      oneWay: 'వన్-వే',
      roundTrip: 'రౌండ్-ట్రిప్ (వెళ్లి రావడం)',
      oneWayDistance: 'ఒక వైపు దూరం',
      totalDistanceLabel: 'మొత్తం',
      vehicleMileage: 'వాహనం మైలేజ్ (కి.మీ/లీ)',
      kmPerLShort: 'కి.మీ/లీ',
      fuelRate: 'ఇంధనం ధర (₹ / లీటరు)',
      fastagTolls: 'అంచనా ఫాస్టాగ్ టోల్స్ (₹)',
      parkingMisc: 'పార్కింగ్ & ఇతర ఖర్చులు (₹)',
      numberOfTravelers: 'ప్రయాణీకుల సంఖ్య (ఖర్చు పంపకం)',
      person: 'వ్యక్తి',
      people: 'వ్యక్తులు',
      grandTotalCost: 'మొత్తం ట్రిప్ బడ్జెట్',
      splitPerPerson: 'ఒక్కొక్కరికి అయ్యే ఖర్చు',
      fuelShare: 'ఇంధన ఖర్చు',
      tollShare: 'ఫాస్టాగ్ టోల్స్',
      parkingShare: 'పార్కింగ్ & ఇతర',
      perKmNet: 'కిలోమీటరుకు ఖర్చు',
      efficiencyTip: 'కార్ పూలింగ్ ద్వారా టోల్ మరియు పెట్రోల్ ఖర్చులు పంచుకోవడం వల్ల వ్యక్తిగత ప్రయాణ ఖర్చు గణనీయంగా తగ్గుతుంది.',
      resultSummaryTitle: 'రోడ్ ట్రిప్ బడ్జెట్ & పంపకం:',
      totalDistanceText: 'మొత్తం దూరం',
      travelersText: 'ప్రయాణీకులు',
      fuelText: 'ఇంధనం',
      fastagTollsText: 'ఫాస్టాగ్ టోల్',
      parkingMiscText: 'పార్కింగ్/ఇతర',
      grandTotalCostText: 'మొత్తం ఖర్చు',
      costPerTravelerText: 'ఒక్కొక్కరి ఖర్చు',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'మొత్తం దూరం = వన్ వే దూరం × (రౌండ్ ట్రిప్ అయితే 2). ఇంధనం ఖర్చు = (మొత్తం దూరం ÷ మైలేజ్) × ధర. మొత్తం ఖర్చు = ఇంధనం + టోల్ + పార్కింగ్. ఒక్కొక్కరికి ఖర్చు = మొత్తం ఖర్చు ÷ ప్రయాణీకుల సంఖ్య.',
    assumptions: [
      'టోల్ మరియు పార్కింగ్ ఖర్చులు సమానంగా పంచుకోబడతాయి.',
      'హైవేపై స్థిరమైన మైలేజ్.',
    ],
    example: {
      title: 'వీకెండ్ రోడ్ ట్రిప్ ఉదాహరణ',
      inputs: {
        'ఒక వైపు దూరం': '280 కి.మీ',
        'ట్రిప్ రకం': 'రౌండ్ ట్రిప్ (560 కి.మీ)',
        'మైలేజ్': '15 కి.మీ/లీ',
        'ఇంధనం ధర': '₹102/లీ',
        'టోల్': '₹400',
        'ప్రయాణీకులు': '4 వ్యక్తులు',
      },
      outputs: {
        'మొత్తం ఇంధనం': '₹3,808',
        'మొత్తం ట్రిప్ ఖర్చు': '₹4,508',
        'ఒక్కొక్కరి ఖర్చు': '₹1,127',
      },
      explanation: '4 వ్యక్తులు కలిసి 560 కి.మీ ప్రయాణించినప్పుడు మొత్తం ₹4,508 ఖర్చు కాగా, ఒక్కొక్కరికి ₹1,127 మాత్రమే అవుతుంది.',
    },
    faqs: [
      {
        question: 'టోల్ ఖర్చులను ముందుగా ఎలా తెలుసుకోవాలి?',
        answer: 'ప్రయాణానికి ముందు గూగుల్ మ్యాప్స్ లేదా NHAI రాజ్ మార్గ్ యాత్ర యాప్‌లో టోల్ ధరలను చెక్ చేయవచ్చు.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಟ್ರಿಪ್ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ರೋಡ್ ಟ್ರಿಪ್ ಪೆಟ್ರೋಲ್, ಟೋಲ್ & ಖರ್ಚು ಹಂಚಿಕೆ | IndiaTools',
      metaDescription: 'ರೋಡ್ ಟ್ರಿಪ್ ಇಂಧನ ವೆಚ್ಚ, ಫಾಸ್ಟ್ಯಾಗ್ ಟೋಲ್, ಪಾರ್ಕಿಂಗ್ ಮತ್ತು ತಲಾ ವೆಚ್ಚವನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕಹಾಕಿ. ಉಚಿತ ಮತ್ತು ತ್ವರಿತ.',
      h1: 'ಟ್ರಿಪ್ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಪೆಟ್ರೋಲ್/ಡೀಸೆಲ್, ಫಾಸ್ಟ್ಯಾಗ್ ಟೋಲ್, ಪಾರ್ಕಿಂಗ್ ಮತ್ತು ಪ್ರತಿ ಪ್ರಯಾಣಿಕನ ಸಮಾನ ವೆಚ್ಚ ಹಂಚಿಕೆಯೊಂದಿಗೆ ರೋಡ್ ಟ್ರಿಪ್ ಪ್ಲಾನ್ ಮಾಡಿ.',
    },
    ui: {
      journeyLogistics: 'ಪ್ರಯಾಣ ಮತ್ತು ಟೋಲ್ ವಿವರಗಳು',
      oneWay: 'ಒಂದು ಕಡೆಗೆ',
      roundTrip: 'ಹೋಗಿ ಬರುವುದು (ರೌಂಡ್ ಟ್ರಿಪ್)',
      oneWayDistance: 'ಒಂದು ಕಡೆಯ ದೂರ',
      totalDistanceLabel: 'ಒಟ್ಟು',
      vehicleMileage: 'ವಾಹನದ ಮೈಲೇಜ್ (ಕಿ.ಮೀ/ಲೀ)',
      kmPerLShort: 'ಕಿ.ಮೀ/ಲೀ',
      fuelRate: 'ಇಂಧನ ದರ (₹ / ಲೀಟರ್)',
      fastagTolls: 'ಅಂದಾಜು ಫಾಸ್ಟ್ಯಾಗ್ ಟೋಲ್ (₹)',
      parkingMisc: 'ಪಾರ್ಕಿಂಗ್ & ಇತರ ವೆಚ್ಚ (₹)',
      numberOfTravelers: 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ (ವೆಚ್ಚ ಹಂಚಿಕೆ)',
      person: 'ವ್ಯಕ್ತಿ',
      people: 'ಜನರು',
      grandTotalCost: 'ಒಟ್ಟು ಟ್ರಿಪ್ ಬಜೆಟ್',
      splitPerPerson: 'ಪ್ರತಿ ಪ್ರಯಾಣಿಕನ ವೆಚ್ಚ',
      fuelShare: 'ಇಂಧನ ವೆಚ್ಚ',
      tollShare: 'ಫಾಸ್ಟ್ಯಾಗ್ ಟೋಲ್',
      parkingShare: 'ಪಾರ್ಕಿಂಗ್ & ಇತರ',
      perKmNet: 'ಪ್ರತಿ ಕಿ.ಮೀಗೆ ನಿವ್ವಳ ವೆಚ್ಚ',
      efficiencyTip: 'ಕಾರು ಹಂಚಿಕೆ ಮತ್ತು ಟೋಲ್ ವೆಚ್ಚ ಹಂಚಿಕೊಳ್ಳುವುದರಿಂದ ಪ್ರಯಾಣದ ವೆಚ್ಚ ಗಣನೀಯವಾಗಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
      resultSummaryTitle: 'ರೋಡ್ ಟ್ರಿಪ್ ಬಜೆಟ್ & ಹಂಚಿಕೆ:',
      totalDistanceText: 'ಒಟ್ಟು ದೂರ',
      travelersText: 'ಪ್ರಯಾಣಿಕರು',
      fuelText: 'ಇಂಧನ',
      fastagTollsText: 'ಫಾಸ್ಟ್ಯಾಗ್ ಟೋಲ್',
      parkingMiscText: 'ಪಾರ್ಕಿಂಗ್/ಇತರ',
      grandTotalCostText: 'ಒಟ್ಟು ವೆಚ್ಚ',
      costPerTravelerText: 'ತಲಾ ವೆಚ್ಚ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಒಟ್ಟು ದೂರ = ಒಂದು ಕಡೆಯ ದೂರ × (ರೌಂಡ್ ಟ್ರಿಪ್ ಆದರೆ 2). ಇಂಧನ ವೆಚ್ಚ = (ಒಟ್ಟು ದೂರ ÷ ಮೈಲೇಜ್) × ದರ. ಒಟ್ಟು ವೆಚ್ಚ = ಇಂಧನ + ಟೋಲ್ + ಪಾರ್ಕಿಂಗ್. ತಲಾ ವೆಚ್ಚ = ಒಟ್ಟು ವೆಚ್ಚ ÷ ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ.',
    assumptions: [
      'ಟೋಲ್ ಮತ್ತು ಪಾರ್ಕಿಂಗ್ ವೆಚ್ಚವನ್ನು ಎಲ್ಲ ಪ್ರಯಾಣಿಕರು ಸಮನಾಗಿ ಹಂಚಿಕೊಳ್ಳುತ್ತಾರೆ.',
      'ಹೆದ್ದಾರಿಯಲ್ಲಿ ಸ್ಥಿರ ಮೈಲೇಜ್.',
    ],
    example: {
      title: 'ವಾರಾಂತ್ಯದ ರೋಡ್ ಟ್ರಿಪ್ ಉದಾಹರಣೆ',
      inputs: {
        'ಒಂದು ಕಡೆಯ ದೂರ': '280 ಕಿ.ಮೀ',
        'ಟ್ರಿಪ್ ಮಾದರಿ': 'ಹೋಗಿ ಬರುವುದು (560 ಕಿ.ಮೀ)',
        'ಮೈಲೇಜ್': '15 ಕಿ.ಮೀ/ಲೀ',
        'ಇಂಧನ ಬೆಲೆ': '₹102/ಲೀ',
        'ಟೋಲ್': '₹400',
        'ಪ್ರಯಾಣಿಕರು': '4 ಜನರು',
      },
      outputs: {
        'ಒಟ್ಟು ಇಂಧನ ವೆಚ್ಚ': '₹3,808',
        'ಒಟ್ಟು ಟ್ರಿಪ್ ವೆಚ್ಚ': '₹4,508',
        'ತಲಾ ವೆಚ್ಚ': '₹1,127',
      },
      explanation: '4 ಸ್ನೇಹಿತರು 560 ಕಿ.ಮೀ ಪ್ರಯಾಣಿಸಿದಾಗ ಒಟ್ಟು ₹4,508 ವೆಚ್ಚವಾಗುತ್ತದೆ, ಅಂದರೆ ಒಬ್ಬರಿಗೆ ಕೇವಲ ₹1,127 ಮಾತ್ರ ತಗಲುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ಟೋಲ್ ಶುಲ್ಕವನ್ನು ಮುಂಚಿತವಾಗಿ ತಿಳಿಯುವುದು ಹೇಗೆ?',
        answer: 'ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸುವ ಮುನ್ನ ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಅಥವಾ NHAI ರಾಜ್‌ಮಾರ್ಗ್ ಯಾತ್ರಾ ಆಪ್‌ನಲ್ಲಿ ಟೋಲ್ ದರಗಳನ್ನು ನೋಡಬಹುದು.',
      },
    ],
  },
}

registerToolTranslations('trip-cost', tripCostTranslations)
