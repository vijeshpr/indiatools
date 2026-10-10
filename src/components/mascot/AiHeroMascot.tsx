import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export type MascotReaction = 'idle' | 'dance' | 'smile_wink' | 'surprise' | 'tilt' | 'bounce'

interface AiHeroMascotProps {
  className?: string
}

const REACTIONS: MascotReaction[] = ['dance', 'smile_wink', 'surprise', 'tilt', 'bounce']

const GREETINGS = ['Namaste! 🙏', 'Vanakkam! ✨', 'Hello! 😊', 'Jai Hind! 🇮🇳']

export const AiHeroMascot: React.FC<AiHeroMascotProps> = ({ className = '' }) => {
  const prefersReduced = useReducedMotion()
  const mascotRef = useRef<HTMLDivElement>(null)

  // Core Interactive States
  const [reaction, setReaction] = useState<MascotReaction>('idle')
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [isBlinking, setIsBlinking] = useState<boolean>(false)
  const [isSmiling, setIsSmiling] = useState<boolean>(false)
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [headTilt, setHeadTilt] = useState<number>(0)
  const [greetingText, setGreetingText] = useState<string | null>(null)

  // 1. NATURAL IDLE BLINKING (Every 3.8 - 4.5 seconds when idle)
  useEffect(() => {
    if (prefersReduced) return

    const blinkInterval = setInterval(() => {
      if (!isBusy && reaction === 'idle') {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 160)
      }
    }, 4000)

    return () => clearInterval(blinkInterval)
  }, [reaction, isBusy, prefersReduced])

  // 2. OCCASIONAL NATURAL SMILE (Gently smile for ~2 seconds every ~8 seconds in idle)
  useEffect(() => {
    if (prefersReduced) return

    const smileInterval = setInterval(() => {
      if (!isBusy && reaction === 'idle') {
        setIsSmiling(true)
        setTimeout(() => setIsSmiling(false), 2200)
      }
    }, 8500)

    return () => clearInterval(smileInterval)
  }, [reaction, isBusy, prefersReduced])

  // 3. MOUSE TRACKING ON DESKTOP (Eyes & subtle head follow cursor)
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (prefersReduced || !mascotRef.current || isBusy) return

      const rect = mascotRef.current.getBoundingClientRect()
      const mascotCenterX = rect.left + rect.width / 2
      const mascotCenterY = rect.top + rect.height / 2

      const dx = e.clientX - mascotCenterX
      const dy = e.clientY - mascotCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Bounded pupil offset ([-6, 6] px horizontal, [-4, 4] px vertical)
      const maxPupilX = 6
      const maxPupilY = 4
      const angle = Math.atan2(dy, dx)
      const pupilDist = Math.min(distance / 200, 1)

      const px = Math.cos(angle) * maxPupilX * pupilDist
      const py = Math.sin(angle) * maxPupilY * pupilDist

      // Subtle head tilt ([-6, 6] degrees)
      const tilt = Math.max(-6, Math.min(6, (dx / 400) * 6))

      setPupilOffset({ x: px, y: py })
      setHeadTilt(tilt)
    },
    [isBusy, prefersReduced]
  )

  useEffect(() => {
    if (prefersReduced) return
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [handlePointerMove, prefersReduced])

  // 4. ON CLICK OR TAP: RANDOMLY TRIGGER ONE SHORT REACTION
  // Reactions: dance, smile_wink, surprise, tilt, bounce
  const triggerReaction = useCallback(() => {
    if (isBusy) return // Anti-spam lock: prevent rapid clicks from breaking or stacking animations

    setIsBusy(true)

    // Randomly select one reaction
    const randomIndex = Math.floor(Math.random() * REACTIONS.length)
    const selectedReaction = REACTIONS[randomIndex]
    setReaction(selectedReaction)

    // Occasionally show a tiny short greeting (approx 1 in 3 taps), auto-dismissed
    if (Math.random() < 0.35) {
      const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
      setGreetingText(randomGreeting)
      setTimeout(() => setGreetingText(null), 1800)
    }

    // Reaction durations (1.0s to 1.3s), smoothly returns to idle
    const durationMs = selectedReaction === 'bounce' ? 1050 : 1250

    setTimeout(() => {
      setReaction('idle')
      setIsBusy(false)
    }, durationMs)
  }, [isBusy])

  // Determine current facial expression based on reaction and state
  const isWinking = reaction === 'smile_wink'
  const isSurprised = reaction === 'surprise'
  const isHappyFace = reaction === 'dance' || reaction === 'bounce' || isSmiling || isWinking
  const isHeadTilting = reaction === 'tilt'

  return (
    <div
      ref={mascotRef}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* ================= OPTIONAL TINY SHORT GREETING PILL ================= */}
      <AnimatePresence>
        {greetingText && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-9 z-30 px-3 py-1 rounded-full bg-white dark:bg-[#131B2E] border border-indigo-200 dark:border-indigo-800 shadow-md text-xs font-bold font-mono text-indigo-700 dark:text-indigo-300 pointer-events-none whitespace-nowrap"
          >
            {greetingText}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#131B2E] border-r border-b border-indigo-200 dark:border-indigo-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INTERACTIVE BHARATH AI ROBOT BUTTON ================= */}
      <button
        type="button"
        onClick={triggerReaction}
        aria-label="Bharath AI — interact"
        title="Bharath AI — Click or tap to interact"
        className="relative group p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl cursor-pointer pointer-events-auto"
      >
        {/* Ambient Hover Aura Glow */}
        <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/15 dark:bg-indigo-400/20 group-hover:bg-indigo-500/30 transition-all duration-300 pointer-events-none" />

        {/* 3D SVG BHARATH AI CHARACTER */}
        <svg
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl overflow-visible"
        >
          <defs>
            {/* Robot Head Pearlescent Gradient */}
            <linearGradient id="bharathHeadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F1F5F9" />
              <stop offset="85%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Visor Screen Cyber Indigo Gradient */}
            <linearGradient id="bharathVisorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B0F19" />
              <stop offset="60%" stopColor="#111827" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            {/* Eye Glowing Cyan Gradient */}
            <linearGradient id="bharathEyeGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Ear Accents (Saffron & Green) */}
            <linearGradient id="earSaffronGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FF9933" />
            </linearGradient>
            <linearGradient id="earGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>

            {/* Chrome Torso Gradient */}
            <linearGradient id="bharathTorsoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* Ground Levitation Shadow */}
          <ellipse cx="70" cy="132" rx="34" ry="5" fill="#0B0F19" fillOpacity="0.2" />

          {/* ================= MAIN WHOLE CHARACTER CONTAINER ================= */}
          <motion.g
            animate={
              prefersReduced
                ? {}
                : reaction === 'dance'
                ? {
                    x: [-4, 4, -4, 4, 0],
                    rotate: [-6, 6, -6, 6, 0],
                    y: [-4, 2, -4, 2, 0],
                  }
                : reaction === 'bounce'
                ? {
                    y: [0, -14, 0, -8, 0],
                    scaleY: [1, 1.08, 0.94, 1.04, 1],
                  }
                : reaction === 'surprise'
                ? {
                    y: [0, -12, -10, 0],
                  }
                : {
                    y: [-3, 3, -3],
                  }
            }
            transition={
              reaction === 'dance'
                ? { duration: 1.25, ease: 'easeInOut' }
                : reaction === 'bounce'
                ? { duration: 1.0, ease: 'easeInOut' }
                : reaction === 'surprise'
                ? { duration: 1.1, ease: 'easeOut' }
                : { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '70px 100px' }}
          >
            {/* ================= FLOATING TORSO & THRUSTER ================= */}
            <g id="bharath-torso">
              {/* Cyan Levitation Thruster Glow */}
              <motion.ellipse
                cx="70"
                cy="114"
                rx="14"
                ry="4"
                fill="#38BDF8"
                animate={
                  prefersReduced
                    ? {}
                    : reaction === 'bounce'
                    ? { rx: [14, 20, 12, 18, 14], opacity: [0.6, 1, 0.4, 0.9, 0.6] }
                    : { rx: [12, 16, 12], opacity: [0.4, 0.85, 0.4] }
                }
                transition={{
                  repeat: reaction === 'idle' ? Infinity : 0,
                  duration: 1.4,
                }}
              />

              {/* Lower Thruster Ring Nozzle */}
              <ellipse cx="70" cy="110" rx="12" ry="3.5" fill="#334155" />
              <ellipse cx="70" cy="109" rx="8" ry="2.2" fill="#0284C7" />

              {/* Rounded Floating Torso Shell */}
              <rect
                x="50"
                y="84"
                width="40"
                height="26"
                rx="13"
                fill="url(#bharathTorsoGrad)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />

              {/* Indian Tricolor Heart / Power Reactor Core */}
              <g transform="translate(70, 96)">
                <circle cx="0" cy="0" r="7.5" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
                {/* Saffron band */}
                <rect x="-5" y="-4.2" width="10" height="2.8" rx="0.5" fill="#FF9933" />
                {/* White band with blue Chakra dot */}
                <rect x="-5" y="-1.4" width="10" height="2.8" rx="0.5" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="1.1" fill="#000080" />
                {/* Green band */}
                <rect x="-5" y="1.4" width="10" height="2.8" rx="0.5" fill="#138808" />
              </g>

              {/* Left Floating Hand */}
              <motion.g
                animate={
                  prefersReduced
                    ? {}
                    : reaction === 'dance'
                    ? { y: [-6, 6, -6, 6, 0], rotate: [-15, 15, -15, 15, 0] }
                    : { y: [-1, 2, -1], rotate: [-2, 3, -2] }
                }
                transition={{
                  repeat: reaction === 'idle' ? Infinity : 0,
                  duration: reaction === 'dance' ? 1.25 : 2,
                  ease: 'easeInOut',
                }}
              >
                <circle cx="40" cy="92" r="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.2" />
                <circle cx="40" cy="92" r="3" fill="#94A3B8" />
              </motion.g>

              {/* Right Floating Hand */}
              <motion.g
                animate={
                  prefersReduced
                    ? {}
                    : reaction === 'dance'
                    ? { y: [6, -6, 6, -6, 0], rotate: [15, -15, 15, -15, 0] }
                    : reaction === 'tilt'
                    ? { y: [-6, -4, 0], rotate: [12, 10, 0] }
                    : { y: [1, -2, 1], rotate: [2, -3, 2] }
                }
                transition={{
                  repeat: reaction === 'idle' ? Infinity : 0,
                  duration: reaction === 'dance' ? 1.25 : 2,
                  ease: 'easeInOut',
                }}
              >
                <circle cx="100" cy="92" r="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.2" />
                <circle cx="100" cy="92" r="3" fill="#94A3B8" />
              </motion.g>
            </g>

            {/* ================= HEAD GROUP (Tilts with Mouse & Reaction) ================= */}
            <motion.g
              id="bharath-head"
              animate={
                prefersReduced
                  ? {}
                  : isHeadTilting
                  ? { rotate: [0, 18, 14, 0] }
                  : { rotate: headTilt }
              }
              transition={
                isHeadTilting
                  ? { duration: 1.25, ease: 'easeInOut' }
                  : { type: 'spring', damping: 20, stiffness: 220 }
              }
              style={{ transformOrigin: '70px 60px' }}
            >
              {/* Antenna with Pulsing Signal Beacon */}
              <g id="antenna">
                <line
                  x1="70"
                  y1="34"
                  x2="70"
                  y2="18"
                  stroke="#64748B"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <ellipse cx="70" cy="34" rx="4" ry="2" fill="#475569" />

                <motion.circle
                  cx="70"
                  cy="16"
                  r={isSurprised ? 7 : 5.5}
                  fill={isSurprised || isWinking ? '#38BDF8' : '#F59E0B'}
                  animate={
                    prefersReduced
                      ? {}
                      : {
                          scale: [0.9, 1.25, 0.9],
                          opacity: [0.75, 1, 0.75],
                        }
                  }
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
                <circle cx="70" cy="16" r="2.8" fill="#FFFFFF" />
              </g>

              {/* Ear Pods */}
              {/* Left Ear (Saffron) */}
              <rect x="34" y="44" width="7" height="18" rx="3.5" fill="#475569" />
              <rect x="36" y="46" width="3" height="14" rx="1.5" fill="url(#earSaffronGrad)" />

              {/* Right Ear (Green) */}
              <rect x="99" y="44" width="7" height="18" rx="3.5" fill="#475569" />
              <rect x="101" y="46" width="3" height="14" rx="1.5" fill="url(#earGreenGrad)" />

              {/* Main Rounded 3D Robot Head */}
              <rect
                x="39"
                y="30"
                width="62"
                height="48"
                rx="24"
                fill="url(#bharathHeadGrad)"
                stroke="#CBD5E1"
                strokeWidth="1.4"
              />

              {/* Specular Highlight */}
              <path
                d="M 50 34 Q 70 30 90 34 Q 70 32 50 34"
                fill="white"
                opacity="0.8"
              />

              {/* Visor Screen */}
              <rect
                x="46"
                y="38"
                width="48"
                height="32"
                rx="14"
                fill="url(#bharathVisorGrad)"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* Visor Glass Sheen Reflection */}
              <path
                d="M 50 40 L 74 40 L 58 68 L 48 68 Z"
                fill="white"
                opacity="0.12"
              />

              {/* Blushing Cheeks (Active when smiling, winking, dancing) */}
              {isHappyFace && (
                <g>
                  <ellipse cx="53" cy="62" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
                  <ellipse cx="87" cy="62" rx="3.5" ry="2" fill="#FB7185" opacity="0.65" />
                </g>
              )}

              {/* ================= CONTROLLABLE FACIAL EXPRESSIONS ================= */}
              {/* 1. SURPRISED (O O Eyes & O mouth) */}
              {isSurprised && (
                <g id="surprised-face">
                  <circle cx="58" cy="50" r="6.5" fill="url(#bharathEyeGlow)" />
                  <circle cx="58" cy="50" r="2.2" fill="#0B0F19" />
                  <circle cx="60" cy="48" r="1.5" fill="#FFFFFF" />

                  <circle cx="82" cy="50" r="6.5" fill="url(#bharathEyeGlow)" />
                  <circle cx="82" cy="50" r="2.2" fill="#0B0F19" />
                  <circle cx="84" cy="48" r="1.5" fill="#FFFFFF" />

                  <ellipse cx="70" cy="63" rx="3.5" ry="4.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
                </g>
              )}

              {/* 2. WINK (- ^ Eyes & Cheeky Smile) */}
              {!isSurprised && isWinking && (
                <g id="wink-face">
                  {/* Left Winking Eye (Curved line) */}
                  <path
                    d="M 53 51 Q 58 54 63 51"
                    stroke="#38BDF8"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Right Open Eye */}
                  <ellipse cx="82" cy="50" rx="5.5" ry="5" fill="url(#bharathEyeGlow)" />
                  <circle cx="83.5" cy="48.5" r="1.5" fill="#FFFFFF" />
                  {/* Star glint */}
                  <path
                    d="M 88 44 Q 90 44 90 42 Q 90 44 92 44 Q 90 44 90 46 Q 90 44 88 44 Z"
                    fill="#FEF08A"
                  />
                  {/* Cheeky smirk */}
                  <path
                    d="M 64 61 Q 70 63 76 60"
                    stroke="#38BDF8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}

              {/* 3. HAPPY ARCS (^ ^ Eyes & Warm Smile) */}
              {!isSurprised && !isWinking && isHappyFace && (
                <g id="happy-face">
                  <path
                    d="M 53 53 Q 58 46 63 53"
                    stroke="#38BDF8"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 77 53 Q 82 46 87 53"
                    stroke="#38BDF8"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 63 60 Q 70 69 77 60 Z"
                    fill="#38BDF8"
                    stroke="#0284C7"
                    strokeWidth="1"
                  />
                </g>
              )}

              {/* 4. IDLE / NORMAL EYES (Natural blinking + pupil tracking) */}
              {!isSurprised && !isWinking && !isHappyFace && (
                <g id="idle-face">
                  {/* Left Eye */}
                  <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                    <ellipse
                      cx="58"
                      cy="51"
                      rx="5"
                      ry={isBlinking ? 0.6 : 5}
                      fill="url(#bharathEyeGlow)"
                    />
                    {!isBlinking && <circle cx="59.5" cy="49.5" r="1.5" fill="#FFFFFF" />}
                  </g>

                  {/* Right Eye */}
                  <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                    <ellipse
                      cx="82"
                      cy="51"
                      rx="5"
                      ry={isBlinking ? 0.6 : 5}
                      fill="url(#bharathEyeGlow)"
                    />
                    {!isBlinking && <circle cx="83.5" cy="49.5" r="1.5" fill="#FFFFFF" />}
                  </g>

                  {/* Calm Idle Mouth */}
                  <path
                    d="M 65 62 Q 70 65 75 62"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}
            </motion.g>
          </motion.g>
        </svg>

        {/* Clean, Non-intrusive Mascot Identity Pill */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#131B2E]/90 border border-slate-200/90 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs group-hover:border-indigo-300 dark:group-hover:border-indigo-500/60 transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bharath AI</span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal ml-0.5">
            • Tap
          </span>
        </div>
      </button>
    </div>
  )
}
