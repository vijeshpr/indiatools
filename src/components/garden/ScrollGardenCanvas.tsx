import React, { useEffect, useRef } from 'react'

export const ScrollGardenCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let scrollProgress = 0
    let targetScrollProgress = 0

    // Measure scroll progress smoothly
    const updateScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll))
    }
    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Petal particles array
    interface DriftingPetal {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      rotation: number
      rotSpeed: number
      color: string
      opacity: number
    }

    const petals: DriftingPetal[] = []
    const petalColors = ['#F3F0E5', '#D8B879', '#A8C5AC', '#E8D5B5', '#16865D']

    for (let i = 0; i < 40; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 8,
        speedY: 0.6 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.2 + Math.random() * 0.5,
      })
    }

    // Sprouting Stems along the left and right borders that grow as user scrolls
    interface BotanicalStem {
      side: 'left' | 'right'
      baseY: number
      points: { x: number; y: number }[]
      color: string
      maxBloomStage: number
    }

    const stems: BotanicalStem[] = [
      // Left side stems
      {
        side: 'left',
        baseY: 0.2,
        points: [
          { x: 0, y: 0.2 },
          { x: 0.05, y: 0.25 },
          { x: 0.08, y: 0.32 },
          { x: 0.04, y: 0.4 },
        ],
        color: '#16865D',
        maxBloomStage: 0.35,
      },
      {
        side: 'left',
        baseY: 0.5,
        points: [
          { x: 0, y: 0.5 },
          { x: 0.06, y: 0.55 },
          { x: 0.09, y: 0.62 },
          { x: 0.05, y: 0.7 },
        ],
        color: '#617A43',
        maxBloomStage: 0.65,
      },
      // Right side stems
      {
        side: 'right',
        baseY: 0.3,
        points: [
          { x: 1, y: 0.3 },
          { x: 0.94, y: 0.38 },
          { x: 0.91, y: 0.45 },
          { x: 0.96, y: 0.52 },
        ],
        color: '#16865D',
        maxBloomStage: 0.5,
      },
      {
        side: 'right',
        baseY: 0.65,
        points: [
          { x: 1, y: 0.65 },
          { x: 0.93, y: 0.72 },
          { x: 0.9, y: 0.8 },
          { x: 0.95, y: 0.88 },
        ],
        color: '#D8B879',
        maxBloomStage: 0.85,
      },
    ]

    let time = 0
    let isVisible = true

    const handleVisibility = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      if (!isVisible) return

      time += 0.016
      // Smooth lerp for scroll progress
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08

      ctx.clearRect(0, 0, width, height)

      // ================= 1. ATMOSPHERIC SCROLL BACKGROUND GRADIENT =================
      // Stage 1 (0.0): Midnight Forest (#07130E)
      // Stage 2 & 3 (0.3 - 0.6): Deep Botanical Green (#10271C, #16865D)
      // Stage 4 & 5 (0.7 - 1.0): Golden Hour glow (#D8B879, #617A43)
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      if (scrollProgress < 0.3) {
        grad.addColorStop(0, 'rgba(7, 19, 14, 0.95)')
        grad.addColorStop(1, 'rgba(16, 39, 28, 0.85)')
      } else if (scrollProgress < 0.7) {
        grad.addColorStop(0, 'rgba(16, 39, 28, 0.9)')
        grad.addColorStop(0.5, 'rgba(22, 134, 93, 0.12)')
        grad.addColorStop(1, 'rgba(7, 19, 14, 0.95)')
      } else {
        grad.addColorStop(0, 'rgba(16, 39, 28, 0.85)')
        grad.addColorStop(0.4, 'rgba(216, 184, 121, 0.08)')
        grad.addColorStop(1, 'rgba(7, 19, 14, 0.95)')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // ================= 2. PROCEDURAL VINES & GROWING STEMS =================
      stems.forEach((stem) => {
        // Growth percentage based on scroll progress
        const growth = Math.min(1, Math.max(0, (scrollProgress - (stem.maxBloomStage - 0.3)) / 0.3))
        if (growth <= 0.02) return

        ctx.save()
        ctx.strokeStyle = stem.color
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.globalAlpha = Math.min(0.65, growth * 0.7)

        ctx.beginPath()
        const startX = stem.points[0].x * width
        const startY = stem.points[0].y * height
        ctx.moveTo(startX, startY)

        // Draw animated curve up to growth limit
        const activeSegments = Math.max(1, Math.floor(growth * (stem.points.length - 1)))
        for (let i = 1; i <= activeSegments; i++) {
          const pt = stem.points[i]
          const sway = Math.sin(time * 1.5 + i) * 8
          ctx.lineTo(pt.x * width + sway, pt.y * height)
        }
        ctx.stroke()

        // Leaves sprouting along stem
        if (growth > 0.4) {
          stem.points.slice(1, activeSegments + 1).forEach((pt, idx) => {
            const px = pt.x * width + Math.sin(time * 1.5 + idx) * 8
            const py = pt.y * height
            const leafSize = 12 * growth

            ctx.save()
            ctx.translate(px, py)
            ctx.rotate(stem.side === 'left' ? 0.6 : -0.6)
            ctx.fillStyle = '#A8C5AC'
            ctx.globalAlpha = 0.5 * growth

            // Delicate leaf shape
            ctx.beginPath()
            ctx.ellipse(leafSize / 2, 0, leafSize, leafSize * 0.45, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          })
        }

        // Flower Blossom at the tip when growth is near complete (Stage 3 & 4)
        if (growth > 0.85) {
          const tip = stem.points[stem.points.length - 1]
          const tx = tip.x * width + Math.sin(time * 1.5) * 8
          const ty = tip.y * height
          const flowerRadius = 14 * (growth - 0.7) * 3.3

          ctx.save()
          ctx.translate(tx, ty)
          ctx.fillStyle = '#D8B879'
          ctx.globalAlpha = 0.75

          // Radial flower petals
          for (let p = 0; p < 6; p++) {
            ctx.save()
            ctx.rotate((p / 6) * Math.PI * 2 + time * 0.2)
            ctx.beginPath()
            ctx.ellipse(flowerRadius, 0, flowerRadius * 0.7, flowerRadius * 0.35, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }

          // Glowing flower center
          ctx.beginPath()
          ctx.arc(0, 0, flowerRadius * 0.35, 0, Math.PI * 2)
          ctx.fillStyle = '#F3F0E5'
          ctx.fill()
          ctx.restore()
        }

        ctx.restore()
      })

      // ================= 3. DRIFTING BOTANICAL PETALS =================
      petals.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.4
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
        ctx.globalAlpha = p.opacity * (0.3 + scrollProgress * 0.6)

        // Draw botanical curved petal
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ================= 4. STAGE 5 GOLDEN HOUR WARMTH GLOW =================
      if (scrollProgress > 0.75) {
        const goldenFactor = (scrollProgress - 0.75) / 0.25
        const goldenGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.8,
          50,
          width * 0.5,
          height * 0.8,
          width * 0.7
        )
        goldenGlow.addColorStop(0, `rgba(216, 184, 121, ${0.12 * goldenFactor})`)
        goldenGlow.addColorStop(0.5, `rgba(97, 122, 67, ${0.08 * goldenFactor})`)
        goldenGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = goldenGlow
        ctx.fillRect(0, 0, width, height)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-[1] w-full h-full"
      aria-hidden="true"
    />
  )
}
