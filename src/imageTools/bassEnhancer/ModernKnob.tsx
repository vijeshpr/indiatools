/**
 * Modern High-End DAW / Synth Precision Knob
 * Inspired by contemporary software synthesizers (Serum, FabFilter).
 * Features spring drag physics, rotary SVG arc, value pop badge, and subtle neon bloom.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModernKnobProps {
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

export const ModernKnob: React.FC<ModernKnobProps> = ({
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
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dragStartYRef = useRef<number>(0)
  const startValRef = useRef<number>(value)
  const knobRef = useRef<HTMLDivElement>(null)

  // Accent styling mappings
  const colorMap = {
    crimson: {
      stroke: '#ff2d55',
      glow: 'rgba(255, 45, 85, 0.45)',
      text: 'text-[#ff2d55]',
      border: 'border-[#ff2d55]/30',
      badge: 'bg-[#ff2d55] text-white',
    },
    amber: {
      stroke: '#ffb800',
      glow: 'rgba(255, 184, 0, 0.45)',
      text: 'text-[#ffb800]',
      border: 'border-[#ffb800]/30',
      badge: 'bg-[#ffb800] text-black font-black',
    },
    cyan: {
      stroke: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.45)',
      text: 'text-[#00f0ff]',
      border: 'border-[#00f0ff]/30',
      badge: 'bg-[#00f0ff] text-black font-black',
    },
  }

  const currentTheme = colorMap[accentColor]

  // Value normalization: 0.0 to 1.0
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))

  // Angle math: from -135deg (min) to +135deg (max) => total 270 degrees
  const startAngle = -135
  const endAngle = 135
  const currentAngle = startAngle + normalized * 270

  // SVG Arc calculation for radius 28
  const r = 26
  const circumference = 2 * Math.PI * r
  // Total arc length is 270 / 360 = 0.75 of circumference
  const arcTotalLength = circumference * 0.75
  const strokeDashoffset = arcTotalLength * (1 - normalized)

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    dragStartYRef.current = e.clientY
    startValRef.current = value

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = dragStartYRef.current - moveEvent.clientY
      const range = max - min
      // 180 pixels of vertical drag traverses the full range
      const change = (deltaY / 180) * range
      let next = startValRef.current + change

      // Apply step
      if (step) {
        next = Math.round(next / step) * step
      }
      next = Math.max(min, Math.min(max, next))
      onChange(next)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  // Double Click reset
  const handleDoubleClick = () => {
    if (disabled) return
    if (defaultValue !== undefined) {
      onChange(defaultValue)
    } else {
      onChange(min + (max - min) * 0.5)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(Math.min(max, value + (step || 1)))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(Math.max(min, value - (step || 1)))
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center select-none ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pop Value Bubble on Drag */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className={`absolute -top-7 z-30 px-2 py-0.5 rounded text-[11px] tracking-wider shadow-lg ${currentTheme.badge}`}
          >
            {value}
            {unit}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotary Knob Container */}
      <div
        ref={knobRef}
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        className="relative w-16 h-16 rounded-full cursor-ns-resize flex items-center justify-center outline-none group"
      >
        {/* Background Track SVG Arc */}
        <svg className="w-16 h-16 -rotate-90 transform pointer-events-none" viewBox="0 0 64 64">
          {/* Base Empty Track */}
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.5"
            strokeDasharray={`${arcTotalLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(135 32 32)"
          />

          {/* Active Colored Arc */}
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={currentTheme.stroke}
            strokeWidth="3.5"
            strokeDasharray={`${arcTotalLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135 32 32)"
            style={{
              filter: isDragging || isHovered ? `drop-shadow(0 0 6px ${currentTheme.glow})` : undefined,
              transition: isDragging ? 'none' : 'stroke-dashoffset 0.1s ease-out',
            }}
          />
        </svg>

        {/* Center Modern Flat Dial with Lighting Specular */}
        <motion.div
          animate={{
            scale: isDragging ? 0.96 : isHovered ? 1.03 : 1.0,
            boxShadow: isDragging
              ? `0 0 16px ${currentTheme.glow}`
              : isHovered
              ? `0 0 10px ${currentTheme.glow}`
              : '0 4px 12px rgba(0, 0, 0, 0.6)',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="absolute w-11 h-11 rounded-full bg-gradient-to-b from-slate-800 to-[#121215] border border-white/10 flex items-center justify-center"
        >
          {/* Inner Needle Indicator */}
          <div
            className="w-full h-full relative"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full"
              style={{
                backgroundColor: currentTheme.stroke,
                boxShadow: `0 0 5px ${currentTheme.glow}`,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Numerical Mono Readout */}
      <div className="mt-1 flex items-baseline gap-0.5 font-mono text-xs font-bold text-white tracking-wider">
        <span>{value}</span>
        <span className="text-[10px] text-slate-400">{unit}</span>
      </div>

      {/* Param Label */}
      <div className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase mt-0.5 text-center">
        {label}
      </div>

      {description && (
        <div className="text-[9px] text-slate-500 text-center max-w-[90px] leading-tight mt-0.5">
          {description}
        </div>
      )}
    </div>
  )
}
