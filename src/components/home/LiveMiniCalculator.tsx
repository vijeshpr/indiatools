import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, Zap, Compass, FileText, ArrowRight, ShieldCheck } from 'lucide-react'
import { calculateMileage, calculateAcCost, convertLandArea } from '../../lib/calculations'
import { convertAmountToWords } from '../../lib/cheque/amountToWords'
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
    <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('mileage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mileage'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vehicle Mileage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ac')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ac'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>AC Power Cost</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('land')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'land'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cent ↔ Sq.ft</span>
          </button>

          {/* 4th Tab: Indian Cheque Studio */}
          <button
            type="button"
            onClick={() => setActiveTab('cheque')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cheque'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cheque Demo</span>
            <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded uppercase">
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
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>{activeTab === 'cheque' ? 'Open Cheque Studio' : 'Open Full Tool'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dynamic Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'mileage' && (
          <motion.div
            key="mileage"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Input sliders & values */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Distance Travelled</span>
                  <span className="font-mono text-indigo-600">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Fuel Filled</span>
                  <span className="font-mono text-indigo-600">{fuelLitres} Litres</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={fuelLitres}
                  onChange={(e) => setFuelLitres(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Fuel Price</span>
                  <span className="font-mono text-indigo-600">₹{fuelPrice} / L</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="115"
                  step="1"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Panel */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-indigo-700 tracking-wider">
                  Calculated Mileage
                </span>
                <div className="text-4xl font-black text-slate-900 mt-1">
                  {mileageResult.mileageKmPerL.toFixed(1)}{' '}
                  <span className="text-sm font-semibold text-slate-500">km/L</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Cost / km</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{mileageResult.costPerKm.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Fuel</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{(fuelLitres * fuelPrice).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ac' && (
          <motion.div
            key="ac"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  AC Tonnage Capacity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 1.5, 2] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTonnage(t)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        tonnage === t
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t} Ton AC
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Daily Usage</span>
                  <span className="font-mono text-indigo-600">{acHours} Hours / day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={acHours}
                  onChange={(e) => setAcHours(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-5 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-indigo-700 tracking-wider">
                  Monthly Power Cost
                </span>
                <div className="text-4xl font-black text-slate-900 mt-1">
                  ₹{Math.round(acResult.monthlyCostRs)}{' '}
                  <span className="text-sm font-semibold text-slate-500">/ mo</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Daily Bill</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{acResult.dailyCostRs.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Units (kWh)</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {acResult.dailyUnitsKwh.toFixed(1)} u/day
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'land' && (
          <motion.div
            key="land"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Land Measure in Cents (Cent)</span>
                  <span className="font-mono text-indigo-600">{centValue} Cents</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={centValue}
                  onChange={(e) => setCentValue(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {[3, 5, 5.5, 10, 20].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setCentValue(quick)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium cursor-pointer"
                  >
                    {quick} cent
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-indigo-700 tracking-wider">
                  Square Feet Area
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  {Math.round(landResult.sqft).toLocaleString('en-IN')}{' '}
                  <span className="text-sm font-semibold text-slate-500">Sq.ft</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Sq. Yards (Gaj)</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {Math.round(landResult.sqft / 9).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Acres</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {landResult.acre.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Cheque Studio Mini Demo */}
        {activeTab === 'cheque' && (
          <motion.div
            key="cheque"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payee Name
                </label>
                <input
                  type="text"
                  value={chequePayee}
                  onChange={(e) => setChequePayee(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount in Rupees (₹)
                </label>
                <input
                  type="number"
                  value={chequeAmount}
                  onChange={(e) => setChequeAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-colors"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[5000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChequeAmount(amt)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        parsedChequeAmount === amt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Convert Words in Indian Language (13 Scripts)
                </label>
                <select
                  value={chequeLang}
                  onChange={(e) => setChequeLang(e.target.value as SupportedLanguage)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-colors cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>CTS-2010 Specimen</span>
                </div>
                <span className="font-mono text-indigo-700 font-semibold text-[11px]">
                  A/C Payee Only
                </span>
              </div>
            </div>

            {/* Right Column: Specimen Preview */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-[540px] rounded-xl border border-slate-300 bg-[#FAFBFB] text-slate-900 shadow-sm overflow-hidden font-serif select-none relative p-3 sm:p-4 text-xs">
                {/* Bank Header Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#004B87]" />

                {/* Diagonal Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.14] select-none z-10">
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] -rotate-12 text-slate-800 text-center leading-tight">
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

                  <div className="text-right">
                    <span className="text-[8px] font-sans font-bold text-slate-500 uppercase block mb-0.5">
                      DATE / दिनांक
                    </span>
                    <div className="flex items-center gap-0.5 font-mono text-[10px] font-bold text-slate-900">
                      {todayParts.map((char, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-4 border border-slate-400 flex items-center justify-center bg-white"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cheque Body: Payee */}
                <div className="mt-2 space-y-2 font-sans text-[11px]">
                  <div className="flex items-end gap-1.5 border-b border-dotted border-slate-400 pb-0.5">
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
                  <div className="border-b border-dotted border-slate-400 pb-0.5">
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-slate-700 whitespace-nowrap text-[10px] font-serif shrink-0">
                        RUPEES / रुपये :
                      </span>
                      <span className="font-semibold text-slate-950 font-serif text-[11px] leading-snug break-words">
                        {chequeWordsResult.words} {chequeWordsResult.words !== 'Zero Rupees Only' && '//'}
                      </span>
                    </div>
                  </div>

                  {/* ₹ Numeric Box & Signature */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-slate-800 bg-white rounded px-2.5 py-1 shadow-2xs">
                      <span className="text-xs font-black text-slate-900 mr-1.5 font-sans">₹</span>
                      <span className="text-xs font-black font-mono text-slate-950">
                        {chequeWordsResult.formattedInr.replace('₹ ', '')} /-
                      </span>
                    </div>

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

                {/* Bottom MICR Strip */}
                <div className="mt-2.5 pt-1 border-t border-slate-200 text-center font-mono text-[9px] text-slate-600 tracking-wider">
                  ⑈ 123456 ⑈ 560002015 ⑆ 000123 ⑈ 10 • CTS-2010 SPECIMEN
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-[540px] gap-3">
                <span className="text-slate-500 text-xs text-center sm:text-left">
                  Includes 31 Indian banks, official IFSC codes & 1-click A4 PDF export.
                </span>
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
                >
                  <span>Launch Cheque Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
