import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface MonthlyVehicleRunningCostUI {
  monthlyOwnershipInputs: string
  completeTcoModel: string
  expectedMonthlyDriving: string
  kmPerMonth: string
  drivingGuideWeekend: string
  drivingGuideCommute: string
  drivingGuideCommercial: string
  vehicleMileage: string
  kmPerLShort: string
  fuelPrice: string
  loanInsuranceUpkeep: string
  monthlyLoanEmi: string
  annualInsurance: string
  annualMaintenance: string
  totalMonthlyOutflow: string
  perMonth: string
  annualCommitmentText: string
  perYear: string
  fuelExpenseShare: string
  loanEmiShare: string
  insuranceShare: string
  serviceShare: string
  tcoInsightTitle: string
  tcoInsightDesc: string
  resultSummaryTitle: string
  monthlyDistanceText: string
  fuelExpenseText: string
  emiLoanText: string
  insuranceShareText: string
  maintenanceText: string
  totalMonthlyOutflowText: string
  totalAnnualOutflowText: string
  effectiveCostPerKmText: string
  calculatedOn: string
}

export const monthlyVehicleRunningCostTranslations: ToolLocaleMap<MonthlyVehicleRunningCostUI> = {
  en: {
    meta: {
      title: 'Monthly Vehicle Running Cost Calculator | Car & Bike TCO | IndiaTools',
      metaDescription: 'Calculate the total cost of car or bike ownership in India. Combine fuel, loan EMI, insurance, maintenance, and per-km running expense.',
      h1: 'Monthly Vehicle Running Cost Calculator',
      subtitle: 'Analyze true vehicle ownership costs including fuel, loan EMI, insurance, and routine service per kilometer.',
    },
    ui: {
      monthlyOwnershipInputs: 'Monthly Ownership Inputs',
      completeTcoModel: 'Complete TCO Model',
      expectedMonthlyDriving: 'Expected Monthly Driving',
      kmPerMonth: 'km/month',
      drivingGuideWeekend: '200 km (Weekend only)',
      drivingGuideCommute: '1,200 km (Daily Commute)',
      drivingGuideCommercial: '3,500+ km (Commercial)',
      vehicleMileage: 'Vehicle Mileage (km/L)',
      kmPerLShort: 'km/L',
      fuelPrice: 'Fuel Price (₹/Litre)',
      loanInsuranceUpkeep: 'Loan, Insurance & Upkeep',
      monthlyLoanEmi: 'Monthly Loan EMI (₹)',
      annualInsurance: 'Annual Insurance Premium (₹)',
      annualMaintenance: 'Annual Maintenance / Service (₹)',
      totalMonthlyOutflow: 'Total Monthly Outflow',
      perMonth: '/ month',
      annualCommitmentText: 'Annual combined vehicle commitment:',
      perYear: '/year',
      fuelExpenseShare: 'Fuel Expense',
      loanEmiShare: 'Loan EMI',
      insuranceShare: 'Insurance (Monthly Prorated)',
      serviceShare: 'Service & Maintenance',
      tcoInsightTitle: 'Indian TCO Insight',
      tcoInsightDesc: 'In India, fixed costs (loan depreciation + insurance) often exceed fuel costs for drives under 800 km/month. At ₹{costPerKm}/km, if you drive infrequently, cab services may be more economical than outright ownership.',
      resultSummaryTitle: 'Monthly Vehicle Running Cost Breakdown:',
      monthlyDistanceText: 'Monthly Distance',
      fuelExpenseText: 'Fuel Expense',
      emiLoanText: 'EMI / Loan',
      insuranceShareText: 'Insurance (Monthly share)',
      maintenanceText: 'Service & Maintenance',
      totalMonthlyOutflowText: 'TOTAL MONTHLY OUTFLOW',
      totalAnnualOutflowText: 'TOTAL ANNUAL OUTFLOW',
      effectiveCostPerKmText: 'EFFECTIVE COST PER KM',
      calculatedOn: 'Calculated via IndiaTools',
    },
    formulaExplanation: 'Monthly Fuel Cost = (Monthly km ÷ Mileage) × Fuel Price. Monthly Insurance = Annual Premium ÷ 12. Monthly Maintenance = Annual Service ÷ 12. Total Monthly Cost = Monthly Fuel Cost + Loan EMI + Monthly Insurance + Monthly Maintenance. Cost per km = Total Monthly Cost ÷ Monthly km.',
    assumptions: [
      'Annual insurance and scheduled service costs are evenly distributed over 12 months.',
      'Excludes unplanned accidental damage covered under comprehensive zero-dep insurance.',
    ],
    example: {
      title: 'Compact Hatchback Ownership (1,200 km/mo)',
      inputs: {
        'Monthly Distance': '1,200 km',
        'Mileage': '15 km/L',
        'Fuel Price': '₹102/L',
        'Loan EMI': '₹8,500/mo',
        'Annual Insurance': '₹14,000',
        'Annual Service': '₹9,000',
      },
      outputs: {
        'Monthly Fuel': '₹8,160',
        'Total Monthly Outflow': '₹18,577',
        'Cost per Km': '₹15.48 / km',
      },
      explanation: 'At 1,200 km/month, the total vehicle commitment is ₹18,577/month, giving an effective ownership cost of ₹15.48 per kilometre driven.',
    },
    faqs: [
      {
        question: 'What is Total Cost of Ownership (TCO) for a vehicle?',
        answer: 'TCO accounts for all real-world expenses including fuel consumption, loan interest & EMI, periodic insurance renewals, and routine maintenance rather than just fuel alone.',
      },
      {
        question: 'When is taking cabs cheaper than buying a car in India?',
        answer: 'If your monthly running is below 500-600 km and you purchase a car on EMI, depreciation and fixed insurance often make car ownership 2x to 3x more expensive per km than ride-hailing services.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'പ്രതിമാസ വാഹന ചെലവ് കാൽക്കുലേറ്റർ | കാർ & ബൈക്ക് ഉടമസ്ഥതാ ചെലവ് | IndiaTools',
      metaDescription: 'ഇന്ധനം, ലോൺ ഇഎംഐ, ഇൻഷുറൻസ്, സർവീസ് എന്നിവ ഉൾപ്പെടെ കാർ/ബൈക്ക് പ്രതിമാസ ചെലവും കിലോമീറ്റർ നിരക്കും കൃത്യമായി കണക്കാക്കുക.',
      h1: 'പ്രതിമാസ വാഹന ചെലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ഇന്ധനം, ലോൺ ഇഎംഐ, വാർഷിക ഇൻഷുറൻസ്, മെയിന്റനൻസ് എന്നിവ ഉൾപ്പെടെ യഥാർത്ഥ പ്രതിമാസ ഉടമസ്ഥതാ ചെലവ് കണക്കാക്കുക.',
    },
    ui: {
      monthlyOwnershipInputs: 'പ്രതിമാസ ചെലവ് വിവരങ്ങൾ',
      completeTcoModel: 'ആകെ ഉടമസ്ഥതാ മോഡൽ',
      expectedMonthlyDriving: 'പ്രതിമാസ ഓട്ടം (കിലോമീറ്റർ)',
      kmPerMonth: 'കി.മീ/മാസം',
      drivingGuideWeekend: '200 കി.മീ (വാരാന്ത്യത്തിൽ മാത്രം)',
      drivingGuideCommute: '1,200 കി.മീ (ദൈനംദിന യാത്ര)',
      drivingGuideCommercial: '3,500+ കി.മീ (വാണിജ്യ ആവശ്യങ്ങൾക്ക്)',
      vehicleMileage: 'വാഹന മൈലേജ് (കി.മീ/ലിറ്റർ)',
      kmPerLShort: 'കി.മീ/ലി',
      fuelPrice: 'ഇന്ധന വില (₹ / ലിറ്റർ)',
      loanInsuranceUpkeep: 'ലോൺ, ഇൻഷുറൻസ് & സർവീസ്',
      monthlyLoanEmi: 'പ്രതിമാസ ലോൺ ഇഎംഐ (₹)',
      annualInsurance: 'വാർഷിക ഇൻഷുറൻസ് പ്രീമിയം (₹)',
      annualMaintenance: 'വാർഷിക സർവീസ് & മെയിന്റനൻസ് (₹)',
      totalMonthlyOutflow: 'ആകെ പ്രതിമാസ ചെലവ്',
      perMonth: '/ മാസം',
      annualCommitmentText: 'ആകെ വാർഷിക വാഹന ബാധ്യത:',
      perYear: '/വർഷം',
      fuelExpenseShare: 'ഇന്ധനച്ചെലവ്',
      loanEmiShare: 'ലോൺ ഇഎംഐ',
      insuranceShare: 'ഇൻഷുറൻസ് (പ്രതിമാസ പങ്ക്)',
      serviceShare: 'സർവീസ് & മെയിന്റനൻസ്',
      tcoInsightTitle: 'ഉടമസ്ഥതാ ചെലവ് വിശകലനം',
      tcoInsightDesc: 'പ്രതിമാസം 800 കി.മീറ്ററിൽ താഴെ മാത്രം യാത്ര ചെയ്യുന്നവർക്ക്, ഇന്ധനച്ചെലവിനേക്കാൾ കൂടുതൽ ഫിക്സഡ് ചെലവുകൾ (ലോൺ + ഇൻഷുറൻസ്) വരുന്നു. കുറഞ്ഞ ഓട്ടമുള്ളവർക്ക് ടാക്സി ഉപയോഗിക്കുന്നതാണ് സ്വന്തം കാർ വാങ്ങുന്നതിനേക്കാൾ ലാഭം.',
      resultSummaryTitle: 'പ്രതിമാസ വാഹന ചെലവ് വിവരങ്ങൾ:',
      monthlyDistanceText: 'പ്രതിമാസ ഓട്ടം',
      fuelExpenseText: 'ഇന്ധനച്ചെലവ്',
      emiLoanText: 'ഇഎംഐ / ലോൺ',
      insuranceShareText: 'ഇൻഷുറൻസ് (പ്രതിമാസ പങ്ക്)',
      maintenanceText: 'സർവീസ് & മെയിന്റനൻസ്',
      totalMonthlyOutflowText: 'ആകെ പ്രതിമാസ ചെലവ്',
      totalAnnualOutflowText: 'ആകെ വാർഷിക ചെലവ്',
      effectiveCostPerKmText: 'ഒരു കിലോമീറ്റർ നിരക്ക്',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'പ്രതിമാസ ഇന്ധനച്ചെലവ് = (പ്രതിമാസ കി.മീ ÷ മൈലേജ്) × ഇന്ധനവില. പ്രതിമാസ ഇൻഷുറൻസ് = വാർഷിക പ്രീമിയം ÷ 12. പ്രതിമാസ മെയിന്റനൻസ് = വാർഷിക സർവീസ് ÷ 12. ആകെ പ്രതിമാസ തുക = ഇന്ധനം + ഇഎംഐ + ഇൻഷുറൻസ് + മെയിന്റനൻസ്. കിലോമീറ്റർ നിരക്ക് = ആകെ തുക ÷ പ്രതിമാസ ദൂരം.',
    assumptions: [
      'വാർഷിക ഇൻഷുറൻസും സർവീസ് ചെലവും 12 മാസങ്ങളിലായി തുല്യമായി ഭാഗിക്കുന്നു.',
      'അപ്രതീക്ഷിത അപകട അറ്റകുറ്റപ്പണികൾ ഇൻഷുറൻസ് പരിരക്ഷയിൽ ഉൾപ്പെടുന്നു.',
    ],
    example: {
      title: 'പ്രതിമാസം 1,200 കി.മീ ഓടുന്ന ഒരു കാർ',
      inputs: {
        'പ്രതിമാസ ദൂരം': '1,200 കി.മീ',
        'മൈലേജ്': '15 കി.മീ/ലിറ്റർ',
        'ഇന്ധന വില': '₹102/ലിറ്റർ',
        'ലോൺ ഇഎംഐ': '₹8,500/മാസം',
        'ഇൻഷുറൻസ്': '₹14,000/വർഷം',
        'സർവീസ്': '₹9,000/വർഷം',
      },
      outputs: {
        'ഇന്ധനച്ചെലവ്': '₹8,160',
        'ആകെ പ്രതിമാസ തുക': '₹18,577',
        'കിലോമീറ്റർ നിരക്ക്': '₹15.48 / കി.മീ',
      },
      explanation: 'പ്രതിമാസം 1,200 കി.മീ ഓടുമ്പോൾ എല്ലാ ചെലവുകളും ചേർത്ത് ₹18,577 പ്രതിമാസം ചിലവാകുന്നു (ഒരു കി.മീറ്ററിന് ₹15.48).',
    },
    faqs: [
      {
        question: 'ഒരു വാഹനത്തിന്റെ സമ്പൂർണ്ണ ഉടമസ്ഥതാ ചെലവ് (TCO) എന്താണ്?',
        answer: 'വെറും ഇന്ധനച്ചെലവ് മാത്രമല്ല, ലോൺ ഇഎംഐ, ഇൻഷുറൻസ്, വാർഷിക സർവീസ് എന്നിവയെല്ലാം ഉൾപ്പെടുന്നതാണ് യഥാർത്ഥ ഉടമസ്ഥതാ ചെലവ്.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'मासिक वाहन संचालन लागत कैलकुलेटर | कार व बाइक टीसीओ | IndiaTools',
      metaDescription: 'ईंधन, लोन ईएमआई, बीमा और सर्विसिंग सहित कार व बाइक का कुल मासिक खर्च और प्रति किमी लागत तुरंत निकालें।',
      h1: 'मासिक वाहन संचालन लागत कैलकुलेटर',
      subtitle: 'ईंधन, ऋण ईएमआई, वार्षिक बीमा और नियमित सर्विसिंग को मिलाकर वाहन के वास्तविक मासिक खर्च की गणना करें।',
    },
    ui: {
      monthlyOwnershipInputs: 'मासिक स्वामित्व इनपुट',
      completeTcoModel: 'पूर्ण टीसीओ मॉडल',
      expectedMonthlyDriving: 'अपेक्षित मासिक ड्राइविंग',
      kmPerMonth: 'किमी/माह',
      drivingGuideWeekend: '200 किमी (केवल सप्ताहांत)',
      drivingGuideCommute: '1,200 किमी (दैनिक आवागमन)',
      drivingGuideCommercial: '3,500+ किमी (व्यावसायिक)',
      vehicleMileage: 'वाहन माइलेज (किमी/लीटर)',
      kmPerLShort: 'किमी/ली',
      fuelPrice: 'ईंधन दर (₹/लीटर)',
      loanInsuranceUpkeep: 'लोन, बीमा व रखरखाव',
      monthlyLoanEmi: 'मासिक लोन ईएमआई (₹)',
      annualInsurance: 'वार्षिक बीमा प्रीमियम (₹)',
      annualMaintenance: 'वार्षिक सर्विसिंग / रखरखाव (₹)',
      totalMonthlyOutflow: 'कुल मासिक खर्च',
      perMonth: '/ माह',
      annualCommitmentText: 'वार्षिक कुल वाहन प्रतिबद्धता:',
      perYear: '/वर्ष',
      fuelExpenseShare: 'ईंधन खर्च',
      loanEmiShare: 'लोन ईएमआई',
      insuranceShare: 'बीमा (मासिक हिस्सा)',
      serviceShare: 'सर्विस व रखरखाव',
      tcoInsightTitle: 'टीसीओ अंतर्दृष्टि',
      tcoInsightDesc: 'भारत में, 800 किमी/माह से कम ड्राइविंग पर ईंधन की तुलना में स्थिर लागत (लोन + बीमा) अधिक होती है। ₹{costPerKm}/किमी पर, कम ड्राइविंग वालों के लिए कैब लेना गाड़ी खरीदने से सस्ता पड़ता है।',
      resultSummaryTitle: 'मासिक वाहन संचालन लागत विवरण:',
      monthlyDistanceText: 'मासिक दूरी',
      fuelExpenseText: 'ईंधन खर्च',
      emiLoanText: 'ईएमआई / लोन',
      insuranceShareText: 'बीमा (मासिक हिस्सा)',
      maintenanceText: 'सर्विस व रखरखाव',
      totalMonthlyOutflowText: 'कुल मासिक खर्च',
      totalAnnualOutflowText: 'कुल वार्षिक खर्च',
      effectiveCostPerKmText: 'प्रभावी प्रति किमी लागत',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'मासिक ईंधन खर्च = (मासिक किमी ÷ माइलेज) × ईंधन दर। मासिक बीमा = वार्षिक प्रीमियम ÷ 12। मासिक रखरखाव = वार्षिक सर्विसिंग ÷ 12। कुल मासिक खर्च = ईंधन + ईएमआई + बीमा + रखरखाव। प्रति किमी लागत = कुल मासिक खर्च ÷ मासिक किमी।',
    assumptions: [
      'वार्षिक बीमा और सर्विसिंग खर्च 12 महीनों में बराबर विभाजित हैं।',
    ],
    example: {
      title: 'कॉम्पैक्ट हैचबैक स्वामित्व (1,200 किमी/माह)',
      inputs: {
        'मासिक दूरी': '1,200 किमी',
        'माइलेज': '15 किमी/ली',
        'ईंधन दर': '₹102/ली',
        'लोन ईएमआई': '₹8,500/माह',
        'वार्षिक बीमा': '₹14,000',
        'वार्षिक सर्विस': '₹9,000',
      },
      outputs: {
        'ईंधन खर्च': '₹8,160',
        'कुल मासिक खर्च': '₹18,577',
        'प्रति किमी लागत': '₹15.48 / किमी',
      },
      explanation: '1,200 किमी मासिक चलने वाली कार का कुल खर्च ₹18,577 प्रति माह और प्रति किमी लागत ₹15.48 आती है।',
    },
    faqs: [
      {
        question: 'वाहन स्वामित्व की कुल लागत (TCO) क्या है?',
        answer: 'टीसीओ में केवल पेट्रोल-डीजल ही नहीं, बल्कि लोन की ईएमआई, बीमा प्रीमियम और सर्विसिंग के सभी नियमित खर्च शामिल होते हैं।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'மாதாந்திர வாகன இயக்கும் செலவு கால்குலேட்டர் | கார் & பைக் TCO | IndiaTools',
      metaDescription: 'எரிபொருள், கடன் EMI, இன்சூரன்ஸ், பராமரிப்பு உட்பட கார் அல்லது பைக்கின் மாதாந்திர மொத்த செலவை துல்லியமாக கணக்கிடுங்கள்.',
      h1: 'மாதாந்திர வாகன இயக்கும் செலவு கால்குலேட்டர்',
      subtitle: 'எரிபொருள், கடன் தவணை, வருடாந்திர இன்சூரன்ஸ் மற்றும் பராமரிப்பு உட்பட உண்மையான மாதாந்திர செலவைக் கணக்கிடுங்கள்.',
    },
    ui: {
      monthlyOwnershipInputs: 'மாதாந்திர உரிமை உள்ளீடுகள்',
      completeTcoModel: 'முழுமையான TCO மாதிரி',
      expectedMonthlyDriving: 'எதிர்பார்க்கப்படும் மாதாந்திர ஓட்டம்',
      kmPerMonth: 'கி.மீ/மாதம்',
      drivingGuideWeekend: '200 கி.மீ (வார இறுதி மட்டும்)',
      drivingGuideCommute: '1,200 கி.மீ (தினசரி பயணம்)',
      drivingGuideCommercial: '3,500+ கி.மீ (வணிக பயன்பாடு)',
      vehicleMileage: 'வாகன மைலேஜ் (கி.மீ/லி)',
      kmPerLShort: 'கி.மீ/லி',
      fuelPrice: 'எரிபொருள் விலை (₹/லிட்டர்)',
      loanInsuranceUpkeep: 'கடன், இன்சூரன்ஸ் & பராமரிப்பு',
      monthlyLoanEmi: 'மாதாந்திர கடன் EMI (₹)',
      annualInsurance: 'வருடாந்திர இன்சூரன்ஸ் பிரீமியம் (₹)',
      annualMaintenance: 'வருடாந்திர பராமரிப்பு / சர்வீஸ் (₹)',
      totalMonthlyOutflow: 'மொத்த மாதாந்திர செலவு',
      perMonth: '/ மாதம்',
      annualCommitmentText: 'வருடாந்திர மொத்த வாகன செலவு:',
      perYear: '/ஆண்டு',
      fuelExpenseShare: 'எரிபொருள் செலவு',
      loanEmiShare: 'கடன் EMI',
      insuranceShare: 'இன்சூரன்ஸ் (மாதாந்திர பங்கு)',
      serviceShare: 'சர்வீஸ் & பராமரிப்பு',
      tcoInsightTitle: 'TCO பார்வை',
      tcoInsightDesc: 'மாதத்திற்கு 800 கி.மீ-க்கும் குறைவாக ஓட்டுபவர்களுக்கு, எரிபொருளை விட நிலையான செலவுகளே (கடன் + இன்சூரன்ஸ்) அதிகம். ₹{costPerKm}/கி.மீ வீதம், குறைவான பயணத்திற்கு வாடகை கார் எடுப்பதே சிறந்தது.',
      resultSummaryTitle: 'மாதாந்திர வாகன செலவு விவரம்:',
      monthlyDistanceText: 'மாதாந்திர தூரம்',
      fuelExpenseText: 'எரிபொருள் செலவு',
      emiLoanText: 'EMI / கடன்',
      insuranceShareText: 'இன்சூரன்ஸ் (மாதாந்திர பங்கு)',
      maintenanceText: 'சர்வீஸ் & பராமரிப்பு',
      totalMonthlyOutflowText: 'மொத்த மாதாந்திர செலவு',
      totalAnnualOutflowText: 'மொத்த வருடாந்திர செலவு',
      effectiveCostPerKmText: 'ஒரு கி.மீ-க்கான நிகர செலவு',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'மாதாந்திர எரிபொருள் செலவு = (மாத தூரம் ÷ மைலேஜ்) × விலை. மாதாந்திர இன்சூரன்ஸ் = பிரீமியம் ÷ 12. மாதாந்திர சர்வீஸ் = வருடாந்திர சர்வீஸ் ÷ 12. மொத்த செலவு = எரிபொருள் + EMI + இன்சூரன்ஸ் + சர்வீஸ். கி.மீ செலவு = மொத்த செலவு ÷ மாத தூரம்.',
    assumptions: [
      'வருடாந்திர இன்சூரன்ஸ் மற்றும் சர்வீஸ் செலவுகள் 12 மாதங்களுக்கு சமமாகப் பிரிக்கப்படுகின்றன.',
    ],
    example: {
      title: 'ஹேட்ச்பேக் கார் மாதாந்திர செலவு (1,200 கி.மீ)',
      inputs: {
        'மாதாந்திர தூரம்': '1,200 கி.மீ',
        'மைலேஜ்': '15 கி.மீ/லி',
        'எரிபொருள் விலை': '₹102/லி',
        'கடன் EMI': '₹8,500/மாதம்',
        'இன்சூரன்ஸ்': '₹14,000/ஆண்டு',
        'சர்வீஸ்': '₹9,000/ஆண்டு',
      },
      outputs: {
        'எரிபொருள் செலவு': '₹8,160',
        'மொத்த மாதாந்திர செலவு': '₹18,577',
        'கி.மீ செலவு': '₹15.48 / கி.மீ',
      },
      explanation: 'மாதம் 1,200 கி.மீ ஓடும் காருக்கு மாதம் ₹18,577 செலவாகிறது (ஒரு கி.மீ-க்கு ₹15.48).',
    },
    faqs: [
      {
        question: 'TCO என்றால் என்ன?',
        answer: 'பெட்ரோல் அல்லது டீசல் செலவு மட்டுமின்றி கடன் தவணை, இன்சூரன்ஸ் மற்றும் வழக்கமான பராமரிப்பு ஆகிய அனைத்தையும் உள்ளடக்கியது மொத்த உரிமை செலவு ஆகும்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'నెలవారీ వాహన నిర్వహణ ఖర్చు కాలిక్యులేటర్ | కారు & బైక్ TCO | IndiaTools',
      metaDescription: 'ఇంధనం, లోన్ EMI, ఇన్సూరెన్స్, సర్వీసింగ్ తో కలిపి వాహనం నెలవారీ ఖర్చు మరియు ప్రతి కి.మీ ఖర్చును సులభంగా లెక్కించండి.',
      h1: 'నెలవారీ వాహన నిర్వహణ ఖర్చు కాలిక్యులేటర్',
      subtitle: 'ఇంధనం, లోన్ వాయిదా, వార్షిక ఇన్సూరెన్స్ మరియు మెయింటెనెన్స్‌తో సహా నిజమైన నెలవారీ వాహన ఖర్చును లెక్కించండి.',
    },
    ui: {
      monthlyOwnershipInputs: 'నెలవారీ ఖర్చుల వివరాలు',
      completeTcoModel: 'పూర్తి TCO మోడల్',
      expectedMonthlyDriving: 'అంచనా నెలవారీ ప్రయాణం',
      kmPerMonth: 'కి.మీ/నెల',
      drivingGuideWeekend: '200 కి.మీ (వారాంతంలో మాత్రమే)',
      drivingGuideCommute: '1,200 కి.మీ (రోజువారీ ప్రయాణం)',
      drivingGuideCommercial: '3,500+ కి.మీ (వాణిజ్య అవసరాలకు)',
      vehicleMileage: 'వాహనం మైలేజ్ (కి.మీ/లీ)',
      kmPerLShort: 'కి.మీ/లీ',
      fuelPrice: 'ఇంధనం ధర (₹/లీటరు)',
      loanInsuranceUpkeep: 'లోన్, ఇన్సూరెన్స్ & నిర్వహణ',
      monthlyLoanEmi: 'నెలవారీ లోన్ EMI (₹)',
      annualInsurance: 'వార్షిక ఇన్సూరెన్స్ ప్రీమియం (₹)',
      annualMaintenance: 'వార్షిక సర్వీసింగ్ / మెయింటెనెన్స్ (₹)',
      totalMonthlyOutflow: 'మొత్తం నెలవారీ ఖర్చు',
      perMonth: '/ నెల',
      annualCommitmentText: 'వార్షిక మొత్తం వాహన వ్యయం:',
      perYear: '/సంవత్సరం',
      fuelExpenseShare: 'ఇంధన ఖర్చు',
      loanEmiShare: 'లోన్ EMI',
      insuranceShare: 'ఇన్సూరెన్స్ (నెలవారీ వాటా)',
      serviceShare: 'సర్వీసింగ్ & మెయింటెనెన్స్',
      tcoInsightTitle: 'TCO విశ్లేషణ',
      tcoInsightDesc: 'నెలకు 800 కి.మీ కంటే తక్కువ తిరిగే వారికి, ఇంధనం కంటే స్థిర ఖర్చులు (లోన్ + ఇన్సూరెన్స్) ఎక్కువవుతాయి. ₹{costPerKm}/కి.మీ చొప్పున, తక్కువ తిరిగే వారికి క్యాబ్ వాడటం కారు కొనడం కంటే చౌక.',
      resultSummaryTitle: 'నెలవారీ వాహన ఖర్చుల వివరాలు:',
      monthlyDistanceText: 'నెలవారీ దూరం',
      fuelExpenseText: 'ఇంధన ఖర్చు',
      emiLoanText: 'EMI / లోన్',
      insuranceShareText: 'ఇన్సూరెన్స్ (నెలవారీ వాటా)',
      maintenanceText: 'సర్వీసింగ్ & మెయింటెనెన్స్',
      totalMonthlyOutflowText: 'మొత్తం నెలవారీ ఖర్చు',
      totalAnnualOutflowText: 'మొత్తం వార్షిక ఖర్చు',
      effectiveCostPerKmText: 'ప్రతి కి.మీ ఖర్చు',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'నెలవారీ ఇంధనం = (నెల దూరం ÷ మైలేజ్) × ధర. నెలవారీ ఇన్సూరెన్స్ = వార్షిక ప్రీమియం ÷ 12. నెలవారీ సర్వీస్ = వార్షిక సర్వీస్ ÷ 12. మొత్తం ఖర్చు = ఇంధనం + EMI + ఇన్సూరెన్స్ + సర్వీస్. కి.మీ ఖర్చు = మొత్తం ఖర్చు ÷ నెల దూరం.',
    assumptions: [
      'వార్షిక ఇన్సూరెన్స్ మరియు సర్వీసింగ్ ఖర్చులు 12 నెలలకు సమానంగా పంచబడతాయి.',
    ],
    example: {
      title: 'హ్యాచ్‌బ్యాక్ కారు నెలవారీ ఖర్చు (1,200 కి.మీ)',
      inputs: {
        'నెలవారీ దూరం': '1,200 కి.మీ',
        'మైలేజ్': '15 కి.మీ/లీ',
        'ఇంధనం ధర': '₹102/లీ',
        'లోన్ EMI': '₹8,500/నెల',
        'ఇన్సూరెన్స్': '₹14,000/సంవత్సరం',
        'సర్వీస్': '₹9,000/సంవత్సరం',
      },
      outputs: {
        'ఇంధనం ఖర్చు': '₹8,160',
        'మొత్తం నెలవారీ ఖర్చు': '₹18,577',
        'కి.మీ ఖర్చు': '₹15.48 / కి.మీ',
      },
      explanation: 'నెలకు 1,200 కి.మీ తిరిగే కారుకు మొత్తం ఖర్చు నెలకు ₹18,577 (కిలోమీటరుకు ₹15.48).',
    },
    faqs: [
      {
        question: 'వాహన నిర్వహణ మొత్తం ఖర్చు (TCO) అంటే ఏమిటి?',
        answer: 'కేవలం పెట్రోల్ ఖర్చు మాత్రమే కాకుండా లోన్ ఈఎంఐ, ఇన్సూరెన్స్ మరియు రెగ్యులర్ సర్వీస్ ఖర్చులను కలిపి టిసిఓ అంటారు.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ಮಾಸಿಕ ವಾಹನ ಚಾಲನಾ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ಕಾರು & ಬೈಕ್ TCO | IndiaTools',
      metaDescription: 'ಇಂಧನ, ಸಾಲದ ಇಎಂಐ, ವಿಮೆ, ನಿರ್ವಹಣೆ ಸೇರಿದಂತೆ ಕಾರು ಅಥವಾ ಬೈಕ್‌ನ ಮಾಸಿಕ ಒಟ್ಟು ವೆಚ್ಚ ಮತ್ತು ಕಿಲೋಮೀಟರ್ ದರವನ್ನು ಲೆಕ್ಕಹಾಕಿ.',
      h1: 'ಮಾಸಿಕ ವಾಹನ ಚಾಲನಾ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಇಂಧನ, ಸಾಲದ ಕಂತು, ವಾರ್ಷಿಕ ವಿಮೆ ಮತ್ತು ನಿರ್ವಹಣೆ ಸೇರಿದಂತೆ ವಾಹನದ ನಿಜವಾದ ಮಾಸಿಕ ವೆಚ್ಚವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.',
    },
    ui: {
      monthlyOwnershipInputs: 'ಮಾಸಿಕ ಮಾಲೀಕತ್ವದ ವಿವರಗಳು',
      completeTcoModel: 'ಸಂಪೂರ್ಣ TCO ಮಾದರಿ',
      expectedMonthlyDriving: 'ನಿರೀಕ್ಷಿತ ಮಾಸಿಕ ಚಾಲನೆ',
      kmPerMonth: 'ಕಿ.ಮೀ/ತಿಂಗಳು',
      drivingGuideWeekend: '200 ಕಿ.ಮೀ (ವಾರಾಂತ್ಯದಲ್ಲಿ ಮಾತ್ರ)',
      drivingGuideCommute: '1,200 ಕಿ.ಮೀ (ದೈನಂದಿನ ಪ್ರಯಾಣ)',
      drivingGuideCommercial: '3,500+ ಕಿ.ಮೀ (ವಾಣಿಜ್ಯ ಬಳಕೆ)',
      vehicleMileage: 'ವಾಹನದ ಮೈಲೇಜ್ (ಕಿ.ಮೀ/ಲೀ)',
      kmPerLShort: 'ಕಿ.ಮೀ/ಲೀ',
      fuelPrice: 'ಇಂಧನ ದರ (₹/ಲೀಟರ್)',
      loanInsuranceUpkeep: 'ಸಾಲ, ವಿಮೆ & ನಿರ್ವಹಣೆ',
      monthlyLoanEmi: 'ಮಾಸಿಕ ಸಾಲದ ಇಎಂಐ (₹)',
      annualInsurance: 'ವಾರ್ಷಿಕ ವಿಮಾ ಪ್ರೀಮಿಯಂ (₹)',
      annualMaintenance: 'ವಾರ್ಷಿಕ ನಿರ್ವಹಣೆ / ಸರ್ವೀಸ್ (₹)',
      totalMonthlyOutflow: 'ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚ',
      perMonth: '/ ತಿಂಗಳು',
      annualCommitmentText: 'ವಾರ್ಷಿಕ ಒಟ್ಟು ವಾಹನ ವೆಚ್ಚ:',
      perYear: '/ವರ್ಷ',
      fuelExpenseShare: 'ಇಂಧನ ವೆಚ್ಚ',
      loanEmiShare: 'ಸಾಲದ ಇಎಂಐ',
      insuranceShare: 'ವಿಮೆ (ಮಾಸಿಕ ಪಾಲು)',
      serviceShare: 'ಸರ್ವೀಸ್ & ನಿರ್ವಹಣೆ',
      tcoInsightTitle: 'TCO ಒಳನೋಟ',
      tcoInsightDesc: 'ತಿಂಗಳಿಗೆ 800 ಕಿ.ಮೀಗಿಂತ ಕಡಿಮೆ ಓಡುವವರಿಗೆ ಇಂಧನಕ್ಕಿಂತ ಸ್ಥಿರ ವೆಚ್ಚಗಳೇ (ಸಾಲ + ವಿಮೆ) ಹೆಚ್ಚಿರುತ್ತವೆ. ₹{costPerKm}/ಕಿ.ಮೀ ದರದಲ್ಲಿ, ಕಡಿಮೆ ಓಡುವವರಿಗೆ ಕಾರು ಖರೀದಿಸುವುದಕ್ಕಿಂತ ಕ್ಯಾಬ್ ಬಳಸುವುದೇ ಲಾಭದಾಯಕ.',
      resultSummaryTitle: 'ಮಾಸಿಕ ವಾಹನ ವೆಚ್ಚದ ವಿವರ:',
      monthlyDistanceText: 'ಮಾಸಿಕ ದೂರ',
      fuelExpenseText: 'ಇಂಧನ ವೆಚ್ಚ',
      emiLoanText: 'ಇಎಂಐ / ಸಾಲ',
      insuranceShareText: 'ವಿಮೆ (ಮಾಸಿಕ ಪಾಲು)',
      maintenanceText: 'ಸರ್ವೀಸ್ & ನಿರ್ವಹಣೆ',
      totalMonthlyOutflowText: 'ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚ',
      totalAnnualOutflowText: 'ಒಟ್ಟು ವಾರ್ಷಿಕ ವೆಚ್ಚ',
      effectiveCostPerKmText: 'ಪ್ರತಿ ಕಿ.ಮೀಗೆ ನಿವ್ವಳ ವೆಚ್ಚ',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಮಾಸಿಕ ಇಂಧನ ವೆಚ್ಚ = (ತಿಂಗಳ ದೂರ ÷ ಮೈಲೇಜ್) × ಇಂಧನ ದರ. ಮಾಸಿಕ ವಿಮೆ = ವಾರ್ಷಿಕ ವಿಮೆ ÷ 12. ಮಾಸಿಕ ಸರ್ವೀಸ್ = ವಾರ್ಷಿಕ ಸರ್ವೀಸ್ ÷ 12. ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚ = ಇಂಧನ + ಇಎಂಐ + ವಿಮೆ + ಸರ್ವೀಸ್. ಪ್ರತಿ ಕಿ.ಮೀ ವೆಚ್ಚ = ಒಟ್ಟು ವೆಚ್ಚ ÷ ತಿಂಗಳ ದೂರ.',
    assumptions: [
      'ವಾರ್ಷಿಕ ವಿಮೆ ಮತ್ತು ಸರ್ವೀಸ್ ವೆಚ್ಚಗಳನ್ನು 12 ತಿಂಗಳುಗಳಿಗೆ ಸಮನಾಗಿ ಹಂಚಲಾಗುತ್ತದೆ.',
    ],
    example: {
      title: 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್ ಕಾರು ಮಾಸಿಕ ವೆಚ್ಚ (1,200 ಕಿ.ಮೀ)',
      inputs: {
        'ಮಾಸಿಕ ದೂರ': '1,200 ಕಿ.ಮೀ',
        'ಮೈಲೇಜ್': '15 ಕಿ.ಮೀ/ಲೀ',
        'ಇಂಧನ ಬೆಲೆ': '₹102/ಲೀ',
        'ಸಾಲದ ಇಎಂಐ': '₹8,500/ತಿಂಗಳು',
        'ವಿಮೆ': '₹14,000/ವರ್ಷ',
        'ಸರ್ವೀಸ್': '₹9,000/ವರ್ಷ',
      },
      outputs: {
        'ಇಂಧನ ವೆಚ್ಚ': '₹8,160',
        'ಒಟ್ಟು ಮಾಸಿಕ ವೆಚ್ಚ': '₹18,577',
        'ಪ್ರತಿ ಕಿ.ಮೀ ವೆಚ್ಚ': '₹15.48 / ಕಿ.ಮೀ',
      },
      explanation: 'ತಿಂಗಳಿಗೆ 1,200 ಕಿ.ಮೀ ಚಲಿಸುವ ಕಾರಿಗೆ ತಿಂಗಳಿಗೆ ₹18,577 ವೆಚ್ಚವಾಗುತ್ತದೆ (ಪ್ರತಿ ಕಿಲೋಮೀಟರ್‌ಗೆ ₹15.48).',
    },
    faqs: [
      {
        question: 'TCO ಎಂದರೇನು?',
        answer: 'ಕೇವಲ ಇಂಧನ ವೆಚ್ಚವಲ್ಲದೆ ವಾಹನದ ಸಾಲದ ಕಂತು, ವಿಮೆ ಮತ್ತು ನಿಯಮಿತ ಸರ್ವೀಸಿಂಗ್ ಸೇರಿದಂತೆ ವಾಹನದ ಸಂಪೂರ್ಣ ವೆಚ್ಚವನ್ನು TCO ಎನ್ನಲಾಗುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('monthly-vehicle-running-cost', monthlyVehicleRunningCostTranslations)
