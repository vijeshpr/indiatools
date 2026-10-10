import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface MascotProps {
  className?: string
  size?: number
  isHovered?: boolean
  interactive?: boolean
}

// =========================================================================
// 1. BUILD / CONSTRUCTION & MATERIALS: ORANGE CONCRETE MIXER TRUCK
// Features rotating drum, orange cab, chute, dual wheels with treads
// =========================================================================
export const BuildMixerMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="mixerCab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="mixerDrum" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="40%" stopColor="#FB923C" />
            <stop offset="80%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="drumStripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
          <linearGradient id="mixerChassis" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="wheelRubber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <radialGradient id="mixerRim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="110" rx="65" ry="7" fill="black" fillOpacity="0.18" />

        {/* Vehicle Body Root with Hover/Float */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-1, 1, -1] }
              : { y: [0, -1.5, 0] }
          }
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          {/* Chassis Beam */}
          <rect x="20" y="82" width="120" height="10" rx="3" fill="url(#mixerChassis)" />

          {/* Rear Chute & Hopper */}
          <path d="M 22 56 L 36 68 L 32 84 L 18 72 Z" fill="#64748B" />
          <path d="M 16 70 L 26 88 L 22 90 L 12 72 Z" fill="#475569" />
          {/* Fresh cement droplet */}
          <motion.circle
            cx="14"
            cy="92"
            r="2.5"
            fill="#94A3B8"
            animate={prefersReduced ? {} : { y: [0, 4, 0], opacity: [0.8, 0.3, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />

          {/* ROTATING CONCRETE MIXER DRUM */}
          <g transform="translate(68, 54)">
            {/* Drum Stand Supports */}
            <path d="M -35 28 L -20 -10 L -12 -10 L -25 28 Z" fill="#475569" />
            <path d="M 20 28 L 10 -8 L 16 -8 L 28 28 Z" fill="#475569" />

            {/* Main Barrel Drum Outer Shape (Rotated at 15deg) */}
            <g transform="rotate(-14)">
              {/* Drum Shell */}
              <ellipse cx="0" cy="0" rx="36" ry="24" fill="url(#mixerDrum)" />
              {/* Back cone */}
              <path d="M -32 -10 L -46 0 L -32 10 Z" fill="#C2410C" />
              {/* Front cone */}
              <path d="M 32 -10 L 42 0 L 32 10 Z" fill="#FB923C" />

              {/* Animated Rotating Helical Stripes */}
              <motion.g
                animate={
                  prefersReduced
                    ? {}
                    : {
                        rotate: [0, 360],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: isHovered ? 2.5 : 5,
                  ease: 'linear',
                }}
              >
                {/* Spiral mixing flight 1 */}
                <path
                  d="M -26 -16 Q 0 -6 26 -16 Q 16 0 -26 -16"
                  fill="url(#drumStripe)"
                  opacity="0.85"
                />
                {/* Spiral mixing flight 2 */}
                <path
                  d="M -26 16 Q 0 6 26 16 Q 16 0 -26 16"
                  fill="url(#drumStripe)"
                  opacity="0.85"
                />
                {/* Center spiral core */}
                <circle cx="0" cy="0" r="10" fill="#EA580C" stroke="#FDBA74" strokeWidth="2" />
                <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Drum Specular Light Reflection */}
              <path
                d="M -30 -14 Q 0 -22 30 -14 Q 10 -17 -30 -14"
                fill="white"
                opacity="0.45"
              />
            </g>
          </g>

          {/* FRONT TRUCK CAB (Orange & Modern) */}
          <g>
            {/* Cab Main Body */}
            <path
              d="M 100 84 L 100 50 Q 102 44 108 42 L 126 42 Q 138 45 142 56 L 146 72 Q 146 84 138 84 Z"
              fill="url(#mixerCab)"
            />
            {/* Windshield */}
            <path
              d="M 112 46 L 126 46 Q 134 48 138 56 L 140 64 L 112 64 Z"
              fill="#BAE6FD"
              stroke="#0284C7"
              strokeWidth="1.2"
            />
            {/* Windshield Gloss Highlight */}
            <path d="M 116 48 L 124 48 L 118 62 L 114 62 Z" fill="white" opacity="0.65" />

            {/* Driver Silhouette */}
            <circle cx="120" cy="56" r="4" fill="#0F172A" opacity="0.7" />
            <path d="M 116 63 Q 120 60 124 63" stroke="#0F172A" strokeWidth="2" opacity="0.7" />

            {/* Front Bumper & Grille */}
            <rect x="138" y="74" width="10" height="10" rx="2" fill="#334155" />
            <line x1="140" y1="77" x2="146" y2="77" stroke="#94A3B8" strokeWidth="1" />
            <line x1="140" y1="80" x2="146" y2="80" stroke="#94A3B8" strokeWidth="1" />

            {/* Bright Headlight */}
            <rect x="144" y="68" width="4" height="5" rx="1.5" fill="#FEF08A" />
            {/* Headlight beam glow */}
            <path d="M 148 68 L 162 62 L 162 78 L 148 74 Z" fill="#FEF08A" opacity={isHovered ? 0.35 : 0.15} />

            {/* Side Mirror */}
            <rect x="108" y="52" width="3" height="7" rx="1" fill="#475569" />
          </g>

          {/* DUAL HEAVY WHEELS WITH TREADS & CHROME HUBS */}
          {/* Rear Wheel 1 */}
          <g transform="translate(42, 92)">
            <circle cx="0" cy="0" r="14" fill="url(#wheelRubber)" />
            <circle cx="0" cy="0" r="8" fill="url(#mixerRim)" />
            <circle cx="0" cy="0" r="3" fill="#1E293B" />
            {/* Tire Tread details */}
            <line x1="-12" y1="0" x2="-8" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="8" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-12" x2="0" y2="-8" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="12" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* Rear Wheel 2 */}
          <g transform="translate(74, 92)">
            <circle cx="0" cy="0" r="14" fill="url(#wheelRubber)" />
            <circle cx="0" cy="0" r="8" fill="url(#mixerRim)" />
            <circle cx="0" cy="0" r="3" fill="#1E293B" />
            <line x1="-12" y1="0" x2="-8" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="8" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-12" x2="0" y2="-8" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="12" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* Front Wheel */}
          <g transform="translate(126, 92)">
            <circle cx="0" cy="0" r="14" fill="url(#wheelRubber)" />
            <circle cx="0" cy="0" r="8" fill="url(#mixerRim)" />
            <circle cx="0" cy="0" r="3" fill="#1E293B" />
            <line x1="-12" y1="0" x2="-8" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="8" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-12" x2="0" y2="-8" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="12" stroke="#475569" strokeWidth="1.5" />
          </g>
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 2. DRIVE / VEHICLE & TRAVEL: INDIAN COMPACT CAR WITH SPINNING WHEELS
// Features Indian EV/hatchback silhouette, spinning alloys, beam glow
// =========================================================================
export const DriveCarMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="carBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="carRoofGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="carGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>
          <linearGradient id="carWheelRubber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>
          <radialGradient id="alloyRim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>
        </defs>

        {/* Road Surface Shadow */}
        <ellipse cx="80" cy="108" rx="60" ry="6" fill="black" fillOpacity="0.2" />

        {/* Car Root Group with Suspension Bounce */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-2, 2, -2] }
              : { y: [0, -1.2, 0] }
          }
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          {/* Headlight Beam Cone */}
          <path
            d="M 140 76 L 165 65 L 165 95 L 140 84 Z"
            fill="#38BDF8"
            opacity={isHovered ? 0.35 : 0.18}
          />

          {/* Underbody Chassis */}
          <rect x="25" y="80" width="108" height="8" rx="2" fill="#1E293B" />

          {/* Dual-Tone Sleek Indian Hatchback Body */}
          <path
            d="M 18 80 
               C 18 72, 24 68, 36 68 
               L 52 50 
               C 56 45, 62 44, 70 44 
               L 105 44 
               C 118 44, 126 52, 134 65 
               L 142 70 
               C 146 73, 146 80, 142 84 
               L 22 84 
               C 18 84, 18 82, 18 80 Z"
            fill="url(#carBodyGrad)"
          />

          {/* Floating Contrast Roof & Spoiler */}
          <path
            d="M 50 50 L 68 42 L 110 42 L 118 50 Z"
            fill="url(#carRoofGrad)"
          />

          {/* Subtle Indian Tricolor Roof Decal */}
          <g transform="translate(80, 42)">
            <rect x="-10" y="0" width="6.6" height="2" fill="#FF9933" />
            <rect x="-3.4" y="0" width="6.8" height="2" fill="#FFFFFF" />
            <rect x="3.4" y="0" width="6.6" height="2" fill="#138808" />
          </g>

          {/* Windows / Greenhouse */}
          <path
            d="M 54 52 L 68 45 L 86 45 L 86 64 L 46 64 Z"
            fill="url(#carGlass)"
          />
          <path
            d="M 90 45 L 108 45 L 122 64 L 90 64 Z"
            fill="url(#carGlass)"
          />
          {/* Window Pillar */}
          <rect x="86" y="45" width="4" height="19" fill="#0284C7" />
          {/* Glass Specular Reflection Line */}
          <line x1="58" y1="48" x2="80" y2="60" stroke="white" strokeWidth="1.5" opacity="0.6" />

          {/* Side Door Character Line */}
          <path d="M 40 70 Q 80 73 134 70" stroke="#0369A1" strokeWidth="1.8" fill="none" />
          <rect x="62" y="67" width="8" height="2.5" rx="1" fill="#0369A1" />
          <rect x="96" y="67" width="8" height="2.5" rx="1" fill="#0369A1" />

          {/* Front Headlight (LED DRL Signature) */}
          <path
            d="M 134 68 Q 142 70 144 75 Q 138 76 134 73 Z"
            fill="#E0F2FE"
            stroke="#38BDF8"
            strokeWidth="1.2"
          />
          {/* Rear Taillight */}
          <rect x="18" y="70" width="4" height="8" rx="1" fill="#EF4444" />

          {/* Front Bumper & Smile Grille */}
          <rect x="138" y="78" width="6" height="6" rx="2" fill="#0C4A6E" />

          {/* WHEEL 1: REAR ALLOY WHEEL (Animated Rotation) */}
          <g transform="translate(45, 86)">
            {/* Wheel Arch */}
            <path d="M -18 0 A 18 18 0 0 1 18 0" stroke="#0369A1" strokeWidth="2.5" fill="none" />
            <circle cx="0" cy="0" r="14" fill="url(#carWheelRubber)" />
            {/* Spinning 5-Spoke Alloy Rim */}
            <motion.g
              animate={
                prefersReduced
                  ? {}
                  : {
                      rotate: [0, 360],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: isHovered ? 1 : 2.5,
                ease: 'linear',
              }}
            >
              <circle cx="0" cy="0" r="9" fill="url(#alloyRim)" />
              {/* 5 spokes */}
              {[0, 72, 144, 216, 288].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={Math.cos((deg * Math.PI) / 180) * 8}
                  y2={Math.sin((deg * Math.PI) / 180) * 8}
                  stroke="#1E293B"
                  strokeWidth="2"
                />
              ))}
              <circle cx="0" cy="0" r="3" fill="#0284C7" />
            </motion.g>
          </g>

          {/* WHEEL 2: FRONT ALLOY WHEEL (Animated Rotation) */}
          <g transform="translate(115, 86)">
            <path d="M -18 0 A 18 18 0 0 1 18 0" stroke="#0369A1" strokeWidth="2.5" fill="none" />
            <circle cx="0" cy="0" r="14" fill="url(#carWheelRubber)" />
            <motion.g
              animate={
                prefersReduced
                  ? {}
                  : {
                      rotate: [0, 360],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: isHovered ? 1 : 2.5,
                ease: 'linear',
              }}
            >
              <circle cx="0" cy="0" r="9" fill="url(#alloyRim)" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={Math.cos((deg * Math.PI) / 180) * 8}
                  y2={Math.sin((deg * Math.PI) / 180) * 8}
                  stroke="#1E293B"
                  strokeWidth="2"
                />
              ))}
              <circle cx="0" cy="0" r="3" fill="#0284C7" />
            </motion.g>
          </g>
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 3. JCB & HEAVY EXCAVATOR FUEL COST: YELLOW EXCAVATOR WITH MOVING BOOM
// Mechanically accurate geometry: tracks, turntable, cabin, boom -> dipper -> bucket
// =========================================================================
export const JcbExcavatorMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 170 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="jcbYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="30%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="jcbBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="jcbCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="jcbGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>

        {/* Soft ground contact shadow */}
        <ellipse cx="80" cy="118" rx="66" ry="5" fill="black" fillOpacity="0.22" />

        {/* 1. TRACKS & UNDERCARRIAGE (Sits firmly on ground) */}
        <g id="tracks">
          {/* Main heavy rubber/steel continuous track */}
          <rect x="22" y="100" width="92" height="17" rx="8.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
          <rect x="26" y="103" width="84" height="11" rx="5.5" fill="#0F172A" />

          {/* Rear Drive Sprocket */}
          <circle cx="32" cy="108.5" r="5" fill="#475569" stroke="#0F172A" strokeWidth="1" />
          <circle cx="32" cy="108.5" r="2" fill="#94A3B8" />

          {/* Front Idler Wheel */}
          <circle cx="104" cy="108.5" r="5" fill="#475569" stroke="#0F172A" strokeWidth="1" />
          <circle cx="104" cy="108.5" r="2" fill="#94A3B8" />

          {/* 4 Bottom Track Rollers */}
          {[46, 60, 74, 88].map((x) => (
            <g key={x}>
              <circle cx={x} cy={109} r="3.8" fill="#64748B" stroke="#0F172A" strokeWidth="0.8" />
              <circle cx={x} cy={109} r="1.4" fill="#1E293B" />
            </g>
          ))}

          {/* Track link grouser ridges */}
          {[26, 36, 46, 56, 66, 76, 86, 96, 106].map((x) => (
            <line key={x} x1={x} y1="99.5" x2={x + 2} y2="101.5" stroke="#94A3B8" strokeWidth="1.2" />
          ))}
        </g>

        {/* 2. TURNTABLE & SLEW RING */}
        <rect x="52" y="96" width="32" height="4.5" rx="1" fill="#334155" stroke="#0F172A" strokeWidth="1" />

        {/* 3. SUPERSTRUCTURE CHASSIS & OPERATOR CABIN */}
        <g id="superstructure">
          {/* Deck Plate */}
          <rect x="24" y="92" width="76" height="4.5" rx="1.5" fill="#1E293B" />

          {/* Rear Engine Hood & Counterweight (Left Side) */}
          <path
            d="M 24 92 L 24 68 Q 24 58 36 56 L 62 56 L 62 92 Z"
            fill="url(#jcbYellow)"
            stroke="#CA8A04"
            strokeWidth="1"
          />
          {/* Rear Lower Counterweight Bumper */}
          <path d="M 24 74 L 24 92 L 32 92 L 32 74 Z" fill="#1E293B" />

          {/* Engine Cooling Louvers */}
          <rect x="38" y="64" width="16" height="2" rx="0.5" fill="#1E293B" />
          <rect x="38" y="69" width="16" height="2" rx="0.5" fill="#1E293B" />
          <rect x="38" y="74" width="16" height="2" rx="0.5" fill="#1E293B" />

          {/* Exhaust Stack Pipe with Rain Cap */}
          <rect x="34" y="44" width="3" height="12" rx="1" fill="#334155" />
          <rect x="33" y="43" width="5" height="2" rx="0.5" fill="#0F172A" />

          {/* Operator Cabin (Curved ROPS Frame & High-Visibility Window) */}
          <path
            d="M 60 92 L 60 48 Q 62 44 68 44 L 82 44 Q 88 46 88 52 L 88 74 L 88 92 Z"
            fill="#1E293B"
          />
          {/* Safety Glass Window */}
          <path
            d="M 64 48 L 82 48 L 84 72 L 64 72 Z"
            fill="url(#jcbGlass)"
            stroke="#0284C7"
            strokeWidth="0.8"
          />
          <line x1="68" y1="50" x2="80" y2="70" stroke="white" strokeWidth="1.5" opacity="0.6" />

          {/* Operator Silhouette */}
          <path d="M 67 72 L 67 62 L 73 62 L 73 72 Z" fill="#0F172A" />
          <circle cx="70" cy="58" r="3" fill="#0F172A" />

          {/* Amber Warning Strobe Beacon */}
          <rect x="72" y="40" width="6" height="4" rx="1.5" fill="#F59E0B" />
          <motion.circle
            cx="75"
            cy="42"
            r="5"
            fill="#FBBF24"
            animate={prefersReduced ? {} : { opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />

          {/* Front Boom Foot Mounting Bracket (Deck Pivot) */}
          <path
            d="M 84 92 L 84 80 Q 86 76 92 76 L 98 76 Q 102 80 102 92 Z"
            fill="#CA8A04"
            stroke="#0F172A"
            strokeWidth="1.2"
          />
          {/* Boom Foot Main Pivot Pin P0 at (92, 82) */}
          <circle cx="92" cy="82" r="5" fill="#1E293B" stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="92" cy="82" r="2" fill="#CA8A04" />
        </g>

        {/* 4. ARTICULATED BOOM: Rotates around P0 (92px 82px) */}
        <motion.g
          id="main-boom"
          style={{ transformOrigin: '92px 82px' }}
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { rotate: [0, -12, 0] }
              : { rotate: [0, -7, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: isHovered ? 2.2 : 3.8,
            ease: 'easeInOut',
          }}
        >
          {/* Curved Goose-Neck Boom Body */}
          <path
            d="M 88 84 L 114 42 Q 120 38 126 40 L 142 58 Q 144 62 140 66 L 126 56 L 96 90 Z"
            fill="url(#jcbYellow)"
            stroke="#CA8A04"
            strokeWidth="1"
          />
          {/* Hydraulic Lift Ram (Chassis to Boom) */}
          <line x1="82" y1="88" x2="110" y2="58" stroke="url(#jcbCylinder)" strokeWidth="3" />
          <line x1="110" y1="58" x2="118" y2="48" stroke="#1E293B" strokeWidth="4" />
          <circle cx="110" cy="58" r="2.5" fill="#1E293B" />

          {/* Elbow Joint Pin P1 at (138, 62) */}
          <circle cx="138" cy="62" r="4.5" fill="#1E293B" stroke="#FDE047" strokeWidth="1.2" />
          <circle cx="138" cy="62" r="1.8" fill="#CA8A04" />

          {/* 5. DIPPER STICK: Nested inside boom, rotates around P1 (138px 62px) */}
          <motion.g
            id="dipper-stick"
            style={{ transformOrigin: '138px 62px' }}
            animate={
              prefersReduced
                ? {}
                : isHovered
                ? { rotate: [0, 16, 0] }
                : { rotate: [0, 10, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: isHovered ? 2.2 : 3.8,
              ease: 'easeInOut',
            }}
          >
            {/* Dipper Beam Body */}
            <path
              d="M 135 60 L 141 60 L 152 96 Q 151 100 147 100 L 144 98 L 134 66 Z"
              fill="url(#jcbYellow)"
              stroke="#CA8A04"
              strokeWidth="1"
            />
            {/* Dipper Hydraulic Cylinder */}
            <line x1="120" y1="40" x2="138" y2="72" stroke="url(#jcbCylinder)" strokeWidth="2.5" />
            <circle cx="138" cy="72" r="2" fill="#1E293B" />

            {/* Bucket Pivot Pin P2 at (149, 98) */}
            <circle cx="149" cy="98" r="3.5" fill="#1E293B" stroke="#FDE047" strokeWidth="1" />
            <circle cx="149" cy="98" r="1.4" fill="#CA8A04" />

            {/* 6. DIGGING BUCKET: Nested inside dipper, rotates around P2 (149px 98px) */}
            <motion.g
              id="bucket"
              style={{ transformOrigin: '149px 98px' }}
              animate={
                prefersReduced
                  ? {}
                  : isHovered
                  ? { rotate: [0, 22, 0] }
                  : { rotate: [0, 14, 0] }
              }
              transition={{
                repeat: Infinity,
                duration: isHovered ? 2.2 : 3.8,
                ease: 'easeInOut',
              }}
            >
              {/* Bucket Curved Shell */}
              <path
                d="M 149 98 C 159 100, 166 106, 162 116 L 146 117 C 141 110, 143 102, 149 98 Z"
                fill="#334155"
                stroke="#0F172A"
                strokeWidth="1"
              />
              {/* Bucket Curl Linkage */}
              <line x1="145" y1="92" x2="152" y2="104" stroke="#64748B" strokeWidth="2" />
              <circle cx="152" cy="104" r="1.5" fill="#0F172A" />

              {/* 4 Pointed Digging Teeth */}
              <polygon points="146,117 141,120 144,116" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
              <polygon points="149,117 145,121 148,116" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
              <polygon points="153,116 150,121 153,115" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
              <polygon points="157,115 155,120 157,114" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 4. POWER / ENERGY & HOME: GLOWING ELECTRICITY SYMBOL WITH PULSING GLOW
// Features 3D lightning bolt, concentric expanding energy rings, plasma core
// =========================================================================
export const PowerEnergyMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg overflow-visible"
      >
        <defs>
          <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <radialGradient id="plasmaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Glow */}
        <ellipse cx="70" cy="106" rx="42" ry="6" fill="#0284C7" fillOpacity="0.25" />

        {/* Concentric Pulsing Energy Shockwaves */}
        <motion.circle
          cx="70"
          cy="56"
          r="36"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          animate={
            prefersReduced
              ? {}
              : {
                  scale: [0.8, 1.25, 0.8],
                  opacity: [0.6, 0.1, 0.6],
                  rotate: [0, 180, 360],
                }
          }
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 56px' }}
        />

        <motion.circle
          cx="70"
          cy="56"
          r="26"
          stroke="#FACC15"
          strokeWidth="1.5"
          fill="none"
          animate={
            prefersReduced
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 0.2, 0.7],
                }
          }
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 56px' }}
        />

        {/* Glowing Plasma Core Backing */}
        <circle cx="70" cy="56" r="32" fill="url(#plasmaGlow)" />

        {/* Orbiting Spark 1 */}
        <motion.circle
          cx="70"
          cy="56"
          r="3"
          fill="#FEF08A"
          animate={
            prefersReduced
              ? {}
              : {
                  x: [0, 28, 0, -28, 0],
                  y: [-28, 0, 28, 0, -28],
                }
          }
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />

        {/* Orbiting Spark 2 */}
        <motion.circle
          cx="70"
          cy="56"
          r="2.5"
          fill="#38BDF8"
          animate={
            prefersReduced
              ? {}
              : {
                  x: [0, -26, 0, 26, 0],
                  y: [26, 0, -26, 0, 26],
                }
          }
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
        />

        {/* Main 3D Faceted Lightning Bolt */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { scale: [1, 1.12, 1], y: [-2, 2, -2] }
              : { y: [-3, 3, -3] }
          }
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          {/* Bolt Drop Shadow */}
          <path
            d="M 76 18 L 48 58 L 68 58 L 58 96 L 94 50 L 74 50 Z"
            fill="#0369A1"
            opacity="0.3"
            transform="translate(2, 3)"
          />

          {/* Bolt Main Body */}
          <path
            d="M 76 18 L 48 58 L 68 58 L 58 96 L 94 50 L 74 50 Z"
            fill="url(#boltGrad)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />

          {/* Faceted Specular Center Split */}
          <path
            d="M 76 18 L 48 58 L 68 58 L 63 76 Z"
            fill="white"
            opacity="0.45"
          />

          {/* Core Sparkle Center */}
          <circle cx="68" cy="54" r="4" fill="#FFFFFF" />
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 5. MONEY / SALARY & FINANCE: GOLDEN INDIAN RUPEE ₹ WITH ROTATING SHINE
// Features 3D bevelled gold coin, embossed ₹, sweeping shine glint, sparkle aura
// =========================================================================
export const MoneyRupeeMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <linearGradient id="goldCoinRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="goldCoinFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="rupeeEmboss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <clipPath id="coinClip">
            <circle cx="70" cy="56" r="32" />
          </clipPath>
        </defs>

        {/* Ambient Ground Coin Shadow */}
        <ellipse cx="70" cy="106" rx="40" ry="6" fill="#78350F" fillOpacity="0.25" />

        {/* Floating Coin Container */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-4, 4, -4], rotate: [-2, 2, -2] }
              : { y: [-3, 3, -3] }
          }
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        >
          {/* Outer Milled Coin Rim */}
          <circle cx="70" cy="56" r="36" fill="url(#goldCoinRim)" />

          {/* Rim notches / milled edge teeth */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <circle
              key={deg}
              cx={70 + Math.cos((deg * Math.PI) / 180) * 34}
              cy={56 + Math.sin((deg * Math.PI) / 180) * 34}
              r="1.2"
              fill="#78350F"
            />
          ))}

          {/* Inner Recessed Face */}
          <circle cx="70" cy="56" r="32" fill="url(#goldCoinFace)" stroke="#FDE68A" strokeWidth="1.5" />

          {/* SWEEPING ROTATING SHINE GLINT EFFECT (Clipped to Coin Face) */}
          <g clipPath="url(#coinClip)">
            <motion.rect
              x="-60"
              y="10"
              width="24"
              height="100"
              fill="white"
              opacity="0.38"
              transform="rotate(30 70 56)"
              animate={
                prefersReduced
                  ? {}
                  : {
                      x: [-60, 150],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: isHovered ? 1.4 : 3,
                ease: 'easeInOut',
                repeatDelay: 0.8,
              }}
            />
          </g>

          {/* EMBOSSED INDIAN RUPEE SYMBOL ₹ */}
          <g transform="translate(70, 56)">
            {/* Rupee 3D Drop Shadow */}
            <text
              x="0"
              y="12"
              textAnchor="middle"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              fill="#78350F"
              opacity="0.6"
              dx="1.5"
              dy="2"
            >
              ₹
            </text>

            {/* Rupee Main Emboss */}
            <text
              x="0"
              y="12"
              textAnchor="middle"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              fill="url(#rupeeEmboss)"
              stroke="#FFFBEB"
              strokeWidth="0.8"
            >
              ₹
            </text>
          </g>

          {/* Outer Specular Crescent */}
          <path
            d="M 44 40 A 30 30 0 0 1 96 40 A 32 32 0 0 0 44 40 Z"
            fill="white"
            opacity="0.4"
          />

          {/* Sparkle 1 (Top Right) */}
          <motion.path
            d="M 98 28 Q 102 28 102 24 Q 102 28 106 28 Q 102 28 102 32 Q 102 28 98 28 Z"
            fill="#FEF08A"
            animate={
              prefersReduced
                ? {}
                : {
                    scale: [0.6, 1.2, 0.6],
                    opacity: [0.4, 1, 0.4],
                  }
            }
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ transformOrigin: '102px 28px' }}
          />

          {/* Sparkle 2 (Bottom Left) */}
          <motion.path
            d="M 38 74 Q 41 74 41 71 Q 41 74 44 74 Q 41 74 41 77 Q 41 74 38 74 Z"
            fill="#FFFFFF"
            animate={
              prefersReduced
                ? {}
                : {
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.3, 0.9, 0.3],
                  }
            }
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}
            style={{ transformOrigin: '41px 74px' }}
          />
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 6. WORK / CAREER & HR: CUTE INDIAN FEMALE PROFESSIONAL WITH FRIENDLY WAVE
// Features modern smart blazer, bindi, warm smile, animated waving hand
// =========================================================================
export const WorkProfessionalMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="blazerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="60%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Soft shadow */}
        <ellipse cx="70" cy="110" rx="36" ry="5" fill="black" fillOpacity="0.16" />

        {/* Character Base / Floating breathing */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-2, 2, -2] }
              : { y: [0, -1.5, 0] }
          }
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          {/* Hair Back Volume / Bun */}
          <circle cx="70" cy="36" r="23" fill="url(#hairGrad)" />
          <circle cx="70" cy="20" r="11" fill="url(#hairGrad)" />
          {/* Hair Bun Ornament / Pin */}
          <circle cx="70" cy="18" r="3" fill="#F59E0B" />

          {/* Shoulders & Corporate Blazer */}
          <path
            d="M 40 102 C 40 82, 52 74, 70 74 C 88 74, 100 82, 100 102 Z"
            fill="url(#blazerGrad)"
          />

          {/* White Formal Collared Shirt & Lapel */}
          <path d="M 62 74 L 70 90 L 78 74 Z" fill="#F8FAFC" />
          {/* IndiaTools ID Badge Lanyard */}
          <line x1="66" y1="74" x2="68" y2="94" stroke="#F59E0B" strokeWidth="1.2" />
          <line x1="74" y1="74" x2="72" y2="94" stroke="#F59E0B" strokeWidth="1.2" />
          <rect x="66" y="94" width="8" height="10" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <rect x="68" y="96" width="4" height="2" fill="#4F46E5" />

          {/* Left Arm Holding Digital Tablet */}
          <path d="M 42 86 L 50 98 L 56 94" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
          {/* Tablet */}
          <rect x="42" y="90" width="16" height="12" rx="2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
          <rect x="44" y="92" width="12" height="8" rx="1" fill="#38BDF8" opacity="0.8" />
          <circle cx="56" cy="96" r="2.5" fill="url(#skinGrad)" />

          {/* Neck */}
          <rect x="66" y="58" width="8" height="16" rx="3" fill="url(#skinGrad)" />

          {/* Head & Face */}
          <ellipse cx="70" cy="46" rx="18" ry="19" fill="url(#skinGrad)" />

          {/* Front Stylish Hair Frame */}
          <path
            d="M 52 42 C 54 28, 86 28, 88 42 C 84 34, 78 33, 70 34 C 62 33, 56 34, 52 42 Z"
            fill="url(#hairGrad)"
          />
          {/* Side hair locks */}
          <path d="M 52 42 Q 54 52 56 56" stroke="url(#hairGrad)" strokeWidth="3" fill="none" />
          <path d="M 88 42 Q 86 52 84 56" stroke="url(#hairGrad)" strokeWidth="3" fill="none" />

          {/* Traditional Auspicious Bindi */}
          <circle cx="70" cy="40" r="1.5" fill="#DC2626" />

          {/* Expressive Warm Eyes with Eyelashes */}
          {/* Left Eye */}
          <circle cx="63" cy="47" r="2.2" fill="#0F172A" />
          <circle cx="62.3" cy="46.3" r="0.7" fill="#FFFFFF" />
          <path d="M 60 44 Q 63 42 66 44" stroke="#0F172A" strokeWidth="1" fill="none" />
          {/* Right Eye */}
          <circle cx="77" cy="47" r="2.2" fill="#0F172A" />
          <circle cx="76.3" cy="46.3" r="0.7" fill="#FFFFFF" />
          <path d="M 74 44 Q 77 42 80 44" stroke="#0F172A" strokeWidth="1" fill="none" />

          {/* Soft Blushing Cheeks */}
          <ellipse cx="59" cy="52" rx="3.5" ry="2" fill="#F43F5E" opacity="0.4" />
          <ellipse cx="81" cy="52" rx="3.5" ry="2" fill="#F43F5E" opacity="0.4" />

          {/* Friendly Smile */}
          <path
            d="M 66 54 Q 70 58 74 54"
            stroke="#9A3412"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* ANIMATED WAVING RIGHT HAND */}
          <motion.g
            id="waving-arm"
            transform="translate(94, 82)"
            animate={
              prefersReduced
                ? {}
                : {
                    rotate: [-14, 18, -14],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: isHovered ? 0.9 : 1.8,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Forearm */}
            <line x1="0" y1="0" x2="16" y2="-16" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
            {/* Hand / Palm */}
            <circle cx="18" cy="-18" r="5" fill="url(#skinGrad)" />
            {/* Waving fingers */}
            <circle cx="21" cy="-21" r="1.8" fill="url(#skinGrad)" />
            <circle cx="18" cy="-23" r="1.8" fill="url(#skinGrad)" />
            <circle cx="15" cy="-22" r="1.8" fill="url(#skinGrad)" />
            {/* Gold Bangle */}
            <ellipse cx="15" cy="-14" rx="3" ry="1.5" fill="#F59E0B" />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 7. THE AI ROBOT MASCOT: MINI COMPANION & TOOLBOX VISUAL GUIDE
// Miniature version of main hero mascot holding glowing digital wrench/toolbox
// =========================================================================
export const AiToolboxMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg overflow-visible"
      >
        <defs>
          <linearGradient id="miniHeadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="miniVisorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        {/* Anti-gravity shadow */}
        <ellipse cx="70" cy="108" rx="34" ry="5" fill="#4F46E5" fillOpacity="0.25" />

        {/* Floating Robot Container */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-4, 4, -4], rotate: [-2, 2, -2] }
              : { y: [-2.5, 2.5, -2.5] }
          }
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          {/* Antenna with Pulsing Glowing Orb */}
          <line x1="70" y1="28" x2="70" y2="14" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <motion.circle
            cx="70"
            cy="12"
            r="5"
            fill="#38BDF8"
            animate={
              prefersReduced
                ? {}
                : {
                    scale: [0.9, 1.3, 0.9],
                    opacity: [0.7, 1, 0.7],
                  }
            }
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <circle cx="70" cy="12" r="2.5" fill="#FFFFFF" />

          {/* Ears / Side Headphone Pods */}
          <rect x="42" y="38" width="6" height="14" rx="3" fill="#6366F1" />
          <circle cx="45" cy="45" r="2" fill="#38BDF8" />
          <rect x="92" y="38" width="6" height="14" rx="3" fill="#6366F1" />
          <circle cx="95" cy="45" r="2" fill="#38BDF8" />

          {/* Robot Head (Rounded Capsule) */}
          <rect x="46" y="26" width="48" height="38" rx="19" fill="url(#miniHeadGrad)" stroke="#CBD5E1" strokeWidth="1" />

          {/* High-Tech Glossy Visor */}
          <rect x="52" y="34" width="36" height="22" rx="10" fill="url(#miniVisorGrad)" />

          {/* Visor Glint Reflection */}
          <path d="M 56 36 L 68 36 L 58 48 L 54 48 Z" fill="white" opacity="0.2" />

          {/* Cheerful Smiling Eyes (^ ^) */}
          <path
            d="M 58 45 Q 62 40 66 45"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 74 45 Q 78 40 82 45"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Floating Torso */}
          <rect x="54" y="68" width="32" height="24" rx="10" fill="url(#miniHeadGrad)" stroke="#CBD5E1" strokeWidth="1" />

          {/* Tricolor Chest Core Badge */}
          <g transform="translate(70, 78)">
            <circle cx="0" cy="0" r="6" fill="#1E293B" />
            <rect x="-4" y="-3" width="8" height="2" fill="#FF9933" />
            <rect x="-4" y="-1" width="8" height="2" fill="#FFFFFF" />
            <rect x="-4" y="1" width="8" height="2" fill="#138808" />
          </g>

          {/* Levitation Thruster Glow */}
          <motion.ellipse
            cx="70"
            cy="94"
            rx="10"
            ry="3.5"
            fill="#38BDF8"
            animate={
              prefersReduced
                ? {}
                : {
                    rx: [8, 12, 8],
                    opacity: [0.4, 0.9, 0.4],
                  }
            }
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          {/* Right Floating Hand Holding Glowing Digital Tool */}
          <motion.g
            animate={
              prefersReduced
                ? {}
                : {
                    y: [-1, 2, -1],
                    rotate: [-4, 6, -4],
                  }
            }
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <circle cx="94" cy="74" r="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            {/* Holographic Glowing Digital Wrench */}
            <path
              d="M 96 66 L 104 58 Q 108 58 108 62 L 102 70 Z"
              fill="#F59E0B"
              stroke="#FEF08A"
              strokeWidth="0.8"
            />
            <circle cx="106" cy="60" r="2" fill="#FFFFFF" />
          </motion.g>

          {/* Left Floating Hand */}
          <circle cx="46" cy="74" r="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 8. PHOTO & DOCUMENTS MASCOT (CREATE CATEGORY & 50KB RESIZER)
