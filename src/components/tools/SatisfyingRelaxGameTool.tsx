import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Palette,
  Layers,
  Smile,
  ShieldCheck,
  CircleDot,
  Waves,
  Feather,
} from 'lucide-react'
import { ToolPageLayout } from './ToolPageLayout'
import { getToolBySlug } from '../../data/tools'
import { useI18n } from '../../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../../i18n/toolTranslations'
import {
  SatisfyingRelaxGameUI,
  satisfyingRelaxGameTranslations,
} from '../../i18n/tools/satisfyingRelaxGameI18n'
import { zenAudio } from '../../lib/zenAudio'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('satisfying-relax-game', satisfyingRelaxGameTranslations)

type GameMode = 'bubble' | 'sand' | 'fluid'
type ColorTheme = 'neon' | 'pastel' | 'gold' | 'emerald'

interface SandVoxel {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  settled: boolean
}

interface FluidParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  color: string
}

const THEME_PALETTES: Record<ColorTheme, {
  name: string
  bg: string
  bubbleGloss: string
  bubblePopped: string
  sandColors: string[]
  fluidGlow: string
  accent: string
}> = {
  neon: {
    name: 'Neon Glow',
    bg: '#080d1a',
    bubbleGloss: 'from-cyan-400/40 via-indigo-500/30 to-purple-500/20',
    bubblePopped: 'bg-neutral-900/60 border-neutral-800',
    sandColors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'],
    fluidGlow: '#06b6d4',
    accent: '#06b6d4',
  },
  pastel: {
    name: 'Pastel Calm',
    bg: '#0f172a',
    bubbleGloss: 'from-teal-300/35 via-sky-300/25 to-pink-300/20',
    bubblePopped: 'bg-neutral-900/50 border-neutral-800/80',
    sandColors: ['#a7f3d0', '#bae6fd', '#ddd6fe', '#fbcfe8', '#fef08a'],
    fluidGlow: '#a7f3d0',
    accent: '#38bdf8',
  },
  gold: {
    name: 'Liquid Gold',
    bg: '#141008',
    bubbleGloss: 'from-amber-400/45 via-yellow-500/35 to-orange-500/25',
    bubblePopped: 'bg-neutral-900/70 border-neutral-800',
    sandColors: ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7', '#b45309'],
    fluidGlow: '#fbbf24',
    accent: '#f59e0b',
  },
  emerald: {
    name: 'Dark Emerald',
    bg: '#061412',
    bubbleGloss: 'from-emerald-400/40 via-teal-500/30 to-cyan-500/20',
    bubblePopped: 'bg-neutral-900/60 border-neutral-800',
    sandColors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#047857'],
    fluidGlow: '#10b981',
    accent: '#10b981',
  },
}

