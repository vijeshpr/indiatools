import React, { useEffect, useRef, useState } from 'react'

interface BotanicalHero3DProps {
  className?: string
}

interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotSpeed: number
  flipAngle: number
  flipSpeed: number
  type: 'rose' | 'lily' | 'jasmine' | 'orchid' | 'leaf'
  color: string
  opacity: number
  oscillationAmp: number
  oscillationSpeed: number
  oscillationOffset: number
}

export const BotanicalHero3D: React.FC<BotanicalHero3DProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const targetParallax = useRef({ x: 0, y: 0 })
  const mousePos = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 })

  // 1. Silky Smooth Lerped Parallax with mouse tracking
  useEffect(() => {
    let animId: number
    let currentX = 0
    let currentY = 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return
      const { innerWidth, innerHeight } = window
      // Max 22px parallax for rich multi-plane optical depth
      targetParallax.current.x = (e.clientX / innerWidth - 0.5) * 22
      targetParallax.current.y = (e.clientY / innerHeight - 0.5) * 16

      // Track cursor velocity for subtle wind impulses
      const dx = e.clientX - mousePos.current.prevX
      const dy = e.clientY - mousePos.current.prevY
      mousePos.current.speed = Math.min(15, Math.hypot(dx, dy))
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      mousePos.current.prevX = e.clientX
      mousePos.current.prevY = e.clientY
    }

    const updateParallax = () => {
      if (!prefersReducedMotion) {
        // Smooth lerp damping (0.08)
        currentX += (targetParallax.current.x - currentX) * 0.08
        currentY += (targetParallax.current.y - currentY) * 0.08
        setParallax({ x: currentX, y: currentY })

        // Decay mouse impulse
        mousePos.current.speed *= 0.92
      }
      animId = requestAnimationFrame(updateParallax)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animId = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  // 2. Realistic 3D Tumbling Falling Petals Physics
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const petals: Petal[] = []
    const petalPalette: Array<{ type: Petal['type']; color: string }> = [
      { type: 'rose', color: '#BE123C' },     // Velvety Crimson Rose
      { type: 'rose', color: '#9F1239' },     // Deep Dark Rose
      { type: 'lily', color: '#F43F5E' },     // Stargazer Lily Pink
      { type: 'lily', color: '#FB7185' },     // Soft Cabbage Rose
      { type: 'jasmine', color: '#FFFBEB' },  // Star Jasmine White
      { type: 'jasmine', color: '#FEF3C7' },  // Cream Jasmine
      { type: 'orchid', color: '#F59E0B' },   // Golden Orchid
      { type: 'leaf', color: '#10B981' },     // Fresh Botanical Leaf
    ]

    const petalCount = 32
    for (let i = 0; i < petalCount; i++) {
      const template = petalPalette[Math.floor(Math.random() * petalPalette.length)]
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: template.type === 'jasmine' ? 6 + Math.random() * 4 : 8 + Math.random() * 8,
        speedY: 0.35 + Math.random() * 0.65,
        speedX: (Math.random() - 0.5) * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.015 + Math.random() * 0.025,
        type: template.type,
        color: template.color,
        opacity: 0.4 + Math.random() * 0.45,
        oscillationAmp: 0.8 + Math.random() * 1.6,
        oscillationSpeed: 0.012 + Math.random() * 0.018,
        oscillationOffset: Math.random() * Math.PI * 2,
      })
    }

    let animationFrameId: number
    let isVisible = true

    const handleVisibility = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    let time = 0
    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      if (!isVisible) return

      time += 1
      ctx.clearRect(0, 0, width, height)

      petals.forEach((p) => {
        // Natural falling & wind oscillation
        p.y += p.speedY
        p.x += p.speedX + Math.sin(time * p.oscillationSpeed + p.oscillationOffset) * p.oscillationAmp
        p.rotation += p.rotSpeed
        p.flipAngle += p.flipSpeed

        // Soft interactive wind push when cursor moves nearby
        if (mousePos.current.speed > 2) {
          const distToCursor = Math.hypot(p.x - mousePos.current.x, p.y - mousePos.current.y)
          if (distToCursor < 180) {
            const windFactor = (1 - distToCursor / 180) * 0.8
            p.x += (p.x > mousePos.current.x ? 1 : -1) * windFactor
            p.y += windFactor * 0.4
          }
        }

        // Seamless wrap around edges
        if (p.y > height + 24) {
          p.y = -24
          p.x = Math.random() * width
        }
        if (p.x < -30) p.x = width + 20
        if (p.x > width + 30) p.x = -20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        // 3D Tumbling simulation via cosine scaling
        const tumbleScale = Math.cos(p.flipAngle)
        ctx.scale(Math.max(0.12, Math.abs(tumbleScale)), 1)

        // Subtle soft shadow underneath the floating petal for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetY = 3

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity

        // Draw botanical curved petal shapes
        ctx.beginPath()
        if (p.type === 'jasmine') {
          // Delicate 5-petaled star jasmine blossom
          const r = p.size * 0.7
          for (let a = 0; a < 5; a++) {
            const angle = (a * Math.PI * 2) / 5
            const px = Math.cos(angle) * r
            const py = Math.sin(angle) * r
            ctx.ellipse(px, py, r * 0.5, r * 0.28, angle, 0, Math.PI * 2)
          }
        } else if (p.type === 'lily') {
          // Pointed stargazer lily petal
          ctx.ellipse(0, 0, p.size * 1.1, p.size * 0.42, 0, 0, Math.PI * 2)
        } else if (p.type === 'leaf') {
          // Delicate green foliage leaf with vein
          ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2)
        } else {
          // Velvety cupped rose petal
          ctx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2)
        }
        ctx.fill()

        // Natural delicate central vein highlight
        ctx.shadowColor = 'transparent'
        ctx.strokeStyle = p.type === 'leaf' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.22)'
        ctx.lineWidth = 0.65
        ctx.beginPath()
        ctx.moveTo(-p.size * 0.65, 0)
        ctx.lineTo(p.size * 0.65, 0)
        ctx.stroke()

        ctx.restore()
      })
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-label="Photorealistic Real Flower Garden Background"
    >
      {/* =========================================================================
          LAYER 1: Deep Garden Atmosphere Layer (Lush, Full-Bleed Real Botanical Garden)
          ========================================================================= */}
      <div
        className="absolute inset-[-30px] transition-transform duration-700 ease-out will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${parallax.x * 0.35}px, ${parallax.y * 0.35}px, 0) scale(1.05)`,
        }}
      >
        <picture>
          <source srcSet="/images/real_flower_garden.webp" type="image/webp" />
          <img
            src="/images/real_flower_garden.jpg"
            alt="Deep botanical flower garden with blooming roses, lilies, orchids and morning bokeh"
            className="w-full h-full object-cover object-center filter saturate-[1.14] contrast-[1.05] brightness-[0.96]"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* =========================================================================
          LAYER 2: Foreground Macro Floral Framing (High-Resolution Real Roses, Lilies & Jasmine)
          ========================================================================= */}
      <div
        className="absolute inset-[-25px] transition-transform duration-500 ease-out will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${parallax.x * 1.15}px, ${parallax.y * 1.15}px, 0) scale(1.04)`,
        }}
      >
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet="/images/flower_garden_mobile.webp"
            type="image/webp"
          />
          <source
            srcSet="/images/flower_garden_frame.webp"
            type="image/webp"
          />
          <img
            src="/images/flower_garden_frame.jpg"
            alt="Vivid foreground framing of crimson roses, pink stargazer lilies, white star jasmine and garden foliage"
            className="w-full h-full object-cover object-center filter saturate-[1.18] contrast-[1.08] drop-shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* =========================================================================
          LAYER 3: Natural Optical Sunlight Rays & Warm Morning Shimmer
          ========================================================================= */}
      {/* Diagonal Natural Sunbeams from Upper-Left */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35 bg-gradient-to-br from-amber-200/35 via-yellow-100/10 to-transparent transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 0.2}px, ${parallax.y * 0.2}px, 0)`,
        }}
      />

      {/* Soft Morning Radial Sun Flare */}
      <div
        className="absolute -top-24 -left-24 w-[550px] h-[550px] rounded-full pointer-events-none mix-blend-screen opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.16) 45%, transparent 70%)',
        }}
      />

      {/* Secondary Soft Rim-Glow on Right Foliage */}
      <div
        className="absolute top-1/4 -right-20 w-[480px] h-[480px] rounded-full pointer-events-none mix-blend-screen opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)',
        }}
      />

      {/* =========================================================================
          LAYER 4: Precision Radial Text Readability Mask
          (Keeps center typography 100% crisp & readable, leaves edge flowers vibrant & luminous)
          ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(6, 20, 13, 0.65) 0%, rgba(6, 20, 13, 0.42) 50%, rgba(6, 20, 13, 0.12) 80%, transparent 100%)',
        }}
      />

      {/* =========================================================================
          LAYER 5: Smooth Transition Scrims (Top Navbar & Bottom Category Navigation)
          ========================================================================= */}
      {/* Bottom seamless transition into category nav */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06140D] via-[#06140D]/75 to-transparent pointer-events-none" />

      {/* Top subtle scrim for header navigation clarity */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#06140D]/65 to-transparent pointer-events-none" />

      {/* =========================================================================
          LAYER 6: Real 3D Tumbling Organic Petals Canvas
          ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
      />
    </div>
  )
}
