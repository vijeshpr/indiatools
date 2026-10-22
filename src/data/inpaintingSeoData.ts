/**
 * Comprehensive Multilingual SEO Dataset for Fast Inpainting Watermark Remover & Object Eraser
 * 100% Client-Side Inpainting Suite for Indian Creators, Students, and Photographers.
 */

export interface InpaintingGuideStep {
  step: number
  title: string
  description: string
}

export interface InpaintingUseCase {
  title: string
  description: string
}

export interface InpaintingFaqItem {
  question: string
  answer: string
}

export interface InpaintingLanguageSeoInfo {
  lang: string
  localeCode: string // BCP-47 for hreflang
  langName: string
  nativeName: string
  slugPath: string
  canonicalUrl: string
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  guideTitle: string
  guideSteps: InpaintingGuideStep[]
  useCasesTitle: string
  useCases: InpaintingUseCase[]
  techSpecsTitle: string
  supportedFormats: string
  limitations: string
  privacyTitle: string
  privacyNote: string
  faqs: InpaintingFaqItem[]
}

const BASE_URL = 'https://indiatools-rho.vercel.app'

export const INPAINTING_SEO_LANGUAGES: Record<string, InpaintingLanguageSeoInfo> = {
  // ================= 1. ENGLISH =================
  en: {
    lang: 'en',
    localeCode: 'en-IN',
    langName: 'English',
    nativeName: 'English',
    slugPath: '/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/tools/fast-inpainting-watermark-remover`,
    title: 'Fast Inpainting Watermark Remover & Object Eraser Online | IndiaTools',
    metaDescription: 'Free online inpainting watermark remover with zero uploads. Erase watermarks, timestamps, logos, and unwanted objects from photos with clean background reconstruction.',
    h1: 'Fast Inpainting Watermark Remover & Object Eraser',
    subtitle: 'Erase watermarks, date stamps, phone brand logos, and unwanted objects from photos in seconds using Fast Marching inpainting. 100% private in your browser memory.',
    guideTitle: 'How to Erase Watermarks & Unwanted Objects Step-by-Step',
    guideSteps: [
      {
        step: 1,
        title: 'Upload Your Photo',
        description: 'Drag and drop any JPG, PNG, or WebP photo into the workspace, or click "Browse Photo". Your image is loaded directly into browser RAM and is never uploaded to any cloud server.',
      },
      {
        step: 2,
        title: 'Adjust the Brush Mask Size',
        description: 'Use the Brush Radius slider (8px to 100px) to match the thickness of the watermark text, date stamp, or object you want to erase.',
      },
      {
        step: 3,
        title: 'Paint Over the Target Area',
        description: 'Paint over the watermark or object with the translucent ruby-red mask. If you accidentally paint outside, switch to the Eraser tool or click Undo.',
      },
      {
        step: 4,
        title: 'Click "Erase & Inpaint"',
        description: 'The Alexandru Telea Fast Marching engine propagates surrounding texture gradients inward, seamlessly filling the masked region in approximately 150ms.',
      },
      {
        step: 5,
        title: 'Compare & Download Clean Photo',
        description: 'Click "Compare Before / After" to verify the seamless reconstruction, then download your full-resolution photo as a high-quality JPG or lossless PNG.',
      },
    ],
    useCasesTitle: 'Practical Real-World Use Cases for Indian Users',
    useCases: [
      {
        title: 'Phone Brand & Camera Watermarks',
        description: 'Easily erase annoying "Shot on Redmi", "Shot on OnePlus", "Shot on iPhone", or Vivo/Realme camera branding stamps from family memories and wallpapers.',
      },
      {
        title: 'Date & Time Stamps on Govt / ID Documents',
        description: 'Clean bright yellow or red digital camera date and time stamps from event photos, certificates, or uploaded application images.',
      },
      {
        title: 'Photobombers & Tourist Clutter',
        description: 'Remove accidental pedestrians, tourists, or vehicles in the background of vacation photos taken at monuments, beaches, or temples.',
      },
      {
        title: 'Power Lines, Dust Spots & Sensor Scratches',
        description: 'Erase overhead electrical wires, lens dust flecks, or surface scratches from sky, portrait, and architectural shots without smudging surrounding details.',
      },
    ],
    techSpecsTitle: 'Supported Formats, Capabilities & Limitations',
    supportedFormats: 'Supports JPEG/JPG, PNG, and WebP raster image formats up to full smartphone camera resolutions (12MP, 48MP, 108MP) within available device RAM.',
    limitations: 'Inpainting estimates color gradients from adjacent clean pixels. It is optimized for watermarks, stamps, wires, and medium objects. It cannot reconstruct completely occluded faces or recreate perspective text obscured by large solid blocks.',
    privacyTitle: '100% Client-Side Privacy Guarantee',
    privacyNote: 'Zero bytes uploaded. Every computer vision calculation, pixel matrix propagation, and canvas export executes exclusively inside your device web browser memory. Your personal photographs never touch external servers or third-party AI APIs.',
    faqs: [
      {
        question: 'How does the inpainting algorithm remove watermarks without blurring?',
        answer: 'The tool uses the Alexandru Telea Fast Marching inpainting method. It calculates the gradient and distance map from the surrounding clean pixels and seamlessly marches inward along isophote lines, reconstructing the natural background texture rather than applying a simple blur filter.',
      },
      {
        question: 'Are my private photographs uploaded to any cloud server?',
        answer: 'Never. All computer vision calculations and canvas rendering execute 100% locally in your device browser memory. Zero bytes leave your machine, making it completely safe for personal photos, ID cards, and official documents.',
      },
      {
        question: 'Can I erase camera "Shot on..." phone watermarks and date stamps?',
        answer: 'Yes. Simply paint over the phone brand logo, date stamp, or text watermark with the red brush and click "Erase & Inpaint". The algorithm reconstructs the underlying surface in under 200 milliseconds.',
      },
      {
        question: 'Is there a resolution limit or watermark added by IndiaTools?',
        answer: 'No. There are no resolution caps, no export fees, no paywalls, and IndiaTools never adds any branding or watermark of its own to your exported photos.',
      },
      {
        question: 'What should I do if I accidentally brush over parts I want to keep?',
        answer: 'Use the "Eraser" tool to unmask any unwanted brush strokes, or click "Undo" to revert previous brush actions.',
      },
      {
        question: 'Does this tool work on mobile phone web browsers?',
        answer: 'Yes. The responsive touch interface fully supports finger-brushing on Android and iOS browsers including Google Chrome, Safari, and Firefox.',
      },
    ],
  },

  // ================= 2. BENGALI =================
  bn: {
    lang: 'bn',
    localeCode: 'bn-IN',
    langName: 'Bengali',
    nativeName: 'বাংলা',
    slugPath: '/bn/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/bn/tools/fast-inpainting-watermark-remover`,
    title: 'ফাস্ট ইনপেইন্টিং ওয়াটারমার্ক রিমুভার এবং অবজেক্ট ইরেজার অনলাইন | IndiaTools',
    metaDescription: 'ছবি থেকে ওয়াটারমার্ক, তারিখের স্ট্যাম্প ও অনাকাঙ্ক্ষিত অবজেক্ট ঝাপসা না করে সেকেন্ডেই মুছে ফেলুন। কোনো ক্লাউড আপলোড ছাড়া সম্পূর্ণ বিনামূল্যে ও ১০০% ব্যক্তিগত।',
    h1: 'ফাস্ট ইনপেইন্টিং ওয়াটারমার্ক রিমুভার এবং অবজেক্ট ইরেজার',
    subtitle: 'ছবি থেকে ওয়াটারমার্ক, ক্যামেরার লোগো, তারিখ ও অপ্রয়োজনীয় অবজেক্ট সেকেন্ডেই ঝাপসা না করে মুছে ফেলুন। সম্পূর্ণ ব্রাউজার মেমরিতে ১০০% সুরক্ষিত।',
    guideTitle: 'কীভাবে ছবি থেকে ওয়াটারমার্ক ও অবজেক্ট মুছবেন (ধাপে ধাপে নির্দেশিকা)',
    guideSteps: [
      {
        step: 1,
        title: 'ছবি আপলোড করুন',
        description: 'আপনার JPG, PNG বা WebP ছবি এখানে ড্র্যাগ ও ড্রপ করুন অথবা "ছবি নির্বাচন করুন" বাটনে ক্লিক করুন। আপনার ছবি কখনোই কোনো সার্ভারে আপলোড হয় না।',
      },
      {
        step: 2,
        title: 'ব্রাশের আকার ঠিক করুন',
        description: 'যে লেখা বা ওয়াটারমার্ক মুছতে চান, তার মাপ অনুযায়ী ব্রাশের আকার (৮px থেকে ১০০px) নির্বাচন করুন।',
      },
      {
        step: 3,
        title: 'ওয়াটারমার্কের উপর লাল ব্রাশ বুলিয়ে দিন',
        description: 'অপ্রয়োজনীয় অংশটি লাল রঙের ব্রাশ দিয়ে চিহ্নিত করুন। ভুল হলে ইরেজার বা Undo বাটন ব্যবহার করে ঠিক করুন।',
      },
      {
        step: 4,
        title: '"মুছুন এবং ঠিক করুন" বাটনে ক্লিক করুন',
        description: 'অ্যালগরিদম চারপাশের ব্যাকগ্রাউন্ডের সাথে সামঞ্জস্য রেখে মাত্র কয়েক মিলিসেকেন্ডে জায়গাটি প্রাকৃতিকভাবে মেরামত করে দেবে।',
      },
      {
        step: 5,
        title: 'তুলনা করুন ও ডাউনলোড করুন',
        description: '"আগে ও পরের তুলনা" বাটনে ক্লিক করে ফলাফল দেখে নিন এবং হাই-কোয়ালিটি JPG বা PNG ফরম্যাটে সেভ করুন।',
      },
    ],
    useCasesTitle: 'বাঙালি ব্যবহারকারীদের জন্য বাস্তব ব্যবহারের ক্ষেত্র',
    useCases: [
      {
        title: 'ফোনের "Shot on..." ক্যামেরা ওয়াটারমার্ক মোছা',
        description: 'ফোনের তোলা ছবিতে আসা Redmi, OnePlus, iPhone বা Realme-এর ব্র্যান্ড লোগো সহজেই মুছে সুন্দর ছবি তৈরি করুন।',
      },
      {
        title: 'তারিখ ও সময়ের ডিজিটাল স্ট্যাম্প সরানো',
        description: 'পুরোনো ছবি বা সার্টিফিকেটের হলুদ ও লাল তারিখের লেখা ছবি নষ্ট না করে পরিচ্ছন্ন করুন।',
      },
      {
        title: 'ভ্রমণের ছবিতে অনাকাঙ্ক্ষিত মানুষ সরানো',
        description: 'দীঘা, দার্জিলিং বা কোনো পর্যটন কেন্দ্রে তোলা ছবির ব্যাকগ্রাউন্ডে অনাকাঙ্ক্ষিত পথচারী বা গাড়ি মুছে ফেলুন।',
      },
      {
        title: 'বৈদ্যুতিক তার ও লেন্সের দাগ দূর করা',
        description: 'আকাশ বা প্রাকৃতিক দৃশ্যের ছবির উপর থাকা বিদ্যুতের তার এবং ক্যামেরার লেন্সের ধুলোর দাগ নিখুঁতভাবে পরিষ্কার করুন।',
      },
    ],
    techSpecsTitle: 'সমর্থিত ফরম্যাট ও সীমাবদ্ধতা',
    supportedFormats: 'JPEG/JPG, PNG এবং WebP ফরম্যাটের ছবি কোনো সাইজ সীমাবদ্ধতা ছাড়াই সমর্থন করে।',
    limitations: 'ইনপেইন্টিং চারপাশের পিক্সেল বিশ্লেষণ করে ব্যাকগ্রাউন্ড তৈরি করে। এটি ওয়াটারমার্ক, তার ও ছোট অবজেক্টের জন্য নিখুঁত। কিন্তু সম্পূর্ণ মুখমণ্ডল পুনরায় তৈরি করতে পারে না।',
    privacyTitle: '১০০% গোপনীয়তা ও সুরক্ষার নিশ্চয়তা',
    privacyNote: 'শূন্য বাইট আপলোড। সমস্ত কাজ আপনার ফোনের বা কম্পিউটারের ব্রাউজারে সম্পন্ন হয়। আপনার ব্যক্তিগত ছবি কখনোই অন্য কোনো সার্ভারে পৌঁছায় না।',
    faqs: [
      {
        question: 'ছবি ব্লার না করে কীভাবে ওয়াটারমার্ক মোছা হয়?',
        answer: 'এটি Alexandru Telea ফাস্ট মার্চিং অ্যালগরিদম ব্যবহার করে আশেপাশের ব্যাকগ্রাউন্ড পিক্সেল থেকে প্রাকৃতিকভাবে জায়গাটি পূরণ করে, ফলে কোনো সাধারণ ব্লার বা ঝাপসা ভাব থাকে না।',
      },
      {
        question: 'আমার ব্যক্তিগত ছবি কি কোনো সার্ভারে আপলোড হয়?',
        answer: 'কখনোই না। সমস্ত প্রসেসিং সম্পূর্ণভাবে আপনার ব্রাউজারের মেমরিতে সম্পন্ন হয়। কোনো ডেটা ইন্টারনেটে যায় না।',
      },
      {
        question: 'ফোনের "Shot on..." ওয়াটারমার্ক ও তারিখ মোছা যাবে?',
        answer: 'হ্যাঁ, লাল ব্রাশ দিয়ে দাগ দিয়ে "মুছুন এবং ঠিক করুন" বাটনে ক্লিক করলেই ২০০ মিলিসেকেন্ডের মধ্যে মুছে যাবে।',
      },
      {
        question: 'টুলটি কি নিজস্ব কোনো ওয়াটারমার্ক যোগ করে?',
        answer: 'না, IndiaTools কোনো নিজস্ব লোগো বা ওয়াটারমার্ক যোগ করে না। আপনার ছবি সম্পূর্ণ নিখুঁত থাকবে।',
      },
      {
        question: 'ভুল জায়গায় ব্রাশ পড়লে কী করব?',
        answer: 'ইরেজার টুল বা Undo বাটন ব্যবহার করে যে কোনো অতিরিক্ত দাগ সহজে মুছে ফেলতে পারেন।',
      },
      {
        question: 'মোবাইল ব্রাউজারে কি এটি কাজ করে?',
        answer: 'হ্যাঁ, Android এবং iPhone-এর Google Chrome, Safari ও Firefox ব্রাউজারে আঙুল দিয়ে ব্রাশ করে সম্পূর্ণ টুলটি ব্যবহার করা যায়।',
      },
    ],
  },

  // ================= 3. MALAYALAM =================
  ml: {
    lang: 'ml',
    localeCode: 'ml-IN',
    langName: 'Malayalam',
    nativeName: 'മലയാളം',
    slugPath: '/ml/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/ml/tools/fast-inpainting-watermark-remover`,
    title: 'ഫാസ്റ്റ് ഇൻപെയ്ന്റിംഗ് വാട്ടർമാർക്ക് റിമൂവർ & ഒബ്ജക്റ്റ് ഇറേസർ | IndiaTools',
    metaDescription: 'ഫോട്ടോകളിൽ നിന്നുള്ള വാട്ടർമാർക്കുകൾ, തീയതി സ്റ്റാമ്പുകൾ, ഫോൺ ലോഗോകൾ എന്നിവ സെക്കന്റുകൾക്കുള്ളിൽ പൂർണ്ണ സ്വകാര്യതയോടെ മായ്ച്ചു കളയൂ. 100% സൗജന്യം.',
    h1: 'ഫാസ്റ്റ് ഇൻപെയ്ന്റിംഗ് വാട്ടർമാർക്ക് റിമൂവർ & ഒബ്ജക്റ്റ് ഇറേസർ',
    subtitle: 'ഫോട്ടോകളിലെ വാട്ടർമാർക്കുകളും അനാവശ്യ വസ്തുക്കളും ബ്ലർ ആകാതെ സ്വാഭാവികമായി മായ്ക്കാൻ അലക്സാണ്ട്രു ടെലിയ ഇൻപെയ്ന്റിംഗ് ടൂൾ. പൂർണ്ണമായും ബ്രൗസറിൽ സുരക്ഷിതം.',
    guideTitle: 'വാട്ടർമാർക്ക് എങ്ങനെ മായ്ക്കാം (ഘട്ടം ഘട്ടമായുള്ള വിവരണം)',
    guideSteps: [
      {
        step: 1,
        title: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
        description: 'നിങ്ങളുടെ JPG, PNG അല്ലെങ്കിൽ WebP ഫോട്ടോ ഡ്രാഗ് ചെയ്യുകയോ ബ്രൗസ് ചെയ്യുകയോ ചെയ്യുക. ഫയൽ ബ്രൗസറിൽ മാത്രമേ ലഭ്യമാകൂ, സെർവറുകളിലേക്ക് അയക്കില്ല.',
      },
      {
        step: 2,
        title: 'ബ്രഷ് വലുപ്പം ക്രമീകരിക്കുക',
        description: 'മായ്ക്കേണ്ട വാട്ടർമാർക്കിന്റെ വലുപ്പത്തിന് അനുസരിച്ച് സ്ലൈഡർ ഉപയോഗിച്ച് ബ്രഷ് റേഡിയസ് ക്രമീകരിക്കുക.',
      },
      {
        step: 3,
        title: 'വാട്ടർമാർക്കിന് മുകളിൽ ബ്രഷ് ചെയ്യുക',
        description: 'ചുവപ്പ് നിറത്തിലുള്ള മാസ്ക് ഉപയോഗിച്ച് മായ്‌ക്കേണ്ട ഭാഗം അടയാളപ്പെടുത്തുക. തെറ്റിയാൽ ഇറേസറോ Undo ബട്ടണോ ഉപയോഗിക്കുക.',
      },
      {
        step: 4,
        title: '"ഇറേസ് & ഇൻപെയ്ന്റ്" ക്ലിക്ക് ചെയ്യുക',
        description: 'അൽഗോരിതം ചുറ്റുമുള്ള പ്രകൃതിദത്ത പശ്ചാത്തലം പുനർനിർമ്മിച്ച് നിമിഷങ്ങൾക്കകം വാട്ടർമാർക്ക് മായ്ക്കുന്നു.',
      },
      {
        step: 5,
        title: 'ഡൗൺലോഡ് ചെയ്യുക',
        description: 'ബിഫോർ / ആഫ്റ്റർ പരിശോധിച്ച് ഉയർന്ന ക്വാളിറ്റിയിൽ ഫോട്ടോ ഫോണിലേക്കോ കമ്പ്യൂട്ടറിലേക്കോ സേവ് ചെയ്യുക.',
      },
    ],
    useCasesTitle: 'പ്രധാന ഉപയോഗങ്ങൾ',
    useCases: [
      {
        title: 'മൊബൈൽ ക്യാമറ വാട്ടർമാർക്കുകൾ',
        description: 'ഫോണിൽ എടുത്ത ചിത്രങ്ങളിലെ "Shot on OnePlus", "Redmi" തുടങ്ങിയ ബ്രാൻഡ് അടയാളങ്ങൾ വൃത്തിയായി നീക്കം ചെയ്യാം.',
      },
      {
        title: 'തീയതിയും സമയവും രേഖപ്പെടുത്തിയ അടയാളങ്ങൾ',
        description: 'ഡിജിറ്റൽ ക്യാമറ ഫോട്ടോകളിലെ മഞ്ഞയോ ചുവപ്പോ തീയതി സ്റ്റാമ്പുകൾ ഫോട്ടോ കേടുപാടില്ലാതെ മായ്ക്കാം.',
      },
      {
        title: 'ബാക്ക്ഗ്രൗണ്ടിലെ അനാവശ്യ ആളുകൾ',
        description: 'യാത്രകളിൽ എടുത്ത ചിത്രങ്ങളുടെ പശ്ചാത്തലത്തിൽ അറിയാതെ വന്നുപെട്ട ആളുകളെയും വാഹനങ്ങളെയും മാറ്റാം.',
      },
      {
        title: 'വൈദ്യുത കമ്പികളും ലെൻസ് പൊടികളും',
        description: 'ലാൻഡ്‌സ്‌കേപ്പ് ഫോട്ടോകളിലെ കേബിളുകളും ലെൻസിലെ പൊടിയടയാളങ്ങളും നീക്കം ചെയ്യാം.',
      },
    ],
    techSpecsTitle: 'പിന്തുണയ്ക്കുന്ന ഫോർമാറ്റുകളും പരിമിതികളും',
    supportedFormats: 'JPG, PNG, WebP ഫോട്ടോ ഫോർമാറ്റുകൾ പിന്തുണയ്ക്കുന്നു.',
    limitations: 'ചുറ്റുമുള്ള പിക്സലുകൾ ഉപയോഗിച്ചാണ് പശ്ചാത്തലം പുനർനിർമ്മിക്കുന്നത്. അതിനാൽ വലിയ ഭാഗങ്ങൾ മറഞ്ഞിരിക്കുന്ന ഫോട്ടോകളിൽ സൂക്ഷ്മമായ വിവരങ്ങൾ നിർമ്മിക്കാൻ കഴിയില്ല.',
    privacyTitle: '100% ഡാറ്റാ സ്വകാര്യത ഉറപ്പ്',
    privacyNote: 'ഒരു ബൈറ്റ് പോലും സെർവറുകളിലേക്ക് പോകുന്നില്ല. എല്ലാ പ്രവർത്തനങ്ങളും നിങ്ങളുടെ ബ്രൗസറിനുള്ളിൽ തന്നെ നടക്കുന്നു.',
    faqs: [
      {
        question: 'ഫോട്ടോ ബ്ലർ ആകാതെ വാട്ടർമാർക്ക് മാറുന്നത് എങ്ങനെ?',
        answer: 'അലക്സാണ്ട്രു ടെലിയ ഫാസ്റ്റ് മാർച്ചിംഗ് സാങ്കേതികവിദ്യ വഴി ചുറ്റുമുള്ള പശ്ചാത്തല നിറങ്ങളും ടെക്സ്ചറുകളും കൃത്യമായി കണക്കുകൂട്ടി സ്വാഭാവികമായി നികത്തുന്നു.',
      },
      {
        question: 'എന്റെ വ്യക്തിഗത ഫോട്ടോകൾ സുരക്ഷിതമാണോ?',
        answer: 'പൂർണ്ണമായും സുരക്ഷിതമാണ്. ഫോട്ടോകൾ ഒരു സെർവറിലേക്കും അപ്‌ലോഡ് ചെയ്യപ്പെടുന്നില്ല.',
      },
      {
        question: 'ഫോൺ ബ്രൗസറിൽ ഇത് പ്രവർത്തിക്കുമോ?',
        answer: 'അതെ, ആൻഡ്രോയിഡ്, ഐഫോൺ ബ്രൗസറുകളിൽ വിരൽ കൊണ്ട് ബ്രഷ് ചെയ്ത് എളുപ്പത്തിൽ ഉപയോഗിക്കാം.',
      },
      {
        question: 'IndiaTools ഫോട്ടോയിൽ വാട്ടർമാർക്ക് ചേർക്കുമോ?',
        answer: 'ഇല്ല, യാതൊരുവിധ വാട്ടർമാർക്കുകളും ചേർക്കില്ല. ഫോട്ടോ പൂർണ്ണമായും ഒറിജിനൽ പോലെ ലഭിക്കും.',
      },
      {
        question: 'തെറ്റായ ഭാഗത്ത് ബ്രഷ് ചെയ്താൽ എന്തുചെയ്യും?',
        answer: 'ഇറേസർ ടൂളോ Undo ബട്ടണോ ഉപയോഗിച്ച് എളുപ്പത്തിൽ തിരുത്താം.',
      },
      {
        question: 'സൗജന്യമാണോ അതോ പണം നൽകണമോ?',
        answer: 'പൂർണ്ണമായും 100% സൗജന്യമാണ്. പരിധികളോ ചാർജുകളോ ഇല്ല.',
      },
    ],
  },

  // ================= 4. HINDI =================
  hi: {
    lang: 'hi',
    localeCode: 'hi-IN',
    langName: 'Hindi',
    nativeName: 'हिन्दी',
    slugPath: '/hi/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/hi/tools/fast-inpainting-watermark-remover`,
    title: 'फास्ट इनपेंटिंग वॉटरमार्क रिमूवर और ऑब्जेक्ट इरेज़र ऑनलाइन | IndiaTools',
    metaDescription: 'फोटो से वॉटरमार्क, तारीख का स्टैम्प और अवांछित ऑब्जेक्ट बिना धुंधला किए हटाएं। 100% सुरक्षित और मुफ्त ब्राउज़र टूल, बिना किसी सर्वर अपलोड के।',
    h1: 'फास्ट इनपेंटिंग वॉटरमार्क रिमूवर और ऑब्जेक्ट इरेज़र',
    subtitle: 'फोटो से वॉटरमार्क, कैमरा लोगो, तारीख और अनचाही चीजों को बिना ब्लर किए आसानी से मिटाएं। 100% प्राइवेट इन-ब्राउज़र तकनीक।',
    guideTitle: 'फोटो से वॉटरमार्क कैसे हटाएं (स्टेप-बाय-स्टेप गाइड)',
    guideSteps: [
      {
        step: 1,
        title: 'फोटो अपलोड करें',
        description: 'अपनी JPG, PNG या WebP फोटो को यहां खींचें या "ब्राउज़ करें" पर क्लिक करें। फोटो केवल आपके डिवाइस में प्रोसेस होती है।',
      },
      {
        step: 2,
        title: 'ब्रश का साइज चुनें',
        description: 'वॉटरमार्क के आकार के अनुसार ब्रश रेडियस स्लाइडर को एडजस्ट करें।',
      },
      {
        step: 3,
        title: 'वॉटरमार्क पर लाल ब्रश चलाएं',
        description: 'हटाए जाने वाले हिस्से को लाल रंग से मार्क करें। गलती होने पर इरेज़र या Undo बटन दबाएं।',
      },
      {
        step: 4,
        title: '"हटाएं और इनपेंट करें" पर क्लिक करें',
        description: 'फास्ट मार्चिंग एल्गोरिदम आसपास के बैकग्राउंड को स्वाभाविक रूप से जोड़कर वॉटरमार्क मिटा देगा।',
      },
      {
        step: 5,
        title: 'साफ फोटो डाउनलोड करें',
        description: 'पहले और बाद की तुलना करें और हाई-रेज़ोल्यूशन JPG या PNG में सेव करें।',
      },
    ],
    useCasesTitle: 'प्रमुख उपयोग',
    useCases: [
      {
        title: 'फोन कैमरा "Shot on..." वॉटरमार्क हटाना',
        description: 'OnePlus, Redmi, Realme या iPhone के कैमरा ब्रांडिंग वॉटरमार्क को अपनी पसंदीदा तस्वीरों से आसानी से हटाएं।',
      },
      {
        title: 'तारीख और टाइम स्टैम्प हटाना',
        description: 'पुरानी तस्वीरों या डिजिटल कैमरों से आने वाली पीली या लाल तारीख को बैकग्राउंड खराब किए बिना हटाएं।',
      },
      {
        title: 'बैकग्राउंड से अनचाहे लोग हटाना',
        description: 'पर्यटन स्थलों पर ली गई तस्वीरों के पीछे से अनजान लोगों और गाड़ियों को गायब करें।',
      },
      {
        title: 'बिजली के तार और धूल के धब्बे',
        description: 'लैंडस्केप और आसमान की तस्वीरों से बिजली के तारों और लेंस के धब्बों को साफ करें।',
      },
    ],
    techSpecsTitle: 'सपोर्टेड फॉर्मेट और सीमाएं',
    supportedFormats: 'JPG, PNG, और WebP इमेज फॉर्मेट पूरी तरह समर्थित हैं।',
    limitations: 'यह टूल आसपास के पिक्सल से बैकग्राउंड बनाता है। छोटे व मध्यम वॉटरमार्क के लिए सर्वोत्तम है।',
    privacyTitle: '100% गोपनीयता गारंटी',
    privacyNote: 'जीरो बाइट अपलोड। सभी प्रक्रियाएं सीधे आपके ब्राउज़र में निष्पादित होती हैं। आपकी तस्वीरें किसी सर्वर पर नहीं जातीं।',
    faqs: [
      {
        question: 'फोटो ब्लर हुए बिना वॉटरमार्क कैसे हटता है?',
        answer: 'यह एलेक्जेंड्रू टेलीया फास्ट मार्चिंग इनपेंटिंग एल्गोरिदम का उपयोग करता है जो आसपास के बैकग्राउंड का विश्लेषण कर स्वाभाविक रूप से खाली जगह भरता है।',
      },
      {
        question: 'क्या मेरी तस्वीरें सुरक्षित हैं?',
        answer: 'हाँ, शत-प्रतिशत सुरक्षित हैं। कोई भी फोटो किसी सर्वर पर अपलोड नहीं की जाती।',
      },
      {
        question: 'क्या मोबाइल फोन में काम करता है?',
        answer: 'हाँ, एंड्रॉइड और आईफोन के क्रोम, सफारी व फायरफॉक्स ब्राउज़र पर उंगली से ब्रश करके उपयोग कर सकते हैं।',
      },
      {
        question: 'क्या कोई वॉटरमार्क इंडियाटूल्स जोड़ता है?',
        answer: 'नहीं, इंडियाटूल्स आपकी फोटो पर कोई लोगो या वॉटरमार्क नहीं लगाता।',
      },
      {
        question: 'गलत जगह ब्रश लगने पर क्या करें?',
        answer: 'इरेज़र टूल का उपयोग करें या Undo बटन दबाकर पहले जैसा करें।',
      },
      {
        question: 'क्या यह सेवा पूरी तरह मुफ्त है?',
        answer: 'हाँ, यह हमेशा 100% मुफ्त और असीमित है।',
      },
    ],
  },

  // ================= 5. TAMIL =================
  ta: {
    lang: 'ta',
    localeCode: 'ta-IN',
    langName: 'Tamil',
    nativeName: 'தமிழ்',
    slugPath: '/ta/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/ta/tools/fast-inpainting-watermark-remover`,
    title: 'பாஸ்ட் இன்பெயிண்டிங் வாட்டர்மார்க் நீக்கி & ஆப்ஜெக்ட் அழிப்பான் | IndiaTools',
    metaDescription: 'புகைப்படங்களிலிருந்து வாட்டர்மார்க், தேதி முத்திரைகள் மற்றும் தேவையற்ற பொருட்களை மங்கலாக்காமல் நொடிகளில் நீக்குங்கள். 100% இலவசம் மற்றும் தனிப்பட்டது.',
    h1: 'பாஸ்ட் இன்பெயிண்டிங் வாட்டர்மார்க் நீக்கி & ஆப்ஜெக்ட் அழிப்பான்',
    subtitle: 'புகைப்படங்களில் உள்ள வாட்டர்மார்க் மற்றும் தேவையற்ற பகுதிகளை மங்கலாக்காமல் இயற்கையாக அழிக்க உதவும் அதிவேக கருவி. உலாவி நினைவகத்தில் முழு பாதுகாப்பு.',
    guideTitle: 'வாட்டர்மார்க்கை எவ்வாறு நீக்குவது (படி படியான வழிகாட்டி)',
    guideSteps: [
      {
        step: 1,
        title: 'புகைப்படத்தைப் பதிவேற்றவும்',
        description: 'உங்கள் JPG, PNG அல்லது WebP புகைப்படத்தை இங்கு இழுத்துவிடவும். படம் உங்கள் உலாவியில் மட்டுமே செயலாக்கப்படும்.',
      },
      {
        step: 2,
        title: 'தூரிகை அளவை மாற்றவும்',
        description: 'அழிக்க வேண்டிய பகுதிக்கு ஏற்ப தூரிகையின் அளவை மாற்றிக்கொள்ளுங்கள்.',
      },
      {
        step: 3,
        title: 'வாட்டர்மார்க் மீது வண்ணம் பூசவும்',
        description: 'சிவப்பு நிற தூரிகை கொண்டு அழிக்க வேண்டிய பகுதியைத் தேர்ந்தெடுக்கவும்.',
      },
      {
        step: 4,
        title: '"அழித்து இன்பெயிண்ட் செய்" பொத்தானை அழுத்தவும்',
        description: 'அதிவேக அல்காரிதம் பின்னணியை இயற்கையாக இணைத்து வாட்டர்மார்க்கை நீக்கும்.',
      },
      {
        step: 5,
        title: 'பதிவிறக்கம் செய்யவும்',
        description: 'முடிவை ஒப்பிட்டுப் பார்த்து தெளிவான புகைப்படத்தைப் பதிவிறக்கவும்.',
      },
    ],
    useCasesTitle: 'முக்கிய பயன்பாடுகள்',
    useCases: [
      {
        title: 'மொபைல் போன் கேமரா வாட்டர்மார்க் நீக்கம்',
        description: '"Shot on OnePlus", "Redmi" போன்ற கேமரா முத்திரைகளை எளிதாக நீக்கலாம்.',
      },
      {
        title: 'தேதி மற்றும் நேர முத்திரைகள்',
        description: 'பழைய புகைப்படங்களில் உள்ள மஞ்சள் அல்லது சிவப்பு வண்ண தேதி முத்திரைகளை அழிக்கலாம்.',
      },
      {
        title: 'பின்னணியில் உள்ள தேவையற்ற நபர்கள்',
        description: 'சுற்றுலா தலங்களில் எடுத்த புகைப்படங்களின் பின்னால் உள்ள மனிதர்கள் மற்றும் வாகனங்களை நீக்கலாம்.',
      },
      {
        title: 'மின்கம்பிகள் மற்றும் தூசிகள்',
        description: 'இயற்கை காட்சிகளின் குறுக்கே உள்ள மின்கம்பிகளைத் துடைத்து எடுக்கலாம்.',
      },
    ],
    techSpecsTitle: 'ஆதரிக்கப்படும் வடிவங்கள்',
    supportedFormats: 'JPG, PNG மற்றும் WebP பட வடிவங்கள் ஆதரிக்கப்படுகின்றன.',
    limitations: 'சுற்றியுள்ள பிக்சல்களைக் கொண்டு பின்னணி உருவாக்கப்படுகிறது.',
    privacyTitle: '100% தனியுரிமை உறுதி',
    privacyNote: 'எந்தவொரு படமும் சேவையகங்களுக்கு அனுப்பப்படுவதில்லை. முழு பணிகளும் உங்கள் சாதனத்திலேயே நடக்கின்றன.',
    faqs: [
      {
        question: 'மங்கலாகாமல் வாட்டர்மார்க் எவ்வாறு நீக்கப்படுகிறது?',
        answer: 'அலெக்ஸாண்ட்ரு டெலியா ஃபாஸ்ட் மார்ச்சிங் முறை மூலம் சுற்றியுள்ள பின்னணி வண்ணங்கள் இயற்கையாகப் பொருத்தப்படுகின்றன.',
      },
      {
        question: 'என் தனிப்பட்ட புகைப்படங்கள் பாதுகாப்பானவையா?',
        answer: 'முற்றிலும் பாதுகாப்பானவை. எந்த படமும் சேமிக்கப்படுவதோ பதிவேற்றப்படுவதோ இல்லை.',
      },
      {
        question: 'மொபைல் போனில் வேலை செய்யுமா?',
        answer: 'ஆம், ஆண்ட்ராய்டு மற்றும் ஐபோன் உலாவிகளில் விரலால் எளிதாகப் பயன்படுத்தலாம்.',
      },
      {
        question: 'இந்தியாடூல்ஸ் ஏதேனும் வாட்டர்மார்க் சேர்க்குமா?',
        answer: 'இல்லை, எந்தவிதமான சொந்த முத்திரையும் சேர்க்கப்படாது.',
      },
      {
        question: 'தவறாக வரைந்துவிட்டால் என்ன செய்வது?',
        answer: 'அழிப்பான் (Eraser) அல்லது Undo பொத்தானைப் பயன்படுத்தி சரிசெய்யலாம்.',
      },
      {
        question: 'இது முற்றிலும் இலவசமா?',
        answer: 'ஆம், 100% இலவசம் மற்றும் கட்டுப்பாடற்ற பயன்பாடு.',
      },
    ],
  },

  // ================= 6. TELUGU =================
  te: {
    lang: 'te',
    localeCode: 'te-IN',
    langName: 'Telugu',
    nativeName: 'తెలుగు',
    slugPath: '/te/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/te/tools/fast-inpainting-watermark-remover`,
    title: 'ఫాస్ట్ ఇన్‌పెయింటింగ్ వాటర్‌మార్క్ రిమూవర్ & ఆబ్జెక్ట్ ఎరేజర్ | IndiaTools',
    metaDescription: 'ఫోటోల నుండి వాటర్‌మార్క్‌లు, తేదీ స్టాంపులు మరియు అవాంఛిత వస్తువులను బ్లర్ కాకుండా సెకన్లలో తొలగించండి. 100% ఉచితం మరియు సురక్షితం.',
    h1: 'ఫాస్ట్ ఇన్‌పెయింటింగ్ వాటర్‌మార్క్ రిమూవర్ & ఆబ్జెక్ట్ ఎరేజర్',
    subtitle: 'ఫోటోలలోని వాటర్‌మార్క్‌లు మరియు అవాంఛిత వస్తువులను బ్లర్ కాకుండా సహజంగా తొలగించే వేగవంతమైన సాధనం.',
    guideTitle: 'వాటర్‌మార్క్‌ను ఎలా తొలగించాలి (స్టెప్ బై స్టెప్ గైడ్)',
    guideSteps: [
      {
        step: 1,
        title: 'ఫోటోను అప్‌లోడ్ చేయండి',
        description: 'మీ JPG, PNG లేదా WebP ఫోటోను ఎంచుకోండి. ఫోటో మీ బ్రౌజర్‌లో మాత్రమే ప్రాసెస్ అవుతుంది.',
      },
      {
        step: 2,
        title: 'బ్రష్ పరిమాణాన్ని మార్చండి',
        description: 'తొలగించాల్సిన వస్తువు పరిమాణానికి తగినట్లుగా బ్రష్ రేడియస్‌ను సర్దుబాటు చేయండి.',
      },
      {
        step: 3,
        title: 'వాటర్‌మార్క్ పై రంగు వేయండి',
        description: 'ఎరుపు రంగు బ్రష్‌తో వాటర్‌మార్క్‌ను మార్క్ చేయండి.',
      },
      {
        step: 4,
        title: '"తొలగించు మరియు సరిచేయి" పై క్లిక్ చేయండి',
        description: 'అల్గారిథమ్ చుట్టుపక్కల నేపథ్యాన్ని ఉపయోగించి వాటర్‌మార్క్‌ను సహజంగా తొలగిస్తుంది.',
      },
      {
        step: 5,
        title: 'డౌన్‌లోడ్ చేయండి',
        description: 'ఫలితాన్ని సరిచూసుకొని శుభ్రమైన ఫోటోను సేవ్ చేసుకోండి.',
      },
    ],
    useCasesTitle: 'ప్రధాన ఉపయోగాలు',
    useCases: [
      {
        title: 'కెమెరా బ్రాండ్ వాటర్‌మార్క్‌లు',
        description: '"Shot on OnePlus", "Redmi" వంటి లోగోలను సులభంగా తీసివేయవచ్చు.',
      },
      {
        title: 'తేదీ మరియు సమయం స్టాంపులు',
        description: 'ఫోటోలలోని పసుపు లేదా ఎరుపు రంగు తేదీ గుర్తులను తొలగించవచ్చు.',
      },
      {
        title: 'నేపథ్యంలో అవాంఛిత వ్యక్తులు',
        description: 'టూర్లలో తీసిన ఫోటోల వెనుక ఉన్న వ్యక్తులను తొలగించవచ్చు.',
      },
      {
        title: 'కరెంట్ వైర్లు మరియు మచ్చలు',
        description: 'ప్రకృతి దృశ్యాల మధ్యలో ఉన్న వైర్లను శుభ్రం చేయవచ్చు.',
      },
    ],
    techSpecsTitle: 'సపోర్ట్ చేసే ఫార్మాట్లు',
    supportedFormats: 'JPG, PNG మరియు WebP ఇమేజ్ ఫార్మాట్లు సపోర్ట్ చేస్తాయి.',
    limitations: 'చుట్టుపక్కల పిక్సెల్స్ ఆధారంగా నేపథ్యం రూపొందించబడుతుంది.',
    privacyTitle: '100% గోప్యత హామీ',
    privacyNote: 'మీ ఫోటోలు ఎక్కడా అప్‌లోడ్ కావు, మీ పరికరంలోనే భద్రంగా ప్రాసెస్ అవుతాయి.',
    faqs: [
      {
        question: 'బ్లర్ కాకుండా ఎలా తొలగిస్తుంది?',
        answer: 'అలెక్సాండ్రూ టెలియా ఫాస్ట్ మార్చింగ్ పద్ధతి ద్వారా నేపథ్యాన్ని సహజంగా నింపుతుంది.',
      },
      {
        question: 'నా ఫోటోలు సురక్షితమేనా?',
        answer: 'అవును, ఏ ఫోటో కూడా సర్వర్‌లకు పంపబడదు.',
      },
      {
        question: 'మొబైల్‌లో పనిచేస్తుందా?',
        answer: 'అవును, ఆండ్రాయిడ్ మరియు ఐఫోన్ బ్రౌజర్లలో వేలితో తేలికగా వాడవచ్చు.',
      },
      {
        question: 'టూల్ ఏదైనా లోగో వేస్తుందా?',
        answer: 'లేదు, ఎటువంటి సొంత వాటర్‌మార్క్ జోడించబడదు.',
      },
      {
        question: 'తప్పుగా మార్క్ చేస్తే ఎలా?',
        answer: 'ఎరేజర్ లేదా Undo బటన్ వాడవచ్చు.',
      },
      {
        question: 'ఇది ఉచితమేనా?',
        answer: 'అవును, ఎల్లప్పుడూ 100% ఉచితం.',
      },
    ],
  },

  // ================= 7. KANNADA =================
  kn: {
    lang: 'kn',
    localeCode: 'kn-IN',
    langName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    slugPath: '/kn/tools/fast-inpainting-watermark-remover',
    canonicalUrl: `${BASE_URL}/kn/tools/fast-inpainting-watermark-remover`,
    title: 'ಫಾಸ್ಟ್ ಇನ್‌ಪೇಂಟಿಂಗ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಿಮೂವರ್ & ಆಬ್ಜೆಕ್ಟ್ ಎರೇಸರ್ | IndiaTools',
    metaDescription: 'ಫೋಟೋಗಳಿಂದ ವಾಟರ್‌ಮಾರ್ಕ್‌ಗಳು, ದಿನಾಂಕದ ಸ್ಟಾಂಪ್‌ಗಳು ಮತ್ತು ಬೇಡದ ವಸ್ತುಗಳನ್ನು ಬ್ಲರ್ ಮಾಡದೆ ಸುಲಭವಾಗಿ ತೆಗೆದುಹಾಕಿ. 100% ಉಚಿತ ಹಾಗೂ ಸುರಕ್ಷಿತ.',
    h1: 'ಫಾಸ್ಟ್ ಇನ್‌ಪೇಂಟಿಂಗ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಿಮೂವರ್ & ಆಬ್ಜೆಕ್ಟ್ ಎರೇಸರ್',
    subtitle: 'ಫೋಟೋಗಳಲ್ಲಿನ ವಾಟರ್‌ಮಾರ್ಕ್ ಮತ್ತು ಬೇಡದ ಭಾಗಗಳನ್ನು ಮಸುಕಾಗಿಸದೆ ನೈಸರ್ಗಿಕವಾಗಿ ತೆಗೆದುಹಾಕುವ ವೇಗದ ಸಾಧನ.',
    guideTitle: 'ವಾಟರ್‌ಮಾರ್ಕ್ ತೆಗೆದುಹಾಕುವುದು ಹೇಗೆ (ಹಂತ-ಹಂತದ ಮಾಹಿತಿ)',
    guideSteps: [
      {
        step: 1,
        title: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
        description: 'ನಿಮ್ಮ JPG, PNG ಅಥವಾ WebP ಫೋಟೋವನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ.',
      },
      {
        step: 2,
        title: 'ಬ್ರಷ್ ಗಾತ್ರ ಸರಿಹೊಂದಿಸಿ',
        description: 'ತೆಗೆಯಬೇಕಾದ ಗುರುತಿಗೆ ತಕ್ಕಂತೆ ಬ್ರಷ್ ಗಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
      },
      {
        step: 3,
        title: 'ವಾಟರ್‌ಮಾರ್ಕ್ ಮೇಲೆ ಬ್ರಷ್ ಮಾಡಿ',
        description: 'ಕೆಂಪು ಬಣ್ಣದ ಬ್ರಷ್ ಬಳಸಿ ಗುರುತು ಮಾಡಿ. ತಪ್ಪಾದರೆ ಎರೇಸರ್ ಅಥವಾ Undo ಬಳಸಿ.',
      },
      {
        step: 4,
        title: '"ತೆಗೆದುಹಾಕಿ & ಸರಿಪಡಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ',
        description: 'ಅಲ್ಗಾರಿದಮ್ ಹಿನ್ನೆಲೆಗೆ ಹೊಂದಿಕೆಯಾಗುವಂತೆ ತಕ್ಷಣವೇ ಸರಿಪಡಿಸುತ್ತದೆ.',
      },
      {
        step: 5,
        title: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
        description: 'ಫಲಿತಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ ಸ್ವಚ್ಛವಾದ ಫೋಟೋವನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ.',
      },
    ],
    useCasesTitle: 'ಪ್ರಮುಖ ಉಪಯೋಗಗಳು',
    useCases: [
      {
        title: 'ಕ್ಯಾಮೆರಾ ಬ್ರಾಂಡ್ ವಾಟರ್‌ಮಾರ್ಕ್ ತೆಗೆಯುವುದು',
        description: '"Shot on OnePlus", "Redmi" ಮುಂತಾದ ಲೋಗೋಗಳನ್ನು ಸುಲಭವಾಗಿ ತೆಗೆಯಿರಿ.',
      },
      {
        title: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಸ್ಟಾಂಪ್‌ಗಳು',
        description: 'ಹಳೆಯ ಫೋಟೋಗಳಲ್ಲಿನ ದಿನಾಂಕದ ಗುರುತುಗಳನ್ನು ಅಳಿಸಿಹಾಕಿ.',
      },
      {
        title: 'ಹಿನ್ನೆಲೆಯಲ್ಲಿನ ಅನಗತ್ಯ ವ್ಯಕ್ತಿಗಳು',
        description: 'ಪ್ರವಾಸಿ ಸ್ಥಳಗಳಲ್ಲಿ ತೆಗೆದ ಚಿತ್ರಗಳಿಂದ ಬೇಡದ ಜನರನ್ನು ತೆಗೆಯಿರಿ.',
      },
      {
        title: 'ವಿದ್ಯುತ್ ತಂತಿಗಳು ಮತ್ತು ಮಚ್ಚೆಗಳು',
        description: 'ಪ್ರಕೃತಿ ಚಿತ್ರಗಳಲ್ಲಿನ ತಂತಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
      },
    ],
    techSpecsTitle: 'ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು',
    supportedFormats: 'JPG, PNG ಮತ್ತು WebP ಫಾರ್ಮ್ಯಾಟ್‌ಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.',
    limitations: 'ಸುತ್ತಮುತ್ತಲಿನ ಪಿಕ್ಸೆಲ್‌ಗಳ ಆಧಾರದ ಮೇಲೆ ಹಿನ್ನೆಲೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತದೆ.',
    privacyTitle: '100% ಗೌಪ್ಯತೆ ಭರವಸೆ',
    privacyNote: 'ಯಾವುದೇ ಫೋಟೋವನ್ನು ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ. ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ಸಂಪೂರ್ಣವಾಗಿ ನಡೆಯುತ್ತದೆ.',
    faqs: [
      {
        question: 'ಬ್ಲರ್ ಆಗದೆ ವಾಟರ್‌ಮಾರ್ಕ್ ಹೇಗೆ ಹೋಗುತ್ತದೆ?',
        answer: 'ಅಲೆಕ್ಸಾಂಡ್ರು ಟೆಲಿಯಾ ಫಾಸ್ಟ್ ಮಾರ್ಚಿಂಗ್ ವಿಧಾನದ ಮೂಲಕ ಹಿನ್ನೆಲೆಯ ಬಣ್ಣಗಳನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಹೊಂದಿಸುತ್ತದೆ.',
      },
      {
        question: 'ನನ್ನ ಫೋಟೋಗಳು ಸುರಕ್ಷಿತವೇ?',
        answer: 'ಹೌದು, ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ. ಯಾವುದೇ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ.',
      },
      {
        question: 'ಮೊಬೈಲ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆಯೇ?',
        answer: 'ಹೌದು, ಆಂಡ್ರಾಯ್ಡ್ ಮತ್ತು ಐಫೋನ್ ಬ್ರೌಸರ್‌ಗಳಲ್ಲಿ ಬೆರಳಿನಿಂದ ಸುಲಭವಾಗಿ ಬಳಸಬಹುದು.',
      },
      {
        question: 'ಟೂಲ್ ಯಾವುದೇ ಸ್ವಂತ ಲೋಗೋ ಸೇರಿಸುತ್ತದೆಯೇ?',
        answer: 'ಇಲ್ಲ, ನಿಮ್ಮ ಫೋಟೋ ಸಂಪೂರ್ಣ ಸ್ವಚ್ಛವಾಗಿರುತ್ತದೆ.',
      },
      {
        question: 'ತಪ್ಪಾಗಿ ಮಾರ್ಕ್ ಮಾಡಿದರೆ ಏನು ಮಾಡುವುದು?',
        answer: 'ಎರೇಸರ್ ಅಥವಾ Undo ಬಟನ್ ಬಳಸಿ ಸರಿಪಡಿಸಬಹುದು.',
      },
      {
        question: 'ಇದು ಸಂಪೂರ್ಣ ಉಚಿತವೇ?',
        answer: 'ಹೌದು, ಯಾವಾಗಲೂ 100% ಉಚಿತ.',
      },
    ],
  },
}

export const INPAINTING_SEO_LANG_CODES = Object.keys(INPAINTING_SEO_LANGUAGES)
