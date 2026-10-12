import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShieldCheck, Zap, Calculator, Sparkles, Navigation, ArrowDown } from 'lucide-react'

export const HighwayHero: React.FC = () => {
  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById('calculator-form')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#060B16] border border-cyan-500/25 shadow-2xl mb-8 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Sky Ambient Radial Gradients */}
        <div className="absolute -top-20 left-1/4 w-[550px] h-[380px] bg-sky-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[380px] bg-cyan-500/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[650px] h-[220px] bg-amber-500/15 rounded-full blur-[110px]" />

        {/* Cinematic SVG Indian Expressway Backdrop */}
        <svg
          viewBox="0 0 1200 480"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full opacity-75 dark:opacity-85"
        >
          <defs>
            {/* Twilight to Sunset Sky Gradient */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#040812" />
              <stop offset="45%" stopColor="#0A162C" />
              <stop offset="72%" stopColor="#1B2640" />
              <stop offset="85%" stopColor="#4A1D36" />
              <stop offset="93%" stopColor="#9A3412" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Sunset Clouds Gradient */}
            <linearGradient id="sunsetClouds" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C026D3" stopOpacity="0.25" />
            </linearGradient>

            {/* Western Ghats Mountain Silhouette 1 (Far Peaks) */}
            <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E243A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0A1022" stopOpacity="0.95" />
            </linearGradient>

            {/* Western Ghats Mountain Silhouette 2 (Mid Ridges) */}
            <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121D32" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#060C1A" stopOpacity="1" />
            </linearGradient>

            {/* 6-Lane Expressway Asphalt Gradient */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="35%" stopColor="#111827" />
              <stop offset="100%" stopColor="#060A12" />
            </linearGradient>

            {/* NHAI Standard Green Sign Gradient */}
            <linearGradient id="nhaiGreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Indian Tricolour Ribbon Gradient for Toll Canopy Fascia */}
            <linearGradient id="tricolorAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="38%" stopColor="#FF9933" />
              <stop offset="42%" stopColor="#FFFFFF" />
              <stop offset="58%" stopColor="#FFFFFF" />
              <stop offset="62%" stopColor="#138808" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowGreen" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowRed" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowAmber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Deep Sunset Sky */}
          <rect width="1200" height="480" fill="url(#skyGrad)" />

          {/* Atmospheric Sunset Clouds */}
          <path
            d="M50 140 Q200 110 400 135 T800 120 T1150 130 L1200 170 L0 170 Z"
            fill="url(#sunsetClouds)"
          />
          <path
            d="M200 170 Q450 145 700 160 T1100 150 L1200 200 L100 200 Z"
            fill="url(#sunsetClouds)"
            opacity="0.5"
          />

          {/* Distant Twilight Stars */}
          <circle cx="120" cy="40" r="1.2" fill="#F8FAFC" opacity="0.8" />
          <circle cx="260" cy="65" r="1.5" fill="#F8FAFC" opacity="0.9" />
          <circle cx="410" cy="35" r="1.0" fill="#F8FAFC" opacity="0.6" />
          <circle cx="670" cy="50" r="1.4" fill="#F8FAFC" opacity="0.8" />
          <circle cx="890" cy="38" r="1.2" fill="#F8FAFC" opacity="0.7" />
          <circle cx="1060" cy="60" r="1.6" fill="#F8FAFC" opacity="0.9" />

          {/* 2. Western Ghats Mountain Silhouettes (Layer 1 - Far Sahyadri Peaks) */}
          <path
            d="M0 260 Q160 180 340 225 T700 190 T1020 220 Q1120 195 1200 240 L1200 320 L0 320 Z"
            fill="url(#mountainFar)"
          />

          {/* Layer 2 - Near Ghat Ridges & Valley Slopes */}
          <path
            d="M0 275 Q140 235 300 265 T640 240 T940 258 Q1090 242 1200 278 L1200 340 L0 340 Z"
            fill="url(#mountainMid)"
          />

          {/* Golden Horizon Glow Line */}
          <line x1="0" y1="295" x2="1200" y2="295" stroke="#F59E0B" strokeWidth="1.5" opacity="0.45" />

          {/* 3. Six-Lane National Highway (Perspective Vanishing to x=600, y=280) */}
          <polygon points="560,280 640,280 1180,480 20,480" fill="url(#roadGrad)" />

          {/* Highway Shoulders / White Border Lines */}
          <line x1="560" y1="280" x2="20" y2="480" stroke="#E2E8F0" strokeWidth="4.5" opacity="0.9" />
          <line x1="640" y1="280" x2="1180" y2="480" stroke="#E2E8F0" strokeWidth="4.5" opacity="0.9" />

          {/* Left Yellow Safety Line */}
          <line x1="572" y1="280" x2="160" y2="480" stroke="#F59E0B" strokeWidth="3" opacity="0.85" />

          {/* Right Yellow Safety Line */}
          <line x1="628" y1="280" x2="1040" y2="480" stroke="#F59E0B" strokeWidth="3" opacity="0.85" />

          {/* Central Concrete Median Barrier */}
          <polygon points="598,280 602,280 605,480 595,480" fill="#334155" />
          <polygon points="597,280 603,280 607,480 593,480" stroke="#0284C7" strokeWidth="1" opacity="0.5" />

          {/* Lane Dashed Lines with Smooth Animation */}
          {/* Lane Divider 1 (Left Carriageway) */}
          <line
            x1="585"
            y1="280"
            x2="370"
            y2="480"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="14 20"
            className="animate-highway-dashes"
            opacity="0.85"
          />

          {/* Lane Divider 2 (Right Carriageway) */}
          <line
            x1="615"
            y1="280"
            x2="830"
            y2="480"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="14 20"
            className="animate-highway-dashes"
            opacity="0.85"
          />

          {/* 4. Modern Indian Highway Multi-Lane Toll Plaza Structure */}
          {/* Toll Plaza Canopy Roof (Vanishing perspective near y=210 to y=240) */}
          <g transform="translate(0, 5)">
            {/* Canopy Pillars */}
            <rect x="420" y="220" width="8" height="60" fill="#475569" />
            <rect x="500" y="220" width="7" height="60" fill="#334155" />
            <rect x="580" y="220" width="8" height="60" fill="#334155" />
            <rect x="660" y="220" width="8" height="60" fill="#334155" />
            <rect x="740" y="220" width="8" height="60" fill="#475569" />

            {/* Main Overhead Canopy Fascia */}
            <polygon points="380,210 780,210 770,225 390,225" fill="#1E293B" stroke="#64748B" strokeWidth="1" />

            {/* Indian Tricolour LED Ribbon along Toll Canopy Edge */}
            <rect x="382" y="210" width="396" height="3" fill="url(#tricolorAccent)" filter="url(#glowAmber)" />

            {/* Toll Booth Cabins at Ground Level */}
            <rect x="445" y="252" width="16" height="24" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <rect x="525" y="252" width="16" height="24" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <rect x="605" y="252" width="16" height="24" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <rect x="685" y="252" width="16" height="24" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />

            {/* Booth Glass Windows */}
            <rect x="447" y="255" width="12" height="10" rx="1" fill="#38BDF8" fillOpacity="0.4" />
            <rect x="527" y="255" width="12" height="10" rx="1" fill="#38BDF8" fillOpacity="0.4" />
            <rect x="607" y="255" width="12" height="10" rx="1" fill="#38BDF8" fillOpacity="0.4" />
            <rect x="687" y="255" width="12" height="10" rx="1" fill="#38BDF8" fillOpacity="0.4" />

            {/* Toll Boom Barrier Arms (Automated FASTag lifted/ready) */}
            <line x1="461" y1="266" x2="495" y2="256" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="541" y1="266" x2="575" y2="256" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="621" y1="266" x2="655" y2="256" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="701" y1="266" x2="735" y2="256" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />

            {/* Overhead Lane FASTag Illuminated LED Indicators */}
            {/* Lane 1 FASTag Active */}
            <rect x="455" y="213" width="38" height="10" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <circle cx="461" cy="218" r="2" fill="#10B981" filter="url(#glowGreen)" />
            <text x="477" y="220" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FASTag ✓
            </text>

            {/* Lane 2 FASTag Active */}
            <rect x="535" y="213" width="38" height="10" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <circle cx="541" cy="218" r="2" fill="#10B981" filter="url(#glowGreen)" />
            <text x="557" y="220" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FASTag ✓
            </text>

            {/* Lane 3 FASTag Active */}
            <rect x="615" y="213" width="38" height="10" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <circle cx="621" cy="218" r="2" fill="#10B981" filter="url(#glowGreen)" />
            <text x="637" y="220" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FASTag ✓
            </text>

            {/* Lane 4 FASTag Active */}
            <rect x="695" y="213" width="38" height="10" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <circle cx="701" cy="218" r="2" fill="#10B981" filter="url(#glowGreen)" />
            <text x="717" y="220" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FASTag ✓
            </text>
          </g>

          {/* 5. Overhead NHAI Green Gantry Sign */}
          {/* Steel Lattice Towers */}
          <rect x="420" y="145" width="5" height="75" fill="#475569" />
          <rect x="765" y="145" width="5" height="75" fill="#475569" />
          <rect x="415" y="145" width="355" height="6" fill="#334155" />

          {/* Gantry Sign 1 (NH 48 Expressway & FASTag) */}
          <rect x="430" y="105" width="160" height="42" rx="4" fill="url(#nhaiGreen)" stroke="#FFFFFF" strokeWidth="1.8" />
          <text x="510" y="120" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            NH 48 • FASTag TOLL PLAZA
          </text>
          <text x="510" y="132" fill="#FEF08A" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            ALL LANES 100% CASHLESS
          </text>
          <text x="510" y="142" fill="#A7F3D0" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle">
            KEEP 50M DISTANCE ➔
          </text>

          {/* Gantry Sign 2 (Speed Limit & Expressway Regulations) */}
          <rect x="600" y="105" width="160" height="42" rx="4" fill="url(#nhaiGreen)" stroke="#FFFFFF" strokeWidth="1.8" />
          <text x="680" y="120" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            NATIONAL HIGHWAY CORRIDOR
          </text>
          <text x="680" y="132" fill="#FFFFFF" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">
            MAX SPEED: 100 KM/H
          </text>
          <text x="680" y="142" fill="#FEF08A" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            HAVE A SAFE JOURNEY
          </text>

          {/* Overhead Green RFID Beacons */}
          <circle cx="475" cy="148" r="2.5" fill="#10B981" filter="url(#glowGreen)" />
          <circle cx="550" cy="148" r="2.5" fill="#10B981" filter="url(#glowGreen)" />
          <circle cx="645" cy="148" r="2.5" fill="#10B981" filter="url(#glowGreen)" />
          <circle cx="720" cy="148" r="2.5" fill="#10B981" filter="url(#glowGreen)" />

          {/* 6. Touring Motorcycle in Perspective on Lane 1 */}
          <g transform="translate(465, 335) scale(0.95)">
            {/* Ground Shadow */}
            <ellipse cx="20" cy="54" rx="28" ry="4" fill="#000000" fillOpacity="0.6" />
            {/* Spoked Rear Wheel */}
            <circle cx="20" cy="46" r="10" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
            <circle cx="20" cy="46" r="4" fill="#94A3B8" />
            {/* Upswept Exhaust Pipe */}
            <path d="M14 44 L28 42" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            {/* Dual Adventure Panniers (Luggage Boxes) */}
            <rect x="2" y="32" width="12" height="15" rx="1.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <rect x="26" y="32" width="12" height="15" rx="1.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            {/* Top Box / Rack */}
            <rect x="12" y="24" width="16" height="10" rx="1" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            {/* Touring Rider Silhouette */}
            {/* Torso & Riding Jacket */}
            <path d="M12 24 C14 16, 26 16, 28 24 Z" fill="#0F172A" />
            <line x1="14" y1="18" x2="26" y2="18" stroke="#38BDF8" strokeWidth="1" />
            {/* Helmet & Visor */}
            <circle cx="20" cy="12" r="6" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
            <path d="M18 11 L23 11" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Red LED Taillight */}
            <circle cx="20" cy="35" r="2.5" fill="#EF4444" filter="url(#glowRed)" />
          </g>

          {/* 7. Modern Indian SUV in Perspective on Lane 2 */}
          <g transform="translate(685, 335)">
            {/* Ground Contact Shadow */}
            <ellipse cx="45" cy="62" rx="48" ry="6" fill="#000000" fillOpacity="0.65" />
            {/* Wide Rear Tires on Asphalt */}
            <rect x="4" y="44" width="16" height="20" rx="3" fill="#0B101D" stroke="#334155" strokeWidth="1" />
            <rect x="70" y="44" width="16" height="20" rx="3" fill="#0B101D" stroke="#334155" strokeWidth="1" />
            {/* Lower Bumper & Skid Plate */}
            <path d="M12 56 L78 56 L74 60 L16 60 Z" fill="#64748B" />
            <rect x="36" y="57" width="18" height="2" fill="#E2E8F0" />
            {/* SUV Main Tailgate Body */}
            <path
              d="M10 52 L10 24 L20 12 L70 12 L80 24 L80 52 L72 55 L18 55 Z"
              fill="#0F172A"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Roof Rails & Shark Fin */}
            <line x1="20" y1="10" x2="70" y2="10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 10 L45 7 L47 10 Z" fill="#94A3B8" />
            {/* Rear Windshield & Defogger */}
            <path d="M22 14 L68 14 L74 26 L16 26 Z" fill="#0369A1" fillOpacity="0.45" />
            <line x1="24" y1="18" x2="66" y2="18" stroke="#38BDF8" strokeWidth="0.5" opacity="0.6" />
            <line x1="22" y1="22" x2="68" y2="22" stroke="#38BDF8" strokeWidth="0.5" opacity="0.6" />
            {/* Continuous LED Lightbar (Modern Tail-lamp cluster) */}
            <path
              d="M12 32 L34 32 L34 35 L56 35 L56 32 L78 32"
              stroke="#EF4444"
              strokeWidth="2.5"
              fill="none"
              filter="url(#glowRed)"
            />
            {/* High Mounted Stop Lamp */}
            <line x1="40" y1="13" x2="50" y2="13" stroke="#EF4444" strokeWidth="1.5" filter="url(#glowRed)" />
            {/* Number Plate IND */}
            <rect x="38" y="42" width="14" height="6" rx="1" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" />
            <text x="45" y="46.5" fill="#0F172A" fontSize="3.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              IND
            </text>
          </g>

          {/* 8. NHAI Milestone Marker on Left Shoulder */}
          <g transform="translate(130, 395) scale(0.95)">
            <rect x="0" y="0" width="28" height="46" rx="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            {/* Yellow Top for National Highway */}
            <path d="M0 14 C0 6, 28 6, 28 14 Z" fill="#F59E0B" />
            <text x="14" y="24" fill="#0F172A" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              NH
            </text>
            <text x="14" y="36" fill="#0F172A" fontSize="10" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">
              48
            </text>
          </g>

          {/* Guard Rail (W-Beam Crash Barrier) on Left */}
          <line x1="50" y1="440" x2="220" y2="390" stroke="#94A3B8" strokeWidth="3" opacity="0.7" />
          <line x1="90" y1="440" x2="90" y2="455" stroke="#64748B" strokeWidth="3" />
          <line x1="160" y1="415" x2="160" y2="430" stroke="#64748B" strokeWidth="3" />
        </svg>

        {/* High-Contrast Gradient Overlays for Guaranteed Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B16] via-[#060B16]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060B16] via-[#060B16]/75 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12 lg:py-14 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 sm:mb-6 font-medium"
        >
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/tools" className="hover:text-cyan-400 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/category/drive" className="hover:text-cyan-400 transition-colors uppercase font-mono tracking-wider">
            Drive
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 font-semibold truncate">
            Road Trip Planner
          </span>
        </nav>

        {/* Category & Verified Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indian Highway Studio</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
            FASTag & Fuel Split
          </span>
        </div>

        {/* Main Cinematic Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3.5">
          Plan Your Next Indian{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-300 to-cyan-400">
            Road Trip
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-6 font-normal">
          Calculate fuel, FASTag tolls, food, accommodation, and total trip expenses before you hit the highway.
        </p>

        {/* Prominent CTA: START PLANNING YOUR TRIP */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pt-1">
          <a
            href="#calculator-form"
            onClick={scrollToCalculator}
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-300 hover:from-amber-300 hover:to-cyan-200 shadow-xl shadow-amber-500/20 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Navigation className="w-5 h-5 fill-slate-950 shrink-0" />
            <span>START PLANNING YOUR TRIP</span>
            <ArrowDown className="w-4 h-4 stroke-[3] shrink-0" />
          </a>
        </div>

        {/* 3 Compact Trust Labels */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant Trip Cost Estimate</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 backdrop-blur-xs">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>No Account Required</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 backdrop-blur-xs">
            <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Private, Browser-Based Calculator</span>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Highway Lane Moving Animation */}
      <style>{`
        @keyframes highwayDashes {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 34;
          }
        }
        .animate-highway-dashes {
          animation: highwayDashes 0.75s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-highway-dashes {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

