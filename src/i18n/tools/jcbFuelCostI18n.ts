import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface JcbFuelCostUI {
  machineParams: string
  liveReactivity: string
  machinePresetLabel: string
  operatingHoursPerDay: string
  hoursPerDay: string
  shiftGuide1: string
  shiftGuide8: string
  shiftGuide16: string
  fuelConsumptionLph: string
  lphShort: string
  dieselPriceLabel: string
  daysWorkedMonth: string
  daysShort: string
  operatingDieselBurn: string
  estimatedDailyDieselCost: string
  perDay: string
  burnSummaryText: string
  costPerHour: string
  litresPerDay: string
  weeklyCost: string
  monthlyCost: string
  daysShift: string
  perMonthLitres: string
  annualDieselExpenditure: string
  contractorTipTitle: string
  contractorTipDesc: string
  resultSummaryTitle: string
  machineText: string
  operatingHoursText: string
  dieselPriceSummaryText: string
  hourlyFuelCostText: string
  dailyFuelCostText: string
  monthlyFuelCostText: string
  annualFuelBurnText: string
  calculatedOn: string
}

export const jcbFuelCostTranslations: ToolLocaleMap<JcbFuelCostUI> = {
  en: {
    meta: {
      title: 'JCB Fuel Consumption & Hourly Cost Calculator | IndiaTools',
      metaDescription: 'Calculate hourly, daily, and monthly diesel costs for JCB 3DX, excavators, and backhoe loaders in India. Accurate fuel estimates.',
      h1: 'JCB Fuel Cost Calculator',
      subtitle: 'Calculate daily, monthly, and hourly diesel expenses for backhoe loaders, excavators, and heavy construction equipment.',
    },
    ui: {
      machineParams: 'Machine & Operating Parameters',
      liveReactivity: 'Live Reactivity',
      machinePresetLabel: 'Machine Model / Equipment Type',
      operatingHoursPerDay: 'Operating Hours Per Day',
      hoursPerDay: 'Hours / Day',
      shiftGuide1: '1 hr (Shift start)',
      shiftGuide8: '8 hrs (Standard)',
      shiftGuide16: '16+ hrs (Double shift)',
      fuelConsumptionLph: 'Fuel Consumption (Litres / Hour)',
      lphShort: 'L/hr',
      dieselPriceLabel: 'Diesel Price (₹ / Litre)',
      daysWorkedMonth: 'Days Worked / Month',
      daysShort: 'days',
      operatingDieselBurn: 'Operating Diesel Burn',
      estimatedDailyDieselCost: 'Estimated Daily Diesel Cost',
      perDay: '/ day',
      burnSummaryText: 'Burn: {litres} Litres / Day • ₹{hourlyCost} / Operating Hour',
      costPerHour: 'Cost / Hour',
      litresPerDay: 'Litres / Day',
      weeklyCost: 'Weekly Cost',
      monthlyCost: 'Monthly Cost',
      daysShift: '6 Days shift',
      perMonthLitres: '{litres} L / month',
      annualDieselExpenditure: 'Annual Diesel Expenditure (12 mo):',
      contractorTipTitle: 'Contractor Tip:',
      contractorTipDesc: 'In heavy rock excavation or hydraulic breaker operation, add +1.5 L/hr to the standard fuel rate.',
      resultSummaryTitle: 'JCB / Excavator Fuel Estimation:',
      machineText: 'Machine',
      operatingHoursText: 'Operating Hours',
      dieselPriceSummaryText: 'Diesel Price',
      hourlyFuelCostText: 'Hourly Fuel Cost',
      dailyFuelCostText: 'Daily Fuel Cost',
      monthlyFuelCostText: 'Monthly Fuel Cost',
      annualFuelBurnText: 'Annual Fuel Burn',
      calculatedOn: 'Calculated on IndiaTools',
    },
    formulaExplanation: 'Hourly Diesel Cost = Litres Per Hour (LPH) × Diesel Price. Daily Fuel Cost = Daily Hours × Hourly Cost. Monthly Diesel Cost = Daily Cost × Working Days Per Month. Annual Diesel Cost = Monthly Cost × 12.',
    assumptions: [
      'Standard machine engine health and regular fuel filter maintenance.',
      'Average load cycles blending loading, trenching, and idling.',
    ],
    example: {
      title: 'JCB 3DX EcoXcellence 8-Hour Daily Shift',
      inputs: {
        'Machine': 'JCB 3DX (4.8 L/hr)',
        'Hours / Day': '8 Hours',
        'Diesel Price': '₹90/L',
        'Working Days': '26 Days / Month',
      },
      outputs: {
        'Daily Fuel Cost': '₹3,456 / day (38.4 Litres)',
        'Monthly Diesel Cost': '₹89,856 / month',
        'Hourly Cost': '₹432 / hour',
      },
      explanation: 'Operating a JCB 3DX for 8 hours burns 38.4 litres of diesel per day. Over 26 monthly working days, the total diesel bill comes to ₹89,856.',
    },
    faqs: [
      {
        question: 'What is the average diesel consumption of a JCB 3DX per hour?',
        answer: 'A standard JCB 3DX typically consumes between 4.5 to 5.2 litres of diesel per hour during regular excavation and loading work, and around 5.5 to 6.5 litres when operating a hydraulic rock breaker.',
      },
      {
        question: 'How do I reduce excavator fuel consumption on construction sites?',
        answer: 'Avoid excessive idle engine times beyond 5 minutes, operate in Eco mode for light backfilling, and clean air filters weekly in dusty site conditions.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'JCB ഇന്ധന ഉപഭോഗവും മണിക്കൂർ ചെലവ് കാൽക്കുലേറ്ററും | IndiaTools',
      metaDescription: 'JCB 3DX, ഹിറ്റാച്ചി, എക്‌സ്‌കവേറ്റർ എന്നിവയുടെ മണിക്കൂർ, ദിവസ, പ്രതിമാസ ഡീസൽ ചെലവുകൾ കൃത്യമായി കണക്കാക്കുക. കോൺട്രാക്ടർമാർക്ക് സൗജന്യം.',
      h1: 'JCB ഇന്ധന ചെലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ജെസിബി, എക്‌സ്‌കവേറ്റർ, മണ്ണുമാന്തി യന്ത്രങ്ങളുടെ പ്രതിദിന, പ്രതിമാസ, മണിക്കൂർ ഡീസൽ ചെലവുകൾ കൃത്യമായി കണക്കാക്കുക.',
    },
    ui: {
      machineParams: 'മെഷീനും പ്രവർത്തന വിവരങ്ങളും',
      liveReactivity: 'തത്സമയ കണക്കുകൂട്ടൽ',
      machinePresetLabel: 'മെഷീൻ മോഡൽ / തരം',
      operatingHoursPerDay: 'പ്രതിദിന ജോലി സമയം (മണിക്കൂർ)',
      hoursPerDay: 'മണിക്കൂർ / ദിവസം',
      shiftGuide1: '1 മണിക്കൂർ (തുടക്കം)',
      shiftGuide8: '8 മണിക്കൂർ (സാധാരണ ഷിഫ്റ്റ്)',
      shiftGuide16: '16+ മണിക്കൂർ (ഇരട്ട ഷിഫ്റ്റ്)',
      fuelConsumptionLph: 'ഇന്ധന ഉപഭോഗം (ലിറ്റർ / മണിക്കൂർ)',
      lphShort: 'ലി/മണിക്കൂർ',
      dieselPriceLabel: 'ഡീസൽ വില (₹ / ലിറ്റർ)',
      daysWorkedMonth: 'മാസത്തിൽ പ്രവർത്തിക്കുന്ന ദിവസങ്ങൾ',
      daysShort: 'ദിവസങ്ങൾ',
      operatingDieselBurn: 'ഡീസൽ ഉപഭോഗ കണക്ക്',
      estimatedDailyDieselCost: 'പ്രതിദിന ഡീസൽ ചെലവ്',
      perDay: '/ ദിവസം',
      burnSummaryText: 'ഉപഭോഗം: {litres} ലിറ്റർ/ദിവസം • മണിക്കൂറിൽ ₹{hourlyCost}',
      costPerHour: 'മണിക്കൂർ ചെലവ്',
      litresPerDay: 'പ്രതിദിന ലിറ്റർ',
      weeklyCost: 'ആഴ്ചയിലെ ചെലവ്',
      monthlyCost: 'പ്രതിമാസ ചെലവ്',
      daysShift: '6 ദിവസത്തെ ഷിഫ്റ്റ്',
      perMonthLitres: 'പ്രതിമാസം {litres} ലിറ്റർ',
      annualDieselExpenditure: 'വാർഷിക ഡീസൽ ചെലവ് (12 മാസം):',
      contractorTipTitle: 'കോൺട്രാക്ടർ ടിപ്പ്:',
      contractorTipDesc: 'പാറ പൊട്ടിക്കുന്ന ബ്രേക്കർ ഉപയോഗിക്കുമ്പോഴും കഠിനമായ മണ്ണെടുപ്പിലും ലിറ്ററിൽ 1.5 ലിറ്റർ അധികം കണക്കാക്കുക.',
      resultSummaryTitle: 'JCB / എക്‌സ്‌കവേറ്റർ ഇന്ധന കണക്ക്:',
      machineText: 'മെഷീൻ',
      operatingHoursText: 'ജോലി സമയം',
      dieselPriceSummaryText: 'ഡീസൽ വില',
      hourlyFuelCostText: 'മണിക്കൂർ ചെലവ്',
      dailyFuelCostText: 'പ്രതിദിന ചെലവ്',
      monthlyFuelCostText: 'പ്രതിമാസ ചെലവ്',
      annualFuelBurnText: 'വാർഷിക ഡീസൽ ചെലവ്',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'മണിക്കൂർ ചെലവ് = ലിറ്റർ/മണിക്കൂർ × ഡീസൽ വില. പ്രതിദിന ചെലവ് = പ്രതിദിന മണിക്കൂർ × മണിക്കൂർ ചെലവ്. പ്രതിമാസ ചെലവ് = പ്രതിദിന ചെലവ് × ജോലി ദിവസങ്ങൾ.',
    assumptions: ['കൃത്യമായ സർവീസിംഗും ഫിൽട്ടർ പരിപാലനവും ഉള്ള യന്ത്രം.'],
    example: {
      title: 'JCB 3DX 8 മണിക്കൂർ ഷിഫ്റ്റ്',
      inputs: {
        'മെഷീൻ': 'JCB 3DX (4.8 ലി/മണിക്കൂർ)',
        'സമയം': '8 മണിക്കൂർ/ദിവസം',
        'ഡീസൽ വില': '₹90/ലിറ്റർ',
        'ജോലി ദിവസങ്ങൾ': '26 ദിവസം/മാസം',
      },
      outputs: {
        'പ്രതിദിന ചെലവ്': '₹3,456 / ദിവസം (38.4 ലിറ്റർ)',
        'പ്രതിമാസ ചെലവ്': '₹89,856 / മാസം',
        'മണിക്കൂർ ചെലവ്': '₹432 / മണിക്കൂർ',
      },
      explanation: 'ഒരു ദിവസം 8 മണിക്കൂർ പ്രവർത്തിക്കുന്ന ജെസിബിക്ക് പ്രതിദിനം ₹3,456-ഉം 26 ദിവസത്തെ മാസത്തേക്ക് ₹89,856-ഉം ഡീസൽ ചെലവ് വരുന്നു.',
    },
    faqs: [
      {
        question: 'ഒരു മണിക്കൂർ പ്രവർത്തിക്കാൻ JCB 3DX എത്ര ലിറ്റർ ഡീസൽ എടുക്കും?',
        answer: 'സാധാരണ മണ്ണെടുപ്പിന് ഒരു മണിക്കൂറിൽ ഏകദേശം 4.5 മുതൽ 5.2 ലിറ്റർ വരെയും, റോക്ക് ബ്രേക്കർ ഉപയോഗിക്കുമ്പോൾ 5.5 മുതൽ 6.5 ലിറ്റർ വരെയും ഡീസൽ ആവശ്യമാണ്.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'JCB Fuel Consumption & Hourly Cost Calculator | IndiaTools',
      metaDescription: 'Calculate hourly, daily, and monthly diesel costs for JCB 3DX, excavators, and backhoe loaders in India. Accurate fuel estimates.',
      h1: 'JCB ईंधन लागत कैलकुलेटर',
      subtitle: 'बैकहो लोडर, पोकलेन और उत्खनन मशीनों के लिए दैनिक, मासिक व प्रति घंटा डीजल खर्च की गणना करें।',
    },
    ui: {
      machineParams: 'मशीन व परिचालन पैरामीटर',
      liveReactivity: 'लाइव गणना',
      machinePresetLabel: 'मशीन मॉडल / उपकरण का प्रकार',
      operatingHoursPerDay: 'प्रतिदिन कार्य घंटे',
      hoursPerDay: 'घंटे / दिन',
      shiftGuide1: '1 घंटा (प्रारंभ)',
      shiftGuide8: '8 घंटे (मानक शिफ्ट)',
      shiftGuide16: '16+ घंटे (डबल शिफ्ट)',
      fuelConsumptionLph: 'ईंधन खपत (लीटर / घंटा)',
      lphShort: 'ली/घंटा',
      dieselPriceLabel: 'डीजल दर (₹ / लीटर)',
      daysWorkedMonth: 'प्रति माह कार्य दिवस',
      daysShort: 'दिन',
      operatingDieselBurn: 'डीजल खपत विवरण',
      estimatedDailyDieselCost: 'अनुमानित दैनिक डीजल लागत',
      perDay: '/ दिन',
      burnSummaryText: 'खपत: {litres} लीटर/दिन • ₹{hourlyCost} / कार्य घंटा',
      costPerHour: 'प्रति घंटा लागत',
      litresPerDay: 'दैनिक लीटर',
      weeklyCost: 'साप्ताहिक लागत',
      monthlyCost: 'मासिक लागत',
      daysShift: '6 दिन शिफ्ट',
      perMonthLitres: '{litres} ली / माह',
      annualDieselExpenditure: 'वार्षिक डीजल व्यय (12 माह):',
      contractorTipTitle: 'ठेकेदार टिप:',
      contractorTipDesc: 'पत्थर तोड़ने (हाइड्रोलिक ब्रेकर) या भारी खुदाई में मानक दर में +1.5 ली/घंटा अतिरिक्त जोड़ें।',
      resultSummaryTitle: 'JCB / उत्खनन डीजल अनुमान:',
      machineText: 'मशीन',
      operatingHoursText: 'कार्य घंटे',
      dieselPriceSummaryText: 'डीजल दर',
      hourlyFuelCostText: 'प्रति घंटा डीजल लागत',
      dailyFuelCostText: 'दैनिक डीजल लागत',
      monthlyFuelCostText: 'मासिक डीजल लागत',
      annualFuelBurnText: 'वार्षिक डीजल खर्च',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'प्रति घंटा लागत = लीटर प्रति घंटा × डीजल दर। दैनिक लागत = कार्य घंटे × प्रति घंटा लागत। मासिक लागत = दैनिक लागत × कार्य दिवस।',
    assumptions: ['मशीन का सही रखरखाव और नियमित सर्विसिंग।'],
    example: {
      title: 'JCB 3DX 8 घंटे की शिफ्ट',
      inputs: {
        'मशीन': 'JCB 3DX (4.8 ली/घंटा)',
        'कार्य घंटे': '8 घंटे/दिन',
        'डीजल दर': '₹90/ली',
        'कार्य दिवस': '26 दिन/माह',
      },
      outputs: {
        'दैनिक डीजल खर्च': '₹3,456 / दिन (38.4 लीटर)',
        'मासिक खर्च': '₹89,856 / माह',
        'प्रति घंटा लागत': '₹432 / घंटा',
      },
      explanation: '8 घंटे रोजाना चलने वाली जेसीबी का दैनिक खर्च ₹3,456 और 26 दिन का मासिक डीजल खर्च ₹89,856 आता है।',
    },
    faqs: [
      {
        question: 'JCB 3DX 1 घंटे में कितना डीजल पीती है?',
        answer: 'सामान्य खुदाई और लोडिंग में 4.5 से 5.2 लीटर प्रति घंटा और रॉक ब्रेकर चलाने पर 5.5 से 6.5 लीटर प्रति घंटा डीजल लगता है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'JCB Fuel Consumption & Hourly Cost Calculator | IndiaTools',
      metaDescription: 'Calculate hourly, daily, and monthly diesel costs for JCB 3DX, excavators, and backhoe loaders in India. Accurate fuel estimates.',
      h1: 'JCB எரிபொருள் செலவு கால்குலேட்டர்',
      subtitle: 'ஜேசிபி, எக்ஸ்கவேட்டர் மற்றும் கனரக இயந்திரங்களின் தினசரி, மாதாந்திர மற்றும் மணிநேர டீசல் செலவைக் கணக்கிடுங்கள்.',
    },
    ui: {
      machineParams: 'இயந்திரம் & செயல்பாட்டு விவரங்கள்',
      liveReactivity: 'நேரடி கணக்கீடு',
      machinePresetLabel: 'இயந்திர மாதிரி / வகை',
      operatingHoursPerDay: 'தினசரி வேலை நேரம் (மணிநேரம்)',
      hoursPerDay: 'மணிநேரம் / நாள்',
      shiftGuide1: '1 மணிநேரம்',
      shiftGuide8: '8 மணிநேரம் (வழக்கமான ஷிப்ட்)',
      shiftGuide16: '16+ மணிநேரம் (இரட்டை ஷிப்ட்)',
      fuelConsumptionLph: 'டீசல் நுகர்வு (லிட்டர் / மணிநேரம்)',
      lphShort: 'லி/மணி',
      dieselPriceLabel: 'டீசல் விலை (₹ / லிட்டர்)',
      daysWorkedMonth: 'மாத வேலை நாட்கள்',
      daysShort: 'நாட்கள்',
      operatingDieselBurn: 'டீசல் நுகர்வு விவரம்',
      estimatedDailyDieselCost: 'மதிப்பிடப்பட்ட தினசரி டீசல் செலவு',
      perDay: '/ நாள்',
      burnSummaryText: 'நுகர்வு: {litres} லிட்டர்/நாள் • ஒரு மணிநேரத்திற்கு ₹{hourlyCost}',
      costPerHour: 'மணிநேர செலவு',
      litresPerDay: 'தினசரி லிட்டர்',
      weeklyCost: 'வாராந்திர செலவு',
      monthlyCost: 'மாதாந்திர செலவு',
      daysShift: '6 நாள் ஷிப்ட்',
      perMonthLitres: '{litres} லி / மாதம்',
      annualDieselExpenditure: 'வருடாந்திர டீசல் செலவு (12 மாதம்):',
      contractorTipTitle: 'ஒப்பந்ததாரர் குறிப்பு:',
      contractorTipDesc: 'பாறை உடைக்கும் பிரேக்கர் பயன்படுத்தும் போது கூடுதல் 1.5 லி/மணி சேர்த்து கணக்கிடுங்கள்.',
      resultSummaryTitle: 'JCB டீசல் செலவு மதிப்பீடு:',
      machineText: 'இயந்திரம்',
      operatingHoursText: 'வேலை நேரம்',
      dieselPriceSummaryText: 'டீசல் விலை',
      hourlyFuelCostText: 'மணிநேர செலவு',
      dailyFuelCostText: 'தினசரி செலவு',
      monthlyFuelCostText: 'மாதாந்திர செலவு',
      annualFuelBurnText: 'வருடாந்திர செலவு',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'மணிநேர செலவு = லிட்டர்/மணி × விலை. தினசரி செலவு = மணிநேரம் × மணிநேர செலவு. மாத செலவு = தினசரி செலவு × வேலை நாட்கள்.',
    assumptions: ['சரியான இயந்திர பராமரிப்பு.'],
    example: {
      title: 'JCB 3DX 8 மணிநேர ஷிப்ட்',
      inputs: {
        'இயந்திரம்': 'JCB 3DX (4.8 லி/மணி)',
        'நேரம்': '8 மணிநேரம்/நாள்',
        'டீசல் விலை': '₹90/லி',
        'வேலை நாட்கள்': '26 நாட்கள்/மாதம்',
      },
      outputs: {
        'தினசரி செலவு': '₹3,456 / நாள் (38.4 லிட்டர்)',
        'மாதாந்திர செலவு': '₹89,856 / மாதம்',
        'மணிநேர செலவு': '₹432 / மணி',
      },
      explanation: '8 மணிநேரம் இயங்கும் ஜேசிபிக்கு தினசரி ₹3,456 மற்றும் 26 நாட்களுக்கு ₹89,856 டீசல் செலவாகிறது.',
    },
    faqs: [
      {
        question: 'ஜேசிபி ஒரு மணி நேரத்திற்கு எத்தனை லிட்டர் டீசல் எடுக்கும்?',
        answer: 'சாதாரண வேலைக்கு 4.5 முதல் 5.2 லிட்டரும், பாறை உடைக்கும் போது 5.5 முதல் 6.5 லிட்டரும் செலவாகும்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'JCB Fuel Consumption & Hourly Cost Calculator | IndiaTools',
      metaDescription: 'Calculate hourly, daily, and monthly diesel costs for JCB 3DX, excavators, and backhoe loaders in India. Accurate fuel estimates.',
      h1: 'JCB ఇంధన ఖర్చు కాలిక్యులేటర్',
      subtitle: 'జేసీబీ, ఎక్స్కవేటర్ల రోజువారీ, నెలవారీ మరియు గంట డీజిల్ ఖర్చులను ఖచ్చితంగా లెక్కించండి.',
    },
    ui: {
      machineParams: 'మెషిన్ & ఆపరేటింగ్ వివరాలు',
      liveReactivity: 'ప్రత్యక్ష లెక్కింపు',
      machinePresetLabel: 'మెషిన్ మోడల్ / రకం',
      operatingHoursPerDay: 'రోజువారీ పని గంటలు',
      hoursPerDay: 'గంటలు / రోజు',
      shiftGuide1: '1 గంట',
      shiftGuide8: '8 గంటలు (సాధారణ షిఫ్ట్)',
      shiftGuide16: '16+ గంటలు (డబుల్ షిఫ్ట్)',
      fuelConsumptionLph: 'డీజిల్ వినియోగం (లీటర్లు / గంట)',
      lphShort: 'లీ/గంట',
      dieselPriceLabel: 'డీజిల్ ధర (₹ / లీటరు)',
      daysWorkedMonth: 'నెలలో పని దినాలు',
      daysShort: 'రోజులు',
      operatingDieselBurn: 'డీజిల్ వినియోగ వివరాలు',
      estimatedDailyDieselCost: 'అంచనా రోజువారీ డీజిల్ ఖర్చు',
      perDay: '/ రోజు',
      burnSummaryText: 'వినియోగం: {litres} లీటర్లు/రోజు • గంటకు ₹{hourlyCost}',
      costPerHour: 'గంటకు ఖర్చు',
      litresPerDay: 'రోజువారీ లీటర్లు',
      weeklyCost: 'వారపు ఖర్చు',
      monthlyCost: 'నెలవారీ ఖర్చు',
      daysShift: '6 రోజుల షిఫ్ట్',
      perMonthLitres: '{litres} లీ / నెల',
      annualDieselExpenditure: 'వార్షిక డీజిల్ ఖర్చు (12 నెలలు):',
      contractorTipTitle: 'కాంట్రాక్టర్ చిట్కా:',
      contractorTipDesc: 'బ్రేకర్ ఆపరేషన్ లేదా రాతి తవ్వకాలలో ప్రామాణిక రేటుకు +1.5 లీ/గంట అదనంగా కలపండి.',
      resultSummaryTitle: 'JCB డీజిల్ అంచనా:',
      machineText: 'మెషిన్',
      operatingHoursText: 'పని గంటలు',
      dieselPriceSummaryText: 'డీజిల్ ధర',
      hourlyFuelCostText: 'గంట ఖర్చు',
      dailyFuelCostText: 'రోజువారీ ఖర్చు',
      monthlyFuelCostText: 'నెలవారీ ఖర్చు',
      annualFuelBurnText: 'వార్షిక ఖర్చు',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'గంట ఖర్చు = లీటర్/గంట × ధర. రోజు ఖర్చు = పని గంటలు × గంట ఖర్చు. నెల ఖర్చు = రోజు ఖర్చు × పని దినాలు.',
    assumptions: ['సక్రమమైన యంత్ర నిర్వహణ.'],
    example: {
      title: 'JCB 3DX 8 గంటల షిఫ్ట్',
      inputs: {
        'మెషిన్': 'JCB 3DX (4.8 లీ/గంట)',
        'పని గంటలు': '8 గంటలు/రోజు',
        'డీజిల్ ధర': '₹90/లీ',
        'పని దినాలు': '26 రోజులు/నెల',
      },
      outputs: {
        'రోజువారీ ఖర్చు': '₹3,456 / రోజు (38.4 లీటర్లు)',
        'నెలవారీ ఖర్చు': '₹89,856 / నెల',
        'గంట ఖర్చు': '₹432 / గంట',
      },
      explanation: 'రోజూ 8 గంటలు నడిచే జేసీబీకి రోజుకు ₹3,456 మరియు 26 రోజులకు ₹89,856 డీజిల్ ఖర్చు అవుతుంది.',
    },
    faqs: [
      {
        question: 'జేసీబీ గంటకు ఎన్ని లీటర్ల డీజిల్ తాగుతుంది?',
        answer: 'సాధారణ తవ్వకాలకు 4.5 నుండి 5.2 లీటర్లు, బ్రేకర్ పనిచేసినప్పుడు 5.5 నుండి 6.5 లీటర్ల డీజిల్ అవసరమవుతుంది.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'JCB Fuel Consumption & Hourly Cost Calculator | IndiaTools',
      metaDescription: 'Calculate hourly, daily, and monthly diesel costs for JCB 3DX, excavators, and backhoe loaders in India. Accurate fuel estimates.',
      h1: 'JCB ಇಂಧನ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಜೆಸಿಬಿ, ಹಿಟಾಚಿ, ಎಕ್ಸ್‌ಕವೇಟರ್‌ಗಳ ದೈನಂದಿನ, ಮಾಸಿಕ ಮತ್ತು ಗಂಟೆಯ ಡೀಸೆಲ್ ವೆಚ್ಚವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
    },
    ui: {
      machineParams: 'ಮೆಷಿನ್ & ಕಾರ್ಯಾಚರಣೆಯ ವಿವರಗಳು',
      liveReactivity: 'ಲೈವ್ ಲೆಕ್ಕಾಚಾರ',
      machinePresetLabel: 'ಮೆಷಿನ್ ಮಾದರಿ / ಉಪಕರಣದ ಮಾದರಿ',
      operatingHoursPerDay: 'ದೈನಂದಿನ ಕೆಲಸದ ಅವಧಿ (ಗಂಟೆಗಳು)',
      hoursPerDay: 'ಗಂಟೆ / ದಿನ',
      shiftGuide1: '1 ಗಂಟೆ',
      shiftGuide8: '8 ಗಂಟೆ (ಸಾಮಾನ್ಯ ಶಿಫ್ಟ್)',
      shiftGuide16: '16+ ಗಂಟೆ (ಡಬಲ್ ಶಿಫ್ಟ್)',
      fuelConsumptionLph: 'ಡೀಸೆಲ್ ಬಳಕೆ (ಲೀಟರ್ / ಗಂಟೆ)',
      lphShort: 'ಲೀ/ಗಂಟೆ',
      dieselPriceLabel: 'ಡೀಸೆಲ್ ದರ (₹ / ಲೀಟರ್)',
      daysWorkedMonth: 'ತಿಂಗಳ ಕೆಲಸದ ದಿನಗಳು',
      daysShort: 'ದಿನಗಳು',
      operatingDieselBurn: 'ಡೀಸೆಲ್ ಬಳಕೆಯ ವಿವರ',
      estimatedDailyDieselCost: 'ಅಂದಾಜು ದೈನಂದಿನ ಡೀಸೆಲ್ ವೆಚ್ಚ',
      perDay: '/ ದಿನ',
      burnSummaryText: 'ಬಳಕೆ: {litres} ಲೀಟರ್/ದಿನ • ಗಂಟೆಗೆ ₹{hourlyCost}',
      costPerHour: 'ಗಂಟೆಯ ವೆಚ್ಚ',
      litresPerDay: 'ದೈನಂದಿನ ಲೀಟರ್',
      weeklyCost: 'ವಾರದ ವೆಚ್ಚ',
      monthlyCost: 'ಮಾಸಿಕ ವೆಚ್ಚ',
      daysShift: '6 ದಿನಗಳ ಶಿಫ್ಟ್',
      perMonthLitres: '{litres} ಲೀ / ತಿಂಗಳು',
      annualDieselExpenditure: 'ವಾರ್ಷಿಕ ಡೀಸೆಲ್ ವೆಚ್ಚ (12 ತಿಂಗಳು):',
      contractorTipTitle: 'ಗುತ್ತಿಗೆದಾರರ ಸಲಹೆ:',
      contractorTipDesc: 'ಬಂಡೆ ಒಡೆಯುವ ಬ್ರೇಕರ್ ಅಥವಾ ಕಠಿಣ ಕೆಲಸಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ 1.5 ಲೀ/ಗಂಟೆ ಸೇರಿಸಿ ಲೆಕ್ಕಹಾಕಿ.',
      resultSummaryTitle: 'JCB ಡೀಸೆಲ್ ಅಂದಾಜು:',
      machineText: 'ಮೆಷಿನ್',
      operatingHoursText: 'ಕೆಲಸದ ಅವಧಿ',
      dieselPriceSummaryText: 'ಡೀಸೆಲ್ ದರ',
      hourlyFuelCostText: 'ಗಂಟೆಯ ವೆಚ್ಚ',
      dailyFuelCostText: 'ದೈನಂದಿನ ವೆಚ್ಚ',
      monthlyFuelCostText: 'ಮಾಸಿಕ ವೆಚ್ಚ',
      annualFuelBurnText: 'ವಾರ್ಷಿಕ ವೆಚ್ಚ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಗಂಟೆಯ ವೆಚ್ಚ = ಲೀಟರ್/ಗಂಟೆ × ದರ. ದಿನದ ವೆಚ್ಚ = ಕೆಲಸದ ಗಂಟೆಗಳು × ಗಂಟೆಯ ವೆಚ್ಚ. ತಿಂಗಳ ವೆಚ್ಚ = ದಿನದ ವೆಚ್ಚ × ಕೆಲಸದ ದಿನಗಳು.',
    assumptions: ['ಸರಿಯಾದ ಯಂತ್ರ ನಿರ್ವಹಣೆ.'],
    example: {
      title: 'JCB 3DX 8 ಗಂಟೆಗಳ ಶಿಫ್ಟ್',
      inputs: {
        'ಮೆಷಿನ್': 'JCB 3DX (4.8 ಲೀ/ಗಂಟೆ)',
        'ಕೆಲಸದ ಗಂಟೆಗಳು': '8 ಗಂಟೆ/ದಿನ',
        'ಡೀಸೆಲ್ ಬೆಲೆ': '₹90/ಲೀ',
        'ಕೆಲಸದ ದಿನಗಳು': '26 ದಿನಗಳು/ತಿಂಗಳು',
      },
      outputs: {
        'ದೈನಂದಿನ ವೆಚ್ಚ': '₹3,456 / ದಿನ (38.4 ಲೀಟರ್)',
        'ಮಾಸಿಕ ವೆಚ್ಚ': '₹89,856 / ತಿಂಗಳು',
        'ಗಂಟೆಯ ವೆಚ್ಚ': '₹432 / ಗಂಟೆ',
      },
      explanation: 'ದಿನಕ್ಕೆ 8 ಗಂಟೆ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಜೆಸಿಬಿಗೆ ದಿನಕ್ಕೆ ₹3,456 ಮತ್ತು 26 ದಿನಗಳಿಗೆ ₹89,856 ಡೀಸೆಲ್ ವೆಚ್ಚವಾಗುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ಜೆಸಿಬಿ 1 ಗಂಟೆಗೆ ಎಷ್ಟು ಲೀಟರ್ ಡೀಸೆಲ್ ಬಳಸುತ್ತದೆ?',
        answer: 'ಸಾಮಾನ್ಯ ಕೆಲಸಕ್ಕೆ 4.5 ರಿಂದ 5.2 ಲೀಟರ್ ಮತ್ತು ಬ್ರೇಕರ್ ಕಾರ್ಯಾಚರಣೆಗೆ 5.5 ರಿಂದ 6.5 ಲೀಟರ್ ಡೀಸೆಲ್ ಬೇಕಾಗುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('jcb-fuel-cost', jcbFuelCostTranslations)
