import { SupportedLanguage } from '../../types/p2pPrint'

export interface I18nContent {
  title: string
  subtitle: string
  heroHeadline: string
  heroSubheadline: string
  pills: {
    p2pZeroCloud: string
    noNumberSharing: string
    webrtcSpeed: string
  }
  stats: {
    cloudLogs: string
    instantPrint: string
    zeroSetup: string
  }
  cta: {
    openTerminal: string
    downloadPoster: string
    testMobile: string
    printDoc: string
    autoPrint: string
    purge: string
    sendToPrinter: string
    sendAnother: string
    selectFile: string
    changeFile: string
  }
  terminal: {
    stationTitle: string
    waitingCustomer: string
    customerConnected: string
    receivingStream: string
    readyToPrint: string
    sessionCode: string
    scanToConnect: string
    incomingTray: string
    noDocWaiting: string
    noDocDesc: string
    bytesReceived: string
    speed: string
    docInspector: string
    pages: string
    colorMode: string
    copies: string
    pageRange: string
    orientation: string
    color: string
    bw: string
    portrait: string
    landscape: string
    purgedNotice: string
  }
  mobile: {
    senderTitle: string
    connectedToCounter: string
    connectingToCounter: string
    offlineNotice: string
    tapToUpload: string
    supportedFormats: string
    preferencesTitle: string
    colorLabel: string
    copiesLabel: string
    pagesLabel: string
    pagesPlaceholder: string
    allPages: string
    sendingProgress: string
    successTitle: string
    successDesc: string
    instantShopArrival: string
  }
  poster: {
    modalTitle: string
    shopNameLabel: string
    taglineLabel: string
    sizeLabel: string
    themeLabel: string
    printButton: string
    closeButton: string
    scanInstructions: string
    step1: string
    step2: string
    step3: string
    privacyBadge: string
    noWhatsAppBadge: string
  }
  faqs: Array<{ q: string; a: string }>
}

