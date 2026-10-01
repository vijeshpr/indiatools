import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const TricolorCursor: React.FC = () => {
  const reducedMotion = useReducedMotion()
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)

  // Spring physics for smooth 150ms trailing lag
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const [tiltAngle, setTiltAngle] = useState(0)
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() })
  const tiltTimer = useRef<number | null>(null)

  useEffect(() => {
    // Check if touch device
    if (typeof window !== 'undefined') {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsTouchDevice(hasTouch)
      if (hasTouch) return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      // Offset cursor slightly to top-right of pointer (18px x 14px)
      mouseX.set(e.clientX + 16)
      mouseY.set(e.clientY - 12)

      // Calculate velocity for subtle aerodynamic tilt
      const now = Date.now()
      const dt = Math.max(1, now - lastPos.current.time)
      const dx = e.clientX - lastPos.current.x
      const vx = dx / dt // px per ms

      const targetTilt = Math.max(-24, Math.min(24, vx * 18))
      setTiltAngle(targetTilt)

      lastPos.current = { x: e.clientX, y: e.clientY, time: now }

      if (tiltTimer.current) window.clearTimeout(tiltTimer.current)
      tiltTimer.current = window.setTimeout(() => {
        setTiltAngle(0) // gently settle to 0
      }, 140)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    // Detect hover on interactive cards/buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('button, a, input, select, textarea, [data-interactive="true"]')
      setIsHoveringInteractive(!!interactive)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (tiltTimer.current) window.clearTimeout(tiltTimer.current)
    }
  }, [isVisible, mouseX, mouseY])

  if (reducedMotion || isTouchDevice || !isVisible) {
    return null
  }

  // Animation duration accelerates when hovering over interactive elements
  const waveDuration = isHoveringInteractive ? '0.7s' : '1.4s'

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        rotate: tiltAngle,
      }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none will-change-transform"
    >
      <div className="relative group">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#FF9933]/25 via-white/20 to-[#138808]/25 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Flag Pole and Fabric Container */}
        <div className="relative flex items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          {/* Mast / Pole */}
          <div className="w-[2px] h-[22px] bg-gradient-to-b from-amber-200 via-neutral-300 to-neutral-500 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.5)]" />

          {/* Flowing Tricolor Fabric */}
          <div
            className="relative w-[30px] h-[18px] rounded-r-[2px] overflow-hidden origin-left"
            style={{
              animation: `flagWave ${waveDuration} ease-in-out infinite alternate`,
              transformOrigin: 'left center',
            }}
          >
            {/* Top Saffron Band */}
            <div className="h-[6px] w-full bg-[#FF9933] relative">
              {/* Fabric sheen reflection */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  animation: `fabricSheen ${waveDuration} ease-in-out infinite`,
                }}
              />
            </div>

            {/* Middle White Band with Ashoka Chakra */}
            <div className="h-[6px] w-full bg-[#FFFFFF] relative flex items-center justify-center">
              {/* Ashoka Chakra 24 Spokes SVG */}
              <svg
                viewBox="0 0 24 24"
                className="w-[5px] h-[5px] text-[#000080]"
                style={{
                  animation: `chakraSpin 8s linear infinite`,
                }}
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                {/* 24 spokes */}
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="22"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 15} 12 12)`}
                  />
                ))}
              </svg>
            </div>

            {/* Bottom Green Band */}
            <div className="h-[6px] w-full bg-[#138808] relative">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  animation: `fabricSheen ${waveDuration} ease-in-out infinite`,
                }}
              />
            </div>

            {/* Subtle soft fabric wave shadow overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/10 via-transparent to-black/15"
              style={{
                animation: `fabricShadow ${waveDuration} ease-in-out infinite alternate`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
