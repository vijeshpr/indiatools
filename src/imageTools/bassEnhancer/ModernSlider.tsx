/**
 * Modern Linear Precision Slider with Glow Fill & Tooltip
 */

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModernSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  defaultValue?: number
  accentColor?: 'crimson' | 'amber' | 'cyan'
  onChange: (val: number) => void
  disabled?: boolean
  description?: string
}

export const ModernSlider: React.FC<ModernSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '%',
  defaultValue,
  accentColor = 'crimson',
  onChange,
  disabled = false,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const colorMap = {
    crimson: {
      fill: 'from-[#ff2d55] to-rose-600',
      thumb: 'bg-[#ff2d55] shadow-[0_0_12px_#ff2d55]',
      border: 'border-[#ff2d55]/40',
      badge: 'bg-[#ff2d55] text-white',
    },
    amber: {
      fill: 'from-[#ffb800] to-yellow-500',
      thumb: 'bg-[#ffb800] shadow-[0_0_12px_#ffb800]',
      border: 'border-[#ffb800]/40',
      badge: 'bg-[#ffb800] text-black font-black',
    },
    cyan: {
      fill: 'from-[#00f0ff] to-cyan-500',
      thumb: 'bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]',
      border: 'border-[#00f0ff]/40',
      badge: 'bg-[#00f0ff] text-black font-black',
    },
  }

  const currentTheme = colorMap[accentColor]
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()

    const updateFromPosition = (clientX: number) => {
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      let next = min + fraction * (max - min)
      if (step) {
        next = Math.round(next / step) * step
      }
      next = Math.max(min, Math.min(max, next))
      onChange(next)
    }

    updateFromPosition(e.clientX)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateFromPosition(moveEvent.clientX)
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handleDoubleClick = () => {
    if (disabled) return
    if (defaultValue !== undefined) {
      onChange(defaultValue)
    } else {
      onChange(min + (max - min) * 0.5)
    }
  }

  return (
    <div
      className={`w-full select-none ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Label and Mono Value */}
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
          {label}
        </div>
        <div className="font-mono font-bold text-white tracking-wider flex items-center gap-0.5">
          <span>{value}</span>
          <span className="text-[10px] text-slate-400">{unit}</span>
        </div>
      </div>

      {/* Slider Track Container */}
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative h-6 flex items-center cursor-pointer group outline-none"
      >
        {/* Base Hollow Track */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden relative">
          {/* Active Glowing Filled Bar */}
          <div
            className={`h-full rounded-full bg-gradient-to-r ${currentTheme.fill} transition-all duration-75`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb with Spring Animation */}
        <motion.div
          animate={{
            scale: isHovered || isFocused ? 1.25 : 1.0,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 400 }}
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white ${currentTheme.thumb} -ml-2 pointer-events-none transition-shadow`}
          style={{ left: `${percentage}%` }}
        />
      </div>

      {description && (
        <div className="text-[10px] text-slate-500 mt-1 leading-snug">
          {description}
        </div>
      )}
    </div>
  )
}