export const SatisfyingRelaxGameTool: React.FC = () => {
  const tool = getToolBySlug('satisfying-relax-game')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } =
    useToolTranslations<SatisfyingRelaxGameUI>('satisfying-relax-game', locale)

  // Controls State
  const [mode, setMode] = useState<GameMode>('bubble')
  const [theme, setTheme] = useState<ColorTheme>('neon')
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.65)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Game Mode Stats & State
  const [bubblesPoppedCount, setBubblesPoppedCount] = useState<number>(0)
  const [bubblesGrid, setBubblesGrid] = useState<boolean[]>(() => Array(70).fill(false))
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false)

  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  // Physics Data Refs
  const voxelsRef = useRef<SandVoxel[]>([])
  const fluidParticlesRef = useRef<FluidParticle[]>([])
  const lastMousePos = useRef<{ x: number; y: number } | null>(null)

  // Audio Sync
  useEffect(() => {
    zenAudio.setVolume(volume)
    zenAudio.setMuted(isMuted)
  }, [volume, isMuted])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // =========================================================
  // 1. BUBBLE WRAP LOGIC
  // =========================================================
  const popBubble = useCallback(
    (index: number) => {
      if (bubblesGrid[index]) return
      setBubblesGrid((prev) => {
        const next = [...prev]
        next[index] = true
        return next
      })
      setBubblesPoppedCount((prev) => prev + 1)
      const pitchMod = 0.85 + (index % 10) * 0.04
      zenAudio.playBubblePop(pitchMod)
    },
    [bubblesGrid]
  )

  const handleBubblePointerMove = useCallback(
    (index: number) => {
      if (isPointerDown && !bubblesGrid[index]) {
        popBubble(index)
      }
    },
    [isPointerDown, bubblesGrid, popBubble]
  )

  const resetBubbles = () => {
    setBubblesGrid(Array(70).fill(false))
    setBubblesPoppedCount(0)
  }

  // =========================================================
  // 2. KINETIC SAND & FLUID CANVAS ENGINE
  // =========================================================
  const initSandVoxels = useCallback((width: number, height: number, colors: string[]) => {
    const voxels: SandVoxel[] = []
    const startX = width * 0.2
    const endX = width * 0.8
    const startY = height * 0.25
    const endY = height * 0.65
    const step = 14

    for (let x = startX; x <= endX; x += step) {
      for (let y = startY; y <= endY; y += step) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        voxels.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: 0,
          vy: 0,
          size: step * 0.85,
          color,
          settled: true,
        })
      }
    }
    voxelsRef.current = voxels
  }, [])

  const resetActiveCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const width = canvas.width
    const height = canvas.height
    const currentTheme = THEME_PALETTES[theme]

    if (mode === 'sand') {
      initSandVoxels(width, height, currentTheme.sandColors)
    } else if (mode === 'fluid') {
      fluidParticlesRef.current = []
    }
  }, [mode, theme, initSandVoxels])

  // Canvas Resize Handler
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = Math.max(380, rect.height) * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${Math.max(380, rect.height)}px`
      resetActiveCanvas()
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mode, theme, resetActiveCanvas])

  // Canvas Interactive Loop (Sand & Fluid)
  useEffect(() => {
    if (mode === 'bubble') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let isRunning = true

    const loop = () => {
      if (!isRunning) return
      const width = canvas.width
      const height = canvas.height
      const currentTheme = THEME_PALETTES[theme]

      ctx.fillStyle = currentTheme.bg
      ctx.fillRect(0, 0, width, height)

      // === KINETIC SAND PHYSICS ===
      if (mode === 'sand') {
        const voxels = voxelsRef.current
        for (let i = 0; i < voxels.length; i++) {
          const v = voxels[i]
          if (!v.settled) {
            v.vy += 0.35 // Gravity
            v.vx *= 0.96 // Air friction
            v.x += v.vx
            v.y += v.vy

            // Floor collision & damping
            if (v.y >= height - v.size - 8) {
              v.y = height - v.size - 8
              v.vy = -v.vy * 0.2
              v.vx *= 0.8
              if (Math.abs(v.vy) < 0.2 && Math.abs(v.vx) < 0.2) {
                v.settled = true
              }
            }
          }

          // Draw Sand Voxel with rounded bevel
          ctx.fillStyle = v.color
          ctx.beginPath()
          ctx.arc(v.x, v.y, v.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // === FLUID RIPPLES SIMULATION ===
      if (mode === 'fluid') {
        const particles = fluidParticlesRef.current
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.98
          p.vy *= 0.98
          p.life -= 1

          const progress = p.life / p.maxLife
          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }

          // Render glowing ripple particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * progress, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = progress * 0.85
          ctx.fill()

          // Ambient outer glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 2.5 * progress, 0, Math.PI * 2)
          ctx.fillStyle = currentTheme.fluidGlow
          ctx.globalAlpha = progress * 0.15
          ctx.fill()
        }
        ctx.globalAlpha = 1.0
      }

      animationFrameId.current = requestAnimationFrame(loop)
    }

    animationFrameId.current = requestAnimationFrame(loop)

    return () => {
      isRunning = false
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [mode, theme])

  // Canvas Pointer Interaction for Sand & Fluid
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const currentX = (e.clientX - rect.left) * scaleX
    const currentY = (e.clientY - rect.top) * scaleY

    const isInteracting = e.buttons > 0 || e.pointerType === 'touch'

    // Sand Slicing Interaction
    if (mode === 'sand' && isInteracting && lastMousePos.current) {
      const sliceRadius = 32
      const voxels = voxelsRef.current
      let slicedCount = 0

      for (let i = 0; i < voxels.length; i++) {
        const v = voxels[i]
        const dx = v.x - currentX
        const dy = v.y - currentY
        const dist = Math.hypot(dx, dy)

        if (dist < sliceRadius && v.settled) {
          v.settled = false
          const angle = Math.atan2(dy, dx)
          v.vx = Math.cos(angle) * (2 + Math.random() * 4)
          v.vy = Math.sin(angle) * (2 + Math.random() * 4) - 2
          slicedCount++
        }
      }

      if (slicedCount > 0) {
        zenAudio.playSandSlice(1 + Math.random() * 0.2)
      }
    }

    // Fluid Particles Creation
    if (mode === 'fluid') {
      const particles = fluidParticlesRef.current
      const currentTheme = THEME_PALETTES[theme]
      const count = isInteracting ? 5 : 2

      for (let k = 0; k < count; k++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3 + 1
        particles.push({
          x: currentX + (Math.random() - 0.5) * 16,
          y: currentY + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 18 + 8,
          life: 45 + Math.random() * 25,
          maxLife: 70,
          color: currentTheme.sandColors[Math.floor(Math.random() * currentTheme.sandColors.length)],
        })
      }

      if (isInteracting && Math.random() < 0.25) {
        zenAudio.playFluidRipple((currentY / canvas.height) * 300)
      }
    }

    lastMousePos.current = { x: currentX, y: currentY }
  }

  // Result Summary for Sharing
  const getResultSummary = () => {
    return `Zen Relaxation Sandbox Activity:
