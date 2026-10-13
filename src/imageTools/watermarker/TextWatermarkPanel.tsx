import React, { useState } from 'react'
import {
  WatermarkPayload,
  TextDiagnostics,
  TextExtractionResult,
} from '../../lib/watermarker/types'
import {
  embedTextWatermark,
  extractTextWatermark,
  stripTextWatermark,
  inspectTextDiagnostics,
} from '../../lib/watermarker/textWatermarkEngine'
import { WatermarkTranslation } from '../../lib/watermarker/i18n/translations'
import { CodepointInspectorModal } from './CodepointInspectorModal'
import {
  FileText,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Trash2,
  Binary,
  Clock,
  Building,
  Key,
  User,
  HelpCircle,
} from 'lucide-react'

interface TextWatermarkPanelProps {
  t: WatermarkTranslation
  isRtl?: boolean
}

export const TextWatermarkPanel: React.FC<TextWatermarkPanelProps> = ({
  t,
  isRtl = false,
}) => {
  const [activeTab, setActiveTab] = useState<'embed' | 'extract'>('embed')

  // Embedding state
  const [ownerId, setOwnerId] = useState('EMP-9042')
  const [organization, setOrganization] = useState('Legal & Compliance Directorate')
  const [referenceKey, setReferenceKey] = useState('CONF-2026-X89')
  const [customNote, setCustomNote] = useState('Authorized for restricted circulation only')
  const [timestamp, setTimestamp] = useState<number>(Date.now())
  const [sourceText, setSourceText] = useState(
    'This Non-Disclosure Agreement governs confidential proprietary technology and trade secret disclosures between both parties. Any unauthorized distribution, leakage, or dissemination is strictly subject to legal prosecution and immediate employment termination.'
  )
  const [strategy, setStrategy] = useState<'word-boundary' | 'line-boundary'>('word-boundary')
  const [watermarkedOutput, setWatermarkedOutput] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [sanitizedMsg, setSanitizedMsg] = useState(false)

  // Inspection Modal state
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectingText, setInspectingText] = useState('')

  // Extraction state
  const [extractInput, setExtractInput] = useState('')
  const [extractionResult, setExtractionResult] = useState<TextExtractionResult | null>(null)

  // Handle Embed
  const handleEmbed = () => {
    try {
      const payload: WatermarkPayload = {
        ownerId: ownerId.trim() || 'ANONYMOUS',
        organization: organization.trim() || 'GENERAL',
        referenceKey: referenceKey.trim() || 'REF-DEFAULT',
        timestamp: timestamp || Date.now(),
        customNote: customNote.trim() || undefined,
      }
      const result = embedTextWatermark(sourceText, payload, { strategy })
      setWatermarkedOutput(result)
    } catch (err: any) {
      alert(err?.message || 'Failed to embed text watermark')
    }
  }

  // Handle Extract
  const handleExtract = () => {
    const res = extractTextWatermark(extractInput)
    setExtractionResult(res)
  }

  // Handle Copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle Sanitize
  const handleSanitize = (text: string) => {
    const clean = stripTextWatermark(text)
    setWatermarkedOutput(clean)
    setSanitizedMsg(true)
    setTimeout(() => setSanitizedMsg(false), 2500)
  }

  // Open Inspector
  const openInspector = (text: string) => {
    setInspectingText(text)
    setInspectorOpen(true)
  }

  // Sample texts
  const loadSample = (type: 'nda' | 'memo' | 'hindi') => {
    if (type === 'nda') {
      setSourceText(
        'CONFIDENTIAL MUTUAL NON-DISCLOSURE AGREEMENT\n\n1. Purpose. The Disclosing Party agrees to provide proprietary source specifications solely for evaluation purposes.\n2. Non-Circumvention. The Receiving Party warrants that all technological trade secrets shall be preserved with strict military diligence.'
      )
    } else if (type === 'memo') {
      setSourceText(
        'INTERNAL MEMORANDUM — FINANCIAL PROJECTIONS FY 2026-27\n\nSubject: Preliminary Q3 Operating Margins & Treasury Allocations.\nDistribution: Strictly limited to Board of Directors and Principal Auditors. Do not forward or duplicate outside encrypted channels.'
      )
    } else {
      setSourceText(
        'गोपनीय शासकीय परिपत्र — भारत सरकार\n\nविषय: आंतरिक सुरक्षा एवं दस्तावेज़ सत्यनिष्ठा दिशा-निर्देश २०२६।\nयह दस्तावेज़ केवल अधिकृत अधिकारियों के व्यक्तिगत उपयोग हेतु है। इसका अनधिकृत प्रसार दंडनीय अपराध है।'
      )
    }
  }

  const currentDiagnostics = inspectingText
    ? inspectTextDiagnostics(inspectingText)
    : inspectTextDiagnostics(watermarkedOutput || sourceText)

  return (
    <div className="space-y-6">
      {/* Sub tabs: Embed vs Extract */}
      <div className="flex border-b border-slate-800 pb-3 gap-3">
        <button
          onClick={() => setActiveTab('embed')}
          className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'embed'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.embedTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('extract')}
          className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'extract'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.extractTab}</span>
        </button>
      </div>

      {activeTab === 'embed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Metadata Configuration */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Signatory & Attribution Metadata</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                CRC16 Guarded
              </span>
            </div>

            {/* Owner ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.ownerId}</span>
              </label>
              <input
                type="text"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                placeholder={t.ownerIdPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.org}</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={t.orgPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* Reference Key */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.refKey}</span>
              </label>
              <input
                type="text"
                value={referenceKey}
                onChange={(e) => setReferenceKey(e.target.value)}
                placeholder={t.refKeyPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 font-mono"
              />
            </div>

            {/* Timestamp */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.timestamp}</span>
                </label>
                <button
                  onClick={() => setTimestamp(Date.now())}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline"
                >
                  {t.useCurrentTime}
                </button>
              </div>
              <input
                type="text"
                value={new Date(timestamp).toUTCString()}
                readOnly
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-mono"
              />
            </div>

            {/* Custom Secret Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.customNote}
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={t.customNotePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* Safe Injection Strategy */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Insertion Strategy (Indic & RTL Preserving)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStrategy('word-boundary')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    strategy === 'word-boundary'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Word Boundaries
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Safe for Indic / Urdu scripts
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('line-boundary')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    strategy === 'line-boundary'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Line Boundaries
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Injected at first newline
                  </span>
                </button>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleEmbed}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.embedBtn}</span>
            </button>
          </div>

          {/* Right Area: Text Editor & Output */}
          <div className="lg:col-span-7 space-y-4">
            {/* Source Text Input */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-200">{t.coverText}</span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Quick samples:</span>
                  <button
                    onClick={() => loadSample('nda')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                  >
                    NDA
                  </button>
                  <button
                    onClick={() => loadSample('memo')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                  >
                    Memo
                  </button>
                  <button
                    onClick={() => loadSample('hindi')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={t.coverTextPlaceholder}
                rows={5}
                className="w-full p-3.5 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>{sourceText.length.toLocaleString()} characters</span>
                <button
                  onClick={() => openInspector(sourceText)}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Binary className="w-3.5 h-3.5" />
                  <span>Inspect Codepoints</span>
                </button>
              </div>
            </div>

            {/* Watermarked Output Display */}
            {watermarkedOutput && (
              <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-5 shadow-xl shadow-emerald-500/5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300">
                      Fingerprinted Document Ready
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                    Visually Indistinguishable
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed max-h-48 overflow-y-auto relative">
                  {watermarkedOutput}
                </div>

                {/* Output Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(watermarkedOutput)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> {t.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t.copyWatermarkedText}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSanitize(watermarkedOutput)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all"
                      title="Strips all invisible zero-width characters"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t.sanitizeText}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => openInspector(watermarkedOutput)}
                    className="px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-900/50 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Binary className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.inspectCodepoints}</span>
                  </button>
                </div>

                {sanitizedMsg && (
                  <p className="text-[11px] text-rose-400 mt-2 font-medium">
                    {t.sanitized}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Extraction Forensic Panel */
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Document Leak Forensics & Signatory Extractor</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste leaked text, email excerpts, or contracts to recover the embedded owner ID and timestamp
                </p>
              </div>
            </div>

            <textarea
              value={extractInput}
              onChange={(e) => setExtractInput(e.target.value)}
              placeholder="Paste leaked text containing invisible steganographic fingerprints..."
              rows={6}
              className="w-full p-4 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 resize-y leading-relaxed font-sans mb-3"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {extractInput.length.toLocaleString()} characters analyzed
              </span>
              <button
                onClick={handleExtract}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.extractBtn}</span>
              </button>
            </div>
          </div>

          {/* Forensic Results View */}
          {extractionResult && (
            <div
              className={`p-6 rounded-3xl border animate-in fade-in duration-200 ${
                extractionResult.success
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  : 'bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-500/5'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl border ${
                      extractionResult.success
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    }`}
                  >
                    {extractionResult.success ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {extractionResult.success ? t.verifiedBadge : t.tamperedBadge}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {extractionResult.success
                        ? 'Zero-width token framing parsed and verified against CRC16 polynomial checksum'
                        : extractionResult.error || t.noWatermark}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Confidence Score</span>
                  <span
                    className={`font-mono text-lg font-bold ${
                      extractionResult.confidenceScore === 100
                        ? 'text-emerald-400'
                        : extractionResult.confidenceScore > 0
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {extractionResult.confidenceScore}%
                  </span>
                </div>
              </div>

              {extractionResult.payload && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.ownerId}
                    </span>
                    <span className="text-sm font-bold text-white font-mono break-all">
                      {extractionResult.payload.ownerId}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.org}
                    </span>
                    <span className="text-sm font-semibold text-slate-200 truncate block">
                      {extractionResult.payload.organization}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.refKey}
                    </span>
                    <span className="text-sm font-bold text-cyan-300 font-mono break-all">
                      {extractionResult.payload.referenceKey}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.timestamp}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      {new Date(extractionResult.payload.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {extractionResult.payload?.customNote && (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 mb-3">
                  <span className="font-semibold text-slate-400 mr-2">Custom Audit Note:</span>
                  {extractionResult.payload.customNote}
                </div>
              )}

              {/* Forensic Details Stats */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-4">
                  <span>
                    Zero-Width Tokens:{' '}
                    <strong className="text-slate-200">
                      {extractionResult.rawZeroWidthCharsFound}
                    </strong>
                  </span>
                  <span>
                    CRC16 Check:{' '}
                    <strong
                      className={
                        extractionResult.crcValid ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {extractionResult.crcValid ? 'VALID' : 'FAILED'}
                    </strong>
                  </span>
                </div>

                <button
                  onClick={() => openInspector(extractInput)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Binary className="w-3.5 h-3.5" />
                  <span>Inspect Extracted Tokens</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Codepoints Modal */}
      <CodepointInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        diagnostics={currentDiagnostics}
        rawText={inspectingText}
      />
    </div>
  )
}
