import { registerToolTranslations, ToolLocaleMap } from '../toolTranslations'

export interface VehicleServiceCostUI {
  vehicleDetails: string
  workshopSlabs: string
  selectSegment: string
  bikeLabel: string
  hatchbackLabel: string
  sedanLabel: string
  suvLabel: string
  currentOdometer: string
  scheduledServiceLevel: string
  minorService: string
  minorServiceDesc: string
  majorService: string
  majorServiceDesc: string
  estimatedInvoice: string
  everyKmInterval: string
  classification: string
  engineOilItem: string
  filtersItem: string
  laborGstItem: string
  alignmentItem: string
  mandatoryItems: string
  workshopTipTitle: string
  workshopTipDesc: string
  resultSummaryTitle: string
  vehicleSegmentText: string
  currentOdometerText: string
  serviceLevelText: string
  estimatedBillText: string
  costBreakdownText: string
  engineOilText: string
  filtersText: string
  laborText: string
  consumablesText: string
  wheelAlignmentText: string
  recommendationsText: string
  calculatedOn: string
}

export const vehicleServiceCostTranslations: ToolLocaleMap<VehicleServiceCostUI> = {
  en: {
    meta: {
      title: 'Vehicle Service Cost Calculator | Car & Bike Periodic Maintenance | IndiaTools',
      metaDescription: 'Estimate periodic maintenance bill for bikes, hatchbacks, sedans, and SUVs in India. Labor, engine oil, filters & workshop GST estimates.',
      h1: 'Vehicle Service Cost Calculator',
      subtitle: 'Plan periodic maintenance budgets for bikes and cars across minor and major service milestones.',
    },
    ui: {
      vehicleDetails: 'Vehicle & Odometer Details',
      workshopSlabs: 'Indian Workshop Slabs',
      selectSegment: 'Select Vehicle Segment',
      bikeLabel: '2-Wheeler / Bike',
      hatchbackLabel: 'Hatchback',
      sedanLabel: 'Sedan',
      suvLabel: 'Mid / Full SUV',
      currentOdometer: 'Current Odometer Reading',
      scheduledServiceLevel: 'Scheduled Service Level',
      minorService: 'Minor Service',
      minorServiceDesc: 'Engine oil, oil filter & basic check',
      majorService: 'Major Service',
      majorServiceDesc: 'All filters, fluids & wheel alignment',
      estimatedInvoice: 'Estimated Workshop Invoice',
      everyKmInterval: 'Every {km} km',
      classification: 'Classification:',
      engineOilItem: 'Engine Oil (Synthetic / Semi-Synthetic)',
      filtersItem: 'Replacement Filters (Oil, Air, Cabin)',
      laborGstItem: 'Labor Charges + 18% GST',
      alignmentItem: 'Wheel Alignment & Balancing',
      mandatoryItems: 'Mandatory Check & Replace Items:',
      workshopTipTitle: 'Workshop Tip',
      workshopTipDesc: 'Always decline unnecessary dealership add-ons like Engine Decarbonizing (₹2,500), Nitrogen inflation (₹300), and AC Sanitization sprays (₹1,500). Sticking strictly to the owner manual checklist saves 25% on invoice cost.',
      resultSummaryTitle: 'Vehicle Periodic Service Budget Planner:',
      vehicleSegmentText: 'Vehicle Segment',
      currentOdometerText: 'Current Odometer',
      serviceLevelText: 'Service Level',
      estimatedBillText: 'ESTIMATED SERVICE BILL',
      costBreakdownText: 'Cost Breakdown',
      engineOilText: 'Engine Oil',
      filtersText: 'Oil/Air/AC Filters',
      laborText: 'Labor & Workshop GST',
      consumablesText: 'Consumables & Coolant',
      wheelAlignmentText: 'Wheel Alignment & Balancing',
      recommendationsText: 'Key Recommended Replacements',
      calculatedOn: 'Calculated via IndiaTools',
    },
    formulaExplanation: 'Total Service Bill = Engine Oil + Filters + Consumables & Coolant + Wheel Alignment + (Labor Charges × 1.18 GST). Minor service occurs every 10,000 km while Major service occurs every 20,000 to 40,000 km.',
    assumptions: [
      'Standard authorized dealership and multi-brand workshop labor rates.',
      'GST calculated at standard 18% on workshop labor and replacement parts.',
    ],
    example: {
      title: 'Hatchback 30,000 km Major Service',
      inputs: {
        'Vehicle': 'Hatchback',
        'Odometer': '35,000 km',
        'Service Level': 'Major Periodic Service',
      },
      outputs: {
        'Estimated Invoice': '₹6,400',
        'Engine Oil': '₹2,100',
        'Filters & Fluids': '₹1,550',
        'Labor + GST': '₹2,124',
      },
      explanation: 'A 30,000 km major service includes synthetic engine oil, oil filter, air & cabin filters, brake inspection, and labor with 18% GST.',
    },
    faqs: [
      {
        question: 'What is the difference between Minor and Major car service?',
        answer: 'Minor service (every 5,000-10,000 km) covers engine oil and oil filter change with basic inspections. Major service (every 20,000-40,000 km) includes spark plugs, coolant, brake fluid, cabin filters, and wheel alignment.',
      },
      {
        question: 'How can I avoid getting overcharged at authorized service centers?',
        answer: 'Review the job card before signing. Refuse optional extras such as engine flush, caliper greasing, windshield fluid pouches, and interior sanitization packages.',
      },
    ],
  },
  ml: {
    meta: {
      title: 'വാഹന സർവീസ് ചെലവ് കാൽക്കുലേറ്റർ | കാർ & ബൈക്ക് മെയിന്റനൻസ് | IndiaTools',
      metaDescription: 'ബൈക്ക്, കാർ, എസ്‌യുവി എന്നിവയുടെ പീരിയോഡിക് സർവീസ് ബിൽ കൃത്യമായി കണക്കാക്കുക. ഓയിൽ, ഫിൽട്ടർ, ലേബർ നിരക്കുകൾ മുൻകൂട്ടി അറിയാം.',
      h1: 'വാഹന സർവീസ് ചെലവ് കാൽക്കുലേറ്റർ',
      subtitle: 'ബൈക്കുകളുടെയും കാറുകളുടെയും മൈനർ, മേജർ പീരിയോഡിക് സർവീസ് ബില്ലുകൾ കൃത്യമായി മുൻകൂട്ടി കണക്കാക്കുക.',
    },
    ui: {
      vehicleDetails: 'വാഹനവും ഓഡോമീറ്റർ വിവരങ്ങളും',
      workshopSlabs: 'വർക്ക്‌ഷോപ്പ് നിരക്കുകൾ',
      selectSegment: 'വാഹന വിഭാഗം തിരഞ്ഞെടുക്കുക',
      bikeLabel: 'ടു-വീലർ / ബൈക്ക്',
      hatchbackLabel: 'ഹാച്ച്ബാക്ക്',
      sedanLabel: 'സെഡാൻ',
      suvLabel: 'എസ്‌യുവി',
      currentOdometer: 'നിലവിലെ ഓഡോമീറ്റർ റീഡിംഗ്',
      scheduledServiceLevel: 'സർവീസ് തരം',
      minorService: 'മൈനർ സർവീസ്',
      minorServiceDesc: 'എഞ്ചിൻ ഓയിൽ, ഓയിൽ ഫിൽട്ടർ & ജനറൽ ചെക്കപ്പ്',
      majorService: 'മേജർ സർവീസ്',
      majorServiceDesc: 'എല്ലാ ഫിൽട്ടറുകളും ഫ്ലൂയിഡുകളും വീൽ അലൈൻമെന്റും',
      estimatedInvoice: 'കണക്കാക്കിയ വർക്ക്‌ഷോപ്പ് ബിൽ',
      everyKmInterval: 'ഓരോ {km} കി.മീറ്ററിലും',
      classification: 'തരം:',
      engineOilItem: 'എഞ്ചിൻ ഓയിൽ (സിന്തറ്റിക് / സെമി സിന്തറ്റിക്)',
      filtersItem: 'ഫിൽട്ടറുകൾ (ഓയിൽ, എയർ, ക്യാബിൻ ഫിൽട്ടറുകൾ)',
      laborGstItem: 'പണിക്കൂലി + 18% ജിഎസ്ടി',
      alignmentItem: 'വീൽ അലൈൻമെന്റ് & ബാലൻസിങ്',
      mandatoryItems: 'നിർബന്ധമായും പരിശോധിക്കേണ്ട കാര്യങ്ങൾ:',
      workshopTipTitle: 'വർക്ക്‌ഷോപ്പ് ടിപ്പ്',
      workshopTipDesc: 'അനാവശ്യമായ എഞ്ചിൻ ഡീകാർബണൈസിംഗ്, എയർ സാനിറ്റൈസേഷൻ തുടങ്ങിയ സർവീസ് സെന്റർ ഓഫറുകൾ നിരസിക്കുക. മാനുവൽ പ്രകാരമുള്ള ചെക്കപ്പ് മാത്രം ചെയ്താൽ ബില്ലിൽ 25% വരെ ലാഭിക്കാം.',
      resultSummaryTitle: 'വാഹന സർവീസ് ബജറ്റ് പ്ലാനർ:',
      vehicleSegmentText: 'വാഹന വിഭാഗം',
      currentOdometerText: 'നിലവിലെ ഓഡോമീറ്റർ',
      serviceLevelText: 'സർവീസ് തരം',
      estimatedBillText: 'കണക്കാക്കിയ സർവീസ് ബിൽ',
      costBreakdownText: 'ചെലവ് വിവരങ്ങൾ',
      engineOilText: 'എഞ്ചിൻ ഓയിൽ',
      filtersText: 'ഫിൽട്ടറുകൾ',
      laborText: 'പണിക്കൂലി & ജിഎസ്ടി',
      consumablesText: 'കൂളന്റ് & മറ്റ് ഫ്ലൂയിഡുകൾ',
      wheelAlignmentText: 'വീൽ അലൈൻമെന്റ്',
      recommendationsText: 'പ്രധാന നിർദ്ദേശങ്ങൾ',
      calculatedOn: 'IndiaTools വഴി കണക്കാക്കിയത്',
    },
    formulaExplanation: 'ആകെ ബിൽ = എഞ്ചിൻ ഓയിൽ + ഫിൽട്ടറുകൾ + ഫ്ലൂയിഡുകൾ + അലൈൻമെന്റ് + (ലേബർ നിരക്ക് × 1.18 ജിഎസ്ടി). മൈനർ സർവീസ് 10,000 കി.മീറ്ററിലും മേജർ സർവീസ് 20,000-40,000 കി.മീറ്ററിലും നടക്കുന്നു.',
    assumptions: ['18% ജിഎസ്ടി ഉൾപ്പെടെയുള്ള സ്റ്റാൻഡേർഡ് വർക്ക്‌ഷോപ്പ് നിരക്കുകൾ.'],
    example: {
      title: 'ഹാച്ച്ബാക്ക് 30,000 കി.മീ മേജർ സർവീസ്',
      inputs: {
        'വാഹനം': 'ഹാച്ച്ബാക്ക്',
        'ഓഡോമീറ്റർ': '35,000 കി.മീ',
        'സർവീസ് തരം': 'മേജർ സർവീസ്',
      },
      outputs: {
        'കണക്കാക്കിയ ബിൽ': '₹6,400',
        'എഞ്ചിൻ ഓയിൽ': '₹2,100',
        'ഫിൽട്ടറുകൾ': '₹1,550',
        'ലേബർ + ജിഎസ്ടി': '₹2,124',
      },
      explanation: '30,000 കി.മീ സർവീസിൽ എഞ്ചിൻ ഓയിൽ, ഫിൽട്ടറുകൾ, ബ്രേക്ക് ഇൻസ്പെക്ഷൻ എന്നിവ ഉൾപ്പെടെ ആകെ ₹6,400 വരുന്നു.',
    },
    faqs: [
      {
        question: 'മൈനർ, മേജർ സർവീസുകൾ തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?',
        answer: 'മൈനർ സർവീസിൽ എഞ്ചിൻ ഓയിലും ഫിൽട്ടറും മാറ്റുമ്പോൾ, മേജർ സർവീസിൽ കൂളന്റ്, ബ്രേക്ക് ഓയിൽ, സ്പാർക്ക് പ്ലഗ്ഗുകൾ, വീൽ അലൈൻമെന്റ് എന്നിവയും ചെയ്യുന്നു.',
      },
    ],
  },
  hi: {
    meta: {
      title: 'वाहन सर्विसिंग लागत कैलकुलेटर | कार व बाइक मेंटेनेंस | IndiaTools',
      metaDescription: 'बाइक, हैचबैक, सेडान और एसयूवी के समयबद्ध सर्विसिंग बिल का सटीक अनुमान लगाएं। इंजन ऑयल, फिल्टर व लेबर चार्ज शामिल।',
      h1: 'वाहन सर्विसिंग लागत कैलकुलेटर',
      subtitle: 'बाइक और कारों के लिए मामूली (माइनर) और बड़े (मेजर) सर्विसिंग खर्च का पहले से बजट बनाएं।',
    },
    ui: {
      vehicleDetails: 'वाहन व ओडोमीटर विवरण',
      workshopSlabs: 'वर्कशॉप दरें',
      selectSegment: 'वाहन श्रेणी चुनें',
      bikeLabel: 'टू-व्हीलर / बाइक',
      hatchbackLabel: 'हैचबैक',
      sedanLabel: 'सेडान',
      suvLabel: 'एसयूवी',
      currentOdometer: 'वर्तमान ओडोमीटर रीडिंग',
      scheduledServiceLevel: 'सर्विसिंग का स्तर',
      minorService: 'माइनर सर्विस',
      minorServiceDesc: 'इंजन ऑयल, ऑयल फिल्टर व सामान्य जांच',
      majorService: 'मेजर सर्विस',
      majorServiceDesc: 'सभी फिल्टर, फ्लुइड्स व व्हील अलाइनमेंट',
      estimatedInvoice: 'अनुमानित वर्कशॉप बिल',
      everyKmInterval: 'प्रत्येक {km} किमी पर',
      classification: 'वर्गीकरण:',
      engineOilItem: 'इंजन ऑयल (सिंथेटिक / सेमी-सिंथेटिक)',
      filtersItem: 'फिल्टर (ऑयल, एयर, केबिन फिल्टर)',
      laborGstItem: 'लेबर शुल्क + 18% जीएसटी',
      alignmentItem: 'व्हील अलाइनमेंट व बैलेंसिंग',
      mandatoryItems: 'अनिवार्य जांच व बदलने वाली वस्तुएं:',
      workshopTipTitle: 'वर्कशॉप टिप',
      workshopTipDesc: 'इंजन डीकार्बोनाइजिंग या अनावश्यक स्प्रे जैसे एड-ऑन को मना करें। केवल सर्विस मैन्युअल के अनुसार काम कराने से बिल में 25% तक बचत होती है।',
      resultSummaryTitle: 'वाहन सर्विसिंग बजट योजनाकार:',
      vehicleSegmentText: 'वाहन श्रेणी',
      currentOdometerText: 'वर्तमान ओडोमीटर',
      serviceLevelText: 'सर्विस स्तर',
      estimatedBillText: 'अनुमानित सर्विस बिल',
      costBreakdownText: 'लागत विवरण',
      engineOilText: 'इंजन ऑयल',
      filtersText: 'फिल्टर',
      laborText: 'लेबर शुल्क व जीएसटी',
      consumablesText: 'कूलेंट व अन्य',
      wheelAlignmentText: 'व्हील अलाइनमेंट',
      recommendationsText: 'प्रमुख सिफारिशें',
      calculatedOn: 'IndiaTools द्वारा परिकलित',
    },
    formulaExplanation: 'कुल सर्विस बिल = इंजन ऑयल + फिल्टर + फ्लुइड्स + अलाइनमेंट + (लेबर शुल्क × 1.18 जीएसटी)।',
    assumptions: ['18% जीएसटी सहित अधिकृत व मल्टी-ब्रांड वर्कशॉप दरें।'],
    example: {
      title: 'हैचबैक 30,000 किमी मेजर सर्विस',
      inputs: {
        'वाहन': 'हैचबैक',
        'ओडोमीटर': '35,000 किमी',
        'सर्विस प्रकार': 'मेजर सर्विस',
      },
      outputs: {
        'अनुमानित बिल': '₹6,400',
        'इंजन ऑयल': '₹2,100',
        'फिल्टर': '₹1,550',
        'लेबर + जीएसटी': '₹2,124',
      },
      explanation: '30,000 किमी सर्विस में सभी फिल्टर, इंजन ऑयल और लेबर मिलाकर लगभग ₹6,400 का बिल बनता है।',
    },
    faqs: [
      {
        question: 'माइनर और मेजर सर्विस में क्या अंतर है?',
        answer: 'माइनर सर्विस (10,000 किमी) में केवल इंजन ऑयल और बेसिक जांच होती है, जबकि मेजर सर्विस (20,000-40,000 किमी) में सभी फिल्टर, कूलेंट और अलाइनमेंट किया जाता है।',
      },
    ],
  },
  ta: {
    meta: {
      title: 'வாகன சர்வீஸ் செலவு கால்குலேட்டர் | கார் & பைக் பராமரிப்பு | IndiaTools',
      metaDescription: 'பைக், கார் மற்றும் எஸ்யூவி வாகனங்களின் காலமுறை சர்வீஸ் பில் தொகையை துல்லியமாக கணக்கிடுங்கள்.',
      h1: 'வாகன சர்வீஸ் செலவு கால்குலேட்டர்',
      subtitle: 'பைக் மற்றும் கார்களுக்கான மைனர் மற்றும் மேஜர் சர்வீஸ் செலவுகளை முன்கூட்டியே திட்டமிடுங்கள்.',
    },
    ui: {
      vehicleDetails: 'வாகனம் & ஓடோமீட்டர் விவரங்கள்',
      workshopSlabs: 'பணிமனை கட்டணங்கள்',
      selectSegment: 'வாகன வகையை தேர்வு செய்யவும்',
      bikeLabel: 'இருசக்கர வாகனம் / பைக்',
      hatchbackLabel: 'ஹேட்ச்பேக்',
      sedanLabel: 'செடான்',
      suvLabel: 'எஸ்யூவி',
      currentOdometer: 'தற்போதைய ஓடோமீட்டர் ரீடிங்',
      scheduledServiceLevel: 'சர்வீஸ் வகை',
      minorService: 'மைனர் சர்வீஸ்',
      minorServiceDesc: 'இன்ஜின் ஆயில், ஆயில் பில்டர் & பொது ஆய்வு',
      majorService: 'மேஜர் சர்வீஸ்',
      majorServiceDesc: 'அனைத்து பில்டர்கள், கூலண்ட் & வீல் அலைன்மென்ட்',
      estimatedInvoice: 'மதிப்பிடப்பட்ட சர்வீஸ் பில்',
      everyKmInterval: 'ஒவ்வொரு {km} கி.மீ-க்கும்',
      classification: 'வகைப்பாடு:',
      engineOilItem: 'இன்ஜின் ஆயில் (சிந்தடிக்)',
      filtersItem: 'பில்டர்கள் (ஆயில், ஏர், கேபின் பில்டர்கள்)',
      laborGstItem: 'கூலி கட்டணம் + 18% ஜிஎஸ்டி',
      alignmentItem: 'வீல் அலைன்மென்ட் & பேலன்சிங்',
      mandatoryItems: 'கட்டாய பரிசோதனை பொருட்கள்:',
      workshopTipTitle: 'சர்வீஸ் டிப்',
      workshopTipDesc: 'தேவையற்ற இன்ஜின் டீகார்பனைசிங் போன்ற கூடுதல் வேலைகளை தவிர்க்கவும். கையேட்டின்படி மட்டுமே செய்தால் 25% வரை சேமிக்கலாம்.',
      resultSummaryTitle: 'வாகன சர்வீஸ் பட்ஜெட் திட்டமிடுபவர்:',
      vehicleSegmentText: 'வாகன வகை',
      currentOdometerText: 'ஓடோமீட்டர்',
      serviceLevelText: 'சர்வீஸ் வகை',
      estimatedBillText: 'மதிப்பிடப்பட்ட பில்',
      costBreakdownText: 'செலவு விவரம்',
      engineOilText: 'இன்ஜின் ஆயில்',
      filtersText: 'பில்டர்கள்',
      laborText: 'கூலி & ஜிஎஸ்டி',
      consumablesText: 'கூலண்ட் & இதர',
      wheelAlignmentText: 'வீல் அலைன்மென்ட்',
      recommendationsText: 'முக்கிய பரிந்துரைகள்',
      calculatedOn: 'IndiaTools மூலம் கணக்கிடப்பட்டது',
    },
    formulaExplanation: 'மொத்த பில் = ஆயில் + பில்டர்கள் + அலைன்மென்ட் + (கூலி × 1.18 ஜிஎஸ்டி).',
    assumptions: ['18% ஜிஎஸ்டி அடங்கிய நிலையான கட்டணங்கள்.'],
    example: {
      title: 'ஹேட்ச்பேக் 30,000 கி.மீ மேஜர் சர்வீஸ்',
      inputs: {
        'வாகனம்': 'ஹேட்ச்பேக்',
        'ஓடோமீட்டர்': '35,000 கி.மீ',
        'சர்வீஸ் வகை': 'மேஜர் சர்வீஸ்',
      },
      outputs: {
        'மதிப்பிடப்பட்ட பில்': '₹6,400',
        'இன்ஜின் ஆயில்': '₹2,100',
        'பில்டர்கள்': '₹1,550',
        'கூலி + ஜிஎஸ்டி': '₹2,124',
      },
      explanation: '30,000 கி.மீ சர்வீஸில் ஆயில், பில்டர்கள் மற்றும் கூலி உட்பட சுமார் ₹6,400 பில் வரும்.',
    },
    faqs: [
      {
        question: 'மைனர் மற்றும் மேஜர் சர்வீஸ் வித்தியாசம் என்ன?',
        answer: 'மைனர் சர்வீஸில் ஆயில் மாற்றம் மட்டுமே நடக்கும், மேஜர் சர்வீஸில் அனைத்து பில்டர்களும் திரவங்களும் மாற்றப்படும்.',
      },
    ],
  },
  te: {
    meta: {
      title: 'వాహన సర్వీసింగ్ ఖర్చు కాలిక్యులేటర్ | కార్ & బైక్ మెయింటెనెన్స్ | IndiaTools',
      metaDescription: 'బైక్, కారు మరియు ఎస్యూవీల పీరియాడిక్ సర్వీసింగ్ బిల్లును ఖచ్చితంగా అంచనా వేయండి.',
      h1: 'వాహన సర్వీసింగ్ ఖర్చు కాలిక్యులేటర్',
      subtitle: 'బైకులు మరియు కార్ల కోసం మైనర్ మరియు మేజర్ సర్వీసింగ్ బడ్జెట్‌ను ముందుగానే ప్లాన్ చేసుకోండి.',
    },
    ui: {
      vehicleDetails: 'వాహనం & ఓడోమీటర్ వివరాలు',
      workshopSlabs: 'వర్క్‌షాప్ స్లాబ్‌లు',
      selectSegment: 'వాహన విభాగాన్ని ఎంచుకోండి',
      bikeLabel: 'టూ-వీలర్ / బైక్',
      hatchbackLabel: 'హ్యాచ్‌బ్యాక్',
      sedanLabel: 'సెడాన్',
      suvLabel: 'ఎస్యూవీ',
      currentOdometer: 'ప్రస్తుత ఓడోమీటర్ రీడింగ్',
      scheduledServiceLevel: 'సర్వీస్ స్థాయి',
      minorService: 'మైనర్ సర్వీస్',
      minorServiceDesc: 'ఇంజిన్ ఆయిల్, ఆయిల్ ఫిల్టర్ & జనరల్ చెకప్',
      majorService: 'మేజర్ సర్వీస్',
      majorServiceDesc: 'అన్ని ఫిల్టర్లు, ఫ్లూయిడ్స్ & వీల్ అలైన్‌మెంట్',
      estimatedInvoice: 'అంచనా వర్క్‌షాప్ బిల్లు',
      everyKmInterval: 'ప్రతి {km} కి.మీలకు',
      classification: 'వర్గీకరణ:',
      engineOilItem: 'ఇంజిన్ ఆయిల్ (సింథటిక్)',
      filtersItem: 'ఫిల్టర్లు (ఆయిల్, ఎయిర్, క్యాబిన్ ఫిల్టర్లు)',
      laborGstItem: 'లేబర్ ఛార్జీలు + 18% జీఎస్టీ',
      alignmentItem: 'వీల్ అలైన్‌మెంట్ & బ్యాలెన్సింగ్',
      mandatoryItems: 'తప్పనిసరిగా తనిఖీ చేయాల్సిన అంశాలు:',
      workshopTipTitle: 'వర్క్‌షాప్ చిట్కా',
      workshopTipDesc: 'అనవసరమైన ఇంజిన్ డీకార్బనైజింగ్ వంటి అదనపు పనులను తిరస్కరించండి. మాన్యువల్ ప్రకారం మాత్రమే చేయిస్తే 25% వరకు ఆదా అవుతుంది.',
      resultSummaryTitle: 'వాహన సర్వీస్ బడ్జెట్ ప్లానర్:',
      vehicleSegmentText: 'వాహన విభాగం',
      currentOdometerText: 'ఓడోమీటర్ రీడింగ్',
      serviceLevelText: 'సర్వీస్ స్థాయి',
      estimatedBillText: 'అంచనా సర్వీస్ బిల్లు',
      costBreakdownText: 'ఖర్చు వివరాలు',
      engineOilText: 'ఇంజిన్ ఆయిల్',
      filtersText: 'ఫిల్టర్లు',
      laborText: 'లేబర్ & జీఎస్టీ',
      consumablesText: 'కూలెంట్ & ఇతరాలు',
      wheelAlignmentText: 'వీల్ అలైన్‌మెంట్',
      recommendationsText: 'ప్రధాన సిఫార్సులు',
      calculatedOn: 'IndiaTools ద్వారా లెక్కించబడింది',
    },
    formulaExplanation: 'మొత్తం బిల్లు = ఆయిల్ + ఫిల్టర్లు + అలైన్‌మెంట్ + (లేబర్ ఛార్జ్ × 1.18 జీఎస్టీ).',
    assumptions: ['18% జీఎస్టీతో కూడిన వర్క్‌షాప్ ఛార్జీలు.'],
    example: {
      title: 'హ్యాచ్‌బ్యాక్ 30,000 కి.మీ మేజర్ సర్వీస్',
      inputs: {
        'వాహనం': 'హ్యాచ్‌బ్యాక్',
        'ఓడోమీటర్': '35,000 కి.మీ',
        'సర్వీస్ స్థాయి': 'మేజర్ సర్వీస్',
      },
      outputs: {
        'అంచనా బిల్లు': '₹6,400',
        'ఇంజిన్ ఆయిల్': '₹2,100',
        'ఫిల్టర్లు': '₹1,550',
        'లేబర్ + జీఎస్టీ': '₹2,124',
      },
      explanation: '30,000 కి.మీ సర్వీస్‌లో ఇంజిన్ ఆయిల్, ఫిల్టర్లు మరియు లేబర్‌తో కలిపి సుమారు ₹6,400 అవుతుంది.',
    },
    faqs: [
      {
        question: 'మైనర్ మరియు మేజర్ సర్వీస్ మధ్య తేడా ఏమిటి?',
        answer: 'మైనర్ సర్వీస్‌లో ఇంజిన్ ఆయిల్ మాత్రమే మారుస్తారు, మేజర్ సర్వీస్‌లో అన్ని ఫిల్టర్లు, కూలెంట్ మరియు అలైన్‌మెంట్ చేస్తారు.',
      },
    ],
  },
  kn: {
    meta: {
      title: 'ವಾಹನ ಸರ್ವೀಸ್ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | ಕಾರು & ಬೈಕ್ ನಿರ್ವಹಣೆ | IndiaTools',
      metaDescription: 'ಬೈಕ್, ಕಾರು ಮತ್ತು ಎಸ್‌ಯುವಿ ವಾಹನಗಳ ಆವರ್ತಕ ಸರ್ವೀಸಿಂಗ್ ಬಿಲ್ ಅನ್ನು ನಿಖರವಾಗಿ ಅಂದಾಜು ಮಾಡಿ.',
      h1: 'ವಾಹನ ಸರ್ವೀಸ್ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      subtitle: 'ಬೈಕ್‌ಗಳು ಮತ್ತು ಕಾರುಗಳಿಗೆ ಮೈನರ್ ಮತ್ತು ಮೇಜರ್ ಸರ್ವೀಸಿಂಗ್ ಬಜೆಟ್ ಅನ್ನು ಮುಂಚಿತವಾಗಿಯೇ ಯೋಜಿಸಿ.',
    },
    ui: {
      vehicleDetails: 'ವಾಹನ & ಓಡೋಮೀಟರ್ ವಿವರಗಳು',
      workshopSlabs: 'ವರ್ಕ್‌ಶಾಪ್ ದರಗಳು',
      selectSegment: 'ವಾಹನದ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      bikeLabel: 'ದ್ವಿಚಕ್ರ ವಾಹನ / ಬೈಕ್',
      hatchbackLabel: 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್',
      sedanLabel: 'ಸೆಡಾನ್',
      suvLabel: 'ಎಸ್‌ಯುವಿ',
      currentOdometer: 'ಪ್ರಸ್ತುತ ಓಡೋಮೀಟರ್ ರೀಡಿಂಗ್',
      scheduledServiceLevel: 'ಸರ್ವೀಸ್ ಹಂತ',
      minorService: 'ಮೈನರ್ ಸರ್ವೀಸ್',
      minorServiceDesc: 'ಎಂಜಿನ್ ಆಯಿಲ್, ಆಯಿಲ್ ಫಿಲ್ಟರ್ & ಸಾಮಾನ್ಯ ತಪಾಸಣೆ',
      majorService: 'ಮೇಜರ್ ಸರ್ವೀಸ್',
      majorServiceDesc: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳು, ದ್ರವಗಳು & ವೀಲ್ ಅಲೈನ್‌ಮೆಂಟ್',
      estimatedInvoice: 'ಅಂದಾಜು ವರ್ಕ್‌ಶಾಪ್ ಬಿಲ್',
      everyKmInterval: 'ಪ್ರತಿ {km} ಕಿ.ಮೀಗೆ',
      classification: 'ವರ್ಗೀಕರಣ:',
      engineOilItem: 'ಎಂಜಿನ್ ಆಯಿಲ್ (ಸಿಂಥೆಟಿಕ್)',
      filtersItem: 'ಫಿಲ್ಟರ್‌ಗಳು (ಆಯಿಲ್, ಏರ್, ಕ್ಯಾಬಿನ್ ಫಿಲ್ಟರ್)',
      laborGstItem: 'ಲೇಬರ್ ಶುಲ್ಕ + 18% ಜಿಎಸ್‌ಟಿ',
      alignmentItem: 'ವೀಲ್ ಅಲೈನ್‌ಮೆಂಟ್ & ಬ್ಯಾಲೆನ್ಸಿಂಗ್',
      mandatoryItems: 'ಕಡ್ಡಾಯ ತಪಾಸಣೆ ಮತ್ತು ಬದಲಾಯಿಸುವ ಭಾಗಗಳು:',
      workshopTipTitle: 'ವರ್ಕ್‌ಶಾಪ್ ಸಲಹೆ',
      workshopTipDesc: 'ಅನಗತ್ಯ ಎಂಜಿನ್ ಡಿಕಾರ್ಬನೈಸಿಂಗ್ ಅಥವಾ ದುಬಾರಿ ಸ್ಪ್ರೇಗಳನ್ನು ನಿರಾಕರಿಸಿ. ಮಾಲೀಕರ ಕೈಪಿಡಿಯ ಪ್ರಕಾರ ಮಾತ್ರ ಕೆಲಸ ಮಾಡಿಸಿದರೆ ಶೇ. 25 ರಷ್ಟು ಹಣ ಉಳಿಯುತ್ತದೆ.',
      resultSummaryTitle: 'ವಾಹನ ಸರ್ವೀಸ್ ಬಜೆಟ್ ಯೋಜಕ:',
      vehicleSegmentText: 'ವಾಹನ ವಿಭಾಗ',
      currentOdometerText: 'ಓಡೋಮೀಟರ್ ರೀಡಿಂಗ್',
      serviceLevelText: 'ಸರ್ವೀಸ್ ಹಂತ',
      estimatedBillText: 'ಅಂದಾಜು ಸರ್ವೀಸ್ ಬಿಲ್',
      costBreakdownText: 'ವೆಚ್ಚದ ವಿವರ',
      engineOilText: 'ಎಂಜಿನ್ ಆಯಿಲ್',
      filtersText: 'ಫಿಲ್ಟರ್‌ಗಳು',
      laborText: 'ಲೇಬರ್ & ಜಿಎಸ್‌ಟಿ',
      consumablesText: 'ಕೂಲೆಂಟ್ & ಇತರೆ',
      wheelAlignmentText: 'ವೀಲ್ ಅಲೈನ್‌ಮೆಂಟ್',
      recommendationsText: 'ಪ್ರಮುಖ ಶಿಫಾರಸುಗಳು',
      calculatedOn: 'IndiaTools ಮೂಲಕ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ',
    },
    formulaExplanation: 'ಒಟ್ಟು ಬಿಲ್ = ಆಯಿಲ್ + ಫಿಲ್ಟರ್‌ಗಳು + ಅಲೈನ್‌ಮೆಂಟ್ + (ಲೇಬರ್ ಶುಲ್ಕ × 1.18 ಜಿಎಸ್‌ಟಿ).',
    assumptions: ['18% ಜಿಎಸ್‌ಟಿ ಒಳಗೊಂಡ ಅಧಿಕೃತ ವರ್ಕ್‌ಶಾಪ್ ದರಗಳು.'],
    example: {
      title: 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್ 30,000 ಕಿ.ಮೀ ಮೇಜರ್ ಸರ್ವೀಸ್',
      inputs: {
        'ವಾಹನ': 'ಹ್ಯಾಚ್‌ಬ್ಯಾಕ್',
        'ಓಡೋಮೀಟರ್': '35,000 ಕಿ.ಮೀ',
        'ಸರ್ವೀಸ್ ಹಂತ': 'ಮೇಜರ್ ಸರ್ವೀಸ್',
      },
      outputs: {
        'ಅಂದಾಜು ಬಿಲ್': '₹6,400',
        'ಎಂಜಿನ್ ಆಯಿಲ್': '₹2,100',
        'ಫಿಲ್ಟರ್‌ಗಳು': '₹1,550',
        'ಲೇಬರ್ + ಜಿಎಸ್‌ಟಿ': '₹2,124',
      },
      explanation: '30,000 ಕಿ.ಮೀ ಸರ್ವೀಸ್‌ನಲ್ಲಿ ಆಯಿಲ್, ಫಿಲ್ಟರ್‌ಗಳು ಮತ್ತು ಲೇಬರ್ ಶುಲ್ಕ ಸೇರಿದಂತೆ ಒಟ್ಟು ಸುಮಾರು ₹6,400 ಬಿಲ್ ಬರುತ್ತದೆ.',
    },
    faqs: [
      {
        question: 'ಮೈನರ್ ಮತ್ತು ಮೇಜರ್ ಸರ್ವೀಸ್ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
        answer: 'ಮೈನರ್ ಸರ್ವೀಸ್‌ನಲ್ಲಿ ಎಂಜಿನ್ ಆಯಿಲ್ ಮತ್ತು ಮೂಲಭೂತ ತಪಾಸಣೆ ಮಾಡಲಾಗುತ್ತದೆ. ಮೇಜರ್ ಸರ್ವೀಸ್‌ನಲ್ಲಿ ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳು, ಕೂಲೆಂಟ್ ಮತ್ತು ಅಲೈನ್‌ಮೆಂಟ್ ಮಾಡಲಾಗುತ್ತದೆ.',
      },
    ],
  },
}

registerToolTranslations('vehicle-service-cost', vehicleServiceCostTranslations)
