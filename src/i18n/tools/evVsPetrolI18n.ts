import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface EvVsPetrolUI {
  evVsIceParams: string
  greenMobilityTco: string
  expectedMonthlyDriving: string
  kmPerMonth: string
  petrolIce: string
  electricEv: string
  petrolPrice: string
  iceMileage: string
  powerTariff: string
  evEfficiency: string
  evUpfrontPricePremium: string
  upfrontPriceHint: string
  annualFuelSavings: string
  savePercent: string
  perYear: string
  monthlyInPocketSavings: string
  perMonth: string
  petrolCostPerKm: string
  evElectricityPerKm: string
  upfrontPriceBreakeven: string
  years: string
  breakevenFootnote: string
  realWorldNuanceTitle: string
  realWorldNuanceDesc: string
  resultSummaryTitle: string
  monthlyDrivingText: string
  petrolRunningCostText: string
  evRunningCostText: string
  netMonthlySavingsText: string
  annualEnergySavingsText: string
  breakevenDistanceText: string
  calculatedOn: string
}

export const evVsPetrolTranslations: ToolLocaleMap<EvVsPetrolUI> = {
  en: {
    meta: {
      title: 'EV vs Petrol Car Calculator | Running Cost, Savings & ROI | IndiaTools',
      metaDescription: 'Compare electric car vs petrol car running cost per km, monthly savings, and payback period on home electricity tariffs across India.',
      h1: 'EV vs Petrol Calculator',
      subtitle: 'Compare electricity charging versus petrol fuel expenses to calculate real monthly savings and upfront vehicle price payback.',
    },
    ui: {
      evVsIceParams: 'EV vs ICE Parameters',
      greenMobilityTco: 'Green Mobility TCO',
      expectedMonthlyDriving: 'Expected Monthly Driving',
      kmPerMonth: 'km/month',
      petrolIce: 'Petrol ICE',
      electricEv: 'Electric (EV)',
      petrolPrice: 'Petrol Price (₹/L)',
      iceMileage: 'ICE Mileage (km/L)',
      powerTariff: 'Power Tariff (₹/kWh)',
      evEfficiency: 'EV Efficiency (km/kWh)',
      evUpfrontPricePremium: 'EV Upfront Price Premium over ICE (₹)',
      upfrontPriceHint: 'Include state EV subsidy deductions, registration tax exemptions (0% road tax in many Indian states).',
      annualFuelSavings: 'Annual Fuel Savings',
      savePercent: 'Save ~85% on Fuel',
      perYear: '/ year',
      monthlyInPocketSavings: 'Monthly in-pocket savings:',
      perMonth: '/month',
      petrolCostPerKm: 'Petrol Cost/Km',
      evElectricityPerKm: 'EV Electricity/Km',
      upfrontPriceBreakeven: 'Upfront Price Breakeven:',
      years: 'Years',
      breakevenFootnote: 'Based on your {monthlyKm} km/month driving pattern and home charging rates.',
      realWorldNuanceTitle: 'Real World Nuance',
      realWorldNuanceDesc: 'Highway fast-charging (DC 50kW+) in India typically costs ₹18 to ₹24 per unit (including GST and convenience fees), raising EV cost per km to ~₹3.00/km on outstation trips. However, 85-90% of typical personal charging happens at home overnight at domestic DISCOM rates.',
      resultSummaryTitle: 'Electric Vehicle (EV) vs Petrol Economics:',
      monthlyDrivingText: 'Monthly Driving',
      petrolRunningCostText: 'Petrol Running Cost',
      evRunningCostText: 'EV Running Cost',
      netMonthlySavingsText: 'Net Monthly Savings with EV',
      annualEnergySavingsText: 'Annual Energy Savings',
      breakevenDistanceText: 'Breakeven Distance',
      calculatedOn: 'Calculated via IndiaTools',
    },
    formulaExplanation: 'Petrol Cost/km = Petrol Price ÷ Mileage. EV Cost/km = Electricity Tariff ÷ Efficiency (km/kWh). Monthly Savings = Monthly km × (Petrol Cost/km - EV Cost/km). Breakeven km = Upfront Price Premium ÷ (Petrol Cost/km - EV Cost/km). Breakeven Years = Breakeven km ÷ (Monthly km × 12).',
    assumptions: [
      'Overnight home charging on domestic slab tariffs.',
      'Excludes home solar charging which reduces EV running cost close to ₹0.20/km.',
    ],
    example: {
      title: 'Compact EV (e.g., Tata Tiago/Punch EV) vs Petrol',
      inputs: {
        'Monthly Distance': '1,500 km',
        'Petrol Price': '₹102/L (14 km/L)',
        'Electricity Tariff': '₹8.50/kWh (7.5 km/kWh)',
        'EV Premium': '₹3,50,000',
      },
      outputs: {
        'Petrol Cost/km': '₹7.29 / km',
        'EV Cost/km': '₹1.13 / km',
        'Monthly Fuel Savings': '₹9,240',
        'Breakeven Time': '3.2 Years',
      },
      explanation: 'Running cost drops from ₹7.29/km to ₹1.13/km, saving ₹9,240 every month. The ₹3.5 Lakh price difference is recovered in 3.2 years.',
    },
    faqs: [
      {
        question: 'How much does it cost to charge an electric car at home in India?',
        answer: 'A typical 30-40 kWh battery (Tata Tiago/Nexon EV) takes 30-40 units of electricity. At ₹7-9/unit domestic tariff, a full charge costs around ₹250 to ₹350 for 250-300 km real-world range.',
      },
      {
        question: 'What is the EV battery replacement cost after 8 years?',
        answer: 'Most Indian EVs provide an 8-year or 1,60,000 km battery warranty. Battery pack prices are dropping ~10% annually with localized lithium iron phosphate (LFP) production.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'ഇവി vs പെട്രോൾ കാർ കാൽക്കുലേറ്റർ | ഓട്ടച്ചെലവ്, ലാഭം & ROI | IndiaTools',
      metaDescription: 'ഇലക്ട്രിക് കാറും പെട്രോൾ കാറും തമ്മിലുള്ള കിലോമീറ്റർ നിരക്ക്, പ്രതിമാസ ലാഭം, ഇവി വില വ്യത്യാസം തിരിച്ചുപിടിക്കാനുള്ള കാലയളവ് എന്നിവ അറിയുക.',
      h1: 'ഇവി vs പെട്രോൾ കാൽക്കുലേറ്റർ',
      subtitle: 'വീട്ടിലെ വൈദ്യുതി ചാർജിംഗും പെട്രോൾ ഇന്ധനച്ചെലവും തമ്മിൽ താരതമ്യം ചെയ്ത് യഥാർത്ഥ പ്രതിമാസ ലാഭം കണക്കാക്കുക.',
    },
    ui: {
      evVsIceParams: 'ഇവി vs പെട്രോൾ വിവരങ്ങൾ',
      greenMobilityTco: 'ഹരിത വാഹന ഉടമസ്ഥതാ മോഡൽ',
      expectedMonthlyDriving: 'പ്രതിമാസ ഓട്ടം (കിലോമീറ്റർ)',
      kmPerMonth: 'കി.മീ/മാസം',
      petrolIce: 'പെട്രോൾ കാർ',
      electricEv: 'ഇലക്ട്രിക് (ഇവി)',
      petrolPrice: 'പെട്രോൾ വില (₹/ലി)',
      iceMileage: 'പെട്രോൾ മൈലേജ് (കി.മീ/ലി)',
      powerTariff: 'വൈദ്യുതി നിരക്ക് (₹/യൂണിറ്റ്)',
      evEfficiency: 'ഇവി കാര്യക്ഷമത (കി.മീ/യൂണിറ്റ്)',
      evUpfrontPricePremium: 'ഇവിക്ക് അധികമായി നൽകേണ്ട വില (₹)',
      upfrontPriceHint: 'സംസ്ഥാന റോഡ് ടാക്സ് ഇളവുകളും സബ്സിഡികളും കണക്കിലെടുത്ത് നൽകുക.',
      annualFuelSavings: 'വാർഷിക ഇന്ധന ലാഭം',
      savePercent: '~85% ഇന്ധനച്ചെലവ് കുറവ്',
      perYear: '/ വർഷം',
      monthlyInPocketSavings: 'പ്രതിമാസം കൈയിൽ മിച്ചം പിടിക്കുന്നത്:',
      perMonth: '/മാസം',
      petrolCostPerKm: 'പെട്രോൾ കി.മീ നിരക്ക്',
      evElectricityPerKm: 'ഇവി വൈദ്യുതി നിരക്ക്/കി.മീ',
      upfrontPriceBreakeven: 'അധിക വില വീണ്ടെടുക്കൽ കാലയളവ്:',
      years: 'വർഷം',
      breakevenFootnote: 'നിങ്ങളുടെ പ്രതിമാസം {monthlyKm} കി.മീ ഓട്ടവും ഗാർഹിക വൈദ്യുതി ചാർജിംഗും അടിസ്ഥാനമാക്കി.',
      realWorldNuanceTitle: 'യാഥാർത്ഥ്യങ്ങൾ',
      realWorldNuanceDesc: 'ഹൈവേ ഫാസ്റ്റ് ചാർജിംഗിന് യൂണിറ്റിന് ₹18 മുതൽ ₹24 വരെ ഈടാക്കാം, എന്നാൽ 85-90% ചാർജിംഗും രാത്രികളിൽ വീട്ടിൽ കുറഞ്ഞ നിരക്കിലാണ് നടക്കുന്നത്.',
      resultSummaryTitle: 'ഇവി vs പെട്രോൾ സാമ്പത്തിക വിശകലനം:',
      monthlyDrivingText: 'പ്രതിമാസ ഓട്ടം',
      petrolRunningCostText: 'പെട്രോൾ ഓട്ടച്ചെലവ്',
      evRunningCostText: 'ഇവി ഓട്ടച്ചെലവ്',
      netMonthlySavingsText: 'ഇവി വഴിയുള്ള പ്രതിമാസ ലാഭം',
      annualEnergySavingsText: 'വാർഷിക ഊർജ്ജ ലാഭം',
      breakevenDistanceText: 'ബ്രേക്ക്ഈവൻ ദൂരം',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'പെട്രോൾ നിരക്ക് = പെട്രോൾ വില ÷ മൈലേജ്. ഇവി നിരക്ക് = വൈദ്യുതി നിരക്ക് ÷ ഇവി കാര്യക്ഷമത. മാസ ലാഭം = മാസ ദൂരം × (പെട്രോൾ നിരക്ക് - ഇവി നിരക്ക്). ബ്രേക്ക്ഈവൻ ദൂരം = അധിക വില ÷ കിലോമീറ്റർ ലാഭം.',
    assumptions: ['ഗാർഹിക വൈദ്യുതി ഉപയോഗിച്ച് വീട്ടിൽ നിന്നുള്ള ചാർജിംഗ്.'],
    example: {
      title: 'കോംപാക്ട് ഇവി vs പെട്രോൾ താരതമ്യം',
      inputs: {
        'മാസ ഓട്ടം': '1,500 കി.മീ',
        'പെട്രോൾ വില': '₹102/ലി (14 കി.മീ/ലി)',
        'വൈദ്യുതി നിരക്ക്': '₹8.50/യൂണിറ്റ് (7.5 കി.മീ/യൂണിറ്റ്)',
        'ഇവി അധിക വില': '₹3,50,000',
      },
      outputs: {
        'പെട്രോൾ നിരക്ക്': '₹7.29 / കി.മീ',
        'ഇവി നിരക്ക്': '₹1.13 / കി.മീ',
        'മാസ ലാഭം': '₹9,240',
        'കാലയളവ്': '3.2 വർഷം',
      },
      explanation: 'കിലോമീറ്റർ നിരക്ക് ₹7.29-ൽ നിന്ന് ₹1.13 ആയി കുറയുന്നു. മാസം ₹9,240 ലാഭിക്കുന്നതിലൂടെ 3.2 വർഷം കൊണ്ട് അധിക വില പൂർണ്ണമായും തിരിച്ചുകിട്ടുന്നു.',
    },
    faqs: [
      {
        question: 'വീട്ടിൽ വെച്ച് ഇവി കാർ ചാർജ് ചെയ്യാൻ എത്ര രൂപ ചിലവാകും?',
        answer: '30 യൂണിറ്റ് വൈദ്യുതി ഉപയോഗിക്കുന്ന ഒരു കാറിന് വീട്ടിൽ ചാർജ് ചെയ്യാൻ ഏകദേശം ₹250 മുതൽ ₹350 വരെ മാത്രമാണ് ചെലവ് വരുന്നത്. ഇതിൽ 250 കി.മീറ്ററിലധികം യാത്ര ചെയ്യാം.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'ईवी बनाम पेट्रोल कार कैलकुलेटर | रनिंग कॉस्ट, बचत व आरओआई | IndiaTools',
      metaDescription: 'इलेक्ट्रिक कार और पेट्रोल कार की प्रति किमी लागत, मासिक बचत और अतिरिक्त कीमत की भरपाई का समय तुरंत जानें।',
      h1: 'ईवी बनाम पेट्रोल कैलकुलेटर',
      subtitle: 'घर की बिजली दर और पेट्रोल खर्च की तुलना करके अपनी वास्तविक मासिक बचत और ब्रेक-इवन अवधि जानें।',
    },
    ui: {
      evVsIceParams: 'ईवी बनाम पेट्रोल पैरामीटर',
      greenMobilityTco: 'ग्रीन मोबिलिटी टीसीओ',
      expectedMonthlyDriving: 'अपेक्षित मासिक ड्राइविंग',
      kmPerMonth: 'किमी/माह',
      petrolIce: 'पेट्रोल कार',
      electricEv: 'इलेक्ट्रिक (ईवी)',
      petrolPrice: 'पेट्रोल दर (₹/ली)',
      iceMileage: 'पेट्रोल माइलेज (किमी/ली)',
      powerTariff: 'बिजली दर (₹/kWh)',
      evEfficiency: 'ईवी माइलेज (किमी/kWh)',
      evUpfrontPricePremium: 'ईवी की अतिरिक्त शोरूम कीमत (₹)',
      upfrontPriceHint: 'राज्य स्तरीय सब्सिडी व रोड टैक्स छूट शामिल करें।',
      annualFuelSavings: 'वार्षिक ईंधन बचत',
      savePercent: 'ईंधन पर ~85% की बचत',
      perYear: '/ वर्ष',
      monthlyInPocketSavings: 'मासिक जेब की सीधी बचत:',
      perMonth: '/माह',
      petrolCostPerKm: 'पेट्रोल लागत/किमी',
      evElectricityPerKm: 'ईवी बिजली लागत/किमी',
      upfrontPriceBreakeven: 'अतिरिक्त कीमत वसूली अवधि:',
      years: 'वर्ष',
      breakevenFootnote: 'आपके {monthlyKm} किमी/माह आवागमन और घरेलू बिजली दरों पर आधारित।',
      realWorldNuanceTitle: 'व्यावहारिक सच्चाई',
      realWorldNuanceDesc: 'हाईवे फास्ट चार्जिंग ₹18-24 प्रति यूनिट पड़ती है, लेकिन 85-90% चार्जिंग घर पर सस्ती घरेलू दरों पर ही होती है।',
      resultSummaryTitle: 'ईवी बनाम पेट्रोल वित्तीय तुलना:',
      monthlyDrivingText: 'मासिक आवागमन',
      petrolRunningCostText: 'पेट्रोल रनिंग कॉस्ट',
      evRunningCostText: 'ईवी रनिंग कॉस्ट',
      netMonthlySavingsText: 'ईवी से मासिक बचत',
      annualEnergySavingsText: 'वार्षिक ऊर्जा बचत',
      breakevenDistanceText: 'ब्रेक-इवन दूरी',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'पेट्रोल लागत = पेट्रोल भाव ÷ माइलेज। ईवी लागत = बिजली भाव ÷ दक्षता। मासिक बचत = मासिक किमी × (पेट्रोल दर - ईवी दर)।',
    assumptions: ['घरेलू बिजली कनेक्शन पर रात की चार्जिंग।'],
    example: {
      title: 'कॉम्पैक्ट ईवी बनाम पेट्रोल तुलना',
      inputs: {
        'मासिक दूरी': '1,500 किमी',
        'पेट्रोल भाव': '₹102/ली (14 किमी/ली)',
        'बिजली दर': '₹8.50/यूनिट (7.5 किमी/यूनिट)',
        'ईवी अतिरिक्त कीमत': '₹3,50,000',
      },
      outputs: {
        'पेट्रोल लागत': '₹7.29 / किमी',
        'ईवी लागत': '₹1.13 / किमी',
        'मासिक बचत': '₹9,240',
        'अवधि': '3.2 वर्ष',
      },
      explanation: 'रनिंग कॉस्ट ₹7.29 से घटकर केवल ₹1.13/किमी रह जाती है, जिससे 3.2 वर्षों में अतिरिक्त कीमत वसूल हो जाती है।',
    },
    faqs: [
      {
        question: 'घर पर इलेक्ट्रिक कार चार्ज करने में कितना खर्च आता है?',
        answer: 'एक फुल चार्ज में 30-35 यूनिट बिजली लगती है, जिसका खर्च ₹250-₹350 आता है और कार 250+ किमी चलती है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'மின்சார கார் vs பெட்ரோல் கால்குலேட்டர் | சேமிப்பு & ROI | IndiaTools',
      metaDescription: 'மின்சார கார் (EV) மற்றும் பெட்ரோல் காரின் கி.மீ செலவு, மாத சேமிப்பு மற்றும் கூடுதல் விலையை ஈடுகட்டும் காலத்தை அறியுங்கள்.',
      h1: 'மின்சார கார் vs பெட்ரோல் கால்குலேட்டர்',
      subtitle: 'வீட்டு மின்சார கட்டணம் மற்றும் பெட்ரோல் விலையை ஒப்பிட்டு உண்மையான மாத சேமிப்பை கணக்கிடுங்கள்.',
    },
    ui: {
      evVsIceParams: 'EV vs பெட்ரோல் உள்ளீடுகள்',
      greenMobilityTco: 'பசுமை இயக்க மாதிரி',
      expectedMonthlyDriving: 'எதிர்பார்க்கப்படும் மாதாந்திர ஓட்டம்',
      kmPerMonth: 'கி.மீ/மாதம்',
      petrolIce: 'பெட்ரோல் கார்',
      electricEv: 'மின்சார கார் (EV)',
      petrolPrice: 'பெட்ரோல் விலை (₹/லி)',
      iceMileage: 'பெட்ரோல் மைலேஜ் (கி.மீ/லி)',
      powerTariff: 'மின் கட்டணம் (₹/யூனிட்)',
      evEfficiency: 'EV செயல்திறன் (கி.மீ/யூனிட்)',
      evUpfrontPricePremium: 'EV-க்கான கூடுதல் விலை (₹)',
      upfrontPriceHint: 'மாநில சாலை வரி விலக்கு மற்றும் மானியங்களை கழித்து உள்ளிடவும்.',
      annualFuelSavings: 'வருடாந்திர எரிபொருள் சேமிப்பு',
      savePercent: '~85% எரிபொருள் செலவு குறைவு',
      perYear: '/ ஆண்டு',
      monthlyInPocketSavings: 'மாதாந்திர நேரடி சேமிப்பு:',
      perMonth: '/மாதம்',
      petrolCostPerKm: 'பெட்ரோல் கி.மீ செலவு',
      evElectricityPerKm: 'EV மின்சார செலவு/கி.மீ',
      upfrontPriceBreakeven: 'கூடுதல் விலை மீட்புக் காலம்:',
      years: 'ஆண்டுகள்',
      breakevenFootnote: 'உங்கள் மாத {monthlyKm} கி.மீ பயன்பாடு மற்றும் வீட்டு மின்சார கட்டணத்தின் அடிப்படையில்.',
      realWorldNuanceTitle: 'நடைமுறை உண்மை',
      realWorldNuanceDesc: 'நெடுஞ்சாலைகளில் பாஸ்ட் சார்ஜிங் அதிக விலை என்றாலும், 85-90% சார்ஜிங் வீட்டிலேயே குறைந்த கட்டணத்தில் நடக்கிறது.',
      resultSummaryTitle: 'EV vs பெட்ரோல் நிதி ஒப்பீடு:',
      monthlyDrivingText: 'மாதாந்திர பயன்பாடு',
      petrolRunningCostText: 'பெட்ரோல் ஓட்டச் செலவு',
      evRunningCostText: 'EV ஓட்டச் செலவு',
      netMonthlySavingsText: 'EV மூலம் மாத சேமிப்பு',
      annualEnergySavingsText: 'வருடாந்திர ஆற்றல் சேமிப்பு',
      breakevenDistanceText: 'பிரேக்-ஈவன் தூரம்',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'பெட்ரோல் செலவு = விலை ÷ மைலேஜ். EV செலவு = மின் கட்டணம் ÷ திறன். மாத சேமிப்பு = தூரம் × (பெட்ரோல் செலவு - EV செலவு).',
    assumptions: ['வீட்டு மின்சாரத்தில் இரவில் சார்ஜ் செய்யப்படுகிறது.'],
    example: {
      title: 'EV vs பெட்ரோல் ஒப்பீடு',
      inputs: {
        'மாத தூரம்': '1,500 கி.மீ',
        'பெட்ரோல் விலை': '₹102/லி (14 கி.மீ/லி)',
        'மின் கட்டணம்': '₹8.50/யூனிட் (7.5 கி.மீ/யூனிட்)',
        'EV கூடுதல் விலை': '₹3,50,000',
      },
      outputs: {
        'பெட்ரோல் செலவு': '₹7.29 / கி.மீ',
        'EV செலவு': '₹1.13 / கி.மீ',
        'மாத சேமிப்பு': '₹9,240',
        'காலம்': '3.2 ஆண்டுகள்',
      },
      explanation: 'கி.மீ செலவு ₹7.29 இலிருந்து ₹1.13 ஆகக் குறைகிறது. மாதம் ₹9,240 மிச்சமாவதன் மூலம் 3.2 ஆண்டுகளில் கூடுதல் விலை சரிகட்டப்படும்.',
    },
    faqs: [
      {
        question: 'வீட்டில் EV கார் சார்ஜ் செய்ய எவ்வளவு செலவாகும்?',
        answer: 'ஒரு முழு சார்ஜிற்கு 30-35 யூனிட் மின்சாரம் தேவைப்படும், இதற்கு ₹250-₹350 மட்டுமே செலவாகிறது.',
      },
    ],
  },
  te: {
    meta: {
      title: 'ఈవీ vs పెట్రోల్ కారు కాలిక్యులేటర్ | రన్నింగ్ ఖర్చు, పొదుపు & ROI | IndiaTools',
      metaDescription: 'ఎలక్ట్రిక్ కారు మరియు పెట్రోల్ కారు రన్నింగ్ ఖర్చు, నెలవారీ పొదుపు మరియు అదనపు ధర రికవరీ సమయాన్ని సులభంగా లెక్కించండి.',
      h1: 'ఈవీ vs పెట్రోల్ కాలిక్యులేటర్',
      subtitle: 'ఇంటి విద్యుత్ ఛార్జింగ్ మరియు పెట్రోల్ ఖర్చులను పోల్చి మీ నిజమైన నెలవారీ పొదుపును తెలుసుకోండి.',
    },
    ui: {
      evVsIceParams: 'ఈవీ vs పెట్రోల్ వివరాలు',
      greenMobilityTco: 'గ్రీన్ మొబిలిటీ TCO',
      expectedMonthlyDriving: 'అంచనా నెలవారీ ప్రయాణం',
      kmPerMonth: 'కి.మీ/నెల',
      petrolIce: 'పెట్రోల్ కారు',
      electricEv: 'ఎలక్ట్రిక్ (ఈవీ)',
      petrolPrice: 'పెట్రోల్ ధర (₹/లీ)',
      iceMileage: 'పెట్రోల్ మైలేజ్ (కి.మీ/లీ)',
      powerTariff: 'కరెంట్ ఛార్జ్ (₹/యూనిట్)',
      evEfficiency: 'ఈవీ సామర్థ్యం (కి.మీ/యూనిట్)',
      evUpfrontPricePremium: 'ఈవీ అదనపు షోరూమ్ ధర (₹)',
      upfrontPriceHint: 'రాష్ట్ర రోడ్ టాక్స్ మినహాయింపులు మరియు సబ్సిడీలను చేర్చండి.',
      annualFuelSavings: 'వార్షిక ఇంధన పొదుపు',
      savePercent: '~85% ఇంధన ఖర్చు ఆదా',
      perYear: '/ సంవత్సరం',
      monthlyInPocketSavings: 'నెలవారీ ప్రత్యక్ష పొదుపు:',
      perMonth: '/నెల',
      petrolCostPerKm: 'పెట్రోల్ కి.మీ ఖర్చు',
      evElectricityPerKm: 'ఈవీ కరెంట్ ఖర్చు/కి.మీ',
      upfrontPriceBreakeven: 'అదనపు ధర రికవరీ కాలం:',
      years: 'సంవత్సరాలు',
      breakevenFootnote: 'మీ నెలవారీ {monthlyKm} కి.మీ ప్రయాణం మరియు ఇంటి విద్యుత్ ధరల ఆధారంగా.',
      realWorldNuanceTitle: 'ఆచరణాత్మక వాస్తవం',
      realWorldNuanceDesc: 'హైవే ఫాస్ట్ ఛార్జింగ్ యూనిట్‌కు ₹18-24 ఉన్నప్పటికీ, 85-90% ఛార్జింగ్ రాత్రిపూట ఇంట్లోనే తక్కువ ధరలో జరుగుతుంది.',
      resultSummaryTitle: 'ఈవీ vs పెట్రోల్ ఆర్థిక విశ్లేషణ:',
      monthlyDrivingText: 'నెలవారీ ప్రయాణం',
      petrolRunningCostText: 'పెట్రోల్ రన్నింగ్ ఖర్చు',
      evRunningCostText: 'ఈవీ రన్నింగ్ ఖర్చు',
      netMonthlySavingsText: 'ఈవీతో నెలవారీ పొదుపు',
      annualEnergySavingsText: 'వార్షిక విద్యుత్ పొదుపు',
      breakevenDistanceText: 'బ్రేక్-ఈవెన్ దూరం',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'పెట్రోల్ ఖర్చు = ధర ÷ మైలేజ్. ఈవీ ఖర్చు = విద్యుత్ రేటు ÷ సామర్థ్యం. నెలవారీ పొదుపు = దూరం × (పెట్రోల్ ఖర్చు - ఈవీ ఖర్చు).',
    assumptions: ['రాత్రిపూట ఇంటి విద్యుత్ ఛార్జింగ్.'],
    example: {
      title: 'ఈవీ vs పెట్రోల్ పోలిక',
      inputs: {
        'నెల దూరం': '1,500 కి.మీ',
        'పెట్రోల్ ధర': '₹102/లీ (14 కి.మీ/లీ)',
        'కరెంట్ రేటు': '₹8.50/యూనిట్ (7.5 కి.మీ/యూనిట్)',
        'ఈవీ అదనపు ధర': '₹3,50,000',
      },
      outputs: {
        'పెట్రోల్ ఖర్చు': '₹7.29 / కి.మీ',
        'ఈవీ ఖర్చు': '₹1.13 / కి.మీ',
        'నెల పొదుపు': '₹9,240',
        'సమయం': '3.2 సంవత్సరాలు',
      },
      explanation: 'కిలోమీటరు ఖర్చు ₹7.29 నుండి ₹1.13 కి తగ్గుతుంది. నెలకు ₹9,240 ఆదా అవ్వడం ద్వారా 3.2 ఏళ్లలో అదనపు ధర రికవర్ అవుతుంది.',
    },
    faqs: [
      {
        question: 'ఇంట్లో ఈవీ కారు ఛార్జ్ చేయడానికి ఎంత ఖర్చవుతుంది?',
        answer: 'ఒక ఫుల్ ఛార్జ్ కోసం 30-35 యూనిట్లు ఖర్చవుతాయి, అంటే సుమారు ₹250-₹350 మాత్రమే అవుతుంది.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಇವಿ vs ಪೆಟ್ರೋಲ್ ಕಾರು ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ಚಾಲನಾ ವೆಚ್ಚ, ಉಳಿತಾಯ & ROI | IndiaTools',
      metaDescription: 'ಎಲೆಕ್ಟ್ರಿಕ್ ಕಾರು ಮತ್ತು ಪೆಟ್ರೋಲ್ ಕಾರಿನ ಕಿ.ಮೀ ದರ, ಮಾಸಿಕ ಉಳಿತಾಯ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಬೆಲೆ ಸರಿದೂಗಿಸುವ ಅವಧಿಯನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
      h1: 'ಇವಿ vs ಪೆಟ್ರೋಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಮನೆಯ ವಿದ್ಯುತ್ ದರ ಮತ್ತು ಪೆಟ್ರೋಲ್ ವೆಚ್ಚವನ್ನು ಹೋಲಿಸಿ ನೈಜ ಮಾಸಿಕ ಉಳಿತಾಯ ಮತ್ತು ಬ್ರೇಕ್-ಈವನ್ ಅವಧಿ ತಿಳಿಯಿರಿ.',
    },
    ui: {
      evVsIceParams: 'ಇವಿ vs ಪೆಟ್ರೋಲ್ ವಿವರಗಳು',
      greenMobilityTco: 'ಗ್ರೀನ್ ಮೊಬಿಲಿಟಿ TCO',
      expectedMonthlyDriving: 'ನಿರೀಕ್ಷಿತ ಮಾಸಿಕ ಚಾಲನೆ',
      kmPerMonth: 'ಕಿ.ಮೀ/ತಿಂಗಳು',
      petrolIce: 'ಪೆಟ್ರೋಲ್ ಕಾರು',
      electricEv: 'ಎಲೆಕ್ಟ್ರಿಕ್ (ಇವಿ)',
      petrolPrice: 'ಪೆಟ್ರೋಲ್ ದರ (₹/ಲೀ)',
      iceMileage: 'ಪೆಟ್ರೋಲ್ ಮೈಲೇಜ್ (ಕಿ.ಮೀ/ಲೀ)',
      powerTariff: 'ವಿದ್ಯುತ್ ದರ (₹/ಯೂನಿಟ್)',
      evEfficiency: 'ಇವಿ ದಕ್ಷತೆ (ಕಿ.ಮೀ/ಯೂನಿಟ್)',
      evUpfrontPricePremium: 'ಇವಿ ಹೆಚ್ಚುವರಿ ಶೋರೂಂ ಬೆಲೆ (₹)',
      upfrontPriceHint: 'ರಾಜ್ಯ ರಸ್ತೆ ತೆರಿಗೆ ವಿನಾಯಿತಿ ಮತ್ತು ಸಬ್ಸಿಡಿಗಳನ್ನು ಕಳೆದು ನಮೂದಿಸಿ.',
      annualFuelSavings: 'ವಾರ್ಷಿಕ ಇಂಧನ ಉಳಿತಾಯ',
      savePercent: '~85% ಇಂಧನ ವೆಚ್ಚ ಕಡಿತ',
      perYear: '/ ವರ್ಷ',
      monthlyInPocketSavings: 'ಮಾಸಿಕ ನೇರ ಉಳಿತಾಯ:',
      perMonth: '/ತಿಂಗಳು',
      petrolCostPerKm: 'ಪೆಟ್ರೋಲ್ ಕಿ.ಮೀ ವೆಚ್ಚ',
      evElectricityPerKm: 'ಇವಿ ವಿದ್ಯುತ್ ವೆಚ್ಚ/ಕಿ.ಮೀ',
      upfrontPriceBreakeven: 'ಹೆಚ್ಚುವರಿ ಬೆಲೆ ಮರುಪಾವತಿ ಅವಧಿ:',
      years: 'ವರ್ಷಗಳು',
      breakevenFootnote: 'ನಿಮ್ಮ ಮಾಸಿಕ {monthlyKm} ಕಿ.ಮೀ ಚಾಲನೆ ಮತ್ತು ಗೃಹ ವಿದ್ಯುತ್ ದರಗಳ ಆಧಾರದ ಮೇಲೆ.',
      realWorldNuanceTitle: 'ವಾಸ್ತವಿಕ ಮಾಹಿತಿ',
      realWorldNuanceDesc: 'ಹೆದ್ದಾರಿಗಳಲ್ಲಿ ವೇಗದ ಚಾರ್ಜಿಂಗ್ ದರ ಹೆಚ್ಚಿದ್ದರೂ, ಶೇ. 85-90 ರಷ್ಟು ಚಾರ್ಜಿಂಗ್ ಮನೆಯಲ್ಲೇ ಕಡಿಮೆ ದರದಲ್ಲಿ ನಡೆಯುತ್ತದೆ.',
      resultSummaryTitle: 'ಇವಿ vs ಪೆಟ್ರೋಲ್ ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ:',
      monthlyDrivingText: 'ಮಾಸಿಕ ಚಾಲನೆ',
      petrolRunningCostText: 'ಪೆಟ್ರೋಲ್ ಚಾಲನಾ ವೆಚ್ಚ',
      evRunningCostText: 'ಇವಿ ಚಾಲನಾ ವೆಚ್ಚ',
      netMonthlySavingsText: 'ಇವಿಯಿಂದ ಮಾಸಿಕ ಉಳಿತಾಯ',
      annualEnergySavingsText: 'ವಾರ್ಷಿಕ ಇಂಧನ ಉಳಿತಾಯ',
      breakevenDistanceText: 'ಬ್ರೇಕ್-ಈವನ್ ದೂರ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಪೆಟ್ರೋಲ್ ವೆಚ್ಚ = ದರ ÷ ಮೈಲೇಜ್. ಇವಿ ವೆಚ್ಚ = ವಿದ್ಯುತ್ ದರ ÷ ದಕ್ಷತೆ. ಮಾಸಿಕ ಉಳಿತಾಯ = ದೂರ × (ಪೆಟ್ರೋಲ್ ವೆಚ್ಚ - ಇವಿ ವೆಚ್ಚ).',
    assumptions: ['ಮನೆಯಲ್ಲಿ ರಾತ್ರಿಯ ವೇಳೆ ಚಾರ್ಜ್ ಮಾಡುವುದು.'],
    example: {
      title: 'ಇವಿ vs ಪೆಟ್ರೋಲ್ ಹೋಲಿಕೆ',
      inputs: {
        'ಮಾಸಿಕ ದೂರ': '1,500 ಕಿ.ಮೀ',
        'ಪೆಟ್ರೋಲ್ ಬೆಲೆ': '₹102/ಲೀ (14 ಕಿ.ಮೀ/ಲೀ)',
        'ವಿದ್ಯುತ್ ದರ': '₹8.50/ಯೂನಿಟ್ (7.5 ಕಿ.ಮೀ/ಯೂನಿಟ್)',
        'ಇವಿ ಹೆಚ್ಚುವರಿ ಬೆಲೆ': '₹3,50,000',
      },
      outputs: {
        'ಪೆಟ್ರೋಲ್ ವೆಚ್ಚ': '₹7.29 / ಕಿ.ಮೀ',
        'ಇವಿ ವೆಚ್ಚ': '₹1.13 / ಕಿ.ಮೀ',
        'ಮಾಸಿಕ ಉಳಿತಾಯ': '₹9,240',
        'ಅವಧಿ': '3.2 ವರ್ಷಗಳು',
      },
      explanation: 'ಕಿಲೋಮೀಟರ್ ದರ ₹7.29 ರಿಂದ ₹1.13 ಕ್ಕೆ ಇಳಿಯುತ್ತದೆ. ತಿಂಗಳಿಗೆ ₹9,240 ಉಳಿತಾಯದೊಂದಿಗೆ 3.2 ವರ್ಷಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ ಬೆಲೆ ಸರಿದೂಗುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ಮನೆಯಲ್ಲಿ ಇವಿ ಕಾರು ಚಾರ್ಜ್ ಮಾಡಲು ಎಷ್ಟು ಖರ್ಚಾಗುತ್ತದೆ?',
        answer: 'ಒಂದು ಪೂರ್ಣ ಚಾರ್ಜ್‌ಗೆ 30-35 ಯೂನಿಟ್ ವಿದ್ಯುತ್ ಸಾಕಾಗುತ್ತದೆ, ಅಂದರೆ ಸುಮಾರು ₹250-₹350 ಮಾತ್ರ ತಗಲುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('ev-vs-petrol', evVsPetrolTranslations)
