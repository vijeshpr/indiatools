import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface PetrolVsDieselUI {
  fuelEconomicsInput: string
  breakevenModel: string
  expectedMonthlyDriving: string
  kmPerMonth: string
  petrolVariant: string
  dieselVariant: string
  fuelPrice: string
  mileage: string
  extraPriceDiesel: string
  extraPriceHint: string
  breakevenPeriod: string
  dieselFeasible: string
  petrolFavored: string
  months: string
  breakevenDescription: string
  petrolMonthlyFuel: string
  dieselMonthlyFuel: string
  monthlySavingsWithDiesel: string
  verdictTitle: string
  verdictDesc: string
  resultSummaryTitle: string
  monthlyDistanceText: string
  petrolMonthlyCostText: string
  dieselMonthlyCostText: string
  monthlyFuelSavingsText: string
  dieselPremiumPriceText: string
  breakevenDistanceText: string
  recommendationText: string
  dieselRecommended: string
  petrolRecommended: string
  calculatedOn: string
}

export const petrolVsDieselTranslations: ToolLocaleMap<PetrolVsDieselUI> = {
  en: {
    meta: {
      title: 'Petrol vs Diesel Calculator | Mileage, Price & Breakeven Analysis | IndiaTools',
      metaDescription: 'Calculate breakeven distance, monthly savings, and ROI between petrol and diesel cars in India. Know if buying diesel is worth the premium.',
      h1: 'Petrol vs Diesel Calculator',
      subtitle: 'Compare showroom premium against running fuel economy to find your exact breakeven mileage and payback period.',
    },
    ui: {
      fuelEconomicsInput: 'Fuel Economics Input',
      breakevenModel: 'Breakeven Model',
      expectedMonthlyDriving: 'Expected Monthly Driving',
      kmPerMonth: 'km/month',
      petrolVariant: 'Petrol Variant',
      dieselVariant: 'Diesel Variant',
      fuelPrice: 'Fuel Price (₹/L)',
      mileage: 'Mileage (km/L)',
      extraPriceDiesel: 'Extra Showroom Price for Diesel Variant (₹)',
      extraPriceHint: 'Diesel engines usually command ₹1 Lakh to ₹1.75 Lakh premium over petrol counterparts.',
      breakevenPeriod: 'Breakeven Period',
      dieselFeasible: 'Diesel Financially Feasible',
      petrolFavored: 'Petrol Favored',
      months: 'Months',
      breakevenDescription: 'Equivalent to driving {breakevenKm} km to recover upfront diesel price difference.',
      petrolMonthlyFuel: 'Petrol Monthly Fuel',
      dieselMonthlyFuel: 'Diesel Monthly Fuel',
      monthlySavingsWithDiesel: 'Monthly Fuel Savings with Diesel:',
      verdictTitle: 'Verdict Guide',
      verdictDesc: 'In Delhi-NCR, diesel vehicles face a 10-year NGT registration limit (vs 15 years for petrol). Also, DPF filter maintenance in modern BS6.2 diesel cars requires periodic highway running. If your commute is primarily stop-and-go city traffic below 1,000 km/month, petrol or CNG remains the superior choice.',
      resultSummaryTitle: 'Petrol vs Diesel Financial Comparison:',
      monthlyDistanceText: 'Monthly Distance',
      petrolMonthlyCostText: 'Petrol Monthly Cost',
      dieselMonthlyCostText: 'Diesel Monthly Cost',
      monthlyFuelSavingsText: 'Monthly Fuel Savings with Diesel',
      dieselPremiumPriceText: 'Diesel Premium Price',
      breakevenDistanceText: 'Breakeven Distance',
      recommendationText: 'Recommendation',
      dieselRecommended: 'Diesel Recommended',
      petrolRecommended: 'Petrol Recommended',
      calculatedOn: 'Calculated via IndiaTools',
    },
    formulaExplanation: 'Per km Fuel Cost = Fuel Price ÷ Mileage. Monthly Fuel Savings = Monthly Distance × (Petrol Cost/km - Diesel Cost/km). Breakeven Distance (km) = Extra Purchase Cost ÷ (Petrol Cost/km - Diesel Cost/km). Breakeven Months = Breakeven Distance ÷ Monthly Distance.',
    assumptions: [
      'Constant fuel pricing without considering resale value differences.',
      'BS6 diesel DPF maintenance and DEF fluid replenishment are kept at standard operating levels.',
    ],
    example: {
      title: 'Compact SUV Comparison (1,500 km/mo)',
      inputs: {
        'Monthly Running': '1,500 km',
        'Petrol Mileage': '14 km/L (at ₹102/L)',
        'Diesel Mileage': '19 km/L (at ₹90/L)',
        'Diesel Premium': '₹1,25,000',
      },
      outputs: {
        'Monthly Savings': '₹3,824 / month',
        'Breakeven Distance': '49,020 km',
        'Breakeven Period': '33 Months (~2.7 Years)',
      },
      explanation: 'With a monthly fuel saving of ₹3,824, driving 1,500 km/month recovers the ₹1.25 Lakh diesel price premium in 33 months.',
    },
    faqs: [
      {
        question: 'Is diesel worth buying for less than 1,000 km/month?',
        answer: 'Rarely. With a monthly running of under 1,000 km, recovering the ₹1.25L - ₹1.75L diesel price premium typically takes 5+ years, making petrol or hybrid much better value.',
      },
      {
        question: 'What about diesel DPF issues in city driving?',
        answer: 'Modern BS6.2 diesel cars use DPF (Diesel Particulate Filters) which can clog with continuous short city trips without periodic highway regeneration cycles.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'പെട്രോൾ vs ഡീസൽ കാൽക്കുലേറ്റർ | മൈലേജ്, വില & ബ്രേക്ക്ഈവൻ വിശകലനം | IndiaTools',
      metaDescription: 'പെട്രോൾ, ഡീസൽ കാറുകൾ തമ്മിലുള്ള മാസ ചെലവും വില വ്യത്യാസം തിരിച്ചുപിടിക്കാൻ എത്ര കിലോമീറ്റർ ഓടണമെന്നും കൃത്യമായി കണക്കാക്കുക.',
      h1: 'പെട്രോൾ vs ഡീസൽ കാൽക്കുലേറ്റർ',
      subtitle: 'കൂടുതൽ പണം നൽകി ഡീസൽ കാർ വാങ്ങുന്നത് ലാഭകരമാണോ എന്ന് ബ്രേക്ക്ഈവൻ കാലയളവ് പരിശോധിച്ച് കണ്ടെത്തുക.',
    },
    ui: {
      fuelEconomicsInput: 'ഇന്ധന സാമ്പത്തിക വിവരങ്ങൾ',
      breakevenModel: 'ബ്രേക്ക്ഈവൻ മോഡൽ',
      expectedMonthlyDriving: 'പ്രതിമാസ ഓട്ടം (കിലോമീറ്റർ)',
      kmPerMonth: 'കി.മീ/മാസം',
      petrolVariant: 'പെട്രോൾ വേരിയന്റ്',
      dieselVariant: 'ഡീസൽ വേരിയന്റ്',
      fuelPrice: 'ഇന്ധന വില (₹/ലി)',
      mileage: 'മൈലേജ് (കി.മീ/ലി)',
      extraPriceDiesel: 'ഡീസൽ മോഡലിന് നൽകേണ്ട അധിക തുക (₹)',
      extraPriceHint: 'സാധാരണയായി പെട്രോളിനേക്കാൾ ₹1 ലക്ഷം മുതൽ ₹1.75 ലക്ഷം വരെ ഡീസലിന് അധിക വിലയുണ്ടാകും.',
      breakevenPeriod: 'ബ്രേക്ക്ഈവൻ കാലയളവ്',
      dieselFeasible: 'ഡീസൽ വാങ്ങുന്നത് ലാഭകരമാണ്',
      petrolFavored: 'പെട്രോളാണ് കൂടുതൽ അനുയോജ്യം',
      months: 'മാസങ്ങൾ',
      breakevenDescription: 'ഡീസലിന്റെ അധിക വില തിരിച്ചുപിടിക്കാൻ {breakevenKm} കി.മീ ഓടിക്കേണ്ടതുണ്ട്.',
      petrolMonthlyFuel: 'പെട്രോൾ മാസച്ചെലവ്',
      dieselMonthlyFuel: 'ഡീസൽ മാസച്ചെലവ്',
      monthlySavingsWithDiesel: 'ഡീസൽ വഴി മാസത്തിൽ ലാഭിക്കുന്നത്:',
      verdictTitle: 'തീരുമാന സഹായം',
      verdictDesc: 'മാസത്തിൽ 1,000 കി.മീറ്ററിൽ താഴെ മാത്രം നഗരങ്ങളിൽ ഓടുന്നവർക്ക് പെട്രോളോ സിഎൻജിയോ ആണ് ഏറ്റവും അനുയോജ്യം. പുതിയ BS6 ഡീസൽ കാറുകളിൽ DPF ഫിൽട്ടർ ക്ലീനിംഗിനായി ഹൈവേ ഓട്ടം ആവശ്യമാണ്.',
      resultSummaryTitle: 'പെട്രോൾ vs ഡീസൽ സാമ്പത്തിക താരതമ്യം:',
      monthlyDistanceText: 'പ്രതിമാസ ഓട്ടം',
      petrolMonthlyCostText: 'പെട്രോൾ മാസച്ചെലവ്',
      dieselMonthlyCostText: 'ഡീസൽ മാസച്ചെലവ്',
      monthlyFuelSavingsText: 'ഡീസൽ വഴി മാസലാഭം',
      dieselPremiumPriceText: 'ഡീസലിന്റെ അധിക വില',
      breakevenDistanceText: 'ബ്രേക്ക്ഈവൻ ദൂരം',
      recommendationText: 'ശുപാർശ',
      dieselRecommended: 'ഡീസൽ ശുപാർശ ചെയ്യുന്നു',
      petrolRecommended: 'പെട്രോൾ ശുപാർശ ചെയ്യുന്നു',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'ഒരു കി.മീ ചെലവ് = ഇന്ധനവില ÷ മൈലേജ്. മാസ ലാഭം = മാസ ദൂരം × (പെട്രോൾ നിരക്ക് - ഡീസൽ നിരക്ക്). ബ്രേക്ക്ഈവൻ ദൂരം = അധിക വില ÷ കിലോമീറ്റർ ലാഭം. ബ്രേക്ക്ഈവൻ മാസങ്ങൾ = ബ്രേക്ക്ഈവൻ ദൂരം ÷ മാസ ദൂരം.',
    assumptions: [
      'റീസെയിൽ വ്യത്യാസങ്ങൾ ഒഴിവാക്കി ഇന്ധനവില സ്ഥിരമായി കണക്കാക്കുന്നു.',
    ],
    example: {
      title: 'കോംപാക്ട് എസ്‌യുവി താരതമ്യം (1,500 കി.മീ/മാസം)',
      inputs: {
        'മാസ ഓട്ടം': '1,500 കി.മീ',
        'പെട്രോൾ മൈലേജ്': '14 കി.മീ/ലി (₹102/ലി)',
        'ഡീസൽ മൈലേജ്': '19 കി.മീ/ലി (₹90/ലി)',
        'ഡീസൽ അധിക വില': '₹1,25,000',
      },
      outputs: {
        'മാസ ലാഭം': '₹3,824 / മാസം',
        'ബ്രേക്ക്ഈവൻ ദൂരം': '49,020 കി.മീ',
        'കാലയളവ്': '33 മാസങ്ങൾ (~2.7 വർഷം)',
      },
      explanation: 'പ്രതിമാസം ₹3,824 ഇന്ധനലാഭമുള്ളതിനാൽ, 1,500 കി.മീ ഓടിയാൽ 33 മാസങ്ങൾ കൊണ്ട് അധിക വില വീണ്ടെടുക്കാം.',
    },
    faqs: [
      {
        question: 'പ്രതിമാസം 1,000 കി.മീറ്ററിൽ താഴെയാണെങ്കിൽ ഡീസൽ കാർ ലാഭകരമാണോ?',
        answer: 'അല്ല. കുറഞ്ഞ ഓട്ടമുള്ളവർക്ക് ഡീസലിന്റെ അധിക വില തിരിച്ചുപിടിക്കാൻ 5 വർഷത്തിലധികം വേണ്ടിവരും, അതിനാൽ പെട്രോളാണ് നല്ലത്.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'पेट्रोल बनाम डीजल कैलकुलेटर | माइलेज व ब्रेक-इवन विश्लेषण | IndiaTools',
      metaDescription: 'पेट्रोल और डीजल कार की तुलना करें। जानें कि अधिक कीमत चुकाकर डीजल लेना कितने किलोमीटर या महीनों में फायदेमंद होगा।',
      h1: 'पेट्रोल बनाम डीजल कैलकुलेटर',
      subtitle: 'माइलेज और अतिरिक्त शोरूम कीमत की तुलना करके सटीक ब्रेक-इवन दूरी और अवधि जानें।',
    },
    ui: {
      fuelEconomicsInput: 'ईंधन अर्थशास्त्र इनपुट',
      breakevenModel: 'ब्रेक-इवन मॉडल',
      expectedMonthlyDriving: 'अपेक्षित मासिक ड्राइविंग',
      kmPerMonth: 'किमी/माह',
      petrolVariant: 'पेट्रोल संस्करण',
      dieselVariant: 'डीजल संस्करण',
      fuelPrice: 'ईंधन दर (₹/ली)',
      mileage: 'माइलेज (किमी/ली)',
      extraPriceDiesel: 'डीजल मॉडल की अतिरिक्त शोरूम कीमत (₹)',
      extraPriceHint: 'डीजल इंजन आमतौर पर पेट्रोल की तुलना में ₹1 लाख से ₹1.75 लाख महंगे होते हैं।',
      breakevenPeriod: 'ब्रेक-इवन अवधि',
      dieselFeasible: 'डीजल आर्थिक रूप से फायदेमंद',
      petrolFavored: 'पेट्रोल अधिक उपयुक्त',
      months: 'महीने',
      breakevenDescription: 'डीजल की अतिरिक्त कीमत वसूलने के लिए {breakevenKm} किमी चलाना आवश्यक है।',
      petrolMonthlyFuel: 'पेट्रोल मासिक ईंधन खर्च',
      dieselMonthlyFuel: 'डीजल मासिक ईंधन खर्च',
      monthlySavingsWithDiesel: 'डीजल से मासिक बचत:',
      verdictTitle: 'निष्कर्ष मार्गदर्शिका',
      verdictDesc: 'दिल्ली-एनसीआर में डीजल गाड़ियों की सीमा 10 वर्ष है। यदि आपका मासिक आवागमन 1,000 किमी से कम है तो पेट्रोल या सीएनजी ही बेहतर विकल्प है।',
      resultSummaryTitle: 'पेट्रोल बनाम डीजल वित्तीय तुलना:',
      monthlyDistanceText: 'मासिक दूरी',
      petrolMonthlyCostText: 'पेट्रोल मासिक खर्च',
      dieselMonthlyCostText: 'डीजल मासिक खर्च',
      monthlyFuelSavingsText: 'डीजल से मासिक बचत',
      dieselPremiumPriceText: 'डीजल की अतिरिक्त कीमत',
      breakevenDistanceText: 'ब्रेक-इवन दूरी',
      recommendationText: 'सिफारिश',
      dieselRecommended: 'डीजल अनुशंसित',
      petrolRecommended: 'पेट्रोल अनुशंसित',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'प्रति किमी लागत = ईंधन दर ÷ माइलेज। मासिक बचत = मासिक दूरी × (पेट्रोल दर - डीजल दर)। ब्रेक-इवन दूरी = अतिरिक्त कीमत ÷ प्रति किमी बचत। ब्रेक-इवन माह = ब्रेक-इवन दूरी ÷ मासिक दूरी।',
    assumptions: [
      'ईंधन दरें स्थिर मानी गई हैं।',
    ],
    example: {
      title: 'एसयूवी तुलना (1,500 किमी/माह)',
      inputs: {
        'मासिक दूरी': '1,500 किमी',
        'पेट्रोल माइलेज': '14 किमी/ली (₹102/ली)',
        'डीजल माइलेज': '19 किमी/ली (₹90/ली)',
        'डीजल अतिरिक्त कीमत': '₹1,25,000',
      },
      outputs: {
        'मासिक बचत': '₹3,824 / माह',
        'ब्रेक-इवन दूरी': '49,020 किमी',
        'ब्रेक-इवन अवधि': '33 महीने (~2.7 वर्ष)',
      },
      explanation: '₹3,824 की मासिक बचत से, 1,500 किमी चलाने पर 33 महीनों में डीजल की अतिरिक्त कीमत पूरी तरह वसूल हो जाती है।',
    },
    faqs: [
      {
        question: 'क्या 1,000 किमी/माह से कम में डीजल लेना चाहिए?',
        answer: 'नहीं, कम चलने पर अतिरिक्त लागत वसूलने में 5 साल से ज्यादा लग जाते हैं, इसलिए पेट्रोल लेना ही समझदारी है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'பெட்ரோல் vs டீசல் கால்குலேட்டர் | மைலேஜ் & பிரேக்-ஈவன் பகுப்பாய்வு | IndiaTools',
      metaDescription: 'பெட்ரோல் அல்லது டீசல் கார் வாங்குவது லாபகரமானதா என்று மாத சேமிப்பு மற்றும் பிரேக்-ஈவன் தூரத்தை உடனடியாக கணக்கிடுங்கள்.',
      h1: 'பெட்ரோல் vs டீசல் கால்குலேட்டர்',
      subtitle: 'டீசல் காருக்கு கொடுக்கும் கூடுதல் விலையை எத்தனை கி.மீ அல்லது மாதங்களில் மீட்டெடுக்கலாம் என்று அறியுங்கள்.',
    },
    ui: {
      fuelEconomicsInput: 'எரிபொருள் பொருளாதார உள்ளீடுகள்',
      breakevenModel: 'பிரேக்-ஈவன் மாதிரி',
      expectedMonthlyDriving: 'எதிர்பார்க்கப்படும் மாதாந்திர ஓட்டம்',
      kmPerMonth: 'கி.மீ/மாதம்',
      petrolVariant: 'பெட்ரோல் மாடல்',
      dieselVariant: 'டீசல் மாடல்',
      fuelPrice: 'விலை (₹/லி)',
      mileage: 'மைலேஜ் (கி.மீ/லி)',
      extraPriceDiesel: 'டீசல் காருக்கான கூடுதல் விலை (₹)',
      extraPriceHint: 'டீசல் இன்ஜின்கள் பெட்ரோலை விட பொதுவாக ₹1 லட்சம் முதல் ₹1.75 லட்சம் வரை கூடுதல் விலை கொண்டவை.',
      breakevenPeriod: 'பிரேக்-ஈவன் காலம்',
      dieselFeasible: 'டீசல் வாங்குவது லாபம்',
      petrolFavored: 'பெட்ரோல் சிறந்தது',
      months: 'மாதங்கள்',
      breakevenDescription: 'டீசலின் கூடுதல் விலையை ஈடுகட்ட {breakevenKm} கி.மீ ஓட்ட வேண்டும்.',
      petrolMonthlyFuel: 'பெட்ரோல் மாதாந்திர செலவு',
      dieselMonthlyFuel: 'டீசல் மாதாந்திர செலவு',
      monthlySavingsWithDiesel: 'டீசல் மூலம் மாத சேமிப்பு:',
      verdictTitle: 'வழிகாட்டுதல்',
      verdictDesc: 'மாதத்திற்கு 1,000 கி.மீட்டருக்கும் குறைவாக ஓட்டுபவர்களுக்கு பெட்ரோல் அல்லது சிஎன்ஜி காரே சிறந்த தேர்வாகும்.',
      resultSummaryTitle: 'பெட்ரோல் vs டீசல் நிதி ஒப்பீடு:',
      monthlyDistanceText: 'மாதாந்திர தூரம்',
      petrolMonthlyCostText: 'பெட்ரோல் மாத செலவு',
      dieselMonthlyCostText: 'டீசல் மாத செலவு',
      monthlyFuelSavingsText: 'டீசல் மூலம் மாத சேமிப்பு',
      dieselPremiumPriceText: 'டீசல் கூடுதல் விலை',
      breakevenDistanceText: 'பிரேக்-ஈவன் தூரம்',
      recommendationText: 'பரிந்துரை',
      dieselRecommended: 'டீசல் பரிந்துரைக்கப்படுகிறது',
      petrolRecommended: 'பெட்ரோல் பரிந்துரைக்கப்படுகிறது',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'ஒரு கி.மீ செலவு = விலை ÷ மைலேஜ். மாத சேமிப்பு = மாத தூரம் × (பெட்ரோல் செலவு - டீசல் செலவு). பிரேக்-ஈவன் தூரம் = கூடுதல் விலை ÷ ஒரு கி.மீ சேமிப்பு.',
    assumptions: ['நிலையான எரிபொருள் விலைகள் கணக்கிடப்படுகின்றன.'],
    example: {
      title: 'எஸ்யூவி ஒப்பீடு (1,500 கி.மீ/மாதம்)',
      inputs: {
        'மாத ஓட்டம்': '1,500 கி.மீ',
        'பெட்ரோல் மைலேஜ்': '14 கி.மீ/லி',
        'டீசல் மைலேஜ்': '19 கி.மீ/லி',
        'டீசல் கூடுதல் விலை': '₹1,25,000',
      },
      outputs: {
        'மாத சேமிப்பு': '₹3,824 / மாதம்',
        'பிரேக்-ஈவன் தூரம்': '49,020 கி.மீ',
        'காலம்': '33 மாதங்கள்',
      },
      explanation: 'மாதம் ₹3,824 சேமிப்பதன் மூலம், 33 மாதங்களில் கூடுதல் விலையை ஈடுகட்ட முடியும்.',
    },
    faqs: [
      {
        question: 'குறைந்த தூரம் ஓட்டுபவர்களுக்கு டீசல் நல்லதா?',
        answer: 'இல்லை, மாதத்திற்கு 1,000 கி.மீக்கு குறைவாக ஓட்டினால் டீசல் மாடல் வாங்குவது நஷ்டமாகும்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'పెట్రోల్ vs డీజిల్ కాలిక్యులేటర్ | మైలేజ్ & బ్రేక్-ఈవెన్ విశ్లేషణ | IndiaTools',
      metaDescription: 'పెట్రోల్ మరియు డీజిల్ కార్ల మధ్య నెలవారీ ఇంధన పొదుపు మరియు అదనపు ధర రికవరీ సమయాన్ని సులభంగా లెక్కించండి.',
      h1: 'పెట్రోల్ vs డీజిల్ కాలిక్యులేటర్',
      subtitle: 'డీజిల్ కారు అదనపు ధరకు సరిపడే మైలేజ్ మరియు బ్రేక్-ఈవెన్ కాలాన్ని ఖచ్చితంగా తెలుసుకోండి.',
    },
    ui: {
      fuelEconomicsInput: 'ఇంధన ఎకనామిక్స్ వివరాలు',
      breakevenModel: 'బ్రేక్-ఈవెన్ మోడల్',
      expectedMonthlyDriving: 'అంచనా నెలవారీ ప్రయాణం',
      kmPerMonth: 'కి.మీ/నెల',
      petrolVariant: 'పెట్రోల్ వేరియంట్',
      dieselVariant: 'డీజిల్ వేరియంట్',
      fuelPrice: 'ధర (₹/లీ)',
      mileage: 'మైలేజ్ (కి.మీ/లీ)',
      extraPriceDiesel: 'డీజిల్ వేరియంట్ అదనపు ధర (₹)',
      extraPriceHint: 'సాధారణంగా డీజిల్ కార్లు పెట్రోల్ కంటే ₹1 లక్ష నుండి ₹1.75 లక్షలు ఎక్కువ ధర ఉంటాయి.',
      breakevenPeriod: 'బ్రేక్-ఈవెన్ సమయం',
      dieselFeasible: 'డీజిల్ తీసుకోవడం లాభదాయకం',
      petrolFavored: 'పెట్రోల్ అనుకూలం',
      months: 'నెలలు',
      breakevenDescription: 'డీజిల్ అదనపు ధరను రికవర్ చేసుకోవడానికి {breakevenKm} కి.మీ నడపాలి.',
      petrolMonthlyFuel: 'పెట్రోల్ నెలవారీ ఖర్చు',
      dieselMonthlyFuel: 'డీజిల్ నెలవారీ ఖర్చు',
      monthlySavingsWithDiesel: 'డీజిల్‌తో నెలవారీ పొదుపు:',
      verdictTitle: 'నిర్ణయ మార్గదర్శి',
      verdictDesc: 'నెలవారీ ప్రయాణం 1,000 కి.మీ కంటే తక్కువ ఉన్నవారికి పెట్రోల్ లేదా సిఎన్‌జి కారు మాత్రమే ఉత్తమం.',
      resultSummaryTitle: 'పెట్రోల్ vs డీజిల్ ఆర్థిక పోలిక:',
      monthlyDistanceText: 'నెలవారీ దూరం',
      petrolMonthlyCostText: 'పెట్రోల్ నెల ఖర్చు',
      dieselMonthlyCostText: 'డీజిల్ నెల ఖర్చు',
      monthlyFuelSavingsText: 'డీజిల్ నెలవారీ పొదుపు',
      dieselPremiumPriceText: 'డీజిల్ అదనపు ధర',
      breakevenDistanceText: 'బ్రేక్-ఈవెన్ దూరం',
      recommendationText: 'సిఫార్సు',
      dieselRecommended: 'డీజిల్ సిఫార్సు చేయబడింది',
      petrolRecommended: 'పెట్రోల్ సిఫార్సు చేయబడింది',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'ప్రతి కి.మీ ఖర్చు = ధర ÷ మైలేజ్. నెలవారీ పొదుపు = నెల దూరం × (పెట్రోల్ రేటు - డీజిల్ రేటు). బ్రేక్-ఈవెన్ దూరం = అదనపు ధర ÷ కి.మీ పొదుపు.',
    assumptions: ['స్థిరమైన ఇంధన ధరల అంచనా.'],
    example: {
      title: 'ఎస్యూవీ పోలిక (1,500 కి.మీ/నెల)',
      inputs: {
        'నెలవారీ దూరం': '1,500 కి.మీ',
        'పెట్రోల్ మైలేజ్': '14 కి.మీ/లీ',
        'డీజిల్ మైలేజ్': '19 కి.మీ/లీ',
        'డీజిల్ అదనపు ధర': '₹1,25,000',
      },
      outputs: {
        'నెలవారీ పొదుపు': '₹3,824 / నెల',
        'బ్రేక్-ఈవెన్ దూరం': '49,020 కి.మీ',
        'సమయం': '33 నెలలు',
      },
      explanation: 'నెలకు ₹3,824 ఆదా చేయడం ద్వారా 33 నెలల్లో అదనపు ధరను భర్తీ చేయవచ్చు.',
    },
    faqs: [
      {
        question: 'తక్కువ తిరిగే వారికి డీజిల్ కారు మంచిదా?',
        answer: 'కాదు, నెలకు 1,000 కి.మీ కంటే తక్కువైతే అదనపు ధర రికవరీ కావడానికి 5 ఏళ్లకు పైగా పడుతుంది.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಪೆಟ್ರೋಲ್ vs ಡೀಸೆಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ಮೈಲೇಜ್ & ಬ್ರೇಕ್-ಈವನ್ ವಿಶ್ಲೇಷಣೆ | IndiaTools',
      metaDescription: 'ಪೆಟ್ರೋಲ್ ಮತ್ತು ಡೀಸೆಲ್ ಕಾರುಗಳ ನಡುವಿನ ಮಾಸಿಕ ಉಳಿತಾಯ ಮತ್ತು ಬೆಲೆ ವ್ಯತ್ಯಾಸದ ಬ್ರೇಕ್-ಈವನ್ ಅವಧಿಯನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
      h1: 'ಪೆಟ್ರೋಲ್ vs ಡೀಸೆಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಹೆಚ್ಚುವರಿ ಬೆಲೆ ನೀಡಿ ಡೀಸೆಲ್ ಕಾರು ಖರೀದಿಸುವುದು ಲಾಭದಾಯಕವೇ ಎಂದು ಬ್ರೇಕ್-ಈವನ್ ಅವಧಿಯ ಮೂಲಕ ತಿಳಿಯಿರಿ.',
    },
    ui: {
      fuelEconomicsInput: 'ಇಂಧನ ಆರ್ಥಿಕತೆಯ ವಿವರಗಳು',
      breakevenModel: 'ಬ್ರೇಕ್-ಈವನ್ ಮಾದರಿ',
      expectedMonthlyDriving: 'ನಿರೀಕ್ಷಿತ ಮಾಸಿಕ ಚಾಲನೆ',
      kmPerMonth: 'ಕಿ.ಮೀ/ತಿಂಗಳು',
      petrolVariant: 'ಪೆಟ್ರೋಲ್ ಆವೃತ್ತಿ',
      dieselVariant: 'ಡೀಸೆಲ್ ಆವೃತ್ತಿ',
      fuelPrice: 'ದರ (₹/ಲೀ)',
      mileage: 'ಮೈಲೇಜ್ (ಕಿ.ಮೀ/ಲೀ)',
      extraPriceDiesel: 'ಡೀಸೆಲ್ ಮಾದರಿಯ ಹೆಚ್ಚುವರಿ ಬೆಲೆ (₹)',
      extraPriceHint: 'ಸಾಮಾನ್ಯವಾಗಿ ಡೀಸೆಲ್ ಕಾರುಗಳು ಪೆಟ್ರೋಲ್‌ಗಿಂತ ₹1 ಲಕ್ಷದಿಂದ ₹1.75 ಲಕ್ಷದಷ್ಟು ದುಬಾರಿಯಾಗಿರುತ್ತವೆ.',
      breakevenPeriod: 'ಬ್ರೇಕ್-ಈವನ್ ಅವಧಿ',
      dieselFeasible: 'ಡೀಸೆಲ್ ಆರ್ಥಿಕವಾಗಿ ಲಾಭದಾಯಕ',
      petrolFavored: 'ಪೆಟ್ರೋಲ್ ಸೂಕ್ತ',
      months: 'ತಿಂಗಳುಗಳು',
      breakevenDescription: 'ಡೀಸೆಲ್‌ನ ಹೆಚ್ಚುವರಿ ಬೆಲೆಯನ್ನು ವಸೂಲಿ ಮಾಡಲು {breakevenKm} ಕಿ.ಮೀ ಚಲಿಸಬೇಕು.',
      petrolMonthlyFuel: 'ಪೆಟ್ರೋಲ್ ಮಾಸಿಕ ಇಂಧನ ವೆಚ್ಚ',
      dieselMonthlyFuel: 'ಡೀಸೆಲ್ ಮಾಸಿಕ ಇಂಧನ ವೆಚ್ಚ',
      monthlySavingsWithDiesel: 'ಡೀಸೆಲ್‌ನಿಂದ ಮಾಸಿಕ ಉಳಿತಾಯ:',
      verdictTitle: 'ತೀರ್ಪಿನ ಮಾರ್ಗದರ್ಶಿ',
      verdictDesc: 'ತಿಂಗಳಿಗೆ 1,000 ಕಿ.ಮೀಗಿಂತ ಕಡಿಮೆ ಚಲಿಸುವವರಿಗೆ ಪೆಟ್ರೋಲ್ ಅಥವಾ ಸಿಎನ್‌ಜಿ ಕಾರು ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆಯಾಗಿದೆ.',
      resultSummaryTitle: 'ಪೆಟ್ರೋಲ್ vs ಡೀಸೆಲ್ ಹಣಕಾಸು ಹೋಲಿಕೆ:',
      monthlyDistanceText: 'ಮಾಸಿಕ ದೂರ',
      petrolMonthlyCostText: 'ಪೆಟ್ರೋಲ್ ಮಾಸಿಕ ವೆಚ್ಚ',
      dieselMonthlyCostText: 'ಡೀಸೆಲ್ ಮಾಸಿಕ ವೆಚ್ಚ',
      monthlyFuelSavingsText: 'ಡೀಸೆಲ್ ಮಾಸಿಕ ಉಳಿತಾಯ',
      dieselPremiumPriceText: 'ಡೀಸೆಲ್ ಹೆಚ್ಚುವರಿ ಬೆಲೆ',
      breakevenDistanceText: 'ಬ್ರೇಕ್-ಈವನ್ ದೂರ',
      recommendationText: 'ಶಿಫಾರಸು',
      dieselRecommended: 'ಡೀಸೆಲ್ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
      petrolRecommended: 'ಪೆಟ್ರೋಲ್ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಪ್ರತಿ ಕಿ.ಮೀ ವೆಚ್ಚ = ದರ ÷ ಮೈಲೇಜ್. ಮಾಸಿಕ ಉಳಿತಾಯ = ಮಾಸಿಕ ದೂರ × (ಪೆಟ್ರೋಲ್ ದರ - ಡೀಸೆಲ್ ದರ). ಬ್ರೇಕ್-ಈವನ್ ದೂರ = ಹೆಚ್ಚುವರಿ ಬೆಲೆ ÷ ಕಿ.ಮೀ ಉಳಿತಾಯ.',
    assumptions: ['ಸ್ಥಿರ ಇಂಧನ ಬೆಲೆಯ ಅಂದಾಜು.'],
    example: {
      title: 'ಎಸ್‌ಯುವಿ ಹೋಲಿಕೆ (1,500 ಕಿ.ಮೀ/ತಿಂಗಳು)',
      inputs: {
        'ಮಾಸಿಕ ದೂರ': '1,500 ಕಿ.ಮೀ',
        'ಪೆಟ್ರೋಲ್ ಮೈಲೇಜ್': '14 ಕಿ.ಮೀ/ಲೀ',
        'ಡೀಸೆಲ್ ಮೈಲೇಜ್': '19 ಕಿ.ಮೀ/ಲೀ',
        'ಡೀಸೆಲ್ ಹೆಚ್ಚುವರಿ ಬೆಲೆ': '₹1,25,000',
      },
      outputs: {
        'ಮಾಸಿಕ ಉಳಿತಾಯ': '₹3,824 / ತಿಂಗಳು',
        'ಬ್ರೇಕ್-ಈವನ್ ದೂರ': '49,020 ಕಿ.ಮೀ',
        'ಅವಧಿ': '33 ತಿಂಗಳುಗಳು',
      },
      explanation: 'ತಿಂಗಳಿಗೆ ₹3,824 ಉಳಿತಾಯದಿಂದ 33 ತಿಂಗಳುಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ ಬೆಲೆಯನ್ನು ಸರಿದೂಗಿಸಬಹುದು.',
    },
    faqs: [
      {
        question: 'ಕಡಿಮೆ ಚಾಲನೆ ಮಾಡುವವರಿಗೆ ಡೀಸೆಲ್ ಉತ್ತಮವೇ?',
        answer: 'ಇಲ್ಲ, ತಿಂಗಳಿಗೆ 1,000 ಕಿ.ಮೀಗಿಂತ ಕಡಿಮೆ ಓಡಿದರೆ ಹೆಚ್ಚುವರಿ ಬೆಲೆ ವಸೂಲಾಗಲು 5 ವರ್ಷಗಳಿಗಿಂತ ಹೆಚ್ಚು ಬೇಕಾಗುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('petrol-vs-diesel', petrolVsDieselTranslations)