// Camera & Exam Photo ID frame with flash sparkle and 50KB badge
// =========================================================================
export const PhotoDocMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="photoCardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="cameraBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
          <linearGradient id="lensRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Soft shadow */}
        <ellipse cx="70" cy="110" rx="42" ry="5" fill="black" fillOpacity="0.2" />

        {/* Floating Photo Document Card & Camera */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { y: [-3, 3, -3] }
              : { y: [-1.5, 1.5, -1.5] }
          }
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          {/* Background ID Document Card */}
          <g transform="translate(32, 28) rotate(-6)">
            <rect x="0" y="0" width="54" height="68" rx="8" fill="url(#photoCardGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Header bar */}
            <rect x="0" y="0" width="54" height="12" rx="8" fill="#EC4899" />
            {/* Portrait placeholder */}
            <rect x="12" y="18" width="30" height="30" rx="5" fill="#E2E8F0" />
            <circle cx="27" cy="30" r="7" fill="#94A3B8" />
            <path d="M 17 46 C 17 40, 37 40, 37 46 Z" fill="#94A3B8" />
            {/* 50KB Badge Pill */}
            <rect x="12" y="52" width="30" height="9" rx="4.5" fill="#10B981" />
            <text x="27" y="58.5" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">&lt; 50 KB</text>
          </g>

          {/* Foreground Compact Modern Camera */}
          <g transform="translate(62, 42)">
            {/* Camera Body */}
            <rect x="0" y="8" width="54" height="38" rx="10" fill="url(#cameraBodyGrad)" stroke="#9F1239" strokeWidth="1" />
            {/* Top Shutter & Flash Bump */}
            <rect x="8" y="3" width="14" height="7" rx="2" fill="#E11D48" />
            <circle cx="42" cy="5" r="4" fill="#E2E8F0" />
            {/* Flash LED */}
            <rect x="36" y="14" width="8" height="5" rx="1.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
            {/* Shutter Button */}
            <rect x="10" y="1" width="10" height="3" rx="1" fill="#334155" />

            {/* Camera Lens */}
            <circle cx="27" cy="27" r="15" fill="#1E293B" stroke="#FDA4AF" strokeWidth="1.5" />
            <circle cx="27" cy="27" r="11" fill="url(#lensRingGrad)" />
            <circle cx="27" cy="27" r="6" fill="#0F172A" />
            <circle cx="29" cy="25" r="2" fill="#FFFFFF" opacity="0.8" />

            {/* Flash Sparkle / Glint (Animated) */}
            <motion.g
              transform="translate(40, 16)"
              animate={
                prefersReduced
                  ? {}
                  : {
                      scale: [0.8, 1.3, 0.8],
                      opacity: [0.6, 1, 0.6],
                    }
              }
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#FEF08A" />
            </motion.g>
          </g>
        </motion.g>
      </svg>
    </div>
  )
}

