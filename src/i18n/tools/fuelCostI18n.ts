import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface FuelCostUI {
  routeAndEconomy: string
  tripBudgeting: string
  totalDistanceToTravel: string
  kmShort: string
  kmGuide50: string
  kmGuide300: string
  kmGuide1000: string
  vehicleMileage: string
  kmPerLShort: string
  bikeQuick: string
  hatchbackQuick: string
  suvQuick: string
  fuelRate: string
  totalFuelBudget: string
  tripBadge: string
  estimatedFuelCost: string
  fuelRequirementSummary: string
  litresNeeded: string
  totalVolume: string
  costPerKm: string
  perKmTravel: string
  estimatedCo2: string
  safetyTip: string
  resultSummaryTitle: string
  journeyDistanceText: string
  mileageText: string
  fuelPriceText: string
  fuelRequiredText: string
  totalFuelExpenseText: string
  calculatedOn: string
}

export const fuelCostTranslations: ToolLocaleMap<FuelCostUI> = {
  en: {
    meta: {
      title: 'Fuel Cost Calculator | Petrol & Diesel Trip Expense | IndiaTools',
      metaDescription: 'Calculate trip fuel costs, required litres, and cost per km for any road journey across India. Accurate petrol, diesel, and CNG mileage calculator.',
      h1: 'Fuel Cost Calculator',
      subtitle: 'Calculate total petrol or diesel expense, litres required, and cost per kilometer for road trips across India. Free and instant.',
    },
    ui: {
      routeAndEconomy: 'Route & Vehicle Economy',
      tripBudgeting: 'Trip Budgeting',
      totalDistanceToTravel: 'Total Distance to Travel',
      kmShort: 'km',
      kmGuide50: '50 km',
      kmGuide300: '300 km (Intercity)',
      kmGuide1000: '1000+ km (Cross-state)',
      vehicleMileage: 'Vehicle Mileage (km / Litre)',
      kmPerLShort: 'km/L',
      bikeQuick: 'Bike (~45 km/L)',
      hatchbackQuick: 'Hatchback (~18)',
      suvQuick: 'SUV (~14)',
      fuelRate: 'Fuel Rate (₹ / Litre)',
      totalFuelBudget: 'Total Fuel Budget',
      tripBadge: 'trip',
      estimatedFuelCost: 'Estimated Fuel Cost',
      fuelRequirementSummary: 'Requires {litres} Litres at ₹{price}/L',
      litresNeeded: 'Litres Needed',
      totalVolume: 'Total volume',
      costPerKm: 'Cost per Km',
      perKmTravel: 'Per km travel',
      estimatedCo2: 'Estimated CO2 Emissions:',
      safetyTip: 'Always keep at least 5 litres reserve fuel in your vehicle before entering ghat roads or interstate expressways.',
      resultSummaryTitle: 'Fuel Cost Projection:',
      journeyDistanceText: 'Journey Distance',
      mileageText: 'Mileage',
      fuelPriceText: 'Fuel Price',
      fuelRequiredText: 'Fuel Required',
      totalFuelExpenseText: 'Total Fuel Expense',
      calculatedOn: 'Calculated on IndiaTools',
    },
    formulaExplanation: 'Total Fuel Needed (Litres) = Total Distance (km) ÷ Vehicle Mileage (km/L). Total Fuel Cost (₹) = Total Fuel Needed × Fuel Price per Litre. Running Cost per km = Total Fuel Cost ÷ Total Distance.',
    assumptions: [
      'Constant average fuel economy across the journey.',
      'Stable fuel pricing along the route without interstate surcharge differentials.',
      'Standard ambient temperature and regular tyre pressure maintained throughout.',
    ],
    example: {
      title: 'Sample Intercity Highway Trip',
      inputs: {
        'Distance': '280 km',
        'Mileage': '16 km/L',
        'Fuel Price': '₹90/L',
      },
      outputs: {
        'Total Fuel': '17.5 Litres',
        'Fuel Expense': '₹1,575',
        'Cost per Km': '₹5.63 / km',
      },
      explanation: 'A 280 km trip in a vehicle delivering 16 km/L consumes 17.5 litres. At ₹90/L, total fuel expense is ₹1,575 with an effective running cost of ₹5.63 per km.',
    },
    faqs: [
      {
        question: 'How do I calculate trip fuel cost accurately?',
        answer: 'Divide your total one-way or round trip distance in kilometres by your vehicle\'s actual highway mileage, then multiply by the current fuel price per litre in your state.',
      },
      {
        question: 'Does AC usage increase highway fuel expense?',
        answer: 'Yes, continuous air conditioning in Indian summer weather typically reduces vehicle fuel economy by 8% to 15%, increasing your per-kilometre fuel burn accordingly.',
      },
      {
        question: 'How is the estimated CO2 emission calculated?',
        answer: 'Burning one litre of standard petrol generates approximately 2.31 kg of CO2, while diesel yields approximately 2.68 kg of CO2 emissions.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'ഇന്ധന ചെലവ് കാൽക്കുലേറ്റർ | പെട്രോൾ & ഡീസൽ യാത്ര ചെലവ് | IndiaTools',
      metaDescription: 'യാത്രയ്ക്കുള്ള ഇന്ധനച്ചെലവ്, ആവശ്യമായ പെട്രോൾ/ഡീസൽ ലിറ്ററുകൾ, കിലോമീറ്റർ നിരക്ക് എന്നിവ കൃത്യമായി കണക്കാക്കുക. സൗജന്യം, വേഗത്തിലുള്ളത്.',
      h1: 'ഇന്ധന ചെലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ഏതൊരു യാത്രയ്ക്കും ആവശ്യമായ പെട്രോൾ/ഡീസൽ ലിറ്ററുകളും ആകെ ഇന്ധനച്ചെലവും കിലോമീറ്റർ നിരക്കും കൃത്യമായി കണക്കാക്കുക.',
    },
    ui: {
      routeAndEconomy: 'യാത്രാ ദൂരവും മൈലേജും',
      tripBudgeting: 'യാത്രാ ബജറ്റ്',
      totalDistanceToTravel: 'ആകെ യാത്രാ ദൂരം',
      kmShort: 'കി.മീ',
      kmGuide50: '50 കി.മീ',
      kmGuide300: '300 കി.മീ (നഗരാന്തര യാത്ര)',
      kmGuide1000: '1000+ കി.മീ (സംസ്ഥാനാന്തര യാത്ര)',
      vehicleMileage: 'വാഹനത്തിന്റെ മൈലേജ് (കി.മീ / ലിറ്റർ)',
      kmPerLShort: 'കി.മീ/ലി',
      bikeQuick: 'ബൈക്ക് (~45 കി.മീ/ലി)',
      hatchbackQuick: 'ഹാച്ച്ബാക്ക് (~18)',
      suvQuick: 'എസ്‌യുവി (~14)',
      fuelRate: 'ഇന്ധന വില (₹ / ലിറ്റർ)',
      totalFuelBudget: 'ആകെ ഇന്ധന ബജറ്റ്',
      tripBadge: 'യാത്ര',
      estimatedFuelCost: 'കണക്കാക്കിയ ഇന്ധനച്ചെലവ്',
      fuelRequirementSummary: '₹{price}/ലിറ്റർ നിരക്കിൽ {litres} ലിറ്റർ ഇന്ധനം ആവശ്യമാണ്',
      litresNeeded: 'ആവശ്യമായ ലിറ്ററുകൾ',
      totalVolume: 'ആകെ അളവ്',
      costPerKm: 'കിലോമീറ്റർ ചെലവ്',
      perKmTravel: 'ഓരോ കി.മീറ്ററിനും',
      estimatedCo2: 'കണക്കാക്കിയ CO2 പുറന്തള്ളൽ:',
      safetyTip: 'ചുരം റോഡുകളിലോ ഹൈവേകളിലോ പ്രവേശിക്കുന്നതിന് മുമ്പ് വാഹനത്തിൽ ചുരുങ്ങിയത് 5 ലിറ്റർ റിസർവ് ഇന്ധനം കരുതുക.',
      resultSummaryTitle: 'ഇന്ധനച്ചെലവ് കണക്കുകൂട്ടൽ:',
      journeyDistanceText: 'യാത്രാ ദൂരം',
      mileageText: 'മൈലേജ്',
      fuelPriceText: 'ഇന്ധന വില',
      fuelRequiredText: 'ആവശ്യമായ ഇന്ധനം',
      totalFuelExpenseText: 'ആകെ ഇന്ധനച്ചെലവ്',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'ആവശ്യമായ ഇന്ധനം (ലിറ്റർ) = ആകെ ദൂരം (കി.മീ) ÷ മൈലേജ് (കി.മീ/ലിറ്റർ). ആകെ ഇന്ധനച്ചെലവ് (₹) = ആവശ്യമായ ഇന്ധനം × ലിറ്റർ വില. കിലോമീറ്റർ ചെലവ് = ആകെ ഇന്ധനച്ചെലവ് ÷ ആകെ ദൂരം.',
    assumptions: [
      'യാത്രയിലുടനീളം ശരാശരി ഒരേ മൈലേജ് നിലനിൽക്കുന്നു.',
      'സംസ്ഥാനാന്തര നികുതി വ്യത്യാസങ്ങൾ ഒഴികെ ഇന്ധനവില സ്ഥിരമായി കണക്കാക്കുന്നു.',
      'വാഹനത്തിൽ ശരിയായ ടയർ പ്രഷർ പരിപാലിക്കപ്പെടുന്നു.',
    ],
    example: {
      title: 'നഗരാന്തര ഹൈവേ യാത്ര ഉദാഹരണം',
      inputs: {
        'ദൂരം': '280 കി.മീ',
        'മൈലേജ്': '16 കി.മീ/ലിറ്റർ',
        'ഇന്ധന വില': '₹90/ലിറ്റർ',
      },
      outputs: {
        'ആവശ്യമായ ഇന്ധനം': '17.5 ലിറ്റർ',
        'ഇന്ധനച്ചെലവ്': '₹1,575',
        'കിലോമീറ്റർ ചെലവ്': '₹5.63 / കി.മീ',
      },
      explanation: '16 കി.മീ/ലിറ്റർ മൈലേജുള്ള ഒരു കാറിൽ 280 കി.മീ യാത്ര ചെയ്യാൻ 17.5 ലിറ്റർ ഇന്ധനം ആവശ്യമാണ്. ₹90 നിരക്കിൽ ആകെ ₹1,575 ചെലവാകുന്നു.',
    },
    faqs: [
      {
        question: 'ഒരു യാത്രയുടെ ഇന്ധനച്ചെലവ് എങ്ങനെ മുൻകൂട്ടി അറിയാം?',
        answer: 'നിങ്ങളുടെ യാത്രാ ദൂരത്തെ കാറിന്റെ മൈലേജ് കൊണ്ട് ഹരിക്കുക. കിട്ടുന്ന ലിറ്ററിനെ നിലവിലെ പെട്രോൾ അല്ലെങ്കിൽ ഡീസൽ വില കൊണ്ട് ഗുണിച്ചാൽ ചെലവ് ലഭിക്കും.',
      },
      {
        question: 'എസി ഓൺ ചെയ്യുന്നത് ഇന്ധനച്ചെലവ് കൂട്ടുമോ?',
        answer: 'അതെ, തുടർച്ചയായി എയർ കണ്ടീഷണർ പ്രവർത്തിപ്പിക്കുമ്പോൾ സാധാരണയായി 8% മുതൽ 15% വരെ മൈലേജ് കുറയുകയും ഇന്ധനച്ചെലവ് കൂടുകയും ചെയ്യും.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'ईंधन लागत कैलकुलेटर | पेट्रोल व डीजल यात्रा खर्च | IndiaTools',
      metaDescription: 'सड़क यात्रा के लिए ईंधन खर्च, आवश्यक पेट्रोल/डीजल लीटर और प्रति किमी लागत तुरंत जानें। भारत के लिए सटीक व मुफ्त फ्यूल कैलकुलेटर।',
      h1: 'ईंधन लागत कैलकुलेटर',
      subtitle: 'किसी भी सड़क यात्रा के लिए आवश्यक पेट्रोल/डीजल की मात्रा, कुल खर्च और प्रति किलोमीटर लागत की तुरंत गणना करें।',
    },
    ui: {
      routeAndEconomy: 'मार्ग व वाहन माइलेज',
      tripBudgeting: 'ट्रिप बजट',
      totalDistanceToTravel: 'कुल यात्रा दूरी',
      kmShort: 'किमी',
      kmGuide50: '50 किमी',
      kmGuide300: '300 किमी (अंतर-शहर)',
      kmGuide1000: '1000+ किमी (अंतर-राज्यीय)',
      vehicleMileage: 'वाहन माइलेज (किमी / लीटर)',
      kmPerLShort: 'किमी/ली',
      bikeQuick: 'बाइक (~45 किमी/ली)',
      hatchbackQuick: 'हैचबैक (~18)',
      suvQuick: 'एसयूवी (~14)',
      fuelRate: 'ईंधन दर (₹ / लीटर)',
      totalFuelBudget: 'कुल ईंधन बजट',
      tripBadge: 'ट्रिप',
      estimatedFuelCost: 'अनुमानित ईंधन लागत',
      fuelRequirementSummary: '₹{price}/लीटर की दर पर {litres} लीटर ईंधन की आवश्यकता है',
      litresNeeded: 'आवश्यक लीटर',
      totalVolume: 'कुल मात्रा',
      costPerKm: 'प्रति किमी लागत',
      perKmTravel: 'प्रति किमी यात्रा',
      estimatedCo2: 'अनुमानित CO2 उत्सर्जन:',
      safetyTip: 'घाट सड़कों या एक्सप्रेसवे पर जाने से पहले अपने वाहन में कम से कम 5 लीटर रिजर्व ईंधन अवश्य रखें।',
      resultSummaryTitle: 'ईंधन खर्च अनुमान:',
      journeyDistanceText: 'यात्रा दूरी',
      mileageText: 'माइलेज',
      fuelPriceText: 'ईंधन दर',
      fuelRequiredText: 'आवश्यक ईंधन',
      totalFuelExpenseText: 'कुल ईंधन खर्च',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'आवश्यक ईंधन (लीटर) = कुल दूरी (किमी) ÷ वाहन माइलेज (किमी/लीटर)। कुल ईंधन लागत (₹) = आवश्यक ईंधन × प्रति लीटर दर। प्रति किमी लागत = कुल लागत ÷ कुल दूरी।',
    assumptions: [
      'पूरी यात्रा के दौरान औसतन एकसमान माइलेज।',
      'सड़क पर स्थिर ईंधन दरें।',
      'वाहन में उचित टायर प्रेशर बनाए रखा गया है।',
    ],
    example: {
      title: 'राजमार्ग यात्रा का उदाहरण',
      inputs: {
        'दूरी': '280 किमी',
        'माइलेज': '16 किमी/लीटर',
        'ईंधन दर': '₹90/लीटर',
      },
      outputs: {
        'आवश्यक ईंधन': '17.5 लीटर',
        'ईंधन खर्च': '₹1,575',
        'प्रति किमी लागत': '₹5.63 / किमी',
      },
      explanation: '16 किमी/लीटर माइलेज वाली कार में 280 किमी यात्रा के लिए 17.5 लीटर ईंधन लगता है। ₹90 प्रति लीटर के अनुसार कुल खर्च ₹1,575 और प्रति किमी लागत ₹5.63 आती है।',
    },
    faqs: [
      {
        question: 'यात्रा का पेट्रोल या डीजल खर्च कैसे निकालें?',
        answer: 'अपनी कुल दूरी (किमी) को वाहन के वास्तविक माइलेज से भाग दें, और परिणामी लीटर्स को अपने शहर के पेट्रोल/डीजल भाव से गुणा करें।',
      },
      {
        question: 'क्या एसी चलाने से ईंधन की खपत बढ़ती है?',
        answer: 'हाँ, कार में एसी चलाने से आमतौर पर माइलेज में 8% से 15% की कमी आती है, जिससे प्रति किलोमीटर यात्रा खर्च बढ़ जाता है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'எரிபொருள் செலவு கால்குலேட்டர் | பெட்ரோல் & டீசல் பயண செலவு | IndiaTools',
      metaDescription: 'பயணத்திற்கான பெட்ரோல் அல்லது டீசல் செலவு, தேவைப்படும் லிட்டர்கள் மற்றும் கி.மீ கட்டணத்தை துல்லியமாக கணக்கிடுங்கள். இலவசம் மற்றும் உடனடியானது.',
      h1: 'எரிபொருள் செலவு கால்குலேட்டர்',
      subtitle: 'சாலைப் பயணங்களுக்கான மொத்த பெட்ரோல்/டீசல் செலவு, தேவையான லிட்டர்கள் மற்றும் ஒரு கி.மீ-க்கான செலவை உடனடியாகக் கணக்கிடுங்கள்.',
    },
    ui: {
      routeAndEconomy: 'பயண தூரம் & மைலேஜ்',
      tripBudgeting: 'பயண பட்ஜெட்',
      totalDistanceToTravel: 'மொத்த பயண தூரம்',
      kmShort: 'கி.மீ',
      kmGuide50: '50 கி.மீ',
      kmGuide300: '300 கி.மீ (நகரங்களுக்கு இடையே)',
      kmGuide1000: '1000+ கி.மீ (மாநிலங்களுக்கு இடையே)',
      vehicleMileage: 'வாகன மைலேஜ் (கி.மீ / லிட்டர்)',
      kmPerLShort: 'கி.மீ/லி',
      bikeQuick: 'பைக் (~45 கி.மீ/லி)',
      hatchbackQuick: 'ஹேட்ச்பேக் (~18)',
      suvQuick: 'எஸ்யூவி (~14)',
      fuelRate: 'எரிபொருள் விலை (₹ / லிட்டர்)',
      totalFuelBudget: 'மொத்த எரிபொருள் பட்ஜெட்',
      tripBadge: 'பயணம்',
      estimatedFuelCost: 'மதிப்பிடப்பட்ட எரிபொருள் செலவு',
      fuelRequirementSummary: '₹{price}/லிட்டர் வீதம் {litres} லிட்டர் எரிபொருள் தேவை',
      litresNeeded: 'தேவையான லிட்டர்கள்',
      totalVolume: 'மொத்த அளவு',
      costPerKm: 'கி.மீ-க்கான செலவு',
      perKmTravel: 'ஒரு கி.மீ பயணத்திற்கு',
      estimatedCo2: 'மதிப்பிடப்பட்ட CO2 உமிழ்வு:',
      safetyTip: 'மலைப் பாதைகள் அல்லது நெடுஞ்சாலைகளில் செல்வதற்கு முன் குறைந்தது 5 லிட்டர் கூடுதல் எரிபொருளை வைத்துக் கொள்ளுங்கள்.',
      resultSummaryTitle: 'எரிபொருள் செலவு மதிப்பீடு:',
      journeyDistanceText: 'பயண தூரம்',
      mileageText: 'மைலேஜ்',
      fuelPriceText: 'எரிபொருள் விலை',
      fuelRequiredText: 'தேவையான எரிபொருள்',
      totalFuelExpenseText: 'மொத்த எரிபொருள் செலவு',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'தேவையான எரிபொருள் (லிட்டர்) = மொத்த தூரம் (கி.மீ) ÷ வாகன மைலேஜ் (கி.மீ/லி). மொத்த செலவு (₹) = தேவையான எரிபொருள் × லிட்டர் விலை. ஒரு கி.மீ செலவு = மொத்த செலவு ÷ மொத்த தூரம்.',
    assumptions: [
      'பயணத்தின் போது சீரான சராசரி மைலேஜ் பராமரிக்கப்படுகிறது.',
      'மாநிலங்களுக்கு இடையே நிலையான எரிபொருள் விலை கணக்கிடப்படுகிறது.',
      'சரியான டயர் அழுத்தம் பராமரிக்கப்படுகிறது.',
    ],
    example: {
      title: 'நெடுஞ்சாலை பயண எடுத்துக்காட்டு',
      inputs: {
        'தூரம்': '280 கி.மீ',
        'மைலேஜ்': '16 கி.மீ/லிட்டர்',
        'எரிபொருள் விலை': '₹90/லிட்டர்',
      },
      outputs: {
        'தேவையான எரிபொருள்': '17.5 லிட்டர்',
        'எரிபொருள் செலவு': '₹1,575',
        'கி.மீ செலவு': '₹5.63 / கி.மீ',
      },
      explanation: '16 கி.மீ/லி மைலேஜ் தரும் காரில் 280 கி.மீ செல்ல 17.5 லிட்டர் தேவை. ₹90 விலையில் மொத்த செலவு ₹1,575 மற்றும் ஒரு கி.மீ-க்கு ₹5.63 ஆகும்.',
    },
    faqs: [
      {
        question: 'பயணத்திற்கான எரிபொருள் செலவை எவ்வாறு கணக்கிடுவது?',
        answer: 'உங்கள் பயண தூரத்தை வாகனத்தின் மைலேஜால் வகுக்கவும். வரும் லிட்டரை உங்கள் ஊர் பெட்ரோல் அல்லது டீசல் விலையுடன் பெருக்கவும்.',
      },
      {
        question: 'ஏசி பயன்படுத்துவது எரிபொருள் செலவை அதிகரிக்குமா?',
        answer: 'ஆம், தொடர்ந்து ஏர் கண்டிஷனரை இயக்கும் போது மைலேஜ் 8% முதல் 15% வரை குறைகிறது, இதனால் செலவு அதிகரிக்கிறது.',
      },
    ],
  },
  te: {
    meta: {
      title: 'ఇంధన ఖర్చు కాలిక్యులేటర్ | పెట్రోల్ & డీజిల్ ప్రయాణ ఖర్చు | IndiaTools',
      metaDescription: 'రోడ్డు ప్రయాణానికి అవసరమైన పెట్రోల్/డీజిల్ లీటర్లు, మొత్తం ఖర్చు మరియు కి.మీ రేటును సులభంగా లెక్కించండి. ఉచితం మరియు తక్షణం.',
      h1: 'ఇంధన ఖర్చు కాలిక్యులేటర్',
      subtitle: 'ఏదైనా రోడ్డు ప్రయాణానికి అవసరమైన పెట్రోల్ లేదా డీజిల్ ఖర్చు, లీటర్లు మరియు ప్రతి కిలోమీటరు ఖర్చును వెంటనే లెక్కించండి.',
    },
    ui: {
      routeAndEconomy: 'రూట్ & వాహనం మైలేజ్',
      tripBudgeting: 'ట్రిప్ బడ్జెట్',
      totalDistanceToTravel: 'మొత్తం ప్రయాణ దూరం',
      kmShort: 'కి.మీ',
      kmGuide50: '50 కి.మీ',
      kmGuide300: '300 కి.మీ (నగరాల మధ్య)',
      kmGuide1000: '1000+ కి.మీ (రాష్ట్రాల మధ్య)',
      vehicleMileage: 'వాహనం మైలేజ్ (కి.మీ / లీటరు)',
      kmPerLShort: 'కి.మీ/లీ',
      bikeQuick: 'బైక్ (~45 కి.మీ/లీ)',
      hatchbackQuick: 'హ్యాచ్‌బ్యాక్ (~18)',
      suvQuick: 'ఎస్‌యూవీ (~14)',
      fuelRate: 'ఇంధనం రేటు (₹ / లీటరు)',
      totalFuelBudget: 'మొత్తం ఇంధన బడ్జెట్',
      tripBadge: 'ట్రిప్',
      estimatedFuelCost: 'అంచనా వేసిన ఇంధన ఖర్చు',
      fuelRequirementSummary: '₹{price}/లీటరు చొప్పున {litres} లీటర్ల ఇంధనం అవసరం',
      litresNeeded: 'అవసరమైన లీటర్లు',
      totalVolume: 'మొత్తం పరిమాణం',
      costPerKm: 'కి.మీ ఖర్చు',
      perKmTravel: 'ప్రతి కి.మీ ప్రయాణానికి',
      estimatedCo2: 'అంచనా వేసిన CO2 ఉద్గారాలు:',
      safetyTip: 'ఘాట్ రోడ్లు లేదా హైవేలలో ప్రయాణించే ముందు వాహనంలో కనీసం 5 లీటర్ల రిజర్వ్ ఇంధనం ఉంచుకోండి.',
      resultSummaryTitle: 'ఇంధన ఖర్చు అంచనా:',
      journeyDistanceText: 'ప్రయాణ దూరం',
      mileageText: 'మైలేజ్',
      fuelPriceText: 'ఇంధనం ధర',
      fuelRequiredText: 'అవసరమైన ఇంధనం',
      totalFuelExpenseText: 'మొత్తం ఇంధన ఖర్చు',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'అవసరమైన ఇంధనం (లీటర్లు) = మొత్తం దూరం (కి.మీ) ÷ మైలేజ్ (కి.మీ/లీ). మొత్తం ఖర్చు (₹) = ఇంధనం × లీటరు ధర. కి.మీ ఖర్చు = మొత్తం ఖర్చు ÷ మొత్తం దూరం.',
    assumptions: [
      'ప్రయాణంలో స్థిరమైన సగటు మైలేజ్ లభిస్తుంది.',
      'స్థిరమైన ఇంధన ధరల అంచనా.',
      'వాహనంలో సరైన టైర్ ప్రెజర్ నిర్వహించబడింది.',
    ],
    example: {
      title: 'హైవే ప్రయాణ ఉదాహరణ',
      inputs: {
        'దూరం': '280 కి.మీ',
        'మైలేజ్': '16 కి.మీ/లీటరు',
        'ఇంధనం రేటు': '₹90/లీటరు',
      },
      outputs: {
        'అవసరమైన ఇంధనం': '17.5 లీటర్లు',
        'ఇంధన ఖర్చు': '₹1,575',
        'కి.మీ ఖర్చు': '₹5.63 / కి.మీ',
      },
      explanation: '16 కి.మీ/లీ మైలేజ్ ఇచ్చే కారులో 280 కి.మీ ప్రయాణానికి 17.5 లీటర్లు అవసరం. ₹90 లీటరు చొప్పున మొత్తం ఖర్చు ₹1,575 మరియు కి.మీ ఖర్చు ₹5.63.',
    },
    faqs: [
      {
        question: 'ప్రయాణ ఇంధన ఖర్చును ఎలా లెక్కించాలి?',
        answer: 'మీ మొత్తం ప్రయాణ దూరాన్ని వాహనం మైలేజ్ తో భాగించి, వచ్చిన లీటర్లను ప్రస్తుత పెట్రోల్ లేదా డీజిల్ ధరతో గుణించండి.',
      },
      {
        question: 'ఏసీ వాడటం వల్ల మైలేజ్ తగ్గుతుందా?',
        answer: 'అవును, ఎయిర్ కండిషనర్ వాడటం వలన మైలేజ్ 8% నుండి 15% వరకు తగ్గి, కిలోమీటరు ఖర్చు పెరుగుతుంది.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಇಂಧನ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ಪೆಟ್ರೋಲ್ & ಡೀಸೆಲ್ ಪ್ರಯಾಣ ಖರ್ಚು | IndiaTools',
      metaDescription: 'ಪ್ರಯಾಣಕ್ಕೆ ಬೇಕಾದ ಪೆಟ್ರೋಲ್ ಅಥವಾ ಡೀಸೆಲ್ ಲೀಟರ್‌ಗಳು, ಒಟ್ಟು ಖರ್ಚು ಮತ್ತು ಪ್ರತಿ ಕಿ.ಮೀ ದರವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಿ. ಉಚಿತ ಮತ್ತು ತಕ್ಷಣದ ಫಲಿತಾಂಶ.',
      h1: 'ಇಂಧನ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಯಾವುದೇ ರಸ್ತೆ ಪ್ರಯಾಣಕ್ಕೆ ಬೇಕಾಗುವ ಪೆಟ್ರೋಲ್/ಡೀಸೆಲ್ ವೆಚ್ಚ, ಲೀಟರ್‌ಗಳು ಮತ್ತು ಪ್ರತಿ ಕಿಲೋಮೀಟರ್ ದರವನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
    },
    ui: {
      routeAndEconomy: 'ಪ್ರಯಾಣ ದೂರ ಮತ್ತು ಮೈಲೇಜ್',
      tripBudgeting: 'ಟ್ರಿಪ್ ಬಜೆಟ್',
      totalDistanceToTravel: 'ಒಟ್ಟು ಪ್ರಯಾಣದ ದೂರ',
      kmShort: 'ಕಿ.ಮೀ',
      kmGuide50: '50 ಕಿ.ಮೀ',
      kmGuide300: '300 ಕಿ.ಮೀ (ನಗರಗಳ ನಡುವೆ)',
      kmGuide1000: '1000+ ಕಿ.ಮೀ (ರಾಜ್ಯಗಳ ನಡುವೆ)',
      vehicleMileage: 'ವಾಹನದ ಮೈಲೇಜ್ (ಕಿ.ಮೀ / ಲೀಟರ್)',
      kmPerLShort: 'ಕಿ.ಮೀ/ಲೀ',
      bikeQuick: 'ಬೈಕ್ (~45 ಕಿ.ಮೀ/ಲೀ)',
      hatchbackQuick: 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್ (~18)',
      suvQuick: 'ಎಸ್‌ಯುವಿ (~14)',
      fuelRate: 'ಇಂಧನ ದರ (₹ / ಲೀಟರ್)',
      totalFuelBudget: 'ಒಟ್ಟು ಇಂಧನ ಬಜೆಟ್',
      tripBadge: 'ಟ್ರಿಪ್',
      estimatedFuelCost: 'ಅಂದಾಜು ಇಂಧನ ವೆಚ್ಚ',
      fuelRequirementSummary: '₹{price}/ಲೀಟರ್ ದರದಲ್ಲಿ {litres} ಲೀಟರ್ ಇಂಧನ ಅಗತ್ಯವಿದೆ',
      litresNeeded: 'ಅಗತ್ಯವಿರುವ ಲೀಟರ್‌ಗಳು',
      totalVolume: 'ಒಟ್ಟು ಪ್ರಮಾಣ',
      costPerKm: 'ಪ್ರತಿ ಕಿ.ಮೀ ವೆಚ್ಚ',
      perKmTravel: 'ಪ್ರತಿ ಕಿ.ಮೀ ಪ್ರಯಾಣಕ್ಕೆ',
      estimatedCo2: 'ಅಂದಾಜು CO2 ಹೊರಸೂಸುವಿಕೆ:',
      safetyTip: 'ಘಾಟ್ ರಸ್ತೆಗಳು ಅಥವಾ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇಗಳಿಗೆ ಪ್ರವೇಶಿಸುವ ಮೊದಲು ವಾಹನದಲ್ಲಿ ಕನಿಷ್ಠ 5 ಲೀಟರ್ ಮೀಸಲು ಇಂಧನವಿರಿಸಿ.',
      resultSummaryTitle: 'ಇಂಧನ ವೆಚ್ಚದ ಅಂದಾಜು:',
      journeyDistanceText: 'ಪ್ರಯಾಣದ ದೂರ',
      mileageText: 'ಮೈಲೇಜ್',
      fuelPriceText: 'ಇಂಧನ ಬೆಲೆ',
      fuelRequiredText: 'ಅಗತ್ಯವಿರುವ ಇಂಧನ',
      totalFuelExpenseText: 'ಒಟ್ಟು ಇಂಧನ ವೆಚ್ಚ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಅಗತ್ಯವಿರುವ ಇಂಧನ (ಲೀಟರ್) = ಒಟ್ಟು ದೂರ (ಕಿ.ಮೀ) ÷ ಮೈಲೇಜ್ (ಕಿ.ಮೀ/ಲೀ). ಒಟ್ಟು ವೆಚ್ಚ (₹) = ಇಂಧನ × ಲೀಟರ್ ಬೆಲೆ. ಪ್ರತಿ ಕಿ.ಮೀ ವೆಚ್ಚ = ಒಟ್ಟು ವೆಚ್ಚ ÷ ಒಟ್ಟು ದೂರ.',
    assumptions: [
      'ಪ್ರಯಾಣದುದ್ದಕ್ಕೂ ಸರಾಸರಿ ಸ್ಥಿರ ಮೈಲೇಜ್.',
      'ಸ್ಥಿರ ಇಂಧನ ಬೆಲೆಯ ಅಂದಾಜು.',
      'ವಾಹನದಲ್ಲಿ ಸರಿಯಾದ ಟೈರ್ ಪ್ರೆಶರ್ ಕಾಪಾಡಿಕೊಳ್ಳಲಾಗಿದೆ.',
    ],
    example: {
      title: 'ಹೆದ್ದಾರಿ ಪ್ರಯಾಣದ ಉದಾಹರಣೆ',
      inputs: {
        'ದೂರ': '280 ಕಿ.ಮೀ',
        'ಮೈಲೇಜ್': '16 ಕಿ.ಮೀ/ಲೀಟರ್',
        'ಇಂಧನ ದರ': '₹90/ಲೀಟರ್',
      },
      outputs: {
        'ಅಗತ್ಯವಿರುವ ಇಂಧನ': '17.5 ಲೀಟರ್',
        'ಇಂಧನ ವೆಚ್ಚ': '₹1,575',
        'ಕಿ.ಮೀ ವೆಚ್ಚ': '₹5.63 / ಕಿ.ಮೀ',
      },
      explanation: '16 ಕಿ.ಮೀ/ಲೀ ಮೈಲೇಜ್ ನೀಡುವ ಕಾರಿನಲ್ಲಿ 280 ಕಿ.ಮೀ ಪ್ರಯಾಣಕ್ಕೆ 17.5 ಲೀಟರ್ ಇಂಧನ ಬೇಕಾಗುತ್ತದೆ. ₹90 ದರದಲ್ಲಿ ಒಟ್ಟು ವೆಚ್ಚ ₹1,575 ಮತ್ತು ಪ್ರತಿ ಕಿ.ಮೀ ದರ ₹5.63 ಆಗುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ಪ್ರಯಾಣದ ಇಂಧನ ವೆಚ್ಚವನ್ನು ಹೇಗೆ ಲೆಕ್ಕಹಾಕುವುದು?',
        answer: 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ದೂರವನ್ನು ವಾಹನದ ಮೈಲೇಜ್‌ನಿಂದ ಭಾಗಿಸಿ, ಬಂದ ಲೀಟರ್‌ಗಳನ್ನು ಇಂದಿನ ಪೆಟ್ರೋಲ್/ಡೀಸೆಲ್ ದರದೊಂದಿಗೆ ಗುಣಿಸಿ.',
      },
      {
        question: 'ಎಸಿ ಬಳಸುವುದರಿಂದ ಇಂಧನ ವೆಚ್ಚ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
        answer: 'ಹೌದು, ಸತತವಾಗಿ ಎಸಿ ಬಳಸುವುದರಿಂದ ಮೈಲೇಜ್ ಶೇ. 8 ರಿಂದ 15 ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ವೆಚ್ಚ ಹೆಚ್ಚುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('fuel-cost', fuelCostTranslations)
