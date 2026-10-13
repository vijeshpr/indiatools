import type { InpaintingLocale } from './types'
export type { InpaintingLocale }

export interface InpaintingFAQ {
  q: string
  a: string
}

export interface InpaintingTranslation {
  title: string
  subtitle: string
  badgeFree: string
  badgePrivacy: string
  badgeEngine: string
  dropTitle: string
  dropSubtitle: string
  dropBrowse: string
  brushTool: string
  eraserTool: string
  brushRadius: string
  undo: string
  redo: string
  clearMask: string
  inpaintAction: string
  inpainting: string
  beforeAfterToggle: string
  showingBefore: string
  showingAfter: string
  downloadImage: string
  downloadJpg: string
  downloadPng: string
  resetImage: string
  analyzingStatus: string
  propagatingStatus: string
  finalizingStatus: string
  doneStatus: string
  faqs: InpaintingFAQ[]
}

export const INPAINTING_LOCALES: Record<
  InpaintingLocale,
  { name: string; nativeName: string; flag: string }
> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
}

export const INPAINTING_TRANSLATIONS: Record<InpaintingLocale, InpaintingTranslation> = {
  en: {
    title: 'Fast Inpainting Watermark Remover & Object Eraser',
    subtitle: 'Erase watermarks, date stamps, phone logos, and unwanted objects from photos in seconds using Fast Marching inpainting. 100% private in your browser.',
    badgeFree: '100% Free & Unlimited',
    badgePrivacy: 'Zero Upload • 100% Private',
    badgeEngine: 'Client-Side Inpainting Engine',
    dropTitle: 'Drag & drop photo here to remove watermark or object',
    dropSubtitle: 'Supports JPG, PNG, and WebP photos with zero cloud upload',
    dropBrowse: 'Browse Photo',
    brushTool: 'Brush Mask',
    eraserTool: 'Eraser',
    brushRadius: 'Brush Radius',
    undo: 'Undo',
    redo: 'Redo',
    clearMask: 'Clear Mask',
    inpaintAction: 'Erase & Inpaint',
    inpainting: 'Inpainting Image...',
    beforeAfterToggle: 'Compare Before / After',
    showingBefore: 'Original Photo',
    showingAfter: 'Clean Inpainted',
    downloadImage: 'Download Clean Photo',
    downloadJpg: 'Download JPG',
    downloadPng: 'Download PNG',
    resetImage: 'New Photo',
    analyzingStatus: 'Analyzing boundary contours and edge gradients...',
    propagatingStatus: 'Propagating boundary colors and texture gradients...',
    finalizingStatus: 'Harmonizing pixel continuity and blending edges...',
    doneStatus: 'Inpainting completed successfully!',
    faqs: [
      {
        q: 'How does the inpainting algorithm remove watermarks without blurring?',
        a: 'The tool uses the Alexandru Telea Fast Marching inpainting method. It calculates the gradient and distance map from the surrounding clean pixels and seamlessly marches inward, reconstructing the natural background texture.',
      },
      {
        q: 'Are my private photographs uploaded to any cloud server?',
        a: 'Never. All computer vision calculations and canvas rendering execute 100% locally in your device browser memory. Zero bytes leave your device.',
      },
      {
        q: 'Can I erase camera "Shot on..." phone watermarks and date stamps?',
        a: 'Yes. Simply paint over the phone brand logo, date stamp, or text watermark with the red brush and click "Erase & Inpaint".',
      },
      {
        q: 'Is there a resolution limit or watermark added by IndiaTools?',
        a: 'No. There are no resolution caps, no paywalls, and IndiaTools never adds any branding or watermark of its own.',
      },
      {
        q: 'What should I do if I accidentally brush over parts I want to keep?',
        a: 'Use the "Eraser" tool to unmask any unwanted brush strokes, or click "Undo" to revert previous brush actions.',
      },
    ],
  },
  ml: {
    title: 'ഫാസ്റ്റ് ഇൻപെയിന്റിംഗ് വാട്ടർമാർക്ക് റിമൂവർ & ഒബ്‌ജക്റ്റ് ഇറേസർ',
    subtitle: 'ഫോട്ടോകളിൽ നിന്നുള്ള വാട്ടർമാർക്കുകൾ, ക്യാമറ സ്റ്റാമ്പുകൾ, അനാവശ്യ വസ്തുക്കൾ എന്നിവ സെക്കൻഡുകൾക്കുള്ളിൽ മായ്ച്ചു കളയൂ. 100% പ്രൈവറ്റ് & സുരക്ഷിതം.',
    badgeFree: '100% സൗജന്യം • അൺലിമിറ്റഡ്',
    badgePrivacy: 'സീറോ അപ്‌ലോഡ് • 100% പ്രൈവറ്റ്',
    badgeEngine: 'ക്ലയന്റ്-സൈഡ് ഇൻപെയിന്റിംഗ് എഞ്ചിൻ',
    dropTitle: 'ഫോട്ടോ ഇവിടെ ഡ്രാഗ് & ഡ്രോപ്പ് ചെയ്യുക',
    dropSubtitle: 'JPG, PNG, WebP ചിത്രങ്ങൾ സെർവർ അപ്‌ലോഡ് ഇല്ലാതെ പ്രോസസ്സ് ചെയ്യാം',
    dropBrowse: 'ഫോട്ടോ തിരഞ്ഞെടുക്കുക',
    brushTool: 'ബ്രഷ് മാസ്ക്',
    eraserTool: 'ഇറേസർ',
    brushRadius: 'ബ്രഷ് സൈസ്',
    undo: 'മുൻപത്തെ അവസ്ഥ (Undo)',
    redo: 'അടുത്ത അവസ്ഥ (Redo)',
    clearMask: 'മാസ്ക് മായ്ക്കുക',
    inpaintAction: 'മായ്ക്കുക (Inpaint)',
    inpainting: 'പ്രോസസ്സിംഗ് നടക്കുന്നു...',
    beforeAfterToggle: 'മുൻപും ശേഷവും താരതമ്യം',
    showingBefore: 'ഒറിജിനൽ ഫോട്ടോ',
    showingAfter: 'മായ്ച്ച ഫോട്ടോ',
    downloadImage: 'ഫോട്ടോ ഡൗൺലോഡ് ചെയ്യുക',
    downloadJpg: 'JPG ഡൗൺലോഡ്',
    downloadPng: 'PNG ഡൗൺലോഡ്',
    resetImage: 'പുതിയ ഫോട്ടോ',
    analyzingStatus: 'അരികുകളും ഗ്രേഡിയന്റുകളും പരിശോധിക്കുന്നു...',
    propagatingStatus: 'പിക്സലുകൾ മായ്ച്ചു പുനർനിർമ്മിക്കുന്നു...',
    finalizingStatus: 'അരികുകൾ ബ്ലെൻഡ് ചെയ്യുന്നു...',
    doneStatus: 'വിജയകരമായി പൂർത്തിയായി!',
    faqs: [
      {
        q: 'ബ്ലർ ആവാതെ വാട്ടർമാർക്ക് എങ്ങനെയാണ് മായ്ക്കുന്നത്?',
        a: 'Alexandru Telea ഫാസ്റ്റ് മാർച്ചിംഗ് മെത്തേഡ് ഉപയോഗിച്ച് വാട്ടർമാർക്കിന് ചുറ്റുമുള്ള ബാക്ക്‌ഗ്രൗണ്ട് പിക്സലുകളും ടെക്സ്ചറുകളും കണക്കുകൂട്ടി സ്വാഭാവികമായി ഫിൽ ചെയ്യുന്നു.',
      },
      {
        q: 'ഫോട്ടോകൾ സെർവറിലേക്ക് അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നുണ്ടോ?',
        a: 'ഒരിക്കലുമില്ല. എല്ലാ പ്രോസസ്സിംഗും 100% നിങ്ങളുടെ ബ്രൗസറിനുള്ളിൽ മാത്രമാണ് നടക്കുന്നത്. ഡാറ്റ പൂർണ്ണമായും സുരക്ഷിതമാണ്.',
      },
      {
        q: 'ഫോണിലെ "Shot on..." വാട്ടർമാർക്കുകളും തീയതിയും മാറ്റാൻ കഴിയുമോ?',
        a: 'തീർച്ചയായും. അത്തരം എഴുത്തുകൾക്ക് മുകളിലൂടെ ചുവന്ന ബ്രഷ് വരച്ച് "മായ്ക്കുക" ക്ലിക്ക് ചെയ്താൽ മതി.',
      },
      {
        q: 'സൈറ്റിന്റെ സ്വന്തം വാട്ടർമാർക്ക് ഫോട്ടോകളിൽ വരുമോ?',
        a: 'ഇല്ല. IndiaTools യാതൊരുവിധ വാട്ടർമാർക്കുകളും ചേർക്കില്ല.',
      },
      {
        q: 'അബദ്ധത്തിൽ ആവശ്യമുള്ള ഭാഗത്ത് ബ്രഷ് വരച്ചാൽ എന്തുചെയ്യും?',
        a: '"ഇറേസർ" ടൂൾ ഉപയോഗിച്ച് ആ ഭാഗം ഒഴിവാക്കാം അല്ലെങ്കിൽ "Undo" ക്ലിക്ക് ചെയ്യാം.',
      },
    ],
  },
  hi: {
    title: 'फास्ट इनपेंटिंग वॉटरमार्क रिमूवर और ऑब्जेक्ट इरेज़र',
    subtitle: 'फ़ोटो से वॉटरमार्क, तारीख़ के स्टैम्प और अवांछित वस्तुओं को बिना धुंधला किए कुछ ही सेकंड में हटाएं। 100% सुरक्षित और मुफ्त।',
    badgeFree: '100% मुफ्त व असीमित',
    badgePrivacy: 'जीरो अपलोड • 100% निजी',
    badgeEngine: 'क्लाइंट-साइड इनपेंटिंग इंजन',
    dropTitle: 'फ़ोटो यहाँ ड्रैग और ड्रॉप करें',
    dropSubtitle: 'JPG, PNG, WebP फ़ोटो बिना सर्वर अपलोड के प्रोसेस करें',
    dropBrowse: 'फ़ोटो चुनें',
    brushTool: 'ब्रश मास्क',
    eraserTool: 'इरेज़र',
    brushRadius: 'ब्रश का आकार',
    undo: 'पूर्ववत (Undo)',
    redo: 'फिर से करें (Redo)',
    clearMask: 'मास्क हटाएं',
    inpaintAction: 'हटाएं और साफ करें',
    inpainting: 'प्रोसेसिंग जारी है...',
    beforeAfterToggle: 'पहले और बाद की तुलना',
    showingBefore: 'मूल फ़ोटो',
    showingAfter: 'साफ फ़ोटो',
    downloadImage: 'फ़ोटो डाउनलोड करें',
    downloadJpg: 'JPG डाउनलोड',
    downloadPng: 'PNG डाउनलोड',
    resetImage: 'नई फ़ोटो',
    analyzingStatus: 'किनारों और रंगों का विश्लेषण जारी है...',
    propagatingStatus: 'पिक्सेल और बनावट का पुनर्निर्माण जारी है...',
    finalizingStatus: 'किनारों को सुचारू किया जा रहा है...',
    doneStatus: 'सफलतापूर्वक साफ किया गया!',
    faqs: [
      {
        q: 'बिना धुंधला किए वॉटरमार्क कैसे हटाया जाता है?',
        a: 'यह टूल Alexandru Telea फास्ट मार्चिंग इनपेंटिंग एल्गोरिदम का उपयोग करके आसपास की पृष्ठभूमि से पिक्सेल की नकल करके प्राकृतिक रूप से भरता है।',
      },
      {
        q: 'क्या मेरी तस्वीरें सर्वर पर अपलोड होती हैं?',
        a: 'बिल्कुल नहीं। सब कुछ आपके ब्राउज़र की मेमोरी में 100% स्थानीय रूप से प्रोसेस होता है।',
      },
      {
        q: 'क्या कैमरे के "Shot on..." वॉटरमार्क और तारीख हट सकती है?',
        a: 'हाँ, लाल ब्रश से उस हिस्से को रंगें और "हटाएं और साफ करें" पर क्लिक करें।',
      },
      {
        q: 'क्या टूल अपना कोई वॉटरमार्क जोड़ता है?',
        a: 'नहीं, आपकी तस्वीर पूरी तरह से साफ रहती है।',
      },
      {
        q: 'गलती से गलत जगह ब्रश चलने पर क्या करें?',
        a: '"इरेज़र" टूल चुनें या "Undo" बटन दबाएं।',
      },
    ],
  },
  ta: {
    title: 'ஃபாஸ்ட் இன்பெயிண்டிங் வாட்டர்மார்க் ரிமூவர் & ஆப்ஜெக்ட் எரேசர்',
    subtitle: 'புகைப்படங்களிலிருந்து வாட்டர்மார்க், தேதி ஸ்டாம்புகள் மற்றும் தேவையற்ற பொருட்களை மங்கலாக்காமல் எளிதாக அழிக்கவும். 100% பாதுகாப்பானது.',
    badgeFree: '100% இலவசம் • வரம்பற்றது',
    badgePrivacy: 'ஜீரோ அப்லோட் • 100% தனிப்பட்டது',
    badgeEngine: 'கிளையண்ட்-சைட் இன்பெயிண்டிங் எஞ்சின்',
    dropTitle: 'புகைப்படத்தை இங்கே இழுத்து விடவும்',
    dropSubtitle: 'JPG, PNG, WebP படங்கள் ஆதரிக்கப்படும்',
    dropBrowse: 'புகைப்படத்தைத் தேர்ந்தெடுக்கவும்',
    brushTool: 'பிரஷ் மாஸ்க்',
    eraserTool: 'அழிப்பான் (Eraser)',
    brushRadius: 'பிரஷ் அளவு',
    undo: 'முந்தைய செயல் (Undo)',
    redo: 'மீண்டும் செய் (Redo)',
    clearMask: 'மாஸ்க் நீக்குக',
    inpaintAction: 'அழிக்கவும் (Inpaint)',
    inpainting: 'செயலாக்கம் நடைபெறுகிறது...',
    beforeAfterToggle: 'முன் / பின் ஒப்பீடு',
    showingBefore: 'அசல் புகைப்படம்',
    showingAfter: 'சுத்தப்படுத்தப்பட்ட படம்',
    downloadImage: 'படத்தை பதிவிறக்குக',
    downloadJpg: 'JPG பதிவிறக்கம்',
    downloadPng: 'PNG பதிவிறக்கம்',
    resetImage: 'புதிய படம்',
    analyzingStatus: 'விளிம்புகள் ஆய்வு செய்யப்படுகின்றன...',
    propagatingStatus: 'பின்னணி பிக்சல்கள் நிரப்பப்படுகின்றன...',
    finalizingStatus: 'விளிம்புகள் மெருகூட்டப்படுகின்றன...',
    doneStatus: 'வெற்றிகரமாக அழிக்கப்பட்டது!',
    faqs: [
      {
        q: 'மங்கலாகாமல் எவ்வாறு வாட்டர்மார்க் அழிக்கப்படுகிறது?',
        a: 'Telea ஃபாஸ்ட் மார்ச்சிங் முறை மூலம் சுற்றியுள்ள இயற்கை நிறங்களை பயன்படுத்தி பின்னணி தடையின்றி மீட்டமைக்கப்படுகிறது.',
      },
      {
        q: 'புகைப்படங்கள் சர்வரில் பதிவேற்றப்படுமா?',
        a: 'இல்லை, உங்கள் உலாவியிலேயே 100% தனிப்பட்ட முறையில் செயலாக்கப்படுகிறது.',
      },
      {
        q: 'போனின் "Shot on..." வாட்டர்மார்க்கை நீக்க முடியுமா?',
        a: 'ஆம், சிவப்பு பிரஷ் மூலம் தேர்ந்தெடுத்து "அழிக்கவும்" என்பதை கிளிக் செய்யவும்.',
      },
      {
        q: 'இந்த கருவி ஏதேனும் சொந்த வாட்டர்மார்க் சேர்க்குமா?',
        a: 'இல்லை, எந்தவித கூடுதல் வாட்டர்மார்க்கும் சேர்க்கப்படாது.',
      },
      {
        q: 'தவறாக வரைந்தால் என்ன செய்வது?',
        a: 'அழிப்பான் (Eraser) கருவியை பயன்படுத்தலாம் அல்லது Undo செய்யலாம்.',
      },
    ],
  },
  te: {
    title: 'ఫాస్ట్ ఇన్‌పెయింటింగ్ వాటర్‌మార్క్ రిమూవర్ & ఆబ్జెక్ట్ ఎరేజర్',
    subtitle: 'ఫోటోల నుండి వాటర్‌మార్క్‌లు, తేదీ స్టాంపులు మరియు అనవసరమైన వస్తువులను బ్లర్ కాకుండా తొలగించండి. 100% ఉచితం & సురక్షితం.',
    badgeFree: '100% ఉచితం • అపరిమితం',
    badgePrivacy: 'జీరో అప్‌లోడ్ • 100% ప్రైవేట్',
    badgeEngine: 'క్లయింట్-సైడ్ ఇన్‌పెయింటింగ్ ఇంజిన్',
    dropTitle: 'ఫోటోను ఇక్కడ డ్రాగ్ & డ్రాప్ చేయండి',
    dropSubtitle: 'JPG, PNG, WebP ఫైళ్లు సర్వర్ అప్‌లోడ్ లేకుండా పనిచేస్తాయి',
    dropBrowse: 'ఫోటోను ఎంచుకోండి',
    brushTool: 'బ్రష్ మాస్క్',
    eraserTool: 'ఎరేజర్',
    brushRadius: 'బ్రష్ సైజు',
    undo: 'అన్‌డూ (Undo)',
    redo: 'రీడూ (Redo)',
    clearMask: 'మాస్క్ తొలగించు',
    inpaintAction: 'తొలగించండి (Inpaint)',
    inpainting: 'ప్రాసెసింగ్ జరుగుతోంది...',
    beforeAfterToggle: 'ముందు / తర్వాత పోలిక',
    showingBefore: 'అసలు ఫోటో',
    showingAfter: 'శుభ్రం చేసిన ఫోటో',
    downloadImage: 'ఫోటో డౌన్‌లోడ్ చేయండి',
    downloadJpg: 'JPG డౌన్‌లోడ్',
    downloadPng: 'PNG డౌన్‌లోడ్',
    resetImage: 'కొత్త ఫోటో',
    analyzingStatus: 'అంచుల రంగులను పరిశీలిస్తోంది...',
    propagatingStatus: 'పిక్సెల్స్ పునర్నిర్మిస్తోంది...',
    finalizingStatus: 'అంచులను సున్నితంగా చేస్తోంది...',
    doneStatus: 'విజయవంతంగా పూర్తయింది!',
    faqs: [
      {
        q: 'మసకబారకుండా వాటర్‌మార్క్ ఎలా తొలగించబడుతుంది?',
        a: 'Telea ఫాస్ట్ మార్చింగ్ పద్ధతి ద్వారా చుట్టుపక్కల సహజ రంగులను గ్రహించి ఆ భాగాన్ని పూర్తి చేస్తుంది.',
      },
      {
        q: 'నా ఫోటోలు సర్వర్‌కి వెళ్తాయా?',
        a: 'లేదు, ప్రాసెసింగ్ మొత్తం 100% మీ బ్రౌజర్‌లోనే జరుగుతుంది.',
      },
      {
        q: 'ఫోన్‌లోని "Shot on..." వాటర్‌మార్క్ పోతుందా?',
        a: 'అవును, ఎరుపు బ్రష్‌తో మార్క్ చేసి క్లిక్ చేస్తే సులభంగా తొలగిపోతుంది.',
      },
      {
        q: 'టూల్ స్వంత వాటర్‌మార్క్ వేస్తుందా?',
        a: 'లేదు, మీ ఫోటో పూర్తిగా క్లీన్‌గా ఉంటుంది.',
      },
      {
        q: 'పొరపాటుగా మార్క్ చేస్తే ఎలా?',
        a: 'ఎరేజర్ లేదా అన్‌డూ బటన్ ఉపయోగించవచ్చు.',
      },
    ],
  },
  kn: {
    title: 'ಫಾಸ್ಟ್ ಇನ್‌ಪೇಂಟಿಂಗ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಿಮೂವರ್ & ಆಬ್ಜೆಕ್ಟ್ ಎರೇಸರ್',
    subtitle: 'ಫೋಟೋಗಳಿಂದ ವಾಟರ್‌ಮಾರ್ಕ್‌ಗಳು, ದಿನಾಂಕದ ಸ್ಟ್ಯಾಂಪ್‌ಗಳು ಮತ್ತು ಬೇಡದ ವಸ್ತುಗಳನ್ನು ಬ್ಲರ್ ಆಗದೆ ಸುಲಭವಾಗಿ ಅಳಿಸಿ. 100% ಉಚಿತ ಮತ್ತು ಖಾಸಗಿ.',
    badgeFree: '100% ಉಚಿತ • ಅನಿಯಮಿತ',
    badgePrivacy: 'ಶೂನ್ಯ ಅಪ್‌ಲೋಡ್ • 100% ಖಾಸಗಿ',
    badgeEngine: 'ಕ್ಲೈಂಟ್-ಸೈಡ್ ಇನ್‌ಪೇಂಟಿಂಗ್ ಇಂಜಿನ್',
    dropTitle: 'ಫೋಟೋವನ್ನು ಇಲ್ಲಿ ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಮಾಡಿ',
    dropSubtitle: 'JPG, PNG, WebP ಫೋಟೋಗಳು ಯಾವುದೇ ಅಪ್‌ಲೋಡ್ ಇಲ್ಲದೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ',
    dropBrowse: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    brushTool: 'ಬ್ರಷ್ ಮಾಸ್ಕ್',
    eraserTool: 'ಎರೇಸರ್',
    brushRadius: 'ಬ್ರಷ್ ಗಾತ್ರ',
    undo: 'ಹಿಂದಕ್ಕೆ (Undo)',
    redo: 'ಮುಂದಕ್ಕೆ (Redo)',
    clearMask: 'ಮಾಸ್ಕ್ ತೆರವುಗೊಳಿಸಿ',
    inpaintAction: 'ಅಳಿಸಿ ಮತ್ತು ಸರಿಪಡಿಸಿ',
    inpainting: 'ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...',
    beforeAfterToggle: 'ಮೊದಲು / ನಂತರ ಹೋಲಿಕೆ',
    showingBefore: 'ಮೂಲ ಫೋಟೋ',
    showingAfter: 'ಸ್ವಚ್ಛಗೊಳಿಸಿದ ಫೋಟೋ',
    downloadImage: 'ಫೋಟೋ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    downloadJpg: 'JPG ಡೌನ್‌ಲೋಡ್',
    downloadPng: 'PNG ಡೌನ್‌ಲೋಡ್',
    resetImage: 'ಹೊಸ ಫೋಟೋ',
    analyzingStatus: 'ಅಂಚುಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    propagatingStatus: 'ಹಿನ್ನೆಲೆ ಪಿಕ್ಸೆಲ್‌ಗಳನ್ನು ಮರುನಿರ್ಮಿಸಲಾಗುತ್ತಿದೆ...',
    finalizingStatus: 'ಅಂಚುಗಳನ್ನು ನಯಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    doneStatus: 'ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!',
    faqs: [
      {
        q: 'ಫೋಟೋ ಮಸುಕಾಗದೆ ವಾಟರ್‌ಮಾರ್ಕ್ ಹೇಗೆ ಅಳಿಸುತ್ತದೆ?',
        a: 'Telea ಫಾಸ್ಟ್ ಮಾರ್ಚಿಂಗ್ ವಿಧಾನದ ಮೂಲಕ ಸುತ್ತಲಿನ ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಆ ಜಾಗವನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ತುಂಬುತ್ತದೆ.',
      },
      {
        q: 'ಫೋಟೋಗಳು ಸರ್ವರ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತವೆಯೇ?',
        a: 'ಇಲ್ಲ, ಎಲ್ಲವೂ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಖಾಸಗಿಯಾಗಿ ನಡೆಯುತ್ತದೆ.',
      },
      {
        q: 'ಕ್ಯಾಮೆರಾದ "Shot on..." ವಾಟರ್‌ಮಾರ್ಕ್ ತೆಗೆಯಬಹುದೇ?',
        a: 'ಹೌದು, ಕೆಂಪು ಬ್ರಷ್‌ನಿಂದ ಮಾರ್ಕ್ ಮಾಡಿ ತೆಗೆಯಬಹುದು.',
      },
      {
        q: 'ಟೂಲ್ ಯಾವುದೇ ಸ್ವಂತ ಲೋಗೋ ಸೇರಿಸುತ್ತದೆಯೇ?',
        a: 'ಇಲ್ಲ, ನಿಮ್ಮ ಫೋಟೋ ಸಂಪೂರ್ಣ ಸ್ವಚ್ಛವಾಗಿರುತ್ತದೆ.',
      },
      {
        q: 'ತಪ್ಪಾಗಿ ಮಾರ್ಕ್ ಮಾಡಿದರೆ ಏನು ಮಾಡುವುದು?',
        a: 'ಎರೇಸರ್ ಅಥವಾ Undo ಬಟನ್ ಬಳಸಿ ಸರಿಪಡಿಸಬಹುದು.',
      },
    ],
  },
  bn: {
    title: 'ফাস্ট ইনপেইন্টিং ওয়াটারমার্ক রিমুভার এবং অবজেক্ট ইরেজার',
    subtitle: 'ছবি থেকে ওয়াটারমার্ক, তারিখের স্ট্যাম্প ও অনাকাঙ্ক্ষিত অবজেক্ট ঝাপসা না করে সেকেন্ডেই মুছে ফেলুন। ১০০% ব্যক্তিগত ও বিনামূল্যে।',
    badgeFree: '১০০% বিনামূল্যে • আনলিমিটেড',
    badgePrivacy: 'জিরো আপলোড • ১০০% ব্যক্তিগত',
    badgeEngine: 'ক্লায়েন্ট-সাইড ইনপেইন্টিং ইঞ্জিন',
    dropTitle: 'এখানে ছবি ড্র্যাগ ও ড্রপ করুন',
    dropSubtitle: 'JPG, PNG, WebP ফরম্যাটের ছবি কোনো সার্ভার আপলোড ছাড়াই ব্যবহার করুন',
    dropBrowse: 'ছবি নির্বাচন করুন',
    brushTool: 'ব্রাশ মাস্ক',
    eraserTool: 'ইরেজার',
    brushRadius: 'ব্রাশের আকার',
    undo: 'পূর্বাবস্থায় ফিরুন (Undo)',
    redo: 'পুনরায় করুন (Redo)',
    clearMask: 'মাস্ক মুছুন',
    inpaintAction: 'মুছুন এবং ঠিক করুন',
    inpainting: 'প্রসেসিং চলছে...',
    beforeAfterToggle: 'আগে ও পরের তুলনা',
    showingBefore: 'আসল ছবি',
    showingAfter: 'পরিষ্কার ছবি',
    downloadImage: 'ছবি ডাউনলোড করুন',
    downloadJpg: 'JPG ডাউনলোড',
    downloadPng: 'PNG ডাউনলোড',
    resetImage: 'নতুন ছবি',
    analyzingStatus: 'ধারের রং ও কনট্যুর বিশ্লেষণ করা হচ্ছে...',
    propagatingStatus: 'পিক্সেল ও ব্যাকগ্রাউন্ড টেক্সচার তৈরি হচ্ছে...',
    finalizingStatus: 'ধারগুলো মসৃণ করা হচ্ছে...',
    doneStatus: 'সফলভাবে মুছে ফেলা হয়েছে!',
    faqs: [
      {
        q: 'ছবি ব্লার না করে কীভাবে ওয়াটারমার্ক মোছা হয়?',
        a: 'এটি Alexandru Telea ফাস্ট মার্চিং অ্যালগরিদম ব্যবহার করে আশেপাশের ব্যাকগ্রাউন্ড পিক্সেল থেকে প্রাকৃতিকভাবে জায়গাটি পূরণ করে।',
      },
      {
        q: 'আমার ছবি কি কোনো সার্ভারে আপলোড হয়?',
        a: 'কখনোই না। সমস্ত প্রসেসিং সম্পূর্ণভাবে আপনার ব্রাউজারের মেমরিতে সম্পন্ন হয়।',
      },
      {
        q: 'ফোনের "Shot on..." ওয়াটারমার্ক ও তারিখ মোছা যাবে?',
        a: 'হ্যাঁ, লাল ব্রাশ দিয়ে দাগ দিয়ে "মুছুন" বাটনে ক্লিক করলেই মুছে যাবে।',
      },
      {
        q: 'টুলটি কি নিজস্ব কোনো ওয়াটারমার্ক যোগ করে?',
        a: 'না, আপনার ছবি সম্পূর্ণ নিখুঁত থাকবে।',
      },
      {
        q: 'ভুল জায়গায় ব্রাশ পড়লে কী করব?',
        a: 'ইরেজার টুল বা Undo বাটন ব্যবহার করতে পারেন।',
      },
    ],
  },
}

export function getInpaintingTranslation(
  locale: InpaintingLocale
): InpaintingTranslation {
  return INPAINTING_TRANSLATIONS[locale] || INPAINTING_TRANSLATIONS.en
}
