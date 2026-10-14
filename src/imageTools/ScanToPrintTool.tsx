import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Printer,
  Smartphone,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Layers,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  P2PConnectionState,
  PrintPreferences,
  ReceivedDocument,
  SupportedLanguage,
  TransferProgress,
} from '../types/p2pPrint'
import { I18N_DATA } from '../components/scanToPrint/scanToPrintI18n'
import { P2PPrintEngine } from '../lib/p2p/p2pPrintEngine'
import {
  playConnectedChime,
  playReceivedChime,
  playPurgeChime,
} from '../components/scanToPrint/chimeAudio'
import { HeroSection } from '../components/scanToPrint/HeroSection'
import { ShopTerminal } from '../components/scanToPrint/ShopTerminal'
import { MobileSender } from '../components/scanToPrint/MobileSender'
import { CountertopPosterGenerator } from '../components/scanToPrint/CountertopPosterGenerator'

function generateCleanSessionId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `ipt-${id}`
}

export const ScanToPrintTool: React.FC = () => {
  const [searchParams] = useSearchParams()
  const sessionFromUrl = searchParams.get('session')
  const modeFromUrl = searchParams.get('mode')

  const tool = getToolBySlug('scan-to-print')

  // Language state (default: English)
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en')
  const i18n = useMemo(() => I18N_DATA[currentLang] || I18N_DATA.en, [currentLang])

  // Session ID & Mode
  const [sessionId, setSessionId] = useState<string>(() => sessionFromUrl || generateCleanSessionId())
  const [activeMode, setActiveMode] = useState<'terminal' | 'mobile'>(() => {
    if (sessionFromUrl || modeFromUrl === 'send') return 'mobile'
    return 'terminal'
  })

  // Transfer States
  const [connectionState, setConnectionState] = useState<P2PConnectionState>('idle')
  const [progress, setProgress] = useState<TransferProgress | null>(null)
  const [receivedDoc, setReceivedDoc] = useState<ReceivedDocument | null>(null)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState<boolean>(true)
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false)

  const engineRef = useRef<P2PPrintEngine | null>(null)
  const printIframeRef = useRef<HTMLIFrameElement | null>(null)

  // Full connection URL for QR Code and sharing
  const sessionUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/tools/scan-to-print?session=${sessionId}`
  }, [sessionId])

  // Initialize or recreate P2P Engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.destroy()
    }

    const role = activeMode === 'mobile' ? 'sender' : 'receiver'

    const engine = new P2PPrintEngine(role, sessionId, {
      onStateChange: (state) => {
        setConnectionState(state)
        if (state === 'connected') {
          playConnectedChime()
        }
      },
      onProgress: (prog) => {
        setProgress(prog)
      },
      onDocumentReceived: (doc) => {
        setReceivedDoc(doc)
        playReceivedChime()

        // Auto-print trigger if enabled
        if (autoPrintEnabled) {
          setTimeout(() => {
            triggerPrintDocument(doc)
          }, 600)
        }
      },
      onError: () => {
        setConnectionState('error')
      },
    })

    engineRef.current = engine

    return () => {
      engine.destroy()
    }
  }, [sessionId, activeMode, autoPrintEnabled])

  const triggerPrintDocument = (doc: ReceivedDocument) => {
    if (doc.type.includes('pdf')) {
      // Print PDF via invisible iframe
      if (!printIframeRef.current) {
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = '0'
        iframe.style.bottom = '0'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = '0'
        document.body.appendChild(iframe)
        printIframeRef.current = iframe
      }

      printIframeRef.current.src = doc.blobUrl
      printIframeRef.current.onload = () => {
        try {
          printIframeRef.current?.contentWindow?.focus()
          printIframeRef.current?.contentWindow?.print()
        } catch (e) {
          window.print()
        }
      }
    } else {
      // Direct window.print() for images
      window.print()
    }
  }

  const handlePrint = () => {
    if (receivedDoc) {
      triggerPrintDocument(receivedDoc)
    } else {
      window.print()
    }
  }

  const handlePurge = () => {
    if (engineRef.current) {
      engineRef.current.purgeMemory()
    }
    setReceivedDoc(null)
    setProgress(null)
    playPurgeChime()
  }

  const handleResetSession = () => {
    const newId = generateCleanSessionId()
    setSessionId(newId)
    setReceivedDoc(null)
    setProgress(null)
  }

  const handleSendFileFromMobile = async (file: File, preferences: PrintPreferences) => {
    if (engineRef.current) {
      await engineRef.current.sendFile(file, preferences)
    }
  }

  const handleOpenMobileTest = () => {
    if (typeof window !== 'undefined') {
      window.open(`/tools/scan-to-print?session=${sessionId}`, '_blank')
    }
  }

  const handleScrollToTerminal = () => {
    const el = document.getElementById('shop-terminal')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!tool) return null

  // Canonical hreflangs for Multilingual SEO
  const hreflangs = [
    { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/tools/scan-to-print' },
    { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/tools/scan-to-print' },
    { lang: 'ml-IN', href: 'https://indiatools-rho.vercel.app/ml/tools/scan-to-print' },
    { lang: 'hi-IN', href: 'https://indiatools-rho.vercel.app/hi/tools/scan-to-print' },
    { lang: 'ta-IN', href: 'https://indiatools-rho.vercel.app/ta/tools/scan-to-print' },
    { lang: 'te-IN', href: 'https://indiatools-rho.vercel.app/te/tools/scan-to-print' },
  ]

  // Structured Data Schema for Search Engines
  const customJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Scan-to-Print P2P QR Drop Studio',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All Web Browsers (Mobile & Desktop)',
    browserRequirements: 'Requires JavaScript. Requires HTML5 & WebRTC.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Direct phone-to-computer document transmission built for Akshaya Centres, DTP shops, colleges, and stationery stores. Zero WhatsApp clutter, no mobile number sharing, 100% private in-memory P2P transfer.',
  }

  return (
    <ToolPageLayout
      tool={tool}
      hideHeroHeader={true}
      hideDefaultGuide={true}
      hideDefaultFaqs={true}
      maxWidthClass="max-w-7xl"
      customTitle={tool.seo.title}
      customDescription={tool.seo.metaDescription}
      customCanonicalPath={tool.seo.canonicalPath}
      hreflangs={hreflangs}
      customJsonLd={customJsonLd}
    >
      <div className="space-y-12">
        {/* Dedicated Standalone SaaS Hero Section */}
        <HeroSection
          i18n={i18n}
          currentLang={currentLang}
          onLangChange={setCurrentLang}
          onOpenTerminal={handleScrollToTerminal}
          onOpenPosterModal={() => setIsPosterModalOpen(true)}
          onOpenMobileTest={handleOpenMobileTest}
        />

        {/* Dual Mode Switcher Bar */}
        <div className="flex items-center justify-center no-print">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => setActiveMode('terminal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'terminal'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Shop Counter Terminal (PC)</span>
            </button>

            <button
              onClick={() => setActiveMode('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'mobile'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Customer Mobile Sender</span>
            </button>
          </div>
        </div>

        {/* ACTIVE OPERATIONAL INTERFACE */}
        <div className="relative">
          {activeMode === 'terminal' ? (
            <ShopTerminal
              sessionId={sessionId}
              sessionUrl={sessionUrl}
              state={connectionState}
              progress={progress}
              document={receivedDoc}
              autoPrintEnabled={autoPrintEnabled}
              onToggleAutoPrint={() => setAutoPrintEnabled(!autoPrintEnabled)}
              onPrint={handlePrint}
              onPurge={handlePurge}
              onOpenPosterModal={() => setIsPosterModalOpen(true)}
              onOpenMobileTest={handleOpenMobileTest}
              onResetSession={handleResetSession}
              i18n={i18n}
            />
          ) : (
            <MobileSender
              sessionId={sessionId}
              connectionState={connectionState}
              progress={progress}
              onSendFile={handleSendFileFromMobile}
              i18n={i18n}
            />
          )}
        </div>

        {/* COMPARISON TABLE: WHATSAPP VS SCAN-TO-PRINT */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6 no-print">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Why Indian Photocopy Shops Are Switching
            </h2>
            <p className="text-xs text-slate-400">
              The real operational advantages of zero-WhatsApp peer-to-peer printing for DTP centres & Akshaya shops
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Feature / Metric</th>
                  <th className="py-3 px-4 text-rose-400">WhatsApp Document Sharing</th>
                  <th className="py-3 px-4 text-emerald-400">Scan-to-Print P2P Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Phone Number Privacy</td>
                  <td className="py-3.5 px-4 flex items-center gap-1.5 text-rose-300">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Requires exchanging personal mobile numbers</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Zero number sharing — 100% anonymous QR scan</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Shop PC Storage & Bloat</td>
                  <td className="py-3.5 px-4 text-rose-300">
                    Hundreds of random customer PDFs permanently filling disk
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300">
                    0 bytes saved to hard drive; exists only in temporary RAM
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Counter Speed & Queue Time</td>
                  <td className="py-3.5 px-4 text-rose-300">
                    Save contact → Wait for sync → Download → Open folder (2–3 mins)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300">
                    Point camera → Select file → Auto-prints at counter (under 10 secs)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Security & Data Retention</td>
                  <td className="py-3.5 px-4 text-rose-300">
                    Personal Aadhaar, PAN cards remain visible in WhatsApp chat media
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300">
                    One-click "Purge RAM" zeroes out all memory buffers instantly
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-white">Cost & Setup</td>
                  <td className="py-3.5 px-4 text-slate-400">Requires dedicated shop phone & SIM</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-bold">
                    ₹0 Free • Works on any browser with zero installation
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DEEP TECHNICAL ARCHITECTURE */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6 no-print">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Technical Architecture & Security Foundations
              </h2>
              <p className="text-xs text-slate-400">
                How direct WebRTC DataChannels and ephemeral RAM streaming protect customer confidentiality
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4" /> 1. WebRTC SCTP Binary Data Channel Streaming
              </h3>
              <p>
                When a customer scans the countertop QR code, their mobile browser and the shop terminal perform standard SDP offer/answer signaling via public STUN servers.
              </p>
              <p>
                Once the direct peer connection is established, files are sliced into 64KB chunks and streamed over an encrypted SCTP DataChannel directly from device to device. No intermediate cloud servers are used.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 2. Dual-Transport Cross-Tab Broadcast Channel
              </h3>
              <p>
                For local demonstration, testing, and multi-monitor setups, the studio incorporates the HTML5 BroadcastChannel API alongside WebRTC.
              </p>
              <p>
                Opening the customer mobile interface in a separate browser tab establishes an instantaneous 0ms link, allowing shopkeepers to verify print layouts and pre-print settings without touching a second device.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 3. In-Memory Multi-Page PDF & Image Inspection
              </h3>
              <p>
                Incoming document chunks are reconstructed in browser heap memory as TypedArrays. For PDFs, the engine parses page structures to report total page counts and dimension layouts.
              </p>
              <p>
                Customer-chosen pre-print preferences (Color vs Black & White, copy count, and page ranges) are transferred directly in the metadata payload and displayed on the inspector.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> 4. Aggressive RAM Shredding & Garbage Collection
              </h3>
              <p>
                Confidential identity cards, bank statements, and examination certificates must never leave digital traces on shared public computers.
              </p>
              <p>
                Clicking &quot;Done &amp; Purge&quot; immediately revokes all generated Blob URLs and releases references to the underlying binary buffers.
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4 no-print">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Answers to common operational and privacy questions for print shops and customers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {i18n.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-slate-950/60 border border-white/10 p-4 transition-all open:border-emerald-500/40"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-emerald-400 transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Countertop Standee Generator Modal */}
        <CountertopPosterGenerator
          isOpen={isPosterModalOpen}
          onClose={() => setIsPosterModalOpen(false)}
          sessionUrl={sessionUrl}
          i18n={i18n}
        />

        {/* PRINT ONLY DOCUMENT RENDER */}
        {receivedDoc && (
          <div className="hidden print:block print:w-full print:m-0 print:p-0">
            {receivedDoc.type.startsWith('image/') ? (
              <img
                src={receivedDoc.blobUrl}
                alt="Document Output"
                className={`w-full h-auto object-contain ${
                  receivedDoc.preferences.colorMode === 'bw' ? 'grayscale' : ''
                }`}
              />
            ) : null}
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
