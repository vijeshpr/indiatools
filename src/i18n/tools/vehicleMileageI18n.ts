import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface VehicleMileageUI {
  tripRefuelingData: string
  tankToTankMethod: string
  distanceTraveled: string
  fuelRefilled: string
  litres: string
  currentFuelPrice: string
  petrolQuick: string
  dieselQuick: string
  cngQuick: string
  cityGuide: string
  highwayGuide: string
  longTourGuide: string
  fuelEconomyAnalytics: string
  calculatedMileage: string
  costPerKm: string
  perKilometer: string
  costFor100Km: string
  totalFuelSpend: string
  tyreAdvice: string
  resultSummaryTitle: string
  runningCostText: string
  costFor100KmText: string
  ratingText: string
  calculatedOn: string
  exceptionalRating: string
  goodRating: string
  moderateRating: string
  heavyRating: string
  invalidInputsRating: string
}

export const vehicleMileageTranslations: ToolLocaleMap<VehicleMileageUI> = {
  en: {
    meta: {
      title: 'Vehicle Mileage & Fuel Cost per Km Calculator | IndiaTools',
      metaDescription: 'Accurately calculate your car or bike mileage (km/L) and cost per kilometer with current Indian petrol and diesel prices. Free, fast, and instant.',
      h1: 'Vehicle Mileage & Fuel Cost Calculator',
      subtitle: 'Calculate exact vehicle mileage (km/L) and running cost per kilometer using the accurate tank-to-tank method. Free and 100% private.',
    },
    ui: {
      tripRefuelingData: 'Trip & Refueling Data',
      tankToTankMethod: 'Tank-to-Tank Method',
      distanceTraveled: 'Distance Traveled (Trip Meter)',
      fuelRefilled: 'Fuel Refilled / Consumed',
      litres: 'Litres',
      currentFuelPrice: 'Current Fuel Price (₹ / Litre)',
      petrolQuick: 'Petrol (~₹102)',
      dieselQuick: 'Diesel (~₹90)',
      cngQuick: 'CNG (~₹85/kg)',
      cityGuide: '50 km (City)',
      highwayGuide: '450 km (Highway)',
      longTourGuide: '1000+ km (Long Tour)',
      fuelEconomyAnalytics: 'Fuel Economy Analytics',
      calculatedMileage: 'Calculated Fuel Mileage',
      costPerKm: 'Cost / Km',
      perKilometer: 'per kilometer',
      costFor100Km: 'Cost for 100 Km',
      totalFuelSpend: 'Total Fuel Paid for this Trip:',
      tyreAdvice: 'Keep tyre pressure at manufacturer recommended PSI (typically 32-35 PSI) and maintain steady 70-80 km/h on highways to maximize mileage.',
      resultSummaryTitle: 'Vehicle Mileage Result:',
      runningCostText: 'Running Cost:',
      costFor100KmText: 'Cost for 100 km:',
      ratingText: 'Rating:',
      calculatedOn: 'Calculated on IndiaTools',
      exceptionalRating: 'Exceptional Fuel Economy (Hatchback/Hybrid/Bike)',
      goodRating: 'Good Highway / Sedan Economy',
      moderateRating: 'Moderate City / Compact SUV Economy',
      heavyRating: 'Heavy Fuel Consumption (Full-size SUV / Heavy Traffic)',
      invalidInputsRating: 'Enter valid distance and fuel',
    },
    formulaExplanation: 'Mileage (km/L) = Total Distance Travelled (km) ÷ Fuel Consumed (Litres). Fuel Cost per km (₹/km) = Fuel Price per Litre ÷ Mileage (km/L).',
    assumptions: ['Best measured via full-tank to full-tank method', 'City vs highway conditions fluctuate by 15-25%'],
    example: {
      title: 'Hatchback City Commute',
      inputs: { 'Distance': '450 km', 'Fuel Filled': '25 Litres', 'Petrol Price': '₹102 / Litre' },
      outputs: { 'Mileage': '18.00 km/L', 'Cost Per Km': '₹5.67 / km', 'Cost per 100km': '₹566.67' },
      explanation: 'Dividing 450 km by 25 litres yields 18 km/L. At ₹102/L, running 1 km costs ₹5.67.',
    },
    faqs: [
      {
        question: 'What is the most accurate way to calculate vehicle mileage in India?',
        answer: 'The tank-to-tank method: Fill your tank to auto-cut off, reset trip meter to 0. Drive regularly until at least half-tank is consumed. Refill to auto-cut off at the same pump. Divide the trip meter distance by the new fuel volume filled.',
      },
      {
        question: 'Why does my real mileage differ from ARAI claimed mileage?',
        answer: 'ARAI ratings are derived in laboratory test conditions with zero wind, no AC, and gentle speeds. Real-world Indian traffic with stop-and-go driving and air-conditioning is typically 15% to 30% lower.',
      },
    ],
  },

  ml: {
    meta: {
      title: 'വാഹന മൈലേജ് & ഇന്ധന ചിലവ് കാൽക്കുലേറ്റർ | IndiaTools',
      metaDescription: 'നിങ്ങളുടെ കാറിന്റെയോ ബൈക്കിന്റെയോ മൈലേജും (km/L) ഒരു കിലോമീറ്ററിനുള്ള ഇന്ധന ചിലവും കൃത്യമായി കണക്കാക്കുക. വേഗത്തിലും സൗജന്യമായും.',
      h1: 'വാഹന മൈലേജ് & ഇന്ധന ചിലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ടാങ്ക് ടു ടാങ്ക് രീതി ഉപയോഗിച്ച് വാഹനത്തിന്റെ കൃത്യമായ മൈലേജും കിലോമീറ്റർ ചിലവും ലളിതമായി കണക്കാക്കുക.',
    },
    ui: {
      tripRefuelingData: 'യാത്ര & ഇന്ധന വിവരങ്ങൾ',
      tankToTankMethod: 'ടാങ്ക് ടു ടാങ്ക് രീതി',
      distanceTraveled: 'സഞ്ചരിച്ച ദൂരം (ട്രിപ്പ് മീറ്റർ)',
      fuelRefilled: 'നിറച്ച / ഉപയോഗിച്ച ഇന്ധനം',
      litres: 'ലിറ്റർ',
      currentFuelPrice: 'ഇപ്പോഴത്തെ ഇന്ധനവില (₹ / ലിറ്റർ)',
      petrolQuick: 'പെട്രോൾ (~₹102)',
      dieselQuick: 'ഡീസൽ (~₹90)',
      cngQuick: 'സിഎൻജി (~₹85/kg)',
      cityGuide: '50 കി.മീ (നഗരം)',
      highwayGuide: '450 കി.മീ (ഹൈവേ)',
      longTourGuide: '1000+ കി.മീ (ദീർഘദൂര യാത്ര)',
      fuelEconomyAnalytics: 'ഇന്ധന ക്ഷമത വിശകലനം',
      calculatedMileage: 'കണക്കാക്കിയ മൈലേജ്',
      costPerKm: 'ചിലവ് / കി.മീ',
      perKilometer: 'ഒരു കിലോമീറ്ററിന്',
      costFor100Km: '100 കി.മീറ്ററിനുള്ള ചിലവ്',
      totalFuelSpend: 'ഈ യാത്രയ്ക്കായി ചിലവായ ആകെ ഇന്ധന തുക:',
      tyreAdvice: 'വാഹന നിർമ്മാതാക്കൾ നിർദ്ദേശിച്ച ടയർ പ്രഷർ (32-35 PSI) നിലനിർത്തുകയും ഹൈവേകളിൽ 70-80 കി.മീ വേഗത പാലിക്കുകയും ചെയ്യുന്നത് മൈലേജ് വർദ്ധിപ്പിക്കും.',
      resultSummaryTitle: 'വാഹന മൈലേജ് ഫലം:',
      runningCostText: 'ഓട്ട ചിലവ്:',
      costFor100KmText: '100 കി.മീ ചിലവ്:',
      ratingText: 'റേറ്റിംഗ്:',
      calculatedOn: 'ഇന്ത്യാടൂൾസിൽ കണക്കാക്കിയത്',
      exceptionalRating: 'മികച്ച ഇന്ധനക്ഷമത (ഹാച്ച്ബാക്ക്/ഹൈബ്രിഡ്/ബൈക്ക്)',
      goodRating: 'നല്ല ഹൈവേ / സെഡാൻ ക്ഷമത',
      moderateRating: 'സാധാരണ സിറ്റി / കോംപാക്റ്റ് എസ്‌യുവി ക്ഷമത',
      heavyRating: 'കൂടിയ ഇന്ധന ഉപഭോഗം (വൻകിട എസ്‌യുവി / കനത്ത ട്രാഫിക്)',
      invalidInputsRating: 'ശരിയായ ദൂരവും ഇന്ധന അളവും നൽകുക',
    },
    formulaExplanation: 'മൈലേജ് (km/L) = ആകെ സഞ്ചരിച്ച ദൂരം (km) ÷ ഉപയോഗിച്ച ഇന്ധനം (ലിറ്റർ). കിലോമീറ്റർ ചിലവ് (₹/km) = ലിറ്റർ ഇന്ധനവില ÷ മൈലേജ് (km/L).',
    assumptions: ['ഫുൾ ടാങ്ക് രീതിയാണ് ഏറ്റവും കൃത്യമായ ഫലം നൽകുന്നത്', 'നഗരങ്ങളിലെയും ഹൈവേകളിലെയും മൈലേജ് 15-25% വരെ വ്യത്യാസപ്പെടാം'],
    example: {
      title: 'ഹാച്ച്ബാക്ക് നഗര യാത്ര',
      inputs: { 'ദൂരം': '450 km', 'നിറച്ച ഇന്ധനം': '25 ലിറ്റർ', 'പെട്രോൾ വില': '₹102 / ലിറ്റർ' },
      outputs: { 'മൈലേജ്': '18.00 km/L', 'കി.മീ ചിലവ്': '₹5.67 / km', '100 കി.മീ ചിലവ്': '₹566.67' },
      explanation: '450 കി.മീ 25 ലിറ്റർ കൊണ്ട് ഓടുമ്പോൾ മൈലേജ് 18 km/L ലഭിക്കുന്നു. ലിറ്ററിന് ₹102 നിരക്കിൽ ഒരു കി.മീ ഓടാൻ ₹5.67 ചിലവ് വരുന്നു.',
    },
    faqs: [
      {
        question: 'വാഹനത്തിന്റെ മൈലേജ് കൃത്യമായി കണക്കാക്കാനുള്ള ഏറ്റവും നല്ല മാർഗ്ഗം ഏതാണ്?',
        answer: 'ടാങ്ക്-ടു-ടാങ്ക് രീതി: ടാങ്ക് ഓട്ടോ-കട്ട് ഓഫ് വരെ നിറയ്ക്കുക, ട്രിപ്പ് മീറ്റർ 0 ആക്കുക. കുറഞ്ഞത് പകുതി ടാങ്ക് കഴിയുന്നത് വരെ പതിവുപോലെ ഓടിക്കുക. വീണ്ടും അതേ പമ്പിൽ നിന്ന് ഫുൾ ടാങ്ക് അടിക്കുക. ട്രിപ്പ് മീറ്ററിലെ ദൂരത്തെ പുതുതായി അടിച്ച ഇന്ധന അളവ് കൊണ്ട് ഹരിക്കുക.',
      },
      {
        question: 'കമ്പനി പറയുന്ന ARAI മൈലേജും യഥാർത്ഥ മൈലേജും തമ്മിൽ വ്യത്യാസമുണ്ടാകുന്നത് എന്തുകൊണ്ട്?',
        answer: 'എസി പ്രവർത്തിപ്പിക്കാതെയും കൃത്യമായ വേഗതയിലുമുള്ള ലാബ് പരിശോധനകളിലാണ് ARAI മൈലേജ് കണ്ടെത്തുന്നത്. എസിയും ഗതാഗതക്കുരുക്കുമുള്ള ഇന്ത്യൻ നിരത്തുകളിൽ യഥാർത്ഥ മൈലേജ് 15% മുതൽ 30% വരെ കുറവായിരിക്കും.',
      },
    ],
  },

  hi: {
    meta: {
      title: 'गाड़ी का माइलेज और प्रति किमी ईंधन खर्च कैलकुलेटर | IndiaTools',
      metaDescription: 'अपनी कार या बाइक का माइलेज (km/L) और प्रति किलोमीटर पेट्रोल/डीजल का वास्तविक खर्च तुरंत निकालें। 100% मुफ़्त और सुरक्षित।',
      h1: 'गाड़ी का माइलेज और ईंधन खर्च कैलकुलेटर',
      subtitle: 'टैंक-टू-टैंक विधि से अपनी कार या बाइक का सटीक माइलेज और प्रति किलोमीटर लागत जानें।',
    },
    ui: {
      tripRefuelingData: 'यात्रा और ईंधन डेटा',
      tankToTankMethod: 'टैंक-टू-टैंक विधि',
      distanceTraveled: 'तय की गई दूरी (ट्रिप मीटर)',
      fuelRefilled: 'भरा गया / खर्च हुआ ईंधन',
      litres: 'लीटर',
      currentFuelPrice: 'वर्तमान ईंधन दर (₹ / लीटर)',
      petrolQuick: 'पेट्रोल (~₹102)',
      dieselQuick: 'डीजल (~₹90)',
      cngQuick: 'सीएनजी (~₹85/kg)',
      cityGuide: '50 किमी (शहर)',
      highwayGuide: '450 किमी (हाईवे)',
      longTourGuide: '1000+ किमी (लंबा सफर)',
      fuelEconomyAnalytics: 'माइलेज और खर्च विश्लेषण',
      calculatedMileage: 'निकाला गया माइलेज',
      costPerKm: 'लागत / किमी',
      perKilometer: 'प्रति किलोमीटर',
      costFor100Km: '100 किमी की लागत',
      totalFuelSpend: 'इस सफर में ईंधन पर कुल खर्च:',
      tyreAdvice: 'टायर में सही हवा (32-35 PSI) रखें और हाईवे पर 70-80 किमी/घंटा की स्थिर गति बनाए रखने से माइलेज सबसे अच्छा मिलता है।',
      resultSummaryTitle: 'माइलेज परिणाम:',
      runningCostText: 'प्रति किमी खर्च:',
      costFor100KmText: '100 किमी का खर्च:',
      ratingText: 'रेटिंग:',
      calculatedOn: 'इंडियाटूल्स पर परिकलित',
      exceptionalRating: 'उत्कृष्ट माइलेज (हैचबैक/हाइब्रिड/बाइक)',
      goodRating: 'अच्छा हाईवे / सेडान माइलेज',
      moderateRating: 'सामान्य शहर / कॉम्पैक्ट एसयूवी माइलेज',
      heavyRating: 'भारी ईंधन खपत (बड़ी एसयूवी / भारी ट्रैफिक)',
      invalidInputsRating: 'कृपया सही दूरी और ईंधन मात्रा दर्ज करें',
    },
    formulaExplanation: 'माइलेज (km/L) = कुल दूरी (किमी) ÷ ईंधन की मात्रा (लीटर)। प्रति किमी लागत (₹/किमी) = ईंधन दर ÷ माइलेज।',
    assumptions: ['फुल टैंक से फुल टैंक विधि सबसे सटीक परिणाम देती है', 'शहर और हाईवे के माइलेज में 15-25% का अंतर हो सकता है'],
    example: {
      title: 'हैचबैक सिटी ड्राइव',
      inputs: { 'दूरी': '450 किमी', 'ईंधन': '25 लीटर', 'पेट्रोल दर': '₹102 / लीटर' },
      outputs: { 'माइलेज': '18.00 km/L', 'प्रति किमी खर्च': '₹5.67 / किमी', '100 किमी खर्च': '₹566.67' },
      explanation: '450 किमी दूरी 25 लीटर में तय करने पर 18 km/L का माइलेज मिलता है। ₹102/लीटर की दर पर 1 किमी चलने का खर्च ₹5.67 आता है।',
    },
    faqs: [
      {
        question: 'भारत में गाड़ी का माइलेज नापने का सबसे सही तरीका क्या है?',
        answer: 'टैंक-टू-टैंक तरीका: टंकी को ऑटो-कट तक भरवाएं और ट्रिप मीटर को शून्य करें। कम से कम आधा टैंक खाली होने तक सामान्य रूप से चलाएं। फिर उसी पेट्रोल पंप पर ऑटो-कट तक ईंधन भरवाएं। ट्रिप मीटर की दूरी को नए भरे गए ईंधन के लीटर से भाग दें।',
      },
      {
        question: 'कंपनी द्वारा दावा किए गए ARAI माइलेज से असली माइलेज कम क्यों होता है?',
        answer: 'ARAI माइलेज प्रयोगशाला में बिना हवा और बिना एसी के आदर्श परिस्थितियों में निकाला जाता है। भारतीय ट्रैफिक, सिग्नल और एसी चलने से वास्तविक माइलेज 15% से 30% तक कम मिलता है।',
      },
    ],
  },

  ta: {
    meta: {
      title: 'வாகன மைலேஜ் & கிலோமீட்டர் எரிபொருள் செலவு கால்குலேட்டர் | IndiaTools',
      metaDescription: 'உங்கள் கார் அல்லது பைக்கின் மைலேஜ் (km/L) மற்றும் ஒரு கிலோமீட்டருக்கான எரிபொருள் செலவை துல்லியமாக கணக்கிடுங்கள்.',
      h1: 'வாகன மைலேஜ் & எரிபொருள் செலவு கால்குலேட்டர்',
      subtitle: 'டேங்க்-டு-டேங்க் முறையில் காரின் உண்மையான மைலேஜ் மற்றும் ஒரு கி.மீ ஓடும் செலவை கணக்கிடுங்கள்.',
    },
    ui: {
      tripRefuelingData: 'பயணம் மற்றும் எரிபொருள் விவரம்',
      tankToTankMethod: 'டேங்க்-டு-டேங்க் முறை',
      distanceTraveled: 'பயணித்த தூரம் (டிரிப் மீட்டர்)',
      fuelRefilled: 'நிரப்பிய எரிபொருள்',
      litres: 'லிட்டர்',
      currentFuelPrice: 'தற்போதைய எரிபொருள் விலை (₹ / லிட்டர்)',
      petrolQuick: 'பெட்ரோல் (~₹102)',
      dieselQuick: 'டீசல் (~₹90)',
      cngQuick: 'சிஎன்ஜி (~₹85/kg)',
      cityGuide: '50 கி.மீ (நகரம்)',
      highwayGuide: '450 கி.மீ (நெடுஞ்சாலை)',
      longTourGuide: '1000+ கி.மீ (நீண்ட பயணம்)',
      fuelEconomyAnalytics: 'எரிபொருள் திறன் பகுப்பாய்வு',
      calculatedMileage: 'கணக்கிடப்பட்ட மைலேஜ்',
      costPerKm: 'செலவு / கி.மீ',
      perKilometer: 'ஒரு கிலோமீட்டருக்கு',
      costFor100Km: '100 கி.மீட்டருக்கான செலவு',
      totalFuelSpend: 'இந்த பயணத்திற்கு ஆன மொத்த எரிபொருள் செலவு:',
      tyreAdvice: 'டயர் காற்றழுத்தத்தை பரிந்துரைக்கப்பட்ட அளவில் (32-35 PSI) வைத்திருப்பதும் நெடுஞ்சாலையில் 70-80 கி.மீ சீரான வேகத்தில் செல்வதும் மைலேஜை உயர்த்தும்.',
      resultSummaryTitle: 'வாகன மைலேஜ் முடிவு:',
      runningCostText: 'ஒரு கி.மீ செலவு:',
      costFor100KmText: '100 கி.மீ செலவு:',
      ratingText: 'மதிப்பீடு:',
      calculatedOn: 'இந்தியாடூல்ஸில் கணக்கிடப்பட்டது',
      exceptionalRating: 'சிறப்பான மைலேஜ் (ஹேட்ச்பேக்/ஹைப்ரிட்/பைக்)',
      goodRating: 'நல்ல நெடுஞ்சாலை / செடான் மைலேஜ்',
      moderateRating: 'மிதமான நகர மைலேஜ்',
      heavyRating: 'அதிக எரிபொருள் நுகர்வு (பெரிய எஸ்யூவி / டிராபிக்)',
      invalidInputsRating: 'சரியான தூரம் மற்றும் எரிபொருள் அளவை உள்ளிடவும்',
    },
    formulaExplanation: 'மைலேஜ் (km/L) = மொத்த தூரம் (கி.மீ) ÷ பயன்படுத்திய எரிபொருள் (லிட்டர்). கி.மீ செலவு (₹/கி.மீ) = லிட்டர் விலை ÷ மைலேஜ்.',
    assumptions: ['டேங்க்-டு-டேங்க் முறை மிகத் துல்லியமான முடிவை தரும்', 'நகர மற்றும் நெடுஞ்சாலை மைலேஜ் 15-25% மாறுபடும்'],
    example: {
      title: 'ஹேட்ச்பேக் நகரப் பயணம்',
      inputs: { 'தூரம்': '450 கி.மீ', 'எரிபொருள்': '25 லிட்டர்', 'பெட்ரோல் விலை': '₹102 / லிட்டர்' },
      outputs: { 'மைலேஜ்': '18.00 km/L', 'கி.மீ செலவு': '₹5.67 / கி.மீ', '100 கி.மீ செலவு': '₹566.67' },
      explanation: '450 கி.மீ தூரத்தை 25 லிட்டரில் பயணிக்கும்போது 18 km/L மைலேஜ் கிடைக்கிறது. லிட்டர் ₹102 வீதம் 1 கி.மீ செலவு ₹5.67 ஆகும்.',
    },
    faqs: [
      {
        question: 'வாகன மைலேஜை துல்லியமாக கணக்கிடுவது எப்படி?',
        answer: 'டேங்க்-டு-டேங்க் முறை: டேங்க்கை முழுமையாக நிரப்பி டிரிப் மீட்டரை 0 ஆக்குங்கள். பாதி டேங்க் காலியாகும் வரை வழக்கம் போல ஓட்டுங்கள். மீண்டும் அதே பங்க்கில் முழுமையாக நிரப்புங்கள். டிரிப் மீட்டர் தூரத்தை புதிய லிட்டர் அளவால் வகுக்கவும்.',
      },
      {
        question: 'நிறுவனம் கூறும் ARAI மைலேஜை விட உண்மையான மைலேஜ் குறைவாக இருப்பது ஏன்?',
        answer: 'ARAI சோதனைகள் ஏசி இல்லாமலும் காற்றில்லா ஆய்வக சூழலிலும் செய்யப்படுகின்றன. இந்திய சாலைகளில் டிராபிக் மற்றும் ஏசி பயன்பாட்டால் 15% முதல் 30% வரை மைலேஜ் குறையும்.',
      },
    ],
  },

  te: {
    meta: {
      title: 'వాహన మైలేజ్ & కిలోమీటరు ఇంధన ఖర్చు కాలిక్యులేటర్ | IndiaTools',
      metaDescription: 'మీ కారు లేదా బైక్ మైలేజ్ (km/L) మరియు ప్రతి కిలోమీటరుకు అయ్యే ఇంధన ఖర్చును సులభంగా లెక్కించండి.',
      h1: 'వాహన మైలేజ్ & ఇంధన ఖర్చు కాలిక్యులేటర్',
      subtitle: 'ట్యాంక్-టు-ట్యాంక్ పద్ధతిలో మీ వాహనం యొక్క ఖచ్చితమైన మైలేజ్ మరియు కిలోమీటరు ఖర్చును తెలుసుకోండి.',
    },
    ui: {
      tripRefuelingData: 'ప్రయాణం మరియు ఇంధన వివరాలు',
      tankToTankMethod: 'ట్యాంక్-టు-ట్యాంక్ పద్ధతి',
      distanceTraveled: 'ప్రయాణించిన దూరం (ట్రిప్ మీటర్)',
      fuelRefilled: 'నింపిన / వినియోగించిన ఇంధనం',
      litres: 'లీటర్లు',
      currentFuelPrice: 'ప్రస్తుత ఇంధన ధర (₹ / లీటరు)',
      petrolQuick: 'పెట్రోల్ (~₹102)',
      dieselQuick: 'డీజిల్ (~₹90)',
      cngQuick: 'సీఎన్‌జీ (~₹85/kg)',
      cityGuide: '50 కి.మీ (నగరం)',
      highwayGuide: '450 కి.మీ (హైవే)',
      longTourGuide: '1000+ కి.మీ (సుదూర ప్రయాణం)',
      fuelEconomyAnalytics: 'మైలేజ్ విశ్లేషణ',
      calculatedMileage: 'లెక్కింపు మైలేజ్',
      costPerKm: 'ఖర్చు / కి.మీ',
      perKilometer: 'ఒక కిలోమీటరుకు',
      costFor100Km: '100 కి.మీలకు అయ్యే ఖర్చు',
      totalFuelSpend: 'ఈ ప్రయాణానికి అయిన మొత్తం ఇంధన ఖర్చు:',
      tyreAdvice: 'టైర్ ప్రెషర్ సరిగ్గా (32-35 PSI) ఉంచి హైవేలలో 70-80 కి.మీ స్థిరమైన వేగంతో ప్రయాణిస్తే మైలేజ్ గణనీయంగా పెరుగుతుంది.',
      resultSummaryTitle: 'వాహన మైలేజ్ ఫలితం:',
      runningCostText: 'రన్నింగ్ ఖర్చు:',
      costFor100KmText: '100 కి.మీ ఖర్చు:',
      ratingText: 'రేటింగ్:',
      calculatedOn: 'ఇండియాటూల్స్‌లో లెక్కించబడింది',
      exceptionalRating: 'అద్భుతమైన మైలేజ్ (హ్యాచ్‌బ్యాక్/హైబ్రిడ్/బైక్)',
      goodRating: 'మంచి హైవే / సెడాన్ మైలేజ్',
      moderateRating: 'సాధారణ సిటీ మైలేజ్',
      heavyRating: 'ఎక్కువ ఇంధన వినియోగం (పెద్ద ఎస్‌యూవీ / ట్రాఫిక్)',
      invalidInputsRating: 'సరైన దూరం మరియు ఇంధన పరిమాణాన్ని నమోదు చేయండి',
    },
    formulaExplanation: 'మైలేజ్ (km/L) = మొత్తం దూరం (కి.మీ) ÷ ఉపయోగించిన ఇంధనం (లీటర్లు). కి.మీ ఖర్చు (₹/కి.మీ) = లీటరు ధర ÷ మైలేజ్.',
    assumptions: ['ట్యాంక్-టు-ట్యాంక్ పద్ధతి అత్యంత ఖచ్చితమైన ఫలితాన్ని ఇస్తుంది', 'నగర మరియు హైవే పరిస్థితులలో 15-25% తేడా ఉంటుంది'],
    example: {
      title: 'హ్యాచ్‌బ్యాక్ నగర ప్రయాణం',
      inputs: { 'దూరం': '450 కి.మీ', 'ఇంధనం': '25 లీటర్లు', 'పెట్రోల్ ధర': '₹102 / లీటరు' },
      outputs: { 'మైలేజ్': '18.00 km/L', 'కి.మీ ఖర్చు': '₹5.67 / కి.మీ', '100 కి.మీ ఖర్చు': '₹566.67' },
      explanation: '450 కి.మీ దూరాన్ని 25 లీటర్లతో పూర్తి చేస్తే 18 km/L మైలేజ్ వస్తుంది. లీటరుకు ₹102 చొప్పున కిలోమీటరుకు ₹5.67 ఖర్చవుతుంది.',
    },
    faqs: [
      {
        question: 'వాహన మైలేజ్‌ను ఖచ్చితంగా లెక్కించే సరైన పద్ధతి ఏది?',
        answer: 'ట్యాంక్-టు-ట్యాంక్ పద్ధతి: ఫుల్ ట్యాంక్ ఆటో-కట్ వరకు నింపి ట్రిప్ మీటర్‌ను 0 చేయండి. సగం ట్యాంక్ ఖాళీ అయ్యే వరకు వాడండి. మళ్లీ ఫుల్ ట్యాంక్ నింపండి. ప్రయాణించిన దూరాన్ని కొత్తగా నింపిన లీటర్లతో భాగించండి.',
      },
      {
        question: 'కంపెనీ ARAI మైలేజ్ కంటే అసలు మైలేజ్ ఎందుకు తక్కువగా ఉంటుంది?',
        answer: 'ARAI మైలేజ్ ల్యాబ్‌లలో ఎలాంటి ట్రాఫిక్ మరియు ఏసీ లేకుండా పరీక్షిస్తారు. భారతీయ రోడ్లపై ట్రాఫిక్ మరియు ఏసీ వాడటం వల్ల 15% నుండి 30% మైలేజ్ తగ్గుతుంది.',
      },
    ],
  },

  kn: {
    meta: {
      title: 'ವಾಹನ ಮೈಲೇಜ್ & ಇಂಧನ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | IndiaTools',
      metaDescription: 'ನಿಮ್ಮ ಕಾರು ಅಥವಾ ಬೈಕಿನ ಮೈಲೇಜ್ (km/L) ಮತ್ತು ಪ್ರತಿ ಕಿಲೋಮೀಟರ್ ಇಂಧನ ವೆಚ್ಚವನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
      h1: 'ವಾಹನ ಮೈಲೇಜ್ & ಇಂಧನ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಟ್ಯಾಂಕ್-ಟು-ಟ್ಯಾಂಕ್ ವಿಧಾನದಿಂದ ನಿಮ್ಮ ವಾಹನದ ನಿಖರ ಮೈಲೇಜ್ ಮತ್ತು ಚಾಲನಾ ವೆಚ್ಚವನ್ನು ತಿಳಿಯಿರಿ.',
    },
    ui: {
      tripRefuelingData: 'ಪ್ರವಾಸ ಮತ್ತು ಇಂಧನ ಮಾಹಿತಿ',
      tankToTankMethod: 'ಟ್ಯಾಂಕ್-ಟು-ಟ್ಯಾಂಕ್ ವಿಧಾನ',
      distanceTraveled: 'ಚಲಿಸಿದ ದೂರ (ಟ್ರಿಪ್ ಮೀಟರ್)',
      fuelRefilled: 'ತುಂಬಿಸಿದ ಇಂಧನ',
      litres: 'ಲೀಟರ್‌ಗಳು',
      currentFuelPrice: 'ಪ್ರಸ್ತುತ ಇಂಧನ ದರ (₹ / ಲೀಟರ್)',
      petrolQuick: 'ಪೆಟ್ರೋಲ್ (~₹102)',
      dieselQuick: 'ಡೀಸೆಲ್ (~₹90)',
      cngQuick: 'ಸಿಎನ್‌ಜಿ (~₹85/kg)',
      cityGuide: '50 ಕಿ.ಮೀ (ನಗರ)',
      highwayGuide: '450 ಕಿ.ಮೀ (ಹೆದ್ದಾರಿ)',
      longTourGuide: '1000+ ಕಿ.ಮೀ (ದೂರದ ಪ್ರಯಾಣ)',
      fuelEconomyAnalytics: 'ಮೈಲೇಜ್ ವಿಶ್ಲೇಷಣೆ',
      calculatedMileage: 'ಲೆಕ್ಕಹಾಕಿದ ಮೈಲೇಜ್',
      costPerKm: 'ವೆಚ್ಚ / ಕಿ.ಮೀ',
      perKilometer: 'ಪ್ರತಿ ಕಿಲೋಮೀಟರ್‌ಗೆ',
      costFor100Km: '100 ಕಿ.ಮೀ ವೆಚ್ಚ',
      totalFuelSpend: 'ಈ ಪ್ರಯಾಣಕ್ಕೆ ಪಾವತಿಸಿದ ಒಟ್ಟು ಇಂಧನ ವೆಚ್ಚ:',
      tyreAdvice: 'ಟೈರ್ ಒತ್ತಡವನ್ನು ಶಿಫಾರಸು ಮಾಡಿದ ಮಟ್ಟದಲ್ಲಿ (32-35 PSI) ಇಟ್ಟುಕೊಳ್ಳುವುದು ಮತ್ತು ಹೆದ್ದಾರಿಯಲ್ಲಿ 70-80 ಕಿ.ಮೀ ಸ್ಥಿರ ವೇಗ ಕಾಯ್ದುಕೊಳ್ಳುವುದು ಮೈಲೇಜ್ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      resultSummaryTitle: 'ವಾಹನ ಮೈಲೇಜ್ ಫಲಿತಾಂಶ:',
      runningCostText: 'ಚಾಲನಾ ವೆಚ್ಚ:',
      costFor100KmText: '100 ಕಿ.ಮೀ ವೆಚ್ಚ:',
      ratingText: 'ರೇಟಿಂಗ್:',
      calculatedOn: 'ಇಂಡಿಯಾಟೂಲ್ಸ್‌ನಲ್ಲಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
      exceptionalRating: 'ಅತ್ಯುತ್ತಮ ಮೈಲೇಜ್ (ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್/ಹೈಬ್ರಿಡ್/ಬೈಕ್)',
      goodRating: 'ಉತ್ತಮ ಹೆದ್ದಾರಿ / ಸೆಡಾನ್ ಮೈಲೇಜ್',
      moderateRating: 'ಸಾಧಾರಣ ನಗರ ಮೈಲೇಜ್',
      heavyRating: 'ಹೆಚ್ಚಿನ ಇಂಧನ ಬಳಕೆ (ದೊಡ್ಡ ಎಸ್‌ಯುವಿ / ಟ್ರಾಫಿಕ್)',
      invalidInputsRating: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ದೂರ ಮತ್ತು ಇಂಧನ ಪ್ರಮಾಣ ನಮೂದಿಸಿ',
    },
    formulaExplanation: 'ಮೈಲೇಜ್ (km/L) = ಚಲಿಸಿದ ಒಟ್ಟು ದೂರ (ಕಿ.ಮೀ) ÷ ಬಳಸಿದ ಇಂಧನ (ಲೀಟರ್). ಕಿ.ಮೀ ವೆಚ್ಚ (₹/ಕಿ.ಮೀ) = ಲೀಟರ್ ದರ ÷ ಮೈಲೇಜ್.',
    assumptions: ['ಟ್ಯಾಂಕ್-ಟು-ಟ್ಯಾಂಕ್ ವಿಧಾನ ಅತ್ಯಂತ ನಿಖರವಾದ ಫಲಿತಾಂಶ ನೀಡುತ್ತದೆ', 'ನಗರ ಮತ್ತು ಹೆದ್ದಾರಿ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ 15-25% ವ್ಯತ್ಯಾಸವಿರುತ್ತದೆ'],
    example: {
      title: 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್ ನಗರ ಪ್ರಯಾಣ',
      inputs: { 'ದೂರ': '450 ಕಿ.ಮೀ', 'ಇಂಧನ': '25 ಲೀಟರ್', 'ಪೆಟ್ರೋಲ್ ದರ': '₹102 / ಲೀಟರ್' },
      outputs: { 'ಮೈಲೇಜ್': '18.00 km/L', 'ಕಿ.ಮೀ ವೆಚ್ಚ': '₹5.67 / ಕಿ.ಮೀ', '100 ಕಿ.ಮೀ ವೆಚ್ಚ': '₹566.67' },
      explanation: '450 ಕಿ.ಮೀ ದೂರವನ್ನು 25 ಲೀಟರ್‌ನಲ್ಲಿ ಕ್ರಮಿಸಿದಾಗ 18 km/L ಮೈಲೇಜ್ ದೊರೆಯುತ್ತದೆ. ಲೀಟರ್‌ಗೆ ₹102 ದರದಲ್ಲಿ 1 ಕಿ.ಮೀ ವೆಚ್ಚ ₹5.67 ಆಗುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ವಾಹನದ ಮೈಲೇಜ್ ಅಳೆಯುವ ಅತ್ಯಂತ ನಿಖರವಾದ ವಿಧಾನ ಯಾವುದು?',
        answer: 'ಟ್ಯಾಂಕ್-ಟು-ಟ್ಯಾಂಕ್ ವಿಧಾನ: ಟ್ಯಾಂಕ್ ಅನ್ನು ಆಟೋ-ಕಟ್ ವರೆಗೆ ತುಂಬಿಸಿ ಟ್ರಿಪ್ ಮೀಟರ್ 0 ಮಾಡಿ. ಅರ್ಧ ಟ್ಯಾಂಕ್ ಖಾಲಿಯಾಗುವವರೆಗೆ ಚಲಾಯಿಸಿ. ಮತ್ತೆ ಅದೇ ಬಂಕ್‌ನಲ್ಲಿ ಫುಲ್ ಟ್ಯಾಂಕ್ ಮಾಡಿ. ಟ್ರಿಪ್ ಮೀಟರ್ ದೂರವನ್ನು ಹೊಸದಾಗಿ ತುಂಬಿದ ಲೀಟರ್‌ನಿಂದ ಭಾಗಿಸಿ.',
      },
      {
        question: 'ಕಂಪನಿ ನೀಡುವ ARAI ಮೈಲೇಜ್‌ಗಿಂತ ನೈಜ ಮೈಲೇಜ್ ಏಕೆ ಕಡಿಮೆಯಿರುತ್ತದೆ?',
        answer: 'ARAI ಮೈಲೇಜ್ ಅನ್ನು ಪ್ರಯೋಗಾಲಯದಲ್ಲಿ ಎಸಿ ಇಲ್ಲದೆ ಪರೀಕ್ಷಿಸಲಾಗುತ್ತದೆ. ಭಾರತೀಯ ರಸ್ತೆಗಳಲ್ಲಿ ಟ್ರಾಫಿಕ್ ಮತ್ತು ಎಸಿ ಬಳಸುವುದರಿಂದ ನೈಜ ಮೈಲೇಜ್ 15% ರಿಂದ 30% ವರೆಗೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('vehicle-mileage', vehicleMileageTranslations)
