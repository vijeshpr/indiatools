import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface TricolorScrollRibbonProps {
  variant?: 'transition' | 'ambient'
}

export const TricolorScrollRibbon: React.FC<TricolorScrollRibbonProps> = ({ variant = 'ambient' }) => {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Transform scroll progress into flowing coordinates
  // Ribbon enters gracefully, waves across as user scrolls between sections, and recedes
  const xOffset = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-180, 40, -20, 60, -120])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.45, 0.55, 0.75, 0.9, 1],
    [0.15, 0.65, 0.4, 0.75, 0.45, 0.7, 0.4, 0.15]
  )
  const scaleY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.85, 1.15, 0.9, 1.05])
  const rotateAngle = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 2, -1])

  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF9933]/30 via-white/20 to-[#138808]/30 opacity-40 z-20" />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-[5] select-none"
    >
      <motion.div
        style={{
          x: xOffset,
          scaleY,
          rotate: rotateAngle,
          opacity,
        }}
        className="absolute top-1/4 -right-16 w-[125vw] max-w-[1700px] h-[320px] will-change-transform mix-blend-screen dark:mix-blend-lighten filter drop-shadow-[0_12px_36px_rgba(255,153,51,0.08)]"
      >
        <svg
          viewBox="0 0 1600 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Saffron gradient with silky light reflection */}
            <linearGradient id="saffronFabric" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0" />
              <stop offset="20%" stopColor="#FF9933" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFA64D" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#FF8000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
            </linearGradient>

            {/* Pure White gradient */}
            <linearGradient id="whiteFabric" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="75%" stopColor="#F1F5F9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* India Green gradient */}
            <linearGradient id="greenFabric" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#138808" stopOpacity="0" />
              <stop offset="20%" stopColor="#138808" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#1EB010" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#0E6B05" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#138808" stopOpacity="0" />
            </linearGradient>

            <filter id="softRibbonBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Saffron Wave Ribbon */}
          <path
            d="M0,80 C320,130 580,20 890,75 C1200,130 1420,50 1600,85 L1600,125 C1420,90 1200,165 890,115 C580,60 320,170 0,120 Z"
            fill="url(#saffronFabric)"
            filter="url(#softRibbonBlur)"
          />

          {/* White Center Ribbon */}
          <path
            d="M0,118 C320,168 580,58 890,113 C1200,168 1420,88 1600,123 L1600,158 C1420,123 1200,198 890,148 C580,95 320,203 0,153 Z"
            fill="url(#whiteFabric)"
          />

          {/* Subtle Ashoka Chakra Motif embedded in the flowing white ribbon */}
          <g transform="translate(870, 130) scale(0.9)" opacity="0.45">
            <circle cx="16" cy="16" r="14" stroke="#000080" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="16" r="2.5" fill="#000080" />
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="16"
                y1="3"
                x2="16"
                y2="29"
                stroke="#000080"
                strokeWidth="0.8"
                transform={`rotate(${i * 15} 16 16)`}
              />
            ))}
          </g>

          {/* India Green Wave Ribbon */}
          <path
            d="M0,151 C320,201 580,93 890,146 C1200,201 1420,121 1600,156 L1600,198 C1420,162 1200,237 890,187 C580,132 320,242 0,192 Z"
            fill="url(#greenFabric)"
            filter="url(#softRibbonBlur)"
          />
        </svg>
      </motion.div>
    </div>
  )
}

/**
 * Section Wave Divider - can be placed between major categories on homepage
 */
export const SectionTricolorDivider: React.FC = () => {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative w-full py-10 overflow-hidden flex items-center justify-center pointer-events-none select-none">
      <div className="w-full max-w-5xl h-[2px] relative flex items-center">
        {/* Left fade */}
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#FF9933]/60 to-[#FF9933]" />
        
        {/* Center Ashoka Chakra emblem */}
        <div className="mx-3 relative flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[#000080] dark:text-[#4B6BFB]"
            style={reducedMotion ? {} : { animation: 'chakraSpin 20s linear infinite' }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="12"
                y1="3"
                x2="12"
                y2="21"
                stroke="currentColor"
                strokeWidth="0.7"
                transform={`rotate(${i * 15} 12 12)`}
              />
            ))}
          </svg>
        </div>

        {/* Right fade */}
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[#138808] via-[#138808]/60 to-transparent" />
      </div>
    </div>
  )
}