export const I18N_DATA: Record<SupportedLanguage, I18nContent> = {
  en: {
    title: 'Scan-to-Print P2P QR Drop Studio',
    subtitle: 'Zero-WhatsApp In-Memory Document Printing',
    heroHeadline: 'Zero-WhatsApp Printing. Scan, Drop & Print in Seconds.',
    heroSubheadline:
      'Direct phone-to-computer document transmission built for Akshaya Centres, DTP shops, colleges, and stationery stores. No WhatsApp clutter, no mobile number sharing, 100% private in-memory P2P transfer.',
    pills: {
      p2pZeroCloud: '100% Client-Side P2P (Zero Cloud Storage)',
      noNumberSharing: 'No Number Sharing Required',
      webrtcSpeed: 'Direct WebRTC Data Transfer',
    },
    stats: {
      cloudLogs: '0 Cloud Logs',
      instantPrint: 'Instant Auto-Print',
      zeroSetup: 'Zero Setup Needed',
    },
    cta: {
      openTerminal: 'Open Shop Counter Terminal (PC)',
      downloadPoster: 'Download Countertop A4 QR Poster',
      testMobile: 'Simulate Mobile Sender in New Tab',
      printDoc: 'Print Document Now',
      autoPrint: 'Auto-Print on Receive',
      purge: 'Done & Purge RAM',
      sendToPrinter: 'Send to Shop Counter',
      sendAnother: 'Send Another File',
      selectFile: 'Select File to Print',
      changeFile: 'Choose Different File',
    },
    terminal: {
      stationTitle: 'Countertop Print Station',
      waitingCustomer: 'Waiting for Customer...',
      customerConnected: 'Customer Phone Connected!',
      receivingStream: 'Receiving Document Chunks...',
      readyToPrint: 'Document Ready for Printing',
      sessionCode: 'Session Code',
      scanToConnect: 'Customer scans this QR code with mobile camera to send documents instantly.',
      incomingTray: 'Incoming Document Tray',
      noDocWaiting: 'No document transferred yet',
      noDocDesc: 'When a customer scans the QR code and selects a file, it will stream directly to this terminal in RAM.',
      bytesReceived: 'Bytes Received',
      speed: 'Transfer Speed',
      docInspector: 'Document Inspector & Layout',
      pages: 'Total Pages',
      colorMode: 'Color Mode',
      copies: 'Number of Copies',
      pageRange: 'Page Range',
      orientation: 'Orientation',
      color: 'Color Print',
      bw: 'Black & White (Monochrome)',
      portrait: 'Portrait',
      landscape: 'Landscape',
      purgedNotice: 'Memory successfully zeroed. All buffers shredded from RAM.',
    },
    mobile: {
      senderTitle: 'Mobile Print Drop',
      connectedToCounter: 'Connected to Shop Counter',
      connectingToCounter: 'Connecting to Shop Station...',
      offlineNotice: 'Connecting peer-to-peer data channel...',
      tapToUpload: 'Tap to select document or photo',
      supportedFormats: 'Supports PDF, JPG, PNG, WEBP & DOCX',
      preferencesTitle: 'Print Preferences',
      colorLabel: 'Print Color',
      copiesLabel: 'Copies',
      pagesLabel: 'Page Range',
      pagesPlaceholder: 'e.g. All, or 1-3, 5',
      allPages: 'All Pages',
      sendingProgress: 'Streaming encrypted data chunks to counter...',
      successTitle: 'Delivered to Shop Counter!',
      successDesc: 'Your file is loaded directly into the shopkeeper’s print station and is ready to print.',
      instantShopArrival: 'Zero WhatsApp chat history saved. Zero cloud retention.',
    },
    poster: {
      modalTitle: 'Countertop QR Standee Generator',
      shopNameLabel: 'Shop / Business Name',
      taglineLabel: 'Custom Tagline / Subtitle',
      sizeLabel: 'Print Paper Size',
      themeLabel: 'Standee Aesthetic Theme',
      printButton: 'Print Standee (A4 / A5)',
      closeButton: 'Close Standee View',
      scanInstructions: 'Scan with your camera to print documents instantly',
      step1: '1. Scan this QR code with your phone camera',
      step2: '2. Select your PDF or photo & set copies',
      step3: '3. Tap Send — prints instantly at the counter!',
      privacyBadge: '100% In-Memory Private P2P',
      noWhatsAppBadge: 'No Phone Number or WhatsApp Needed',
    },
    faqs: [
      {
        q: 'Why should DTP and photocopy shops replace WhatsApp with Scan-to-Print?',
        a: 'Photocopy shops waste huge amounts of time saving unfamiliar customer numbers, deleting heavy 50MB PDFs from full phone memories, and exposing personal WhatsApp contacts. Scan-to-Print enables customers to simply point their camera, drop their file, and the shop PC displays the print job in RAM without any phone number exchange.',
      },
      {
        q: 'How does the direct P2P data transfer work without servers?',
        a: 'The phone and shop PC establish a direct WebRTC DataChannel via peer signaling and public STUN servers. Binary data streams directly between the two local devices. No file is ever uploaded, cached, or stored on any intermediate cloud server.',
      },
      {
        q: 'What happens to the customer documents after printing?',
        a: 'Once the shopkeeper clicks "Done & Purge", the in-memory JavaScript TypedArray buffers are zeroed out and garbage collected, and the object URLs are revoked. Nothing is saved to disk.',
      },
      {
        q: 'Can customers send multi-page PDFs, color photos, and ID cards?',
        a: 'Yes. The system supports multi-page PDFs, JPEGs, PNGs, and images. Customers can even select color mode, number of copies, and specific page ranges directly from their phone before sending.',
      },
    ],
  },
  ml: {
    title: 'സ്കാൻ-ടു-പ്രിന്റ് ക്യു.ആർ ഡ്രോപ്പ് സ്റ്റുഡിയോ',
    subtitle: 'വാട്സാപ്പ് ഇല്ലാതെ നേരിട്ട് പ്രിന്റ് എടുക്കാം',
    heroHeadline: 'വാട്സാപ്പ് ഇല്ലാതെ മൊബൈലിൽ നിന്ന് കമ്പ്യൂട്ടറിലേക്ക് നേരിട്ട് പ്രിന്റ് ചെയ്യാം.',
    heroSubheadline:
      'അക്ഷയ കേന്ദ്രങ്ങൾ, ഡി.ടി.പി സെന്ററുകൾ, ഫോട്ടോകോപ്പി കടകൾ എന്നിവയ്ക്കായി തയ്യാറാക്കിയ സുരക്ഷിത പിയർ-ടു-പിയർ പ്രിന്റിംഗ് സിസ്റ്റം. നമ്പർ കൊടുക്കേണ്ടതില്ല, ക്ലൗഡിൽ സൂക്ഷിക്കില്ല.',
    pills: {
      p2pZeroCloud: '100% സ്വകാര്യം (ക്ലൗഡ് അപ്‌ലോഡ് ഇല്ല)',
      noNumberSharing: 'മൊബൈൽ നമ്പർ നൽകേണ്ടതില്ല',
      webrtcSpeed: 'ഡയറക്ട് വെബ്‌ആർ.ടി.സി കണക്ഷൻ',
    },
    stats: {
      cloudLogs: '0 ക്ലൗഡ് സ്റ്റോറേജ്',
      instantPrint: 'ഓട്ടോ-പ്രിന്റ് സപ്പോർട്ട്',
      zeroSetup: 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യേണ്ടതില്ല',
    },
    cta: {
      openTerminal: 'ഷോപ്പ് കൗണ്ടർ ടെർമിനൽ തുറക്കുക',
      downloadPoster: 'A4 ക്യു.ആർ പോസ്റ്റർ പ്രിന്റ് ചെയ്യുക',
      testMobile: 'മൊബൈൽ സെൻഡർ പുതിയ ടാബിൽ പരിശോധിക്കുക',
      printDoc: 'ഡോക്യുമെന്റ് പ്രിന്റ് ചെയ്യുക',
      autoPrint: 'ഫയൽ വന്നയുടൻ പ്രിന്റ് ചെയ്യുക',
      purge: 'മെമ്മറി ക്ലിയർ ചെയ്യുക (Purge)',
      sendToPrinter: 'കൗണ്ടറിലേക്ക് അയക്കുക',
      sendAnother: 'മറ്റൊരു ഫയൽ അയക്കുക',
      selectFile: 'പ്രിന്റ് ചെയ്യേണ്ട ഫയൽ തിരഞ്ഞെടുക്കുക',
      changeFile: 'മറ്റൊരു ഫയൽ മാറ്റുക',
    },
    terminal: {
      stationTitle: 'കൗണ്ടർ പ്രിന്റ് സ്റ്റേഷൻ',
      waitingCustomer: 'ഉപഭോക്താവിനായി കാത്തിരിക്കുന്നു...',
      customerConnected: 'ഉപഭോക്താവിന്റെ ഫോൺ കണക്റ്റ് ആയി!',
      receivingStream: 'ഫയൽ ഡാറ്റ സ്വീകരിക്കുന്നു...',
      readyToPrint: 'ഫയൽ പ്രിന്റ് ചെയ്യാൻ തയാറാണ്',
      sessionCode: 'സെഷൻ കോഡ്',
      scanToConnect: 'ഉപഭോക്താക്കൾ ഈ ക്യു.ആർ കോഡ് ക്യാമറ വഴി സ്കാൻ ചെയ്ത് ഫയലുകൾ അയക്കാം.',
      incomingTray: 'ഇൻകമിംഗ് ഫയൽ ട്രേ',
      noDocWaiting: 'ഇതുവരെ ഫയലുകൾ വന്നിട്ടില്ല',
      noDocDesc: 'ഉപഭോക്താവ് ക്യു.ആർ സ്കാൻ ചെയ്ത് അയക്കുമ്പോൾ ഫയൽ തത്സമയം ഇവിടെ ദൃശ്യമാകും.',
      bytesReceived: 'ലഭിച്ച ബൈറ്റുകൾ',
      speed: 'വേഗത',
      docInspector: 'ഡോക്യുമെന്റ് പ്രിവ്യൂ',
      pages: 'ആകെ പേജുകൾ',
      colorMode: 'കളർ മോഡ്',
      copies: 'കോപ്പികളുടെ എണ്ണം',
      pageRange: 'പേജ് നമ്പർ',
      orientation: 'ഓറിയന്റേഷൻ',
      color: 'കളർ പ്രിന്റ്',
      bw: 'ബ്ലാക്ക് & വൈറ്റ്',
      portrait: 'പോർട്രെയ്റ്റ്',
      landscape: 'ലാൻഡ്‌സ്‌കേപ്പ്',
      purgedNotice: 'മെമ്മറി പൂർണ്ണമായി ശുദ്ധീകരിച്ചു. ഫയലുകൾ നീക്കം ചെയ്തു.',
    },
    mobile: {
      senderTitle: 'മൊബൈൽ പ്രിന്റ് ഡ്രോപ്പ്',
      connectedToCounter: 'ഷോപ്പ് കൗണ്ടറുമായി കണക്റ്റ് ആയി',
      connectingToCounter: 'കൗണ്ടറിലേക്ക് കണക്റ്റ് ചെയ്യുന്നു...',
      offlineNotice: 'ഡാറ്റാ ചാനൽ ബന്ധിപ്പിക്കുന്നു...',
      tapToUpload: 'ഡോക്യുമെന്റോ ഫോട്ടോയോ തിരഞ്ഞെടുക്കുക',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX സപ്പോർട്ട് ചെയ്യും',
      preferencesTitle: 'പ്രിന്റിംഗ് മുൻഗണനകൾ',
      colorLabel: 'പ്രിന്റ് നിറം',
      copiesLabel: 'കോപ്പികൾ',
      pagesLabel: 'പേജുകൾ',
      pagesPlaceholder: 'ഉദാ: All അല്ലെങ്കിൽ 1-3, 5',
      allPages: 'എല്ലാ പേജുകളും',
      sendingProgress: 'കൗണ്ടറിലേക്ക് സുരക്ഷിതമായി അയക്കുന്നു...',
      successTitle: 'കൗണ്ടറിലേക്ക് വിജയകരമായി എത്തി!',
      successDesc: 'നിങ്ങളുടെ ഫയൽ ഷോപ്പ് കമ്പ്യൂട്ടറിൽ എത്തിക്കഴിഞ്ഞു. പ്രിന്റ് തയാറാണ്.',
      instantShopArrival: 'വാട്സാപ്പ് നമ്പറോ ചാറ്റ് വിവരങ്ങളോ സൂക്ഷിക്കില്ല.',
    },
    poster: {
      modalTitle: 'ടേബിൾ-ടോപ്പ് ക്യു.ആർ സ്റ്റാൻഡി പോസ്റ്റർ',
      shopNameLabel: 'സ്ഥാപനത്തിന്റെ പേര്',
      taglineLabel: 'സബ്‌ടൈറ്റിൽ',
      sizeLabel: 'പേപ്പർ സൈസ്',
      themeLabel: 'ഡിസൈൻ തീം',
      printButton: 'പോസ്റ്റർ പ്രിന്റ് ചെയ്യുക',
      closeButton: 'അടയ്ക്കുക',
      scanInstructions: 'ഫയലുകൾ പ്രിന്റ് ചെയ്യാൻ നിങ്ങളുടെ ഫോൺ ക്യാമറ കൊണ്ട് സ്കാൻ ചെയ്യുക',
      step1: '1. ഫോൺ ക്യാമറ വഴി ക്യു.ആർ കോഡ് സ്കാൻ ചെയ്യുക',
      step2: '2. ഡോക്യുമെന്റ് തിരഞ്ഞെടുത്ത് കോപ്പികൾ നിശ്ചയിക്കുക',
      step3: '3. "അയക്കുക" ടാപ്പ് ചെയ്യുക — തത്സമയം പ്രിന്റ് റെഡി!',
      privacyBadge: '100% സ്വകാര്യ കണക്ഷൻ',
      noWhatsAppBadge: 'വാട്സാപ്പോ മൊബൈൽ നമ്പറോ ആവശ്യമില്ല',
    },
    faqs: [
      {
        q: 'അക്ഷയ കേന്ദ്രങ്ങളിലും ഡി.ടി.പി സെന്ററുകളിലും ഇത് എങ്ങനെ ഉപകരിക്കും?',
        a: 'ദിവസവും വരുന്ന നൂറുകണക്കിന് ആളുകളുടെ മൊബൈൽ നമ്പർ സേവ് ചെയ്ത് വാട്സാപ്പിൽ ഫയൽ വാങ്ങി കമ്പ്യൂട്ടർ മെമ്മറി നിറയുന്ന ബുദ്ധിമുട്ട് ഒഴിവാക്കാം. കസ്റ്റമർക്ക് ക്യു.ആർ സ്കാൻ ചെയ്ത് നിമിഷങ്ങൾക്കുള്ളിൽ നേരിട്ട് ഫയൽ അയക്കാം.',
      },
      {
        q: 'ഫയലുകൾ ഏതെങ്കിലും സെർവറിൽ സേവ് ചെയ്യപ്പെടുമോ?',
        a: 'ഒരിക്കലുമില്ല. WebRTC സാങ്കേതികവിദ്യ വഴി മൊബൈലിൽ നിന്ന് നേരിട്ട് കമ്പ്യൂട്ടറിന്റെ റാമിലേക്ക് മാത്രമാണ് ഫയൽ എത്തുന്നത്. സർവറുകളിലോ ക്ലൗഡിലോ സൂക്ഷിക്കുന്നില്ല.',
      },
    ],
  },
  hi: {
    title: 'स्कैन-टू-प्रिंट P2P क्यूआर ड्रॉप स्टूडियो',
    subtitle: 'बिना व्हाट्सएप सीधे मोबाइल से प्रिंट करें',
    heroHeadline: 'बिना व्हाट्सएप नंबर शेयर किए, सीधे मोबाइल से कंप्यूटर पर प्रिंट करें।',
    heroSubheadline:
      'फोटोकॉपी, डीटीपी दुकानों, साइबर कैफे और कॉलेजों के लिए आधुनिक समाधान। न व्हाट्सएप चैट, न नंबर शेयरिंग, 100% सुरक्षित P2P ट्रांसफर।',
    pills: {
      p2pZeroCloud: '100% क्लाइंट-साइड P2P (जीरो क्लाउड अपलोड)',
      noNumberSharing: 'मोबाइल नंबर देने की जरूरत नहीं',
      webrtcSpeed: 'सीधा WebRTC डेटा ट्रांसफर',
    },
    stats: {
      cloudLogs: '0 क्लाउड लॉग्स',
      instantPrint: 'इंस्टेंट ऑटो-प्रिंट',
      zeroSetup: 'बिना किसी ऐप इनस्टॉल के',
    },
    cta: {
      openTerminal: 'शॉप काउंटर टर्मिनल खोलें',
      downloadPoster: 'काउंटरटॉप A4 पोस्टर प्रिंट करें',
      testMobile: 'नए टैब में मोबाइल सेंडर टेस्ट करें',
      printDoc: 'डॉक्यूमेंट प्रिंट करें',
      autoPrint: 'फाइल आते ही ऑटो-प्रिंट करें',
      purge: 'मेमोरी साफ करें (Purge RAM)',
      sendToPrinter: 'काउंटर पर भेजें',
      sendAnother: 'दूसरी फाइल भेजें',
      selectFile: 'प्रिंट करने हेतु फाइल चुनें',
      changeFile: 'फाइल बदलें',
    },
    terminal: {
      stationTitle: 'काउंटर प्रिंट स्टेशन',
      waitingCustomer: 'ग्राहक की प्रतीक्षा में...',
      customerConnected: 'ग्राहक का फोन कनेक्ट हो गया!',
      receivingStream: 'डेटा चंक्स आ रहे हैं...',
      readyToPrint: 'डॉक्यूमेंट प्रिंट के लिए तैयार है',
      sessionCode: 'सत्र कोड',
      scanToConnect: 'ग्राहक अपने कैमरे से यह क्यूआर स्कैन करके तुरंत फाइल भेज सकते हैं।',
      incomingTray: 'इनकमिंग फाइल ट्रे',
      noDocWaiting: 'अभी तक कोई फाइल नहीं आई',
      noDocDesc: 'जैसे ही ग्राहक क्यूआर स्कैन करके फाइल भेजेंगे, वह सीधे यहां रैम में लोड हो जाएगी।',
      bytesReceived: 'प्राप्त बाइट्स',
      speed: 'ट्रांसफर स्पीड',
      docInspector: 'डॉक्यूमेंट प्रिव्यू',
      pages: 'कुल पृष्ठ',
      colorMode: 'कलर मोड',
      copies: 'प्रतियों की संख्या',
      pageRange: 'पेज रेंज',
      orientation: 'ओरिएंटेशन',
      color: 'रंगीन (Color)',
      bw: 'ब्लैक एंड व्हाइट',
      portrait: 'पोर्ट्रेट',
      landscape: 'लैंडस्केप',
      purgedNotice: 'मेमोरी पूरी तरह साफ कर दी गई है।',
    },
    mobile: {
      senderTitle: 'मोबाइल प्रिंट ड्रॉप',
      connectedToCounter: 'शॉप काउंटर से जुड़ा हुआ है',
      connectingToCounter: 'शॉप काउंटर से जुड़ रहा है...',
      offlineNotice: 'डेटा चैनल कनेक्ट हो रहा है...',
      tapToUpload: 'डॉक्यूमेंट या फोटो चुनें',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX सपोर्टेड',
      preferencesTitle: 'प्रिंट प्राथमिकताएं',
      colorLabel: 'प्रिंट कलर',
      copiesLabel: 'प्रतियां (Copies)',
      pagesLabel: 'पेज संख्या',
      pagesPlaceholder: 'उदा: All या 1-3, 5',
      allPages: 'सभी पेज',
      sendingProgress: 'काउंटर पर सुरक्षित भेजा जा रहा है...',
      successTitle: 'दुकान काउंटर पर पहुंच गया!',
      successDesc: 'आपकी फाइल सीधे दुकानदार के प्रिंट स्टेशन में पहुंच गई है।',
      instantShopArrival: 'व्हाट्सएप चैट या नंबर सेव करने की कोई जरूरत नहीं।',
    },
    poster: {
      modalTitle: 'टेबल-टॉप स्टैंडी पोस्टर जनरेटर',
      shopNameLabel: 'दुकान का नाम',
      taglineLabel: 'टैगलाइन',
      sizeLabel: 'कागज का आकार',
      themeLabel: 'डिज़ाइन थीम',
      printButton: 'पोस्टर प्रिंट करें',
      closeButton: 'बंद करें',
      scanInstructions: 'प्रिंट करने के लिए अपने मोबाइल कैमरे से क्यूआर कोड स्कैन करें',
      step1: '1. फोन कैमरे से क्यूआर कोड स्कैन करें',
      step2: '2. डॉक्यूमेंट चुनें और प्रतियां सेट करें',
      step3: '3. "भेजें" दबाएं — काउंटर पर तुरंत प्रिंट तैयार!',
      privacyBadge: '100% निजी P2P ट्रांसफर',
      noWhatsAppBadge: 'व्हाट्सएप नंबर देने की आवश्यकता नहीं',
    },
    faqs: [
      {
        q: 'फोटोकॉपी दुकानों के लिए यह व्हाट्सएप से बेहतर क्यों है?',
        a: 'दुकानदारों को हर ग्राहक का फोन नंबर सेव नहीं करना पड़ता, और भारी फाइलों से फोन की मेमोरी नहीं भरती। ग्राहक सीधे क्यूआर स्कैन करके फाइल भेजते हैं।',
      },
      {
        q: 'क्या मेरी फाइल किसी ऑनलाइन सर्वर पर सेव होती है?',
        a: 'बिल्कुल नहीं। यह सीधे मोबाइल से दुकान के कंप्यूटर की रैम में WebRTC के माध्यम से ट्रांसफर होती है। कोई क्लाउड स्टोरेज नहीं है।',
      },
    ],
  },
  ta: {
    title: 'ஸ்கேன்-டு-பிரிண்ட் P2P QR டிராப் ஸ்டுடியோ',
    subtitle: 'வாட்ஸ்அப் இல்லாமல் மொபைலில் இருந்து நேரடியாக பிரிண்ட் எடுங்கள்',
    heroHeadline: 'வாட்ஸ்அப் எண் பகிராமல், மொபைலில் இருந்து கணினிக்கு நேரடி பிரிண்ட்.',
    heroSubheadline:
      'ஜெராக்ஸ் கடைகள், டி.டி.பி மையங்கள், கல்லூரிகளுக்கான பிரத்யேக சாதனம். வாட்ஸ்அப் நெரிசல் இல்லை, முழுமையான P2P பாதுகாப்பு.',
    pills: {
      p2pZeroCloud: '100% நேரடி P2P (கிளவுட் சேமிப்பு இல்லை)',
      noNumberSharing: 'மொபைல் எண் தேவையில்லை',
      webrtcSpeed: 'வேகமான WebRTC இணைப்பு',
    },
    stats: {
      cloudLogs: '0 கிளவுட் சேமிப்பு',
      instantPrint: 'உடனடி ஆட்டோ-பிரிண்ட்',
      zeroSetup: 'செயலி இன்ஸ்டால் தேவையில்லை',
    },
    cta: {
      openTerminal: 'கவுண்டர் டெர்மினலை திறக்கவும்',
      downloadPoster: 'A4 QR போஸ்டரை பிரிண்ட் செய்யவும்',
      testMobile: 'மொபைல் அனுப்புநரை சோதிக்கவும்',
      printDoc: 'டாக்குமெண்ட் பிரிண்ட் செய்க',
      autoPrint: 'வந்தவுடன் தானாக பிரிண்ட் செய்க',
      purge: 'மெமரி அழிக்க (Purge)',
      sendToPrinter: 'கவுண்டருக்கு அனுப்பு',
      sendAnother: 'மற்றொரு ஃபைல் அனுப்பு',
      selectFile: 'ஃபைலை தேர்ந்தெடுக்கவும்',
      changeFile: 'வேறு ஃபைலை மாற்றவும்',
    },
    terminal: {
      stationTitle: 'கவுண்டர் பிரிண்ட் நிலையம்',
      waitingCustomer: 'வாடிக்கையாளருக்காக காத்திருக்கிறது...',
      customerConnected: 'வாடிக்கையாளர் மொபைல் இணைக்கப்பட்டது!',
      receivingStream: 'கோப்பு பெறப்படுகிறது...',
      readyToPrint: 'பிரிண்ட் செய்ய தயாராக உள்ளது',
      sessionCode: 'செஷன் குறியீடு',
      scanToConnect: 'வாடிக்கையாளர் இந்த QR குறியீட்டை ஸ்கேன் செய்து ஃபைல்களை அனுப்பலாம்.',
      incomingTray: 'வந்த கோப்புகள் ட்ரே',
      noDocWaiting: 'இன்னும் கோப்புகள் வரவில்லை',
      noDocDesc: 'வாடிக்கையாளர் அனுப்பும் போது ஃபைல் உடனடியாக இங்கு தோன்றும்.',
      bytesReceived: 'பெறப்பட்ட பைட்டுகள்',
      speed: 'வேகம்',
      docInspector: 'கோப்பு முன்னோட்டம்',
      pages: 'மொத்த பக்கங்கள்',
      colorMode: 'வண்ண பயன்முறை',
      copies: 'நகல்களின் எண்ணிக்கை',
      pageRange: 'பக்க வரம்பு',
      orientation: 'திசைவேகம்',
      color: 'வண்ணம் (Color)',
      bw: 'கருப்பு வெள்ளை',
      portrait: 'செங்குத்து',
      landscape: 'கிடைமட்டம்',
      purgedNotice: 'மெமரி முழுமையாக அழிக்கப்பட்டது.',
    },
    mobile: {
      senderTitle: 'மொபைல் பிரிண்ட் டிராப்',
      connectedToCounter: 'கவுண்டருடன் இணைக்கப்பட்டது',
      connectingToCounter: 'இணைக்கப்படுகிறது...',
      offlineNotice: 'இணைப்பு ஏற்படுத்தப்படுகிறது...',
      tapToUpload: 'டாக்குமெண்ட் அல்லது புகைப்படத்தை தேர்வு செய்யவும்',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX ஆதரிக்கப்படுகிறது',
      preferencesTitle: 'பிரிண்ட் விருப்பங்கள்',
      colorLabel: 'நிறம்',
      copiesLabel: 'நகல்கள்',
      pagesLabel: 'பக்கங்கள்',
      pagesPlaceholder: 'எ.கா: All அல்லது 1-3, 5',
      allPages: 'அனைத்து பக்கங்களும்',
      sendingProgress: 'கவுண்டருக்கு அனுப்பப்படுகிறது...',
      successTitle: 'கவுண்டருக்கு சென்றடைந்தது!',
      successDesc: 'உங்கள் கோப்பு கடை கணினியில் தயாராக உள்ளது.',
      instantShopArrival: 'எந்த வாட்ஸ்அப் அரட்டையோ எண்ணோ சேமிக்கப்படவில்லை.',
    },
    poster: {
      modalTitle: 'QR ஸ்டாண்டீ போஸ்டர்',
      shopNameLabel: 'கடையின் பெயர்',
      taglineLabel: 'துணைத்தலைப்பு',
      sizeLabel: 'தாள் அளவு',
      themeLabel: 'வடிவமைப்பு தீம்',
      printButton: 'போஸ்டர் பிரிண்ட் செய்க',
      closeButton: 'மூடுக',
      scanInstructions: 'பிரிண்ட் செய்ய உங்கள் கேமரா மூலம் ஸ்கேன் செய்யவும்',
      step1: '1. QR குறியீட்டை ஸ்கேன் செய்யவும்',
      step2: '2. கோப்பை தேர்ந்தெடுத்து நகல்களை தேர்வு செய்க',
      step3: '3. "அனுப்பு" தட்டவும் — உடனடியாக பிரிண்ட் தயார்!',
      privacyBadge: '100% பாதுகாப்பான P2P',
      noWhatsAppBadge: 'வாட்ஸ்அப் தேவையில்லை',
    },
    faqs: [
      {
        q: 'ஜெராக்ஸ் மற்றும் பிரிண்டிங் கடைகளுக்கு இது எவ்வாறு உதவுகிறது?',
        a: 'ஒவ்வொரு வாடிக்கையாளரின் வாட்ஸ்அப் எண்ணையும் சேமிக்க வேண்டிய அவசியமில்லை. கஸ்டமர் நேரடியாக QR ஸ்கேன் செய்து ஃபைல் அனுப்பலாம்.',
      },
      {
        q: 'கோப்புகள் சர்வரில் சேமிக்கப்படுமா?',
        a: 'இல்லை. இது மொபைலில் இருந்து நேரடியாக கணினியின் ரேமுக்கு மட்டுமே மாற்றப்படும்.',
      },
    ],
  },
  te: {
    title: 'స్కాన్-టు-ప్రింట్ P2P QR డ్రాప్ స్టూడియో',
    subtitle: 'వాట్సాప్ లేకుండా నేరుగా ప్రింట్ తీసుకోండి',
    heroHeadline: 'వాట్సాప్ నంబర్ పంచుకోకుండా, మొబైల్ నుండి కంప్యూటర్‌కు డైరెక్ట్ ప్రింట్.',
    heroSubheadline:
      'జెరాక్స్ షాపులు, డి.టి.పి సెంటర్లు మరియు కాలేజీల కోసం ప్రత్యేక టూల్. వాట్సాప్ గందరగోళం లేదు, పూర్తి ప్రైవేట్ P2P బదిలీ.',
    pills: {
      p2pZeroCloud: '100% క్లయింట్-సైడ్ P2P (క్లౌడ్ సేవింగ్ లేదు)',
      noNumberSharing: 'మొబైల్ నంబర్ అవసరం లేదు',
      webrtcSpeed: 'వేగవంతమైన WebRTC డేటా ట్రాన్స్‌ఫర్',
    },
    stats: {
      cloudLogs: '0 క్లౌడ్ లాగ్‌లు',
      instantPrint: 'ఇన్‌స్టంట్ ఆటో-ప్రింట్',
      zeroSetup: 'యాప్ ఇన్‌స్టాల్ అక్కర్లేదు',
    },
    cta: {
      openTerminal: 'షాప్ కౌంటర్ టెర్మినల్ తెరవండి',
      downloadPoster: 'A4 QR పోస్టర్ ప్రింట్ చేయండి',
      testMobile: 'మొబైల్ సెండర్ కొత్త ట్యాబ్‌లో పరీక్షించండి',
      printDoc: 'డాక్యుమెంట్ ప్రింట్ చేయండి',
      autoPrint: 'ఫైల్ రాగానే ఆటో-ప్రింట్ చేయండి',
      purge: 'మెమరీ క్లియర్ చేయండి (Purge)',
      sendToPrinter: 'కౌంటర్‌కు పంపండి',
      sendAnother: 'మరొక ఫైల్ పంపండి',
      selectFile: 'ప్రింట్ చేయాల్సిన ఫైల్ ఎంచుకోండి',
      changeFile: 'ఫైల్ మార్చండి',
    },
    terminal: {
      stationTitle: 'కౌంటర్ ప్రింట్ స్టేషన్',
      waitingCustomer: 'కస్టమర్ కోసం ఎదురుచూస్తోంది...',
      customerConnected: 'కస్టమర్ ఫోన్ కనెక్ట్ అయింది!',
      receivingStream: 'ఫైల్ డేటా స్వీకరిస్తోంది...',
      readyToPrint: 'డాక్యుమెంట్ ప్రింట్‌కు సిద్ధంగా ఉంది',
      sessionCode: 'సెషన్ కోడ్',
      scanToConnect: 'కస్టమర్ తమ కెమెరాతో ఈ QR స్కాన్ చేసి నేరుగా ఫైల్స్ పంపవచ్చు.',
      incomingTray: 'ఇన్‌కమింగ్ ఫైల్ ట్రే',
      noDocWaiting: 'ఇంకా ఎలాంటి ఫైల్ రాలేదు',
      noDocDesc: 'కస్టమర్ QR స్కాన్ చేసి పంపినప్పుడు ఫైల్ వెంటనే ఇక్కడ కనిపిస్తుంది.',
      bytesReceived: 'వచ్చిన బైట్లు',
      speed: 'స్పీడ్',
      docInspector: 'డాక్యుమెంట్ ప్రివ్యూ',
      pages: 'మొత్తం పేజీలు',
      colorMode: 'కలర్ మోడ్',
      copies: 'కాపీల సంఖ్య',
      pageRange: 'పేజీ పరిధి',
      orientation: 'ఓరియంటేషన్',
      color: 'కలర్ (రంగు)',
      bw: 'బ్లాక్ & వైట్',
      portrait: 'పోర్ట్రెయిట్',
      landscape: 'ల్యాండ్‌స్కేప్',
      purgedNotice: 'మెమరీ పూర్తిగా క్లియర్ చేయబడింది.',
    },
    mobile: {
      senderTitle: 'మొబైల్ ప్రింట్ డ్రాప్',
      connectedToCounter: 'షాప్ కౌంటర్‌కు కనెక్ట్ అయింది',
      connectingToCounter: 'కనెక్ట్ అవుతోంది...',
      offlineNotice: 'డేటా ఛానల్ కనెక్ట్ అవుతోంది...',
      tapToUpload: 'డాక్యుమెంట్ లేదా ఫోటో ఎంచుకోండి',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX సపోర్ట్ చేస్తుంది',
      preferencesTitle: 'ప్రింట్ ప్రాధాన్యతలు',
      colorLabel: 'ప్రింట్ కలర్',
      copiesLabel: 'కాపీలు',
      pagesLabel: 'పేజీలు',
      pagesPlaceholder: 'ఉదా: All లేదా 1-3, 5',
      allPages: 'అన్ని పేజీలు',
      sendingProgress: 'కౌంటర్‌కు సురక్షితంగా పంపబడుతోంది...',
      successTitle: 'షాప్ కౌంటర్‌కు చేరింది!',
      successDesc: 'మీ ఫైల్ షాప్ కంప్యూటర్‌లో ప్రింట్‌కు సిద్ధంగా ఉంది.',
      instantShopArrival: 'వాట్సాప్ నంబర్ లేదా చాట్ హిస్టరీ సేవ్ అవ్వదు.',
    },
    poster: {
      modalTitle: 'టేబుల్-టాప్ స్టాండీ పోస్టర్',
      shopNameLabel: 'షాప్ పేరు',
      taglineLabel: 'ట్యాగ్‌లైన్',
      sizeLabel: 'పేపర్ సైజు',
      themeLabel: 'డిజైన్ థీమ్',
      printButton: 'పోస్టర్ ప్రింట్ చేయండి',
      closeButton: 'మూసివేయండి',
      scanInstructions: 'ప్రింట్ చేయడానికి మీ కెమెరాతో QR కోడ్ స్కాన్ చేయండి',
      step1: '1. ఫోన్ కెమెరాతో QR కోడ్ స్కాన్ చేయండి',
      step2: '2. ఫైల్ ఎంచుకుని కాపీలు సెట్ చేయండి',
      step3: '3. "పంపు" నొక్కండి — కౌంటర్ వద్ద వెంటనే ప్రింట్ రెడీ!',
      privacyBadge: '100% ప్రైవేట్ P2P',
      noWhatsAppBadge: 'వాట్సాప్ నంబర్ అవసరం లేదు',
    },
    faqs: [
      {
        q: 'జెరాక్స్ షాపులకు ఇది ఎలా సహాయపడుతుంది?',
        a: 'కస్టమర్ వాట్సాప్ నంబర్లు సేవ్ చేయాల్సిన శ్రమ తప్పుతుంది. కస్టమర్ కేవలం QR స్కాన్ చేసి నేరుగా కంప్యూటర్‌కు ఫైల్ పంపవచ్చు.',
      },
      {
        q: 'ఫైల్స్ క్లౌడ్ సర్వర్‌లో సేవ్ అవుతాయా?',
        a: 'లేదు. ఫైల్ నేరుగా మొబైల్ నుండి కంప్యూటర్ రామ్‌కు మాత్రమే వెళ్తుంది. ఏ సర్వర్‌లోనూ సేవ్ అవ్వదు.',
      },
    ],
  },
}
