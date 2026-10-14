import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ToolCategory } from '../../types'

interface CategoryAnimationPreviewProps {
  category: ToolCategory | string
  isHovered: boolean
  accentColor?: string
}

export const CategoryAnimationPreview: React.FC<CategoryAnimationPreviewProps> = ({
  category,
  isHovered,
  accentColor = '#10B981',
}) => {
  // If not hovered, don't run active canvas loops
  if (!isHovered) {
    return null
  }

  // Render category-specific visual animation
  switch (category) {
    case 'money':
      return <MoneyCoinsAnimation />
    case 'audio':
      return <AudioWaveformAnimation />
    case 'image':
      return <ImageTransformAnimation />
    case 'video':
      return <VideoCinematicAnimation />
    case 'pdf':
      return <PdfDocumentAnimation />
    case 'security':
      return <SecurityShieldAnimation />
    case 'developer':
      return <DeveloperCodeAnimation />
    case 'utilities':
    case 'drive':
    case 'build':
    case 'power':
    case 'land':
    case 'work':
    default:
      return <EverydayUtilityAnimation />
  }
}

/**
 * A. MONEY & FINANCE — Realistic Gold Coins Bursting & Spinning
 */
const MoneyCoinsAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const coins = Array.from({ length: 8 }, (_, i) => ({
      x: canvas.width / 2,
      y: canvas.height * 0.75,
      vx: (Math.random() - 0.5) * 3.8,
      vy: -Math.random() * 4.2 - 2.5,
      gravity: 0.14,
      rotX: Math.random() * Math.PI,
      rotSpeed: 0.08 + Math.random() * 0.12,
      radius: 9 + Math.random() * 4,
      color: i % 2 === 0 ? '#F59E0B' : '#D8B879',
      edgeColor: '#B45309',
    }))

    const sparkles = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      alpha: Math.random(),
      speed: 0.03 + Math.random() * 0.04,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sparkles
      sparkles.forEach((s) => {
        s.alpha += s.speed
        const currentAlpha = (Math.sin(s.alpha) + 1) / 2
        ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha * 0.7})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Coins
      coins.forEach((c) => {
        c.x += c.vx
        c.y += c.vy
        c.vy += c.gravity
        c.rotX += c.rotSpeed

        // Coin thickness projection using rotX
        const scaleY = Math.abs(Math.cos(c.rotX))

        ctx.save()
        ctx.translate(c.x, c.y)

        // Outer rim
        ctx.fillStyle = c.edgeColor
        ctx.beginPath()
        ctx.ellipse(0, 0, c.radius, Math.max(1, c.radius * scaleY), 0, 0, Math.PI * 2)
        ctx.fill()

        // Inner coin face
        ctx.fillStyle = c.color
        ctx.beginPath()
        ctx.ellipse(0, 0, c.radius * 0.85, Math.max(0.8, c.radius * 0.85 * scaleY), 0, 0, Math.PI * 2)
        ctx.fill()

        // Specular highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.ellipse(0, 0, c.radius * 0.65, Math.max(0.5, c.radius * 0.65 * scaleY), 0, 0, Math.PI)
        ctx.stroke()

        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-[#D8B879]/15 via-[#10271C]/40 to-transparent">
      <canvas ref={canvasRef} width={280} height={110} className="w-full h-full object-cover" />
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#07130E]/80 border border-[#D8B879]/30 text-[9px] font-mono font-bold text-[#D8B879]">
        3D WEALTH MATRIX
      </div>
    </div>
  )
}

/**
 * B. AUDIO & STUDIO — Layered Oscilloscope Waveforms & Radiating Waves
 */
const AudioWaveformAnimation: React.FC = () => {
  const bars = [18, 42, 68, 92, 54, 78, 35, 88, 62, 45, 95, 30, 72, 85, 40]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-purple-900/25 via-[#10271C]/50 to-transparent flex items-center justify-center p-3">
      {/* Concentric sound wave pulses */}
      <motion.div
        animate={{ scale: [0.8, 1.4], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-20 h-20 rounded-full border border-purple-400/40"
      />
      <motion.div
        animate={{ scale: [0.8, 1.6], opacity: [0.4, 0] }}
        transition={{ duration: 1.6, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-20 h-20 rounded-full border border-pink-500/30"
      />

      {/* Dynamic Waveform Bars */}
      <div className="relative z-10 flex items-center gap-1.5 h-14">
        {bars.map((height, idx) => (
          <motion.div
            key={idx}
            animate={{
              height: [`${height * 0.35}%`, `${height}%`, `${height * 0.45}%`],
            }}
            transition={{
              duration: 0.6 + (idx % 4) * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 via-pink-400 to-amber-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          />
        ))}
      </div>

      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#07130E]/80 border border-purple-500/30 text-[9px] font-mono font-bold text-purple-300">
        AUDIO MASTERING DSP
      </div>
    </div>
  )
}

/**
 * C. IMAGE & GRAPHICS — Before/After Split Scan & Pixel Reconstitution
 */
const ImageTransformAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-emerald-950/30 via-[#10271C]/60 to-transparent">
      {/* Moving Vertical Laser Scanner */}
      <motion.div
        animate={{ x: ['-20%', '120%', '-20%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
      />

      {/* Pixel Grid Matrix */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-1.5 p-4 opacity-40">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.9, 0.3] }}
            transition={{ duration: 1.2, delay: (i % 6) * 0.15, repeat: Infinity }}
            className="rounded-sm bg-emerald-500/30 border border-emerald-400/40"
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="px-3 py-1 rounded-lg bg-[#07130E]/90 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>NEURAL IMAGE PIPELINE</span>
        </div>
      </div>
    </div>
  )
}

/**
 * D. VIDEO & SCREEN — 35mm Film Strip & Focus Rectangle
 */
const VideoCinematicAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-cyan-950/30 via-[#10271C]/60 to-transparent flex items-center justify-center">
      {/* Film Strip Sprockets */}
      <div className="w-full flex flex-col justify-between h-full py-2 px-3 opacity-30">
        <div className="flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-2 h-1.5 bg-cyan-400 rounded-xs" />
          ))}
        </div>
        <div className="flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-2 h-1.5 bg-cyan-400 rounded-xs" />
          ))}
        </div>
      </div>

      {/* Cinematic Focus Reticle */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-24 h-14 border border-cyan-400/60 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
      >
        <div className="w-2 h-2 border-t-2 border-l-2 border-cyan-300 absolute -top-1 -left-1" />
        <div className="w-2 h-2 border-t-2 border-r-2 border-cyan-300 absolute -top-1 -right-1" />
        <div className="w-2 h-2 border-b-2 border-l-2 border-cyan-300 absolute -bottom-1 -left-1" />
        <div className="w-2 h-2 border-b-2 border-r-2 border-cyan-300 absolute -bottom-1 -right-1" />
        <span className="text-[9px] font-mono font-bold text-cyan-300">REC 4K HDR</span>
      </motion.div>
    </div>
  )
}

/**
 * E. PDF & DOCUMENTS — 3D Separating Document Sheets & Scan Lines
 */
const PdfDocumentAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-amber-950/30 via-[#10271C]/60 to-transparent flex items-center justify-center">
      <div className="relative w-28 h-16">
        {/* Layer 3 */}
        <motion.div
          animate={{ x: [0, 8, 0], y: [0, -6, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-lg bg-amber-600/30 border border-amber-500/40"
        />
        {/* Layer 2 */}
        <motion.div
          animate={{ x: [0, -6, 0], y: [0, -3, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          className="absolute inset-0 rounded-lg bg-amber-500/35 border border-amber-400/50"
        />
        {/* Layer 1 (Top Sheet) */}
        <div className="relative z-10 w-full h-full rounded-lg bg-[#07130E]/90 border border-amber-400/70 p-2 flex flex-col justify-between shadow-lg">
          <div className="space-y-1">
            <div className="w-12 h-1 bg-amber-400/80 rounded-full" />
            <div className="w-20 h-1 bg-amber-400/40 rounded-full" />
            <div className="w-16 h-1 bg-amber-400/30 rounded-full" />
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono text-amber-300 font-bold">
            <span>IN-MEMORY RAM</span>
            <span>PDF/X-4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * F. SECURITY & CRYPTOGRAPHY — Shield Node Matrix & Lock Shackle
 */
const SecurityShieldAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-emerald-950/40 via-[#10271C]/60 to-transparent flex items-center justify-center">
      {/* Encrypted Binary Flow */}
      <div className="absolute inset-0 opacity-20 font-mono text-[8px] text-emerald-400 p-2 overflow-hidden flex flex-col justify-between">
        <div>AES-256-GCM / 0x7F9A0B</div>
        <div>SHA-512 INTEGRITY VERIFIED</div>
        <div>ZERO-KNOWLEDGE EPHEMERAL</div>
      </div>

      {/* Cyber Shield */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 p-2.5 rounded-2xl bg-[#07130E]/90 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span className="text-[9px] font-mono font-bold text-emerald-300">
          ZERO LEAKS
        </span>
      </motion.div>
    </div>
  )
}

/**
 * G. DEVELOPER TOOLS — Syntax Typing & Node Connections
 */
const DeveloperCodeAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-cyan-950/30 via-[#10271C]/60 to-transparent p-3 font-mono text-[9px] flex flex-col justify-center space-y-1">
      <div className="text-cyan-400/90 flex items-center gap-1">
        <span className="text-pink-400">const</span> engine = <span className="text-yellow-400">new</span> WebAssembly();
      </div>
      <div className="text-emerald-400/90">
        &gt; tokens: <span className="text-[#D8B879]">32,768</span> / prompt
      </div>
      <div className="text-slate-400 flex items-center gap-1">
        <span>&gt; status: 200 OK</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-1.5 h-3 bg-cyan-400 inline-block"
        />
      </div>
    </div>
  )
}

/**
 * H. INDIA & EVERYDAY UTILITIES — Active Speedometer Sweep & Engineering Grid
 */
const EverydayUtilityAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl bg-gradient-to-b from-orange-950/25 via-[#10271C]/60 to-transparent flex items-center justify-center">
      {/* Speedometer Radial Gauge */}
      <div className="relative w-24 h-16 flex items-end justify-center">
        {/* Outer Arc */}
        <svg viewBox="0 0 100 55" className="w-24 h-14">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(249, 115, 22, 0.25)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <motion.path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#F97316"
            strokeWidth="6"
            strokeDasharray="125"
            animate={{ strokeDashoffset: [125, 30, 80, 15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Pivot & Needle */}
        <motion.div
          animate={{ rotate: [-45, 45, 10, 60, -45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1 w-0.5 h-10 bg-[#F3F0E5] origin-bottom shadow-md"
        />
        <div className="absolute bottom-0 w-3 h-3 rounded-full bg-[#F97316] border border-white" />
      </div>

      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#07130E]/80 border border-[#F97316]/30 text-[9px] font-mono font-bold text-[#F97316]">
        PRACTICAL METRICS
      </div>
    </div>
  )
}
