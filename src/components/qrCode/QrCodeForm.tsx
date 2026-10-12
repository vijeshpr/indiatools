import React, { useRef, useState } from 'react'
import {
  IndianRupee,
  Globe,
  MessageCircle,
  Wifi,
  FileText,
  User,
  Palette,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
} from 'lucide-react'
import {
  QrType,
  UpiFormData,
  UrlFormData,
  WhatsAppFormData,
  WifiFormData,
  TextFormData,
  VCardFormData,
  QrStylingConfig,
  DotStyleType,
  CornerSquareStyleType,
  CornerDotStyleType,
  ErrorCorrectionLevel,
} from './QrCodeTypes'
import { PRESET_LOGOS, STYLING_PRESETS, StylingPreset } from './QrCodePresets'

interface QrCodeFormProps {
  qrType: QrType
  setQrType: (type: QrType) => void
  upiData: UpiFormData
  setUpiData: React.Dispatch<React.SetStateAction<UpiFormData>>
  urlData: UrlFormData
  setUrlData: React.Dispatch<React.SetStateAction<UrlFormData>>
  whatsappData: WhatsAppFormData
  setWhatsappData: React.Dispatch<React.SetStateAction<WhatsAppFormData>>
  wifiData: WifiFormData
  setWifiData: React.Dispatch<React.SetStateAction<WifiFormData>>
  textData: TextFormData
  setTextData: React.Dispatch<React.SetStateAction<TextFormData>>
  vcardData: VCardFormData
  setVcardData: React.Dispatch<React.SetStateAction<VCardFormData>>
  config: QrStylingConfig
  setConfig: React.Dispatch<React.SetStateAction<QrStylingConfig>>
  onReset: () => void
}