- Mode: ${mode.toUpperCase()}
- Bubbles Popped: ${bubblesPoppedCount}
- Theme Atmosphere: ${THEME_PALETTES[theme].name}
- Relaxing 100% Client-Side Physics Game
Play for free on IndiaTools: https://indiatools-rho.vercel.app/calculators/satisfying-relax-game`
  }

  // Localized Tool Shell
  const localizedTool = useMemo(() => {
    return {
      ...tool,
      title: meta.title,
      detailedDescription: meta.subtitle,
      formulaExplanation: formulaExplanation || tool.formulaExplanation,
      assumptions: assumptions || tool.assumptions,
      exampleCalculation: example
        ? {
            title: example.title,
            inputs: example.inputs,
            outputs: example.outputs,
            explanation: example.explanation,
          }
        : tool.exampleCalculation,
      faqs: faqs && faqs.length > 0 ? faqs : tool.faqs,
    }
  }, [tool, meta, formulaExplanation, assumptions, example, faqs])

  return (
    <ToolPageLayout
      tool={localizedTool}
      onReset={() => {
        resetBubbles()
        resetActiveCanvas()
      }}
      onCopyResult={getResultSummary}
      customH1={meta.h1}
      customSubtitle={meta.subtitle}
      maxWidthClass="max-w-6xl"
    >
      <div
        ref={containerRef}
        className={`space-y-6 ${
          isFullscreen ? 'fixed inset-0 z-50 bg-[#060a12] p-6 overflow-y-auto' : ''
        }`}
      >
        {/* Navigation & Mode Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b1325]/80 border border-cyan-500/20 shadow-xl backdrop-blur-md">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              type="button"
              onClick={() => setMode('bubble')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                mode === 'bubble'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CircleDot className="w-4 h-4" />
              <span>{ui.modeBubble}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('sand')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                mode === 'sand'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Feather className="w-4 h-4" />
              <span>{ui.modeSand}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('fluid')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                mode === 'fluid'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>{ui.modeFluid}</span>
            </button>
          </div>

          {/* Controls: Audio, Themes, Fullscreen */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Volume & Mute */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-neutral-400 hover:text-cyan-400 transition-colors"
                title={isMuted ? ui.unmuteButton : ui.muteButton}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
                title={ui.volumeLabel}
              />
            </div>

            {/* Atmosphere Theme Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ColorTheme)}
                className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="neon" className="bg-neutral-900 text-white">Neon Glow</option>
                <option value="pastel" className="bg-neutral-900 text-white">Pastel Calm</option>
                <option value="gold" className="bg-neutral-900 text-white">Liquid Gold</option>
                <option value="emerald" className="bg-neutral-900 text-white">Dark Emerald</option>
              </select>
            </div>

            {/* Reset Canvas Button */}
            <button
              type="button"
              onClick={() => {
                resetBubbles()
                resetActiveCanvas()
              }}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title={ui.resetButton}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title={isFullscreen ? ui.exitFullscreen : ui.fullscreenButton}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Sandbox Workspace Area */}
        <div
          className="relative rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl p-4 sm:p-6 min-h-[460px] flex flex-col justify-center transition-colors duration-500"
          style={{ backgroundColor: THEME_PALETTES[theme].bg }}
          onPointerDown={() => setIsPointerDown(true)}
          onPointerUp={() => setIsPointerDown(false)}
          onPointerLeave={() => {
            setIsPointerDown(false)
            lastMousePos.current = null
          }}
        >
          {/* Mode 1: Infinite Bubble Wrap */}
          {mode === 'bubble' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {ui.bubbleHint}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  {ui.popCountLabel}: {bubblesPoppedCount}
                </span>
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-10 gap-2.5 sm:gap-3.5 select-none touch-none">
                {bubblesGrid.map((popped, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: popped ? 1.0 : 1.08 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => popBubble(idx)}
                    onPointerEnter={() => handleBubblePointerMove(idx)}
                    className={`aspect-square rounded-full transition-all duration-150 relative overflow-hidden flex items-center justify-center cursor-pointer ${
                      popped
                        ? 'bg-neutral-900/60 border border-neutral-800/80 shadow-inner scale-95 opacity-55'
                        : `bg-gradient-to-br ${THEME_PALETTES[theme].bubbleGloss} border border-cyan-400/40 shadow-lg shadow-cyan-500/20 backdrop-blur-md`
                    }`}
                  >
                    {!popped && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/70 absolute top-2 left-2 blur-[0.5px]" />
                    )}
                    {popped && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-700/80" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2 & 3: Kinetic Sand / Fluid Ripples HTML5 Canvas */}
          {(mode === 'sand' || mode === 'fluid') && (
            <div className="relative w-full h-[440px] rounded-2xl overflow-hidden touch-none select-none">
              <div className="absolute top-3 left-4 z-10 pointer-events-none">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 bg-neutral-950/70 px-2.5 py-1 rounded-lg border border-neutral-800">
                  {mode === 'sand' ? ui.sandHint : ui.fluidHint}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                onPointerMove={handleCanvasPointerMove}
                className="w-full h-full cursor-crosshair block"
              />
            </div>
          )}
        </div>

        {/* Sensory Feedback & Leisure Notice Card */}
        <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-neutral-300">
              {ui.zenDisclaimer}
            </p>
            <p className="text-[11px] text-neutral-500">
              {ui.hapticNotice} Built with 100% in-browser Web Audio synthesis and adaptive HTML5 Canvas rendering. Zero network tracking.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