// =========================================================================
// 9. LAND & SURVEY MASCOT (LAND CATEGORY)
// Land surveyor theodolite tripod & precision compass rose
// =========================================================================
export const LandSurveyMascot: React.FC<MascotProps> = ({
  className = '',
  size = 120,
  isHovered = false,
}) => {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="surveyBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="70" cy="110" rx="46" ry="5" fill="black" fillOpacity="0.2" />

        {/* Surveyor Tripod Legs */}
        <g id="tripod-legs" stroke="#475569" strokeWidth="4" strokeLinecap="round">
          {/* Left leg */}
          <line x1="70" y1="58" x2="34" y2="108" />
          {/* Center leg */}
          <line x1="70" y1="58" x2="70" y2="109" />
          {/* Right leg */}
          <line x1="70" y1="58" x2="106" y2="108" />
        </g>
        {/* Tripod leg clamps */}
        <rect x="48" y="80" width="8" height="4" rx="1" fill="#F59E0B" transform="rotate(-30 52 82)" />
        <rect x="66" y="84" width="8" height="4" rx="1" fill="#F59E0B" />
        <rect x="84" y="80" width="8" height="4" rx="1" fill="#F59E0B" transform="rotate(30 88 82)" />

        {/* Tripod Base Tribrach */}
        <polygon points="56,60 84,60 70,52" fill="#1E293B" />

        {/* Theodolite / Total Station Unit */}
        <motion.g
          animate={
            prefersReduced
              ? {}
              : isHovered
              ? { rotate: [-6, 6, -6] }
              : { rotate: [-2, 2, -2] }
          }
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 48px' }}
        >
          {/* Unit Body */}
          <rect x="58" y="32" width="24" height="24" rx="6" fill="url(#surveyBodyGrad)" stroke="#047857" strokeWidth="1" />
          {/* Display screen */}
          <rect x="62" y="38" width="16" height="10" rx="2" fill="#064E3B" />
          <text x="70" y="45" fill="#6EE7B7" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">GPS • OK</text>

          {/* Telescope Barrel */}
          <rect x="50" y="22" width="40" height="9" rx="3" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
          {/* Objective Lens */}
          <ellipse cx="90" cy="26.5" rx="2.5" ry="4.5" fill="#38BDF8" />
          <ellipse cx="50" cy="26.5" rx="2" ry="3.5" fill="#64748B" />

          {/* Laser Pointer Pulse */}
          <motion.line
            x1="92"
            y1="26.5"
            x2="135"
            y2="26.5"
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            animate={
              prefersReduced
                ? {}
                : {
                    opacity: [0.4, 1, 0.4],
                  }
            }
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <circle cx="135" cy="26.5" r="2" fill="#EF4444" />
        </motion.g>
      </svg>
    </div>
  )
}
