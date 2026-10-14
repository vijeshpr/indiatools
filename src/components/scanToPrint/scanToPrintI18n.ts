import { SupportedLanguage } from '../../types/p2pPrint'

export interface I18nContent {
  title: string
  subtitle: string
  heroHeadline: string
  heroSubheadline: string
  trustBadges: {
    clientSideP2P: string
    noNumberExchange: string
    worksAnyPrinter: string
    silentPrivate: string
  }
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
    launchCounter: string
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
  howItWorks: {
    title: string
    subtitle: string
    steps: Array<{
      stepNumber: number
      title: string
      description: string
    }>
  }
  zeroPrinterSetup: {
    title: string
    subtitle: string
    badge: string
    bullet1: {
      title: string
      desc: string
    }
    bullet2: {
      title: string
      desc: string
    }
    bullet3: {
      title: string
      desc: string
    }
    supportedBrands: string
    osPrintNotice: string
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
      'Direct phone-to-computer document transmission built for Akshaya Centres, DTP centers, photo studios, and college print shops. No WhatsApp clutter, no mobile number sharing, 100% private in-memory P2P transfer.',
    trustBadges: {
      clientSideP2P: '100% Client-Side P2P (Zero Cloud Storage)',
      noNumberExchange: 'No Phone Number Exchange Needed',
      worksAnyPrinter: 'Works with Any Printer (No Drivers Needed)',
      silentPrivate: '100% Silent & Private',
    },
    pills: {
      p2pZeroCloud: '100% Client-Side P2P (Zero Cloud Storage)',
      noNumberSharing: 'No Phone Number Exchange Needed',
      webrtcSpeed: 'Direct WebRTC Data Transfer',
    },
    stats: {
      cloudLogs: '0 Cloud Logs',
      instantPrint: 'Instant Auto-Print',
      zeroSetup: 'Zero Setup Needed',
    },
    cta: {
      launchCounter: 'Launch Counter Station',
      openTerminal: 'Launch Counter Station',
      downloadPoster: 'Print Station Poster (A4 Tabletop)',
      testMobile: 'Simulate Mobile Sender in New Tab',
      printDoc: 'Print Document (Ctrl + P)',
      autoPrint: 'Auto-Print when Transfer Completes',
      purge: 'Done / Clear Document',
      sendToPrinter: 'Send to Shop PC',
      sendAnother: 'Send Another File',
      selectFile: 'Select File to Print',
      changeFile: 'Choose Different File',
    },
    howItWorks: {
      title: 'How It Works (Step-by-Step)',
      subtitle: 'Zero-configuration phone-to-computer print pipeline',
      steps: [
        {
          stepNumber: 1,
          title: 'Display QR on Shop PC',
          description: 'Open this page on your counter PC and show the dynamic QR code on screen or countertop standee.',
        },
        {
          stepNumber: 2,
          title: 'Customer Scans QR Code',
          description: 'Customer scans the QR code using their default phone camera or Google Lens without installing any app.',
        },
        {
          stepNumber: 3,
          title: 'Select File & Tap Send',
          description: 'Customer selects the document (PDF/Image) on mobile, chooses B&W or Color & copies, and taps Send.',
        },
        {
          stepNumber: 4,
          title: 'Direct Print at Counter',
          description: 'Document instantly streams into PC RAM. Click "Print Document" or use Auto-Print to output immediately.',
        },
      ],
    },
    zeroPrinterSetup: {
      title: 'For Shopkeepers: Zero Printer Setup Guide',
      subtitle: 'Works with your existing hardware with 0 setup',
      badge: 'Crucial Architecture Info',
      bullet1: {
        title: 'No Printer Setup Needed',
        desc: 'This tool uses whatever printer (Canon, HP, Epson, Brother) is already connected to your computer.',
      },
      bullet2: {
        title: 'No Software or Drivers to Install',
        desc: 'Click "Print" and your normal system print dialog opens automatically.',
      },
      bullet3: {
        title: 'Pre-formatted for A4',
        desc: 'Incoming documents are auto-fit to standard A4 printing with zero margin distortion.',
      },
      supportedBrands: 'Canon • HP • Epson • Brother • Ricoh • Konica Minolta • Pantum • Samsung',
      osPrintNotice: 'Native OS Print (Ctrl + P) • Standard system spooler • 100% hardware independent',
    },
    terminal: {
      stationTitle: 'Shopkeeper Terminal (The Print Station)',
      waitingCustomer: 'Waiting for Customer Phone to Scan...',
      customerConnected: 'Customer Phone Connected via WebRTC!',
      receivingStream: 'Receiving Document Chunks into RAM...',
      readyToPrint: 'Document Ready for Printing',
      sessionCode: 'Counter Station Code',
      scanToConnect: 'Customer points phone camera at this QR code to transfer documents in seconds.',
      incomingTray: 'Incoming Document Tray',
      noDocWaiting: 'No document transferred yet',
      noDocDesc: 'When a customer scans the QR code and selects a file, it will stream directly to this terminal in RAM.',
      bytesReceived: 'Bytes Received',
      speed: 'Transfer Speed',
      docInspector: 'Document Preview Carousel & Layout',
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
      senderTitle: 'Customer Mobile Sender',
      connectedToCounter: 'Connected to Shop PC via WebRTC',
      connectingToCounter: 'Connecting to Shop Station...',
      offlineNotice: 'Connecting peer-to-peer data channel...',
      tapToUpload: 'Tap to select document or photo (PDF, JPG, PNG, DOCX)',
      supportedFormats: 'Supports PDF, JPG, PNG, WEBP & DOCX',
      preferencesTitle: 'Pre-Print Preferences',
      colorLabel: 'Print Color',
      copiesLabel: 'Number of Copies',
      pagesLabel: 'Page Selection',
      pagesPlaceholder: 'e.g. All, or 1-3, 5',
      allPages: 'All Pages',
      sendingProgress: 'Streaming encrypted data chunks to counter...',
      successTitle: 'File transferred to PC successfully!',
      successDesc: 'Ready for printing. The shopkeeper’s terminal has loaded your document in RAM.',
      instantShopArrival: 'Zero WhatsApp chat history saved. Zero cloud retention.',
    },
    poster: {
      modalTitle: 'Print Station Poster Generator',
      shopNameLabel: 'Shop / Business Name',
      taglineLabel: 'Custom Tagline / Subtitle',
      sizeLabel: 'Print Paper Size',
      themeLabel: 'Standee Aesthetic Theme',
      printButton: 'Print Standee (A4 / A5)',
      closeButton: 'Close Standee View',
      scanInstructions: 'Scan with your camera to print documents instantly without WhatsApp',
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
        q: 'Do I need to install any printer driver or software?',
        a: 'No. The shopkeeper does not need to configure, select, or pair any printer inside the web app. The tool strictly uses the OS/system default printer already installed on the computer via standard window.print().',
      },
      {
        q: 'What happens to the customer documents after printing?',
        a: 'Once the shopkeeper clicks "Done / Clear Document", the in-memory JavaScript TypedArray buffers are zeroed out and garbage collected, and the object URLs are revoked. Nothing is saved to disk.',
      },
      {
        q: 'Can customers send multi-page PDFs, color photos, and ID cards?',
        a: 'Yes. The system supports multi-page PDFs, JPEGs, PNGs, and images. Customers can even select color mode, number of copies, and specific page ranges directly from their phone before sending.',
      },
    ],
  },
  ml: {
    title: 'സ്കാൻ-ടു-പ്രിന്റ് P2P QR ഡ്രോപ്പ് സ്റ്റുഡിയോ',
    subtitle: 'വാട്സാപ്പ് ഇല്ലാതെ നേരിട്ട് പ്രിന്റ് എടുക്കാം',
    heroHeadline: 'Zero-WhatsApp Printing. Scan, Drop & Print in Seconds.',
    heroSubheadline:
      'അക്ഷയ കേന്ദ്രങ്ങൾ, ഡി.ടി.പി സെന്ററുകൾ, ഫോട്ടോകോപ്പി കടകൾ എന്നിവയ്ക്കായി തയ്യാറാക്കിയ സുരക്ഷിത പിയർ-ടു-പിയർ പ്രിന്റിംഗ് സിസ്റ്റം. നമ്പർ കൊടുക്കേണ്ടതില്ല, ക്ലൗഡിൽ സൂക്ഷിക്കില്ല.',
    trustBadges: {
      clientSideP2P: '100% ക്ലയന്റ്-സൈഡ് P2P (ക്ലൗഡ് സ്റ്റോറേജ് ഇല്ല)',
      noNumberExchange: 'ഫോൺ നമ്പർ നൽകേണ്ടതില്ല',
      worksAnyPrinter: 'ഏത് പ്രിന്ററിലും പ്രവർത്തിക്കും (ഡ്രൈവർ ആവശ്യമില്ല)',
      silentPrivate: '100% നിശ്ശബ്ദവും സ്വകാര്യവും',
    },
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
      launchCounter: 'കൗണ്ടർ സ്റ്റേഷൻ ആരംഭിക്കുക',
      openTerminal: 'കൗണ്ടർ സ്റ്റേഷൻ ആരംഭിക്കുക',
      downloadPoster: 'കൗണ്ടർടോപ്പ് A4 QR പോസ്റ്റർ',
      testMobile: 'മൊബൈൽ സെൻഡർ പുതിയ ടാബിൽ പരിശോധിക്കുക',
      printDoc: 'ഡോക്യുമെന്റ് പ്രിന്റ് ചെയ്യുക (Ctrl + P)',
      autoPrint: 'ഫയൽ വന്നയുടൻ ഓട്ടോ-പ്രിന്റ് ചെയ്യുക',
      purge: 'പൂർത്തിയായി / മെമ്മറി ക്ലിയർ ചെയ്യുക',
      sendToPrinter: 'ഷോപ്പ് കമ്പ്യൂട്ടറിലേക്ക് അയക്കുക',
      sendAnother: 'മറ്റൊരു ഫയൽ അയക്കുക',
      selectFile: 'പ്രിന്റ് ചെയ്യേണ്ട ഫയൽ തിരഞ്ഞെടുക്കുക',
      changeFile: 'മറ്റൊരു ഫയൽ മാറ്റുക',
    },
    howItWorks: {
      title: 'പ്രവർത്തിക്കുന്ന വിധം (ഘട്ടം ഘട്ടമായി)',
      subtitle: 'വാട്സാപ്പും നമ്പറും ഇല്ലാതെ നിമിഷങ്ങൾക്കകം പ്രിന്റ് ചെയ്യാം',
      steps: [
        {
          stepNumber: 1,
          title: 'കമ്പ്യൂട്ടറിൽ ഈ പേജ് തുറക്കുക',
          description: 'നിങ്ങളുടെ കൗണ്ടർ കമ്പ്യൂട്ടറിൽ ഈ പേജ് തുറന്ന് സ്ക്രീനിലെ QR കോഡ് കാണിക്കുക.',
        },
        {
          stepNumber: 2,
          title: 'ഉപഭോക്താവ് QR സ്കാൻ ചെയ്യുന്നു',
          description: 'ഉപഭോക്താവ് സ്വന്തം ഫോൺ ക്യാമറയോ ഗൂഗിൾ ലെൻസോ ഉപയോഗിച്ച് QR കോഡ് സ്കാൻ ചെയ്യുന്നു.',
        },
        {
          stepNumber: 3,
          title: 'ഫയൽ തിരഞ്ഞെടുത്ത് Send ടാപ്പ് ചെയ്യുക',
          description: 'മൊബൈലിൽ നിന്ന് ഫയൽ (PDF/ഫോട്ടോ) തെരഞ്ഞെടുത്ത് കളർ, കോപ്പികൾ സെറ്റ് ചെയ്ത് അയക്കുക.',
        },
        {
          stepNumber: 4,
          title: 'കൗണ്ടറിൽ തത്സമയം പ്രിന്റ് ചെയ്യാം',
          description: 'ഫയൽ ഉടൻ കമ്പ്യൂട്ടർ റാമിൽ എത്തും. "Print Document" ക്ലിക്ക് ചെയ്ത് പ്രിന്റ് ചെയ്യാം.',
        },
      ],
    },
    zeroPrinterSetup: {
      title: 'കടക്കാർക്കായി: സീറോ പ്രിന്റർ സെറ്റപ്പ് ഗൈഡ്',
      subtitle: 'കമ്പ്യൂട്ടറുമായി ബന്ധിപ്പിച്ച ഏത് പ്രിന്ററിലും പ്രവർത്തിക്കും',
      badge: 'പ്രധാന നിർദ്ദേശം',
      bullet1: {
        title: 'പ്രിന്റർ സെറ്റപ്പ് ആവശ്യമില്ല',
        desc: 'നിങ്ങളുടെ കമ്പ്യൂട്ടറുമായി ബന്ധിപ്പിച്ചിട്ടുള്ള ഏത് പ്രിന്ററും (Canon, HP, Epson, Brother) നേരിട്ട് ഉപയോഗിക്കാം.',
      },
      bullet2: {
        title: 'സോഫ്റ്റ്‌വെയറോ ഡ്രൈവറോ ഇൻസ്റ്റാൾ ചെയ്യേണ്ടതില്ല',
        desc: '"Print" ക്ലിക്ക് ചെയ്യുമ്പോൾ സിസ്റ്റത്തിന്റെ സാധാരണ പ്രിന്റ് ഡയലോഗ് തനിയെ തുറക്കും.',
      },
      bullet3: {
        title: 'A4 ഫോർമാറ്റിൽ ഓട്ടോ-ഫിറ്റ്',
        desc: 'വരുന്ന എല്ലാ ഫയലുകളും മാർജിൻ വ്യത്യാസമില്ലാതെ സ്റ്റാൻഡേർഡ് A4 സൈസിൽ കൃത്യമായി പ്രിന്റ് ചെയ്യാം.',
      },
      supportedBrands: 'Canon • HP • Epson • Brother • Ricoh • Konica Minolta • Pantum • Samsung',
      osPrintNotice: 'Native OS Print (Ctrl + P) • ഡിഫോൾട്ട് സിസ്റ്റം പ്രിന്റർ ഉപയോഗിക്കുന്നു',
    },
    terminal: {
      stationTitle: 'ഷോപ്പ്കീപ്പർ ടെർമിനൽ (പ്രിന്റ് സ്റ്റേഷൻ)',
      waitingCustomer: 'ഉപഭോക്താവ് സ്കാൻ ചെയ്യാനായി കാത്തിരിക്കുന്നു...',
      customerConnected: 'WebRTC വഴി ഉപഭോക്താവിന്റെ ഫോൺ കണക്റ്റ് ആയി!',
      receivingStream: 'ഫയൽ ഡാറ്റ കമ്പ്യൂട്ടർ റാമിലേക്ക് സ്വീകരിക്കുന്നു...',
      readyToPrint: 'ഫയൽ പ്രിന്റ് ചെയ്യാൻ തയാറാണ്',
      sessionCode: 'കൗണ്ടർ സ്റ്റേഷൻ കോഡ്',
      scanToConnect: 'ഉപഭോക്താക്കൾ ഈ QR കോഡ് ക്യാമറ വഴി സ്കാൻ ചെയ്ത് ഫയലുകൾ അയക്കാം.',
      incomingTray: 'ഇൻകമിംഗ് ഫയൽ ട്രേ',
      noDocWaiting: 'ഇതുവരെ ഫയലുകൾ വന്നിട്ടില്ല',
      noDocDesc: 'ഉപഭോക്താവ് QR സ്കാൻ ചെയ്ത് അയക്കുമ്പോൾ ഫയൽ തത്സമയം ഇവിടെ ദൃശ്യമാകും.',
      bytesReceived: 'ലഭിച്ച ബൈറ്റുകൾ',
      speed: 'വേഗത',
      docInspector: 'ഡോക്യുമെന്റ് പ്രിവ്യൂ & ലേഔട്ട്',
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
      senderTitle: 'കസ്റ്റമർ മൊബൈൽ സെൻഡർ',
      connectedToCounter: 'ഷോപ്പ് കൗണ്ടറുമായി ബന്ധിപ്പിച്ചു',
      connectingToCounter: 'കൗണ്ടറിലേക്ക് കണക്റ്റ് ചെയ്യുന്നു...',
      offlineNotice: 'ഡാറ്റാ ചാനൽ ബന്ധിപ്പിക്കുന്നു...',
      tapToUpload: 'ഡോക്യുമെന്റോ ഫോട്ടോയോ തിരഞ്ഞെടുക്കുക (PDF, JPG, PNG, DOCX)',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX സപ്പോർട്ട് ചെയ്യും',
      preferencesTitle: 'പ്രിന്റിംഗ് മുൻഗണനകൾ',
      colorLabel: 'പ്രിന്റ് നിറം',
      copiesLabel: 'കോപ്പികളുടെ എണ്ണം',
      pagesLabel: 'പേജ് തിരഞ്ഞെടുക്കൽ',
      pagesPlaceholder: 'ഉദാ: All അല്ലെങ്കിൽ 1-3, 5',
      allPages: 'എല്ലാ പേജുകളും',
      sendingProgress: 'കൗണ്ടറിലേക്ക് സുരക്ഷിതമായി അയക്കുന്നു...',
      successTitle: 'ഫയൽ കമ്പ്യൂട്ടറിലേക്ക് വിജയകരമായി എത്തി!',
      successDesc: 'പ്രിന്റ് ചെയ്യാൻ തയാറാണ്. നിങ്ങളുടെ ഫയൽ കടക്കാരന്റെ കമ്പ്യൂട്ടറിൽ എത്തിക്കഴിഞ്ഞു.',
      instantShopArrival: 'വാട്സാപ്പ് നമ്പറോ ചാറ്റ് വിവരങ്ങളോ സൂക്ഷിക്കില്ല.',
    },
    poster: {
      modalTitle: 'പ്രിന്റ് സ്റ്റേഷൻ പോസ്റ്റർ ജനറേറ്റർ',
      shopNameLabel: 'സ്ഥാപനത്തിന്റെ പേര്',
      taglineLabel: 'സബ്‌ടൈറ്റിൽ',
      sizeLabel: 'പേപ്പർ സൈസ്',
      themeLabel: 'ഡിസൈൻ തീം',
      printButton: 'പോസ്റ്റർ പ്രിന്റ് ചെയ്യുക',
      closeButton: 'അടയ്ക്കുക',
      scanInstructions: 'വാട്സാപ്പ് ഇല്ലാതെ പ്രിന്റ് ചെയ്യാൻ ക്യാമറ കൊണ്ട് സ്കാൻ ചെയ്യുക',
      step1: '1. ഫോൺ ക്യാമറ വഴി QR കോഡ് സ്കാൻ ചെയ്യുക',
      step2: '2. ഫയൽ തിരഞ്ഞെടുത്ത് കോപ്പികൾ നിശ്ചയിക്കുക',
      step3: '3. "Send" ടാപ്പ് ചെയ്യുക — തത്സമയം പ്രിന്റ് റെഡി!',
      privacyBadge: '100% സ്വകാര്യ P2P കണക്ഷൻ',
      noWhatsAppBadge: 'വാട്സാപ്പോ മൊബൈൽ നമ്പറോ ആവശ്യമില്ല',
    },
    faqs: [
      {
        q: 'അക്ഷയ കേന്ദ്രങ്ങളിലും ഡി.ടി.പി സെന്ററുകളിലും ഇത് എങ്ങനെ ഉപകരിക്കും?',
        a: 'ദിവസവും വരുന്ന നൂറുകണക്കിന് ആളുകളുടെ മൊബൈൽ നമ്പർ സേവ് ചെയ്ത് വാട്സാപ്പിൽ ഫയൽ വാങ്ങി കമ്പ്യൂട്ടർ മെമ്മറി നിറയുന്ന ബുദ്ധിമുട്ട് ഒഴിവാക്കാം. കസ്റ്റമർക്ക് QR സ്കാൻ ചെയ്ത് നിമിഷങ്ങൾക്കുള്ളിൽ നേരിട്ട് ഫയൽ അയക്കാം.',
      },
      {
        q: 'പ്രിന്റർ സെറ്റപ്പ് ചെയ്യേണ്ടതുണ്ടോ?',
        a: 'ഇല്ല. കമ്പ്യൂട്ടറുമായി ഘടിപ്പിച്ചിട്ടുള്ള ഏത് പ്രിന്ററും സാധാരണ പ്രിന്റ് ഡയലോഗ് വഴി തന്നെ ഉപയോഗിക്കാം.',
      },
      {
        q: 'ഫയലുകൾ ഏതെങ്കിലും സെർവറിൽ സേവ് ചെയ്യപ്പെടുമോ?',
        a: 'ഒരിക്കലുമില്ല. WebRTC സാങ്കേതികവിദ്യ വഴി മൊബൈലിൽ നിന്ന് നേരിട്ട് കമ്പ്യൂട്ടറിന്റെ റാമിലേക്ക് മാത്രമാണ് ഫയൽ എത്തുന്നത്.',
      },
    ],
  },
  hi: {
    title: 'स्कैन-टू-प्रिंट P2P क्यूआर ड्रॉप स्टूडियो',
    subtitle: 'बिना व्हाट्सएप सीधे मोबाइल से प्रिंट करें',
    heroHeadline: 'Zero-WhatsApp Printing. Scan, Drop & Print in Seconds.',
    heroSubheadline:
      'फोटोकॉपी, डीटीपी दुकानों, साइबर कैफे और कॉलेजों के लिए आधुनिक समाधान। न व्हाट्सएप चैट, न नंबर शेयरिंग, 100% सुरक्षित P2P ट्रांसफर।',
    trustBadges: {
      clientSideP2P: '100% क्लाइंट-साइड P2P (जीरो क्लाउड स्टोरेज)',
      noNumberExchange: 'मोबाइल नंबर देने की जरूरत नहीं',
      worksAnyPrinter: 'किसी भी प्रिंटर पर चलेगा (ड्राइवर की जरूरत नहीं)',
      silentPrivate: '100% साइलेंट और प्राइवेट',
    },
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
      launchCounter: 'काउंटर स्टेशन शुरू करें',
      openTerminal: 'काउंटर स्टेशन शुरू करें',
      downloadPoster: 'काउंटरटॉप A4 स्टैंडी पोस्टर',
      testMobile: 'नए टैब में मोबाइल सेंडर टेस्ट करें',
      printDoc: 'डॉक्यूमेंट प्रिंट करें (Ctrl + P)',
      autoPrint: 'फाइल आते ही ऑटो-प्रिंट करें',
      purge: 'पूर्ण / मेमोरी साफ करें (Purge)',
      sendToPrinter: 'शॉप कंप्यूटर पर भेजें',
      sendAnother: 'दूसरी फाइल भेजें',
      selectFile: 'प्रिंट करने हेतु फाइल चुनें',
      changeFile: 'फाइल बदलें',
    },
    howItWorks: {
      title: 'यह कैसे काम करता है (स्टेप-बाय-स्टेप)',
      subtitle: 'बिना व्हाट्सएप नंबर शेयर किए 4 आसान चरणों में प्रिंट',
      steps: [
        {
          stepNumber: 1,
          title: 'कंप्यूटर पर यह पेज खोलें',
          description: 'अपने काउंटर कंप्यूटर पर यह पेज खोलें और स्क्रीन पर क्यूआर कोड दिखाएं।',
        },
        {
          stepNumber: 2,
          title: 'ग्राहक क्यूआर कोड स्कैन करता है',
          description: 'ग्राहक अपने फोन कैमरे या गूगल लेंस से बिना किसी ऐप के क्यूआर स्कैन करता है।',
        },
        {
          stepNumber: 3,
          title: 'डॉक्यूमेंट चुनें और Send दबाएं',
          description: 'ग्राहक मोबाइल में डॉक्यूमेंट (PDF/फोटो) चुनता है, कॉपियां सेट करता है और Send दबाता है।',
        },
        {
          stepNumber: 4,
          title: 'काउंटर पर तुरंत प्रिंट निकालें',
          description: 'डॉक्यूमेंट सीधे कंप्यूटर रैम में आ जाता है। तुरंत प्रिंट करने के लिए "Print" दबाएं।',
        },
      ],
    },
    zeroPrinterSetup: {
      title: 'दुकानदारों के लिए: जीरो प्रिंटर सेटअप गाइड',
      subtitle: 'आपके मौजूदा प्रिंटर के साथ बिना किसी झंझट काम करता है',
      badge: 'महत्वपूर्ण जानकारी',
      bullet1: {
        title: 'किसी प्रिंटर सेटअप की जरूरत नहीं',
        desc: 'यह टूल आपके कंप्यूटर से जुड़े किसी भी प्रिंटर (Canon, HP, Epson, Brother) का सीधे उपयोग करता है।',
      },
      bullet2: {
        title: 'कोई सॉफ्टवेयर या ड्राइवर नहीं चाहिए',
        desc: '"Print" पर क्लिक करते ही आपका सामान्य सिस्टम प्रिंट डायलॉग अपने आप खुल जाता है।',
      },
      bullet3: {
        title: 'A4 साइज में प्री-फॉर्मेटेड',
        desc: 'आने वाले सभी डॉक्यूमेंट बिना किसी मार्जिन खराबी के A4 साइज में सही बैठते हैं।',
      },
      supportedBrands: 'Canon • HP • Epson • Brother • Ricoh • Konica Minolta • Pantum • Samsung',
      osPrintNotice: 'Native OS Print (Ctrl + P) • सिस्टम डिफॉल्ट प्रिंटर के साथ 100% अनुकूल',
    },
    terminal: {
      stationTitle: 'दुकानदार टर्मिनल (द प्रिंट स्टेशन)',
      waitingCustomer: 'ग्राहक के स्कैन करने की प्रतीक्षा में...',
      customerConnected: 'WebRTC से ग्राहक का फोन कनेक्ट हो गया!',
      receivingStream: 'डेटा चंक्स सीधे रैम में लोड हो रहे हैं...',
      readyToPrint: 'डॉक्यूमेंट प्रिंट के लिए तैयार है',
      sessionCode: 'काउंटर स्टेशन कोड',
      scanToConnect: 'ग्राहक अपने कैमरे से यह क्यूआर स्कैन करके तुरंत फाइल भेज सकते हैं।',
      incomingTray: 'इनकमिंग फाइल ट्रे',
      noDocWaiting: 'अभी तक कोई फाइल नहीं आई',
      noDocDesc: 'जैसे ही ग्राहक क्यूआर स्कैन करके फाइल भेजेंगे, वह सीधे यहां रैम में लोड हो जाएगी।',
      bytesReceived: 'प्राप्त बाइट्स',
      speed: 'ट्रांसफर स्पीड',
      docInspector: 'डॉक्यूमेंट प्रिव्यू कैरोसेल',
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
      senderTitle: 'ग्राहक मोबाइल सेंडर',
      connectedToCounter: 'दुकान कंप्यूटर से जुड़ा हुआ है',
      connectingToCounter: 'शॉप काउंटर से जुड़ रहा है...',
      offlineNotice: 'डेटा चैनल कनेक्ट हो रहा है...',
      tapToUpload: 'डॉक्यूमेंट या फोटो चुनें (PDF, JPG, PNG, DOCX)',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX सपोर्टेड',
      preferencesTitle: 'प्रिंट प्राथमिकताएं',
      colorLabel: 'प्रिंट कलर',
      copiesLabel: 'प्रतियों की संख्या (Copies)',
      pagesLabel: 'पेज संख्या',
      pagesPlaceholder: 'उदा: All या 1-3, 5',
      allPages: 'सभी पेज',
      sendingProgress: 'काउंटर पर सुरक्षित भेजा जा रहा है...',
      successTitle: 'फाइल कंप्यूटर पर सफलतापूर्वक पहुंच गई!',
      successDesc: 'प्रिंट के लिए तैयार। दुकानदार के कंप्यूटर में आपकी फाइल रैम में लोड हो चुकी है।',
      instantShopArrival: 'व्हाट्सएप चैट या नंबर सेव करने की कोई जरूरत नहीं।',
    },
    poster: {
      modalTitle: 'प्रिंट स्टेशन पोस्टर जनरेटर',
      shopNameLabel: 'दुकान का नाम',
      taglineLabel: 'टैगलाइन',
      sizeLabel: 'कागज का आकार',
      themeLabel: 'डिज़ाइन थीम',
      printButton: 'पोस्टर प्रिंट करें',
      closeButton: 'बंद करें',
      scanInstructions: 'बिना व्हाट्सएप के तुरंत प्रिंट करने के लिए स्कैन करें',
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
        q: 'क्या कोई प्रिंटर ड्राइवर इंस्टॉल करना होगा?',
        a: 'नहीं। यह आपके कंप्यूटर से जुड़े किसी भी सामान्य प्रिंटर के डिफॉल्ट प्रिंट डायलॉग से चलता है।',
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
    heroHeadline: 'Zero-WhatsApp Printing. Scan, Drop & Print in Seconds.',
    heroSubheadline:
      'ஜெராக்ஸ் கடைகள், டி.டி.பி மையங்கள், கல்லூரிகளுக்கான பிரத்யேக சாதனம். வாட்ஸ்அப் நெரிசல் இல்லை, முழுமையான P2P பாதுகாப்பு.',
    trustBadges: {
      clientSideP2P: '100% கிளையன்ட்-சைட் P2P (கிளவுட் சேமிப்பு இல்லை)',
      noNumberExchange: 'மொபைல் எண் பரிமாற்றம் தேவையில்லை',
      worksAnyPrinter: 'எந்த பிரிண்டரிலும் இயங்கும் (டிரைவர்கள் தேவையில்லை)',
      silentPrivate: '100% அமைதியானது & பாதுகாப்பானது',
    },
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
      launchCounter: 'கவுண்டர் நிலையத்தைத் தொடங்கவும்',
      openTerminal: 'கவுண்டர் நிலையத்தைத் தொடங்கவும்',
      downloadPoster: 'A4 QR ஸ்டாண்டீ போஸ்டர்',
      testMobile: 'மொபைல் அனுப்புநரை சோதிக்கவும்',
      printDoc: 'டாக்குமெண்ட் பிரிண்ட் செய்க (Ctrl + P)',
      autoPrint: 'வந்தவுடன் தானாக பிரிண்ட் செய்க',
      purge: 'முடிந்தது / மெமரி அழிக்க (Purge)',
      sendToPrinter: 'கணினிக்கு அனுப்பு',
      sendAnother: 'மற்றொரு ஃபைல் அனுப்பு',
      selectFile: 'ஃபைலை தேர்ந்தெடுக்கவும்',
      changeFile: 'வேறு ஃபைலை மாற்றவும்',
    },
    howItWorks: {
      title: 'இது எவ்வாறு செயல்படுகிறது (படிப்படியாக)',
      subtitle: 'வாட்ஸ்அப் இல்லாமல் 4 எளிய படிகளில் நேரடி அச்சிடுதல்',
      steps: [
        {
          stepNumber: 1,
          title: 'கணினியில் இந்த பக்கத்தை திறக்கவும்',
          description: 'உங்கள் கடை கணினியில் இந்தப் பக்கத்தைத் திறந்து திரையில் QR குறியீட்டைக் காட்டவும்.',
        },
        {
          stepNumber: 2,
          title: 'வாடிக்கையாளர் QR-ஐ ஸ்கேன் செய்கிறார்',
          description: 'வாடிக்கையாளர் மொபைல் கேமரா அல்லது கூகுள் லென்ஸ் மூலம் QR குறியீட்டை ஸ்கேன் செய்கிறார்.',
        },
        {
          stepNumber: 3,
          title: 'கோப்பை தேர்ந்தெடுத்து Send தட்டவும்',
          description: 'வாடிக்கையாளர் மொபைலில் கோப்பை (PDF/படம்) தேர்வு செய்து, நகல்களை அமைத்து அனுப்புகிறார்.',
        },
        {
          stepNumber: 4,
          title: 'கவுண்டரில் உடனடியாக பிரிண்ட் செய்க',
          description: 'கோப்பு உடனடியாக கணினி ரேமில் தோன்றும். "Print" என்பதை கிளிக் செய்து உடனே பிரிண்ட் செய்யலாம்.',
        },
      ],
    },
    zeroPrinterSetup: {
      title: 'கடைக்காரர்களுக்கு: ஜீரோ பிரிண்டர் அமைப்பு வழிகாட்டி',
      subtitle: 'ஏற்கனவே இணைக்கப்பட்டுள்ள பிரிண்டரிலேயே இயங்கும்',
      badge: 'முக்கிய குறிப்பு',
      bullet1: {
        title: 'பிரிண்டர் அமைப்பு தேவையில்லை',
        desc: 'உங்கள் கணினியுடன் இணைக்கப்பட்டுள்ள எந்த பிரிண்டரிலும் (Canon, HP, Epson, Brother) நேரடியாக வேலை செய்யும்.',
      },
      bullet2: {
        title: 'மென்பொருள் அல்லது டிரைவர் நிறுவத் தேவையில்லை',
        desc: '"Print" கிளிக் செய்தவுடன் கணினி பிரிண்ட் சாளரம் தானாக திறக்கும்.',
      },
      bullet3: {
        title: 'A4 அளவுக்கான தானியங்கி வடிவம்',
        desc: 'வரும் ஆவணங்கள் மார்ஜின் பிழையின்றி துல்லியமாக A4 அளவில் பொருந்தும்.',
      },
      supportedBrands: 'Canon • HP • Epson • Brother • Ricoh • Konica Minolta • Pantum • Samsung',
      osPrintNotice: 'Native OS Print (Ctrl + P) • வழக்கமான கணினி அச்சுப்பொறி ஆதரவு',
    },
    terminal: {
      stationTitle: 'கடைக்காரர் டெர்மினல் (பிரிண்ட் நிலையம்)',
      waitingCustomer: 'வாடிக்கையாளர் ஸ்கேன் செய்ய காத்திருக்கிறது...',
      customerConnected: 'WebRTC வழியாக வாடிக்கையாளர் மொபைல் இணைக்கப்பட்டது!',
      receivingStream: 'கோப்பு நேரடியாக கணினி ரேமில் பெறப்படுகிறது...',
      readyToPrint: 'பிரிண்ட் செய்ய தயாராக உள்ளது',
      sessionCode: 'கவுண்டர் நிலைய குறியீடு',
      scanToConnect: 'வாடிக்கையாளர் இந்த QR குறியீட்டை ஸ்கேன் செய்து ஃபைல்களை அனுப்பலாம்.',
      incomingTray: 'வந்த கோப்புகள் ட்ரே',
      noDocWaiting: 'இன்னும் கோப்புகள் வரவில்லை',
      noDocDesc: 'வாடிக்கையாளர் அனுப்பும் போது ஃபைல் உடனடியாக இங்கு தோன்றும்.',
      bytesReceived: 'பெறப்பட்ட பைட்டுகள்',
      speed: 'வேகம்',
      docInspector: 'கோப்பு முன்னோட்டம் & தளவமைப்பு',
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
      senderTitle: 'வாடிக்கையாளர் மொபைல் அனுப்புநர்',
      connectedToCounter: 'கடை கணினியுடன் இணைக்கப்பட்டது',
      connectingToCounter: 'இணைக்கப்படுகிறது...',
      offlineNotice: 'இணைப்பு ஏற்படுத்தப்படுகிறது...',
      tapToUpload: 'டாக்குமெண்ட் அல்லது புகைப்படத்தை தேர்வு செய்யவும் (PDF, JPG, PNG, DOCX)',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX ஆதரிக்கப்படுகிறது',
      preferencesTitle: 'பிரிண்ட் விருப்பங்கள்',
      colorLabel: 'நிறம்',
      copiesLabel: 'நகல்களின் எண்ணிக்கை',
      pagesLabel: 'பக்க வரம்பு',
      pagesPlaceholder: 'எ.கா: All அல்லது 1-3, 5',
      allPages: 'அனைத்து பக்கங்களும்',
      sendingProgress: 'கவுண்டருக்கு அனுப்பப்படுகிறது...',
      successTitle: 'கோப்பு கணினிக்கு வெற்றிகரமாக சென்றடைந்தது!',
      successDesc: 'அச்சிட தயாராக உள்ளது. கடைக்காரரின் கணினியில் கோப்பு ரேமில் தயாராக உள்ளது.',
      instantShopArrival: 'எந்த வாட்ஸ்அப் அரட்டையோ எண்ணோ சேமிக்கப்படவில்லை.',
    },
    poster: {
      modalTitle: 'பிரிண்ட் ஸ்டேஷன் போஸ்டர் ஜெனரேட்டர்',
      shopNameLabel: 'கடையின் பெயர்',
      taglineLabel: 'துணைத்தலைப்பு',
      sizeLabel: 'தாள் அளவு',
      themeLabel: 'வடிவமைப்பு தீம்',
      printButton: 'போஸ்டர் பிரிண்ட் செய்க',
      closeButton: 'மூடுக',
      scanInstructions: 'வாட்ஸ்அப் இல்லாமல் பிரிண்ட் செய்ய உங்கள் கேமரா மூலம் ஸ்கேன் செய்யவும்',
      step1: '1. QR குறியீட்டை ஸ்கேன் செய்யவும்',
      step2: '2. கோப்பை தேர்ந்தெடுத்து நகல்களை தேர்வு செய்க',
      step3: '3. "Send" தட்டவும் — உடனடியாக பிரிண்ட் தயார்!',
      privacyBadge: '100% பாதுகாப்பான P2P',
      noWhatsAppBadge: 'வாட்ஸ்அப் தேவையில்லை',
    },
    faqs: [
      {
        q: 'ஜெராக்ஸ் மற்றும் பிரிண்டிங் கடைகளுக்கு இது எவ்வாறு உதவுகிறது?',
        a: 'ஒவ்வொரு வாடிக்கையாளரின் வாட்ஸ்அப் எண்ணையும் சேமிக்க வேண்டிய அவசியமில்லை. கஸ்டமர் நேரடியாக QR ஸ்கேன் செய்து ஃபைல் அனுப்பலாம்.',
      },
      {
        q: 'பிரிண்டர் அமைப்புகள் செய்ய வேண்டுமா?',
        a: 'இல்லை. கணினியுடன் இணைக்கப்பட்டுள்ள பிரிண்டரிலேயே நேரடியாக window.print() வழியாக பிரிண்ட் செய்யலாம்.',
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
    heroHeadline: 'Zero-WhatsApp Printing. Scan, Drop & Print in Seconds.',
    heroSubheadline:
      'జెరాక్స్ షాపులు, డి.టి.పి సెంటర్లు మరియు కాలేజీల కోసం ప్రత్యేక టూల్. వాట్సాప్ గందరగోళం లేదు, పూర్తి ప్రైవేట్ P2P బదిలీ.',
    trustBadges: {
      clientSideP2P: '100% క్లయింట్-సైడ్ P2P (క్లౌడ్ సేవింగ్ లేదు)',
      noNumberExchange: 'మొబైల్ నంబర్ పంచుకోవాల్సిన పనిలేదు',
      worksAnyPrinter: 'ఏ ప్రింటర్ అయినా పనిచేస్తుంది (డ్రైవర్లు అక్కర్లేదు)',
      silentPrivate: '100% సైలెంట్ & ప్రైవేట్',
    },
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
      launchCounter: 'కౌంటర్ స్టేషన్ ప్రారంభించండి',
      openTerminal: 'కౌంటర్ స్టేషన్ ప్రారంభించండి',
      downloadPoster: 'A4 QR స్టాండీ పోస్టర్',
      testMobile: 'మొబైల్ సెండర్ కొత్త ట్యాబ్‌లో పరీక్షించండి',
      printDoc: 'డాక్యుమెంట్ ప్రింట్ చేయండి (Ctrl + P)',
      autoPrint: 'ఫైల్ రాగానే ఆటో-ప్రింట్ చేయండి',
      purge: 'పూర్తయింది / మెమరీ క్లియర్ చేయండి (Purge)',
      sendToPrinter: 'షాప్ కంప్యూటర్‌కు పంపండి',
      sendAnother: 'మరొక ఫైల్ పంపండి',
      selectFile: 'ప్రింట్ చేయాల్సిన ఫైల్ ఎంచుకోండి',
      changeFile: 'ఫైల్ మార్చండి',
    },
    howItWorks: {
      title: 'ఇది ఎలా పనిచేస్తుంది (దశలవారీగా)',
      subtitle: 'వాట్సాప్ లేకుండా 4 సులభ దశల్లో డైరెక్ట్ ప్రింట్',
      steps: [
        {
          stepNumber: 1,
          title: 'కంప్యూటర్‌లో ఈ పేజీని తెరవండి',
          description: 'మీ కౌంటర్ కంప్యూటర్‌లో ఈ పేజీని తెరిచి స్క్రీన్‌పై QR కోడ్‌ను చూపించండి.',
        },
        {
          stepNumber: 2,
          title: 'కస్టమర్ QR కోడ్ స్కాన్ చేస్తారు',
          description: 'కస్టమర్ తమ ఫోన్ కెమెరా లేదా గూగుల్ లెన్స్ ద్వారా యాప్ లేకుండా QR స్కాన్ చేస్తారు.',
        },
        {
          stepNumber: 3,
          title: 'ఫైల్ ఎంచుకుని Send ట్యాప్ చేయండి',
          description: 'మొబైల్‌లో డాక్యుమెంట్ (PDF/ఫోటో) ఎంచుకుని, కలర్ మరియు కాపీలు సెట్ చేసి పంపుతారు.',
        },
        {
          stepNumber: 4,
          title: 'కౌంటర్ వద్ద వెంటనే ప్రింట్ చేయండి',
          description: 'ఫైల్ వెంటనే కంప్యూటర్ ర్యామ్‌లోకి వస్తుంది. "Print" క్లిక్ చేసి నేరుగా ప్రింట్ చేయవచ్చు.',
        },
      ],
    },
    zeroPrinterSetup: {
      title: 'షాప్ నిర్వాహకులకు: జీరో ప్రింటర్ సెటప్ గైడ్',
      subtitle: 'కంప్యూటర్‌కు కనెక్ట్ చేసిన ప్రింటర్‌తో ఎలాంటి అదనపు సెటప్ లేకుండా పనిచేస్తుంది',
      badge: 'ముఖ్యమైన సమాచారం',
      bullet1: {
        title: 'ప్రింటర్ సెటప్ అవసరం లేదు',
        desc: 'మీ కంప్యూటర్‌కు కనెక్ట్ చేయబడిన ఏదైనా ప్రింటర్ (Canon, HP, Epson, Brother) నేరుగా పనిచేస్తుంది.',
      },
      bullet2: {
        title: 'సాఫ్ట్‌వేర్ లేదా డ్రైవర్లు అవసరం లేదు',
        desc: '"Print" నొక్కగానే సాధారణ సిస్టమ్ ప్రింట్ డైలాగ్ తెరుచుకుంటుంది.',
      },
      bullet3: {
        title: 'A4 పరిమాణంలో ఆటో-ఫిట్',
        desc: 'వచ్చే డాక్యుమెంట్లు ఎటువంటి మార్జిన్ లోపం లేకుండా A4 పరిమాణంలో సరిగ్గా సరిపోతాయి.',
      },
      supportedBrands: 'Canon • HP • Epson • Brother • Ricoh • Konica Minolta • Pantum • Samsung',
      osPrintNotice: 'Native OS Print (Ctrl + P) • సాధారణ సిస్టమ్ స్పూలర్ మద్దతు',
    },
    terminal: {
      stationTitle: 'షాప్‌కీపర్ టెర్మినల్ (ప్రింట్ స్టేషన్)',
      waitingCustomer: 'కస్టమర్ స్కాన్ కోసం ఎదురుచూస్తోంది...',
      customerConnected: 'WebRTC ద్వారా కస్టమర్ ఫోన్ కనెక్ట్ అయింది!',
      receivingStream: 'ఫైల్ డేటా కంప్యూటర్ ర్యామ్‌లోకి వస్తోంది...',
      readyToPrint: 'డాక్యుమెంట్ ప్రింట్‌కు సిద్ధంగా ఉంది',
      sessionCode: 'కౌంటర్ స్టేషన్ కోడ్',
      scanToConnect: 'కస్టమర్ తమ కెమెరాతో ఈ QR స్కాన్ చేసి నేరుగా ఫైల్స్ పంపవచ్చు.',
      incomingTray: 'ఇన్‌కమింగ్ ఫైల్ ట్రే',
      noDocWaiting: 'ఇంకా ఎలాంటి ఫైల్ రాలేదు',
      noDocDesc: 'కస్టమర్ QR స్కాన్ చేసి పంపినప్పుడు ఫైల్ వెంటనే ఇక్కడ కనిపిస్తుంది.',
      bytesReceived: 'వచ్చిన బైట్లు',
      speed: 'స్పీడ్',
      docInspector: 'డాక్యుమెంట్ ప్రివ్యూ కరౌసెల్',
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
      senderTitle: 'కస్టమర్ మొబైల్ సెండర్',
      connectedToCounter: 'షాప్ కంప్యూటర్‌కు కనెక్ట్ అయింది',
      connectingToCounter: 'కనెక్ట్ అవుతోంది...',
      offlineNotice: 'డేటా ఛానల్ కనెక్ట్ అవుతోంది...',
      tapToUpload: 'డాక్యుమెంట్ లేదా ఫోటో ఎంచుకోండి (PDF, JPG, PNG, DOCX)',
      supportedFormats: 'PDF, JPG, PNG, WEBP, DOCX సపోర్ట్ చేస్తుంది',
      preferencesTitle: 'ప్రింట్ ప్రాధాన్యతలు',
      colorLabel: 'ప్రింట్ కలర్',
      copiesLabel: 'కాపీల సంఖ్య',
      pagesLabel: 'పేజీ పరిధి',
      pagesPlaceholder: 'ఉదా: All లేదా 1-3, 5',
      allPages: 'అన్ని పేజీలు',
      sendingProgress: 'కౌంటర్‌కు సురక్షితంగా పంపబడుతోంది...',
      successTitle: 'ఫైల్ కంప్యూటర్‌కు విజయవంతంగా చేరింది!',
      successDesc: 'ప్రింట్‌కు సిద్ధంగా ఉంది. మీ ఫైల్ కంప్యూటర్ ర్యామ్‌లోకి లోడ్ అయింది.',
      instantShopArrival: 'వాట్సాప్ నంబర్ లేదా చాట్ హిస్టరీ సేవ్ అవ్వదు.',
    },
    poster: {
      modalTitle: 'ప్రింట్ స్టేషన్ పోస్టర్ జనరేటర్',
      shopNameLabel: 'షాప్ పేరు',
      taglineLabel: 'ట్యాగ్‌లైన్',
      sizeLabel: 'పేపర్ సైజు',
      themeLabel: 'డిజైన్ థీమ్',
      printButton: 'పోస్టర్ ప్రింట్ చేయండి',
      closeButton: 'మూసివేయండి',
      scanInstructions: 'వాట్సాప్ లేకుండా నేరుగా ప్రింట్ చేయడానికి మీ కెమెరాతో స్కాన్ చేయండి',
      step1: '1. ఫోన్ కెమెరాతో QR కోడ్ స్కాన్ చేయండి',
      step2: '2. ఫైల్ ఎంచుకుని కాపీలు సెట్ చేయండి',
      step3: '3. "Send" నొక్కండి — కౌంటర్ వద్ద వెంటనే ప్రింట్ రెడీ!',
      privacyBadge: '100% ప్రైవేట్ P2P',
      noWhatsAppBadge: 'వాట్సాప్ నంబర్ అవసరం లేదు',
    },
    faqs: [
      {
        q: 'జెరాక్స్ షాపులకు ఇది ఎలా సహాయపడుతుంది?',
        a: 'కస్టమర్ వాట్సాప్ నంబర్లు సేవ్ చేయాల్సిన శ్రమ తప్పుతుంది. కస్టమర్ కేవలం QR స్కాన్ చేసి నేరుగా కంప్యూటర్‌కు ఫైల్ పంపవచ్చు.',
      },
      {
        q: 'ప్రింటర్ సెటప్ చేయాలా?',
        a: 'అవసరం లేదు. కంప్యూటర్‌కు కనెక్ట్ అయి ఉన్న సాధారణ ప్రింటర్ డైలాగ్ నుంచే నేరుగా ప్రింట్ చేయవచ్చు.',
      },
      {
        q: 'ఫైల్స్ క్లౌడ్ సర్వర్‌లో సేవ్ అవుతాయా?',
        a: 'లేదు. ఫైల్ నేరుగా మొబైల్ నుండి కంప్యూటర్ రామ్‌కు మాత్రమే వెళ్తుంది. ఏ సర్వర్‌లోనూ సేవ్ అవ్వదు.',
      },
    ],
  },
}
