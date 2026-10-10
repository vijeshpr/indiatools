import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, Zap, Compass, FileText, ArrowRight, ShieldCheck } from 'lucide-react'
import { calculateMileage, calculateAcCost, convertLandArea } from '../../lib/calculations'
import { convertAmountToWords, formatInr } from '../../lib/cheque/amountToWords'
import { LANGUAGES } from '../../lib/cheque/languages'
import { SupportedLanguage } from '../../lib/cheque/types'

export const LiveMiniCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mileage' | 'ac' | 'land' | 'cheque'>('mileage')

  // Tab 1: Mileage
  const [distanceKm, setDistanceKm] = useState<number>(465)
  const [fuelLitres, setFuelLitres] = useState<number>(25)
  const [fuelPrice, setFuelPrice] = useState<number>(102)

  const mileageResult = useMemo(() => {
    return calculateMileage(distanceKm, fuelLitres, fuelPrice)
  }, [distanceKm, fuelLitres, fuelPrice])

  // Tab 2: AC Cost
  const [tonnage, setTonnage] = useState<1 | 1.5 | 2>(1.5)
  const [acHours, setAcHours] = useState<number>(8)
  const unitTariff = 8.5

  const acResult = useMemo(() => {
    return calculateAcCost(tonnage, 5, true, acHours, unitTariff)
  }, [tonnage, acHours, unitTariff])

  // Tab 3: Land
  const [centValue, setCentValue] = useState<number>(5.5)

  const landResult = useMemo(() => {
    return convertLandArea(centValue, 'cent')
  }, [centValue])

  // Tab 4: Cheque Studio Mini Demo
  const [chequePayee, setChequePayee] = useState<string>('Ramesh Kumar')
  const [chequeAmount, setChequeAmount] = useState<number | string>(50000)
  const [chequeLang, setChequeLang] = useState<SupportedLanguage>('hi')

  const parsedChequeAmount = useMemo(() => {
    if (typeof chequeAmount === 'string') {
      const parsed = parseFloat(chequeAmount)
      return isNaN(parsed) ? 0 : Math.max(0, parsed)
    }
    return Math.max(0, chequeAmount || 0)
  }, [chequeAmount])

  const chequeWordsResult = useMemo(() => {
    return convertAmountToWords(parsedChequeAmount, 0, chequeLang)
  }, [parsedChequeAmount, chequeLang])

  // Today's date digits for mini demo cheque
  const todayParts = useMemo(() => {
    const d = new Date()
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear())
    return [day[0], day[1], month[0], month[1], year[0], year[1], year[2], year[3]]
  }, [])

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-white/10 light:border-slate-200 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('mileage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'mileage'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm shadow-orange-500/10'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Vehicle Mileage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ac')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'ac'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-sm shadow-blue-500/10'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AC Power Cost</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('land')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'land'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cent ↔ Sq.ft</span>
          </button>

          {/* New 4th Tab: Indian Cheque Studio */}
          <button
            type="button"
            onClick={() => setActiveTab('cheque')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeTab === 'cheque'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cheque Demo</span>
            <span className="text-[9px] font-mono font-bold bg-amber-500/25 text-amber-300 px-1.5 py-0.2 rounded-full uppercase">
              13 Lang
            </span>
          </button>
        </div>

        <Link
          to={
            activeTab === 'mileage'
              ? '/calculators/vehicle-mileage'
              : activeTab === 'ac'
              ? '/calculators/ac-electricity-cost'
              : activeTab === 'land'
              ? '/calculators/cent-to-sqft'
              : '/calculators/indian-cheque-studio'
          }
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>{activeTab === 'cheque' ? 'Open Cheque Studio' : 'Open Full Tool'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'mileage' && (
          <motion.div
            key="mileage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
                  <span>Distance Travelled</span>
                  <span className="font-mono text-orange-400 font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="900"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
                  <span>Fuel Consumed (Litres)</span>
                  <span className="font-mono text-orange-400 font-bold">{fuelLitres} Litres</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={fuelLitres}
                  onChange={(e) => setFuelLitres(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">Fuel Rate:</span>
                <div className="flex gap-2">
                  {[90, 102, 106].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFuelPrice(rate)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border transition-colors ${
                        fuelPrice === rate
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      ₹{rate}/L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Fuel Economy
              </span>
              <div className="text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {mileageResult.mileageKmPerL}
                <span className="text-lg text-neutral-400 font-normal"> km/L</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Cost / Km</span>
                  <span className="font-mono text-amber-400 font-bold">₹{mileageResult.fuelCostPerKm}/km</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">Total Fuel Bill</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">₹{Math.round(fuelLitres * fuelPrice)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ac' && (
          <motion.div
            key="ac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 mb-1.5 font-medium">AC Capacity</label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 1.5, 2] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTonnage(t)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        tonnage === t ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {t} Ton
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 mb-1.5 font-medium">
                  <span>Daily Run Time</span>
                  <span className="font-mono text-blue-400 font-bold">{acHours} Hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={acHours}
                  onChange={(e) => setAcHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Electricity Tariff:</span>
                <span className="font-mono font-bold text-white">₹{unitTariff} / unit</span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Monthly AC Bill
              </span>
              <div className="text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{acResult.monthlyCostRs.toLocaleString('en-IN')}
                <span className="text-sm text-neutral-400 font-normal"> / mo</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Daily Expense</span>
                  <span className="font-mono text-blue-400 font-bold">₹{acResult.dailyCostRs}/day</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">Monthly Power</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">{acResult.monthlyUnitsKwh} Units</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'land' && (
          <motion.div
            key="land"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 mb-1.5 font-medium">
                  <span>Cent Measurement</span>
                  <span className="font-mono text-emerald-400 font-bold">{centValue} Cents</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={centValue}
                  onChange={(e) => setCentValue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                {[3, 5, 8, 10, 20].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCentValue(c)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-all ${
                      centValue === c ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {c} Cents
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Square Feet Equivalent
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {landResult.sqft.toLocaleString('en-IN')}
                <span className="text-sm text-neutral-400 font-normal"> sq.ft</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">In Acres</span>
                  <span className="font-mono text-emerald-400 font-bold">{landResult.acre} Acres</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">In Gunthas</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">{landResult.guntha} Gunthas</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: CHEQUE DEMO SANDBOX ================= */}
        {activeTab === 'cheque' && (
          <motion.div
            key="cheque"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-6 items-start"
          >
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-5 space-y-3.5">
              {/* Payee Name Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 font-semibold mb-1">
                  Payee / Beneficiary Name
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={chequePayee}
                  onChange={(e) => setChequePayee(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-white light:text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Rupee Amount Input */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-1">
                  <span className="uppercase font-semibold">Amount (₹)</span>
                  <span className="text-emerald-400 font-bold">{formatInr(parsedChequeAmount)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="10000000"
                    value={chequeAmount}
                    onChange={(e) => setChequeAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[10000, 25000, 50000, 100000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChequeAmount(amt)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                        parsedChequeAmount === amt
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector for Live Conversion */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 font-semibold mb-1">
                  Convert Words in Indian Language (13 Scripts)
                </label>
                <select
                  value={chequeLang}
                  onChange={(e) => setChequeLang(e.target.value as SupportedLanguage)}
                  className="w-full bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-white light:text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Security Pill Indicators */}
              <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CTS-2010 Specimen</span>
                </div>
                <span className="font-mono text-amber-400 text-[10px]">A/C Payee Crossed</span>
              </div>
            </div>

            {/* Right Column: Mini CTS-2010 Demo Cheque Specimen */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-[540px] rounded-xl border border-slate-400/80 bg-[#F4F9F9] text-slate-900 shadow-xl overflow-hidden font-serif select-none relative p-3 sm:p-4 text-xs">
                {/* Bank Header Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#004B87]" />

                {/* Prominent Diagonal Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.14] select-none z-10">
                  <span className="text-2xl sm:text-3xl font-black uppercase tracking-[0.25em] -rotate-12 text-slate-800 text-center leading-tight">
                    DEMO — NOT A VALID CHEQUE
                  </span>
                </div>

                {/* Account Payee Crossing (Top Left) */}
                <div className="absolute top-2 left-2 pointer-events-none z-20">
                  <div className="w-20 h-10 border-b-2 border-r-2 border-slate-900 -rotate-45 -translate-x-6 -translate-y-2 flex items-center justify-center">
                    <span className="text-[7px] font-sans font-black tracking-tighter text-slate-950">
                      A/C PAYEE ONLY
                    </span>
                  </div>
                </div>

                {/* Bank Title & Date Row */}
                <div className="flex items-start justify-between pl-6 sm:pl-8 mb-2">
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-[#004B87] uppercase font-sans tracking-tight">
                      State Bank of India
                    </h4>
                    <p className="text-[9px] text-slate-600 font-sans">
                      Sansad Marg Branch • IFSC: SBIN0000691
                    </p>
                  </div>

                  {/* Date Grid */}
                  <div className="text-right">
                    <span className="text-[8px] font-sans font-bold text-slate-500 uppercase block mb-0.5">
                      DATE / दिनांक
                    </span>
                    <div className="flex items-center gap-0.5 font-mono text-[10px] font-bold text-slate-900">
                      {todayParts.map((char, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-4 border border-slate-500 flex items-center justify-center bg-white"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cheque Body: Payee */}
                <div className="mt-2 space-y-2 font-sans text-[11px]">
                  <div className="flex items-end gap-1.5 border-b border-dotted border-slate-600 pb-0.5">
                    <span className="font-bold text-slate-700 whitespace-nowrap text-[10px] font-serif">
                      PAY / अदा करें :
                    </span>
                    <span className="font-bold text-slate-950 font-serif text-xs truncate flex-1">
                      {chequePayee || <span className="text-slate-400 italic font-sans">Name of Payee</span>}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 whitespace-nowrap">
                      OR BEARER
                    </span>
                  </div>

                  {/* Rupees in Words */}
                  <div className="border-b border-dotted border-slate-600 pb-0.5">
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-slate-700 whitespace-nowrap text-[10px] font-serif shrink-0">
                        RUPEES / रुपये :
                      </span>
                      <span className="font-semibold text-slate-950 font-serif text-[11px] leading-snug break-words">
                        {chequeWordsResult.words} {chequeWordsResult.words !== 'Zero Rupees Only' && '//'}
                      </span>
                    </div>
                  </div>

                  {/* ₹ Numeric Box & Signature Row */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Amount Box */}
                    <div className="flex items-center border border-slate-800 bg-white rounded px-2.5 py-1 shadow-sm">
                      <span className="text-xs font-black text-slate-900 mr-1.5 font-sans">₹</span>
                      <span className="text-xs font-black font-mono text-slate-950">
                        {chequeWordsResult.formattedInr.replace('₹ ', '')} /-
                      </span>
                    </div>

                    {/* Authorised Signatory */}
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-slate-700 uppercase">
                        FOR PRIYA SHARMA
                      </div>
                      <div className="text-[8px] text-slate-400 italic">
                        Authorised Signatory
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom MICR Decorative Band */}
                <div className="mt-2.5 pt-1 border-t border-slate-300 text-center font-mono text-[9px] text-slate-700 tracking-wider">
                  ⑈ 123456 ⑈ 560002015 ⑆ 000123 ⑈ 10 • CTS-2010 SPECIMEN
                </div>
              </div>

              {/* CTA link to Full Cheque Studio */}
              <div className="mt-3 flex items-center justify-between w-full max-w-[540px] text-xs">
                <span className="text-neutral-400 text-[11px]">
                  Need 31 Indian banks, print export & validation?
                </span>
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
                >
                  <span>Open Full Cheque Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