export const QrCodeForm: React.FC<QrCodeFormProps> = ({
  qrType,
  setQrType,
  upiData,
  setUpiData,
  urlData,
  setUrlData,
  whatsappData,
  setWhatsappData,
  wifiData,
  setWifiData,
  textData,
  setTextData,
  vcardData,
  setVcardData,
  config,
  setConfig,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'styling' | 'logo'>('content')
  const [showWifiPassword, setShowWifiPassword] = useState(false)
  const logoFileInputRef = useRef<HTMLInputElement>(null)

  // Quick VPA suffixes for UPI
  const upiSuffixes = ['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@upi', '@ibl']

  // Handle custom logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setConfig((prev) => ({
        ...prev,
        logoUrl: result,
        // When logo is uploaded, ensure error correction is high enough
        errorCorrection: prev.errorCorrection === 'L' ? 'Q' : prev.errorCorrection,
      }))
    }
    reader.readAsDataURL(file)
  }

  // Remove logo
  const handleRemoveLogo = () => {
    setConfig((prev) => ({ ...prev, logoUrl: '' }))
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = ''
    }
  }

  // Apply styling preset
  const handleApplyPreset = (preset: StylingPreset) => {
    setConfig((prev) => ({
      ...prev,
      colorMode: preset.colorMode,
      fgColor: preset.fgColor,
      gradientType: preset.gradientType,
      gradientColor1: preset.gradientColor1,
      gradientColor2: preset.gradientColor2,
      gradientRotation: preset.gradientRotation,
      bgColor: preset.bgColor,
      dotType: preset.dotType,
      cornerSquareType: preset.cornerSquareType,
      cornerDotType: preset.cornerDotType,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation: Type & Content vs Appearance vs Logo */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl border border-slate-200/80 dark:border-zinc-700/80">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. QR Content</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('styling')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'styling'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>2. Style & Colors</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>3. Logo / Icon</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: QR CONTENT (TABBED SELECTION FOR ALL 6 QR TYPES) */}
      {/* ============================================================== */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          {/* QR Code Type Selector Badges */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
              Select QR Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'upi', label: 'UPI Pay', icon: IndianRupee, color: 'text-emerald-500' },
                { id: 'url', label: 'Website', icon: Globe, color: 'text-blue-500' },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500' },
                { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: 'text-indigo-500' },
                { id: 'vcard', label: 'Contact', icon: User, color: 'text-purple-500' },
                { id: 'text', label: 'Plain Text', icon: FileText, color: 'text-amber-500' },
              ].map((t) => {
                const Icon = t.icon
                const isSelected = qrType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setQrType(t.id as QrType)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/15 border-indigo-500/60 text-indigo-700 dark:text-indigo-300 shadow-sm scale-[1.02]'
                        : 'bg-white/60 dark:bg-zinc-900/60 border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : t.color}`} />
                    <span className="text-xs font-bold leading-tight">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Fields corresponding to the selected type */}
          <div className="bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            {/* TYPE 1: UPI PAYMENT */}
            {qrType === 'upi' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                      Standard NPCI UPI Payment Link
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    GPay / PhonePe / Paytm / BHIM
                  </span>
                </div>

                {/* UPI ID (VPA) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    UPI ID / VPA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={upiData.upiId}
                    onChange={(e) => setUpiData({ ...upiData, upiId: e.target.value })}
                    placeholder="e.g. sharma@okaxis or 9876543210@paytm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  {/* Quick Suffix Chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-400">Quick handle:</span>
                    {upiSuffixes.map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => {
                          const base = upiData.upiId.includes('@')
                            ? upiData.upiId.split('@')[0]
                            : upiData.upiId || 'merchant'
                          setUpiData({ ...upiData, upiId: `${base}${suf}` })
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payee Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Payee / Shop Name
                  </label>
                  <input
                    type="text"
                    value={upiData.payeeName}
                    onChange={(e) => setUpiData({ ...upiData, payeeName: e.target.value })}
                    placeholder="e.g. Sharma General Store"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                {/* Amount (Optional) & Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Fixed Amount (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={upiData.amount}
                        onChange={(e) => setUpiData({ ...upiData, amount: e.target.value })}
                        placeholder="Leave blank for any amount"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Transaction Note / Remarks <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={upiData.note}
                      onChange={(e) => setUpiData({ ...upiData, note: e.target.value })}
                      placeholder="e.g. Bill Payment"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                {/* Registered Mobile Number for Counter Standee */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Registered Mobile Number <span className="text-slate-400 font-normal">(Optional, displayed on shop standee)</span>
                  </label>
                  <input
                    type="tel"
                    value={upiData.merchantPhone || ''}
                    onChange={(e) => setUpiData({ ...upiData, merchantPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            )}

            {/* TYPE 2: URL / WEBSITE */}
            {qrType === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Website Address / Link URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={urlData.url}
                    onChange={(e) => setUrlData({ url: e.target.value })}
                    placeholder="e.g. indiatools-rho.vercel.app or https://yourshop.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                    `https://` will automatically be prefixed if not included.
                  </p>
                </div>
              </div>
            )}

            {/* TYPE 3: WHATSAPP DIRECT */}
            {qrType === 'whatsapp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Country Code
                    </label>
                    <input
                      type="text"
                      value={whatsappData.countryCode}
                      onChange={(e) => setWhatsappData({ ...whatsappData, countryCode: e.target.value })}
                      placeholder="+91"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      WhatsApp Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsappData.phone}
                      onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Pre-filled Message <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={whatsappData.message}
                    onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                    placeholder="e.g. Hi! I want to enquire about prices."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                  />
                </div>
              </div>
            )}

            {/* TYPE 4: WI-FI NETWORK */}
            {qrType === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Network Name (SSID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wifiData.ssid}
                    onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                    placeholder="e.g. Sharma_Fiber_5G"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Encryption Security
                    </label>
                    <select
                      value={wifiData.encryption}
                      onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP (Older)</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>

                  {wifiData.encryption !== 'nopass' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Wi-Fi Password
                      </label>
                      <div className="relative">
                        <input
                          type={showWifiPassword ? 'text' : 'password'}
                          value={wifiData.password}
                          onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                          placeholder="Network Password"
                          className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWifiPassword(!showWifiPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                        >
                          {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={wifiData.hidden}
                    onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Hidden Network (SSID is not broadcasting)</span>
                </label>
              </div>
            )}

            {/* TYPE 5: VCARD CONTACT */}
            {qrType === 'vcard' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={vcardData.firstName}
                      onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                      placeholder="e.g. Rajesh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={vcardData.lastName}
                      onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                      placeholder="e.g. Kumar"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={vcardData.phone}
                      onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={vcardData.email}
                      onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                      placeholder="name@business.in"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Company / Store
                    </label>
                    <input
                      type="text"
                      value={vcardData.company}
                      onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                      placeholder="Bharat Enterprises"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={vcardData.title}
                      onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                      placeholder="Proprietor / Director"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 6: PLAIN TEXT */}
            {qrType === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Plain Text Message / Note
                  </label>
                  <textarea
                    rows={4}
                    value={textData.text}
                    onChange={(e) => setTextData({ text: e.target.value })}
                    placeholder="Type anything here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STYLE & COLORS */}
      {/* ============================================================== */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Quick Design Presets */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
              1-Click Style Themes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:border-indigo-400 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{
                        background:
                          p.colorMode === 'gradient'
                            ? `linear-gradient(135deg, ${p.gradientColor1}, ${p.gradientColor2})`
                            : p.fgColor,
                      }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dots Pattern Selection */}
          <div className="bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                QR Dot Pattern Styling
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'classy', label: 'Classy' },
                  { id: 'square', label: 'Square' },
                  { id: 'classy-rounded', label: 'Artistic' },
                  { id: 'extra-rounded', label: 'Smooth' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setConfig({ ...config, dotType: d.id as DotStyleType })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      config.dotType === d.id
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400'
                        : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Squares & Dots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                  Corner Eye Frame
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'extra-rounded', label: 'Rounded' },
                    { id: 'square', label: 'Square' },
                    { id: 'dot', label: 'Circle' },
                  ].map((cs) => (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => setConfig({ ...config, cornerSquareType: cs.id as CornerSquareStyleType })}
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        config.cornerSquareType === cs.id
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400'
                          : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400'
                      }`}
                    >
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                  Corner Center Dot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dot', label: 'Dot (Circle)' },
                    { id: 'square', label: 'Square' },
                  ].map((cd) => (
                    <button
                      key={cd.id}
                      type="button"
                      onClick={() => setConfig({ ...config, cornerDotType: cd.id as CornerDotStyleType })}
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        config.cornerDotType === cd.id
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400'
                          : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400'
                      }`}
                    >
                      {cd.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Color & Gradient Controls */}
          <div className="bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                Colors & Gradients
              </span>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, colorMode: 'single' })}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                    config.colorMode === 'single'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, colorMode: 'gradient' })}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                    config.colorMode === 'gradient'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Gradient
                </button>
              </div>
            </div>

            {config.colorMode === 'single' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.fgColor}
                    onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-zinc-700"
                  />
                  <input
                    type="text"
                    value={config.fgColor}
                    onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-mono uppercase"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Gradient Start
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.gradientColor1}
                        onChange={(e) => setConfig({ ...config, gradientColor1: e.target.value })}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300 dark:border-zinc-700"
                      />
                      <input
                        type="text"
                        value={config.gradientColor1}
                        onChange={(e) => setConfig({ ...config, gradientColor1: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Gradient End
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.gradientColor2}
                        onChange={(e) => setConfig({ ...config, gradientColor2: e.target.value })}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300 dark:border-zinc-700"
                      />
                      <input
                        type="text"
                        value={config.gradientColor2}
                        onChange={(e) => setConfig({ ...config, gradientColor2: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-zinc-400">Type:</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, gradientType: 'linear' })}
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                        config.gradientType === 'linear'
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      Linear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, gradientType: 'radial' })}
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                        config.gradientType === 'radial'
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      Radial
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-zinc-400">Rotation:</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={config.gradientRotation}
                      onChange={(e) => setConfig({ ...config, gradientRotation: Number(e.target.value) })}
                      className="w-24 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{config.gradientRotation}°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Background Color & Transparency */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Background Canvas Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={config.bgTransparent}
                    value={config.bgColor}
                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer border border-slate-300 dark:border-zinc-700 disabled:opacity-40"
                  />
                  <input
                    type="text"
                    disabled={config.bgTransparent}
                    value={config.bgColor}
                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                    className="w-28 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-mono uppercase disabled:opacity-40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-zinc-300 mt-4">
                <input
                  type="checkbox"
                  checked={config.bgTransparent}
                  onChange={(e) => setConfig({ ...config, bgTransparent: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Transparent Background (PNG/SVG only)</span>
              </label>
            </div>
          </div>

          {/* Size, Quiet Zone & Error Correction */}
          <div className="bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  <span>Quiet Zone (Margin)</span>
                  <span className="font-mono">{config.qrMargin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={config.qrMargin}
                  onChange={(e) => setConfig({ ...config, qrMargin: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { level: 'L', label: 'L (7%)' },
                    { level: 'M', label: 'M (15%)' },
                    { level: 'Q', label: 'Q (25%)' },
                    { level: 'H', label: 'H (30%)' },
                  ].map((ec) => (
                    <button
                      key={ec.level}
                      type="button"
                      onClick={() => setConfig({ ...config, errorCorrection: ec.level as ErrorCorrectionLevel })}
                      className={`py-1.5 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                        config.errorCorrection === ec.level
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400'
                          : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {ec.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LOGO & ICON EMBEDDING */}
      {/* ============================================================== */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          {/* Preset Brand Logos for India */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
              Popular Indian Payment & App Presets
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {PRESET_LOGOS.map((item) => {
                const isSelected = config.logoUrl === item.svgDataUri
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        logoUrl: item.svgDataUri,
                        errorCorrection: item.id === 'none' ? prev.errorCorrection : 'Q',
                      }))
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-white/70 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center p-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs">
                      {item.svgDataUri ? (
                        <img src={item.svgDataUri} alt={item.name} className="w-7 h-7 object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">None</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Upload Custom Shop Logo */}
          <div className="bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                Custom Shop Logo / Photo
              </span>
              {config.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={logoFileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />

            {config.logoUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <img src={config.logoUrl} alt="Selected Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                    Logo Active in QR Code
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Background dots behind the logo are automatically cleared.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onClick={() => logoFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-indigo-500" />
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-200 mb-1">
                  Upload Custom Logo (PNG, JPG, SVG)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Recommended: Transparent PNG or crisp vector SVG square logo
                </p>
              </div>
            )}

            {/* Logo Size and Margin Sliders (if logo active) */}
            {config.logoUrl && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      <span>Logo Scale</span>
                      <span className="font-mono">{Math.round(config.logoSize * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="0.45"
                      step="0.02"
                      value={config.logoSize}
                      onChange={(e) => setConfig({ ...config, logoSize: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      <span>Logo Margin (Padding)</span>
                      <span className="font-mono">{config.logoMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      value={config.logoMargin}
                      onChange={(e) => setConfig({ ...config, logoMargin: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-zinc-300 pt-1">
                  <input
                    type="checkbox"
                    checked={config.hideBackgroundDots}
                    onChange={(e) => setConfig({ ...config, hideBackgroundDots: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Hide background QR dots directly behind the logo badge</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
