import React, { useEffect, useRef, useState } from 'react'

interface BotanicalHero3DProps {
  className?: string
}

export const BotanicalHero3D: React.FC<BotanicalHero3DProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  // 1. Mouse-driven Parallax effect for realistic depth of field
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 16 // Max 16px parallax
      const y = (e.clientY / innerHeight - 0.5) * 12
      setParallax({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 2. Gentle organic falling petal physics
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    interface Petal {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      rotation: number
      rotSpeed: number
      color: string
      opacity: number
      oscillationAmp: number
      oscillationSpeed: number
      oscillationOffset: number
    }

    const petals: Petal[] = []
    const petalColors = [
      '#BE123C', // Crimson rose petal
      '#E11D48', // Deep rose
      '#F43F5E', // Pink lily petal
      '#FDA4AF', // Soft pink rose
      '#FFFBEB', // White jasmine petal
      '#FBBF24', // Amber orchid petal
    ]

    const petalCount = 28
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 7 + Math.random() * 9,
        speedY: 0.4 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.35 + Math.random() * 0.45,
        oscillationAmp: 0.8 + Math.random() * 1.5,
        oscillationSpeed: 0.015 + Math.random() * 0.02,
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
        p.y += p.speedY
        p.x += p.speedX + Math.sin(time * p.oscillationSpeed + p.oscillationOffset) * p.oscillationAmp
        p.rotation += p.rotSpeed

        // Wrap around bottom
        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity

        // Draw natural curved flower petal
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()

        // Subtle petal vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(-p.size * 0.6, 0)
        ctx.lineTo(p.size * 0.6, 0)
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
      {/* 1. Real DSLR Flower Garden Photograph (WebP, Responsive, High-Definition) */}
      <div
        className="absolute inset-[-20px] transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.03)`,
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
            alt="Lush real flower garden with fresh red and pink roses, lilies, orchids and white star jasmine"
            className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.04]"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* 2. Soft Natural Sunbeam Shimmer Overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-gradient-to-b from-amber-100/40 via-yellow-200/10 to-transparent animate-pulse"
        style={{ animationDuration: '6s' }}
      />

      {/* 3. Cinematic Contrast Vignette (Preserves vivid edge flowers while keeping center text crystal clear) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(6, 20, 13, 0.52) 0%, rgba(6, 20, 13, 0.32) 45%, rgba(6, 20, 13, 0.75) 85%, rgba(6, 20, 13, 0.92) 100%)',
        }}
      />

      {/* 4. Subtle Bottom Gradient Fade into Category Navigation */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06140D] via-[#06140D]/80 to-transparent pointer-events-none" />

      {/* 5. Top Navigation Subtle Shadow Scrim */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#06140D]/70 to-transparent pointer-events-none" />

      {/* 6. Real Organic Drifting Petals Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
      />
    </div>
  )
}
