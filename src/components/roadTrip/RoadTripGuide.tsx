import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Fuel,
  CreditCard,
  Users,
  ChevronDown,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'

export const RoadTripGuide: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How are FASTag highway toll charges estimated on Indian national expressways?',
      a: 'NHAI (National Highways Authority of India) determines toll charges based on expressway category and vehicle axle classification. For standard 4-lane and 6-lane access-controlled national expressways, passenger cars, jeeps, and vans average between ₹1.80 and ₹2.10 per kilometer. Motorcycles (2-wheelers) are completely toll-exempt on standard national highways, while 2-axle commercial buses average ₹6.60/km and heavy multi-axle trucks average ₹7.10/km.',
    },
    {
      q: 'Does NHAI offer a discount on return journey toll charges?',
      a: 'Yes. Under standard NHAI rules, a 25% discount is automatically applied to your return toll if you cross the same toll plaza within 24 hours of your initial passage using an active FASTag. If your return trip occurs beyond 24 hours, the standard one-way toll rate applies in both directions.',
    },
    {
      q: 'Are motorcycles and two-wheelers required to pay toll on Indian expressways?',
      a: 'On standard NHAI National Highways, two-wheelers are 100% exempt from toll fees. However, note that certain newly built access-controlled expressways (such as the Delhi-Mumbai Expressway and Bengaluru-Mysuru Expressway) legally prohibit two-wheelers, three-wheelers, and slow-moving vehicles from entering the main carriageway for safety reasons, directing them to toll-free service lanes.',
    },
    {
      q: 'What happens if my FASTag has low balance when approaching a toll plaza?',
      a: 'Under Ministry of Road Transport & Highways (MoRTH) rules, if your FASTag wallet balance is insufficient or blacklisted, the toll plaza boom barrier will not lift. Passing through a designated FASTag lane with an invalid or depleted tag incurs a penalty charge equal to double the standard toll amount in cash.',
    },
    {
      q: 'How should friends split highway road trip expenses fairly?',
      a: 'The most transparent method is to calculate the total pooled highway outflow (Fuel + FASTag Tolls + Shared Dhaba Meals + Hotel Stays) and divide equally by the total number of travellers. IndiaTools Road Trip Planner provides this exact per-person share figure so you can settle accounts seamlessly via UPI without manual spreadsheets.',
    },
    {
      q: 'Can electric vehicles (EVs) take long-distance highway road trips in India?',
      a: 'Yes. Major Indian highway corridors (such as Delhi-Jaipur, Mumbai-Pune-Goa, and Bengaluru-Chennai) now feature 60kW to 120kW DC fast chargers every 50 to 80 km at highway dhabas, food malls, and BPCL/IOCL/HPCL fuel bunks. At ~₹16–22 per kWh, highway EV running costs average ₹2.50–3.20/km, which is nearly 60% lower than petrol.',
    },
  ]

  const relatedTools = [
    {
      slug: 'fuel-cost',
      title: 'Fuel Cost Calculator',
      desc: 'Estimate exact petrol, diesel, and CNG cost per kilometer.',
      badge: 'Core Tool',
    },
    {
      slug: 'vehicle-mileage',
      title: 'Vehicle Mileage Calculator',
      desc: 'Calculate tank-to-tank fuel efficiency under highway conditions.',
      badge: 'Essential',
    },
    {
      slug: 'monthly-vehicle-running-cost',
      title: 'Monthly Running Cost',
      desc: 'Budget EMI, insurance, fuel and service expenses per month.',
      badge: 'Ownership',
    },
    {
      slug: 'petrol-vs-diesel',
      title: 'Petrol vs Diesel Calculator',
      desc: 'Compare running cost and payback distance on high-mileage drives.',
      badge: 'Comparison',
    },
    {
      slug: 'ev-vs-petrol',
      title: 'EV vs Petrol Running Cost',
      desc: 'Analyze electricity savings vs petrol expenses on Indian roads.',
      badge: 'EV Hub',
    },
  ]

  return (
    <div className="space-y-8 mt-12 no-print">
      {/* 4 Informational Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Route Planning */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                How to Plan an Indian Road Trip
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Route, timings & safety inspection
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Long-distance highway travel across India requires strategic planning around early morning starts (typically 4:30 AM – 5:30 AM to bypass urban exit congestion), pre-trip tire pressure checks (including the spare), coolant levels, and wiper blades before monsoon drives.
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Plan rest breaks every 2.5 to 3 hours or 200 km to combat highway driver fatigue.</li>
            <li>Download offline Google Maps / MapmyIndia for ghat sections with weak cell coverage.</li>
            <li>Keep a minimum ₹1,500 FASTag balance linked to auto-top-up before leaving.</li>
          </ul>
        </div>

        {/* Card 2: Fuel Consumption */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                How Fuel Cost is Calculated
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Mathematical formula & highway factors
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 mb-3">
            Fuel Required (L) = Total Distance (km) ÷ Highway Mileage (km/L)
            <br />
            Fuel Cost (₹) = Fuel Required (L) × Fuel Price (₹/L)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Cruising smoothly at 80–90 km/h in top gear delivers 15–20% superior fuel economy compared to aggressive acceleration above 110 km/h with repeated hard braking for highway speed-breakers and truck overtaking maneuvers.
          </p>
        </div>

        {/* Card 3: FASTag Transparency */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Toll Estimation Transparency
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Standard NHAI expressway benchmarks
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            This tool uses published NHAI (National Highways Authority of India) four/six-lane access-controlled rate averages. Because individual state highway tolls, municipal flyover entry taxes, and concessionaire BOT rates vary by specific stretch, our tool provides an automatic per-km baseline while enabling full manual adjustment.
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
            <strong>Toll Disclaimer:</strong> Figures are accurate model estimates based on standard national highway norms. Always check your NETC FASTag wallet app for live transaction deductions.
          </div>
        </div>

        {/* Card 4: Expense Splitting */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Splitting Expenses Fairly
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                No awkward end-of-trip calculations
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            The simplest road trip strategy is appointing a single "Trip Treasurer" who maintains the FASTag account and pays dhaba fuel bills. At the conclusion of the drive, the total outflow is split by the number of friends.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            If the vehicle owner provides their personal car, it is customary across Indian road-trip culture for friends to cover all fuel, tolls, and food, or omit the vehicle owner from the fuel split to balance tire wear and servicing costs.
          </p>
        </div>
      </div>

      {/* Expandable FAQs Accordion */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions About Indian Road Trips
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified rules on FASTag, national expressways, vehicle classes & safety
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* Related Tools Recommendation */}
      <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Indian Automotive Calculators
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Combine tools for deeper fleet, fuel, and trip budgeting
            </p>
          </div>
          <Link
            to="/category/drive"
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1"
          >
            <span>View All Drive Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              to={`/calculators/${t.slug}`}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 transition-all flex flex-col justify-between group shadow-xs hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Calculate now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
