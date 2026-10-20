/**
 * IndiaTools — Audio to Video Studio
 * 12 Curated Cinematic Procedural Backgrounds
 * 
 * Generates 100% client-side resolution-independent visuals with zero external network requests.
 */

import { BackgroundPreset, BackgroundCategory } from './types.ts'

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'night-city',
    name: 'Night City',
    subtitle: 'Cyberpunk metropolis with luminous skyline and neon reflections',
    category: 'Urban',
    accentColor: '#38BDF8',
    description: 'Towering skyscrapers with glowing neon office windows, purple dusk sky, and damp reflective asphalt.',
    gradient: ['#090919', '#141432', '#060712'],
  },
  {
    id: 'romantic-rain',
    name: 'Romantic Rain',
    subtitle: 'Warm streetlamp rain with glowing amber drops & soft foliage',
    category: 'Atmosphere',
    accentColor: '#F59E0B',
    description: 'Atmospheric evening rain illuminated by warm golden streetlights, wet pavement bokeh, and falling droplets.',
    gradient: ['#0B111E', '#162235', '#080C14'],
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    subtitle: 'Cozy interior looking through steamed glass at rolling rainfall',
    category: 'Atmosphere',
    accentColor: '#60A5FA',
    description: 'Cinematic window pane with water beads and condensation trails overlooking a blue nocturnal storm.',
    gradient: ['#0A121A', '#132333', '#080F16'],
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    subtitle: 'Bioluminescent deep waters surging under midnight moonlight',
    category: 'Nature',
    accentColor: '#14B8A6',
    description: 'Rolling oceanic swells and cyan wave crests glistening under a glowing full moon.',
    gradient: ['#021B2B', '#07364C', '#01101A'],
  },
  {
    id: 'mountain-landscapes',
    name: 'Mountain Landscapes',
    subtitle: 'Misty alpine peaks layered in twilight gradient fog',
    category: 'Nature',
    accentColor: '#818CF8',
    description: 'Majestic mountain silhouettes rising through layered pine valleys and soft atmospheric mist.',
    gradient: ['#0B1020', '#1C2541', '#0B132B'],
  },
  {
    id: 'forest-nature',
    name: 'Forest and Nature',
    subtitle: 'Emerald pine forest with ethereal morning god-rays',
    category: 'Nature',
    accentColor: '#10B981',
    description: 'Deep evergreen canopy with sunbeams filtering through mist and glowing firefly motes.',
    gradient: ['#031A14', '#083327', '#02120E'],
  },
  {
    id: 'galaxy-stars',
    name: 'Galaxy and Stars',
    subtitle: 'Cosmic nebula clouds with twinkling starfields & deep space dust',
    category: 'Cosmic',
    accentColor: '#C084FC',
    description: 'Vibrant interstellar magenta and indigo nebula swirls peppered with glittering cosmic stars.',
    gradient: ['#08020F', '#1F0833', '#05010A'],
  },
  {
    id: 'sunset-sunrise',
    name: 'Sunset and Sunrise',
    subtitle: 'Golden hour horizon with warm amber, coral, and violet gradients',
    category: 'Nature',
    accentColor: '#F97316',
    description: 'Breathtaking horizon sunset with warm orange and violet skies casting long cinematic shadows.',
    gradient: ['#2A0826', '#4D1234', '#150419'],
  },
  {
    id: 'abstract-neon',
    name: 'Abstract Neon',
    subtitle: 'Futuristic synthwave geometric grid with pulsing laser beams',
    category: 'Abstract',
    accentColor: '#EC4899',
    description: 'Retro 80s synthwave perspective grid receding toward an electric pink sun and neon laser ribbons.',
    gradient: ['#0B0014', '#260438', '#07000D'],
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    subtitle: 'Ultra-clean studio charcoal vignette with subtle radial rim light',
    category: 'Minimal',
    accentColor: '#94A3B8',
    description: 'Sophisticated matte studio backdrop with deep obsidian shadows and fine central vignette.',
    gradient: ['#0F1117', '#1A1D24', '#090A0F'],
  },
  {
    id: 'dreamy-bokeh',
    name: 'Dreamy Bokeh',
    subtitle: 'Soft pastel floating light orbs with shallow depth of field',
    category: 'Atmosphere',
    accentColor: '#F472B6',
    description: 'Luminous out-of-focus light orbs in champagne and rose tones drifting smoothly across the scene.',
    gradient: ['#170F1C', '#2A1833', '#0F0914'],
  },
  {
    id: 'cinematic-light',
    name: 'Cinematic Light',
    subtitle: 'Anamorphic lens flares and volumetric stage illumination',
    category: 'Abstract',
    accentColor: '#22D3EE',
    description: 'Dual theatrical spotlights casting anamorphic blue and violet rays across a dark stage floor.',
    gradient: ['#040B14', '#0D2035', '#02060B'],
  },
]

/**
 * Procedurally render the selected background onto a Canvas context at native resolution.
 */
export function drawProceduralBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  presetId: BackgroundCategory,
  time: number,
  bassEnergy: number,
  brightness: number
) {
  ctx.save()

  // Base background gradient
  const preset = BACKGROUND_PRESETS.find((p) => p.id === presetId) || BACKGROUND_PRESETS[0]
  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, preset.gradient[0])
  grad.addColorStop(0.5, preset.gradient[1])
  grad.addColorStop(1, preset.gradient[2])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  switch (presetId) {
    case 'night-city': {
      // Skyline silhouettes with glowing windows
      ctx.fillStyle = '#070810'
      const horizonY = height * 0.72
      const buildingCount = Math.floor(width / 50)
      for (let i = 0; i < buildingCount; i++) {
        const bx = i * 52 - 10
        const bw = 42 + ((i * 19) % 25)
        const bh = 120 + ((i * 73) % 180) + Math.sin(i * 0.5) * 40
        ctx.fillRect(bx, horizonY - bh, bw, bh + 100)

        // Windows
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(56, 189, 248, 0.45)' : 'rgba(251, 191, 36, 0.4)'
        for (let wy = horizonY - bh + 15; wy < horizonY - 15; wy += 22) {
          for (let wx = bx + 6; wx < bx + bw - 8; wx += 12) {
            if ((wx + wy) % 5 === 0) {
              ctx.fillRect(wx, wy, 5, 8)
            }
          }
        }
        ctx.fillStyle = '#070810'
      }

      // Wet ground reflection
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height)
      groundGrad.addColorStop(0, 'rgba(14, 21, 38, 0.95)')
      groundGrad.addColorStop(1, 'rgba(5, 7, 14, 0.98)')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, horizonY, width, height - horizonY)

      // Neon pavement light reflections
      ctx.save()
      ctx.globalAlpha = 0.25 + bassEnergy * 0.2
      for (let i = 0; i < 5; i++) {
        const rx = width * (0.2 + i * 0.15)
        const rw = 40 + i * 15
        const rGrad = ctx.createLinearGradient(rx, horizonY, rx, height)
        rGrad.addColorStop(0, i % 2 === 0 ? '#38BDF8' : '#EC4899')
        rGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = rGrad
        ctx.fillRect(rx - rw / 2, horizonY, rw, height - horizonY)
      }
      ctx.restore()
      break
    }

    case 'romantic-rain':
    case 'rainy-window': {
      // Soft atmospheric distant street lights / bokeh
      const bokehColors = ['rgba(245, 158, 11, 0.35)', 'rgba(239, 68, 68, 0.25)', 'rgba(56, 189, 248, 0.3)']
      for (let i = 0; i < 14; i++) {
        const bx = width * (0.1 + ((i * 37) % 80) / 100)
        const by = height * (0.2 + ((i * 53) % 60) / 100)
        const br = (25 + ((i * 17) % 35)) * (1.0 + Math.sin(time + i) * 0.15)
        const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        bGrad.addColorStop(0, bokehColors[i % bokehColors.length])
        bGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = bGrad
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case 'ocean-waves': {
      // Moon
      const moonX = width * 0.75
      const moonY = height * 0.25
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 140)
      moonGrad.addColorStop(0, 'rgba(207, 250, 254, 0.6)')
      moonGrad.addColorStop(0.3, 'rgba(14, 116, 144, 0.25)')
      moonGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = moonGrad
      ctx.beginPath()
      ctx.arc(moonX, moonY, 140, 0, Math.PI * 2)
      ctx.fill()

      // Ocean swells
      const horizon = height * 0.58
      ctx.fillStyle = '#021622'
      ctx.beginPath()
      ctx.moveTo(0, horizon)
      for (let x = 0; x <= width; x += 30) {
        const wave = Math.sin(x * 0.008 + time * 1.5) * (15 + bassEnergy * 15)
        ctx.lineTo(x, horizon + wave)
      }
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()
      break
    }

    case 'mountain-landscapes': {
      // 3 Mountain silhouette layers with atmospheric depth
      const layers = [
        { color: '#131A2E', horizon: height * 0.45, roughness: 90 },
        { color: '#0C1222', horizon: height * 0.58, roughness: 120 },
        { color: '#060A14', horizon: height * 0.72, roughness: 70 },
      ]
      layers.forEach((l, idx) => {
        ctx.fillStyle = l.color
        ctx.beginPath()
        ctx.moveTo(0, l.horizon)
        for (let x = 0; x <= width; x += 40) {
          const y = l.horizon - Math.abs(Math.sin((x + idx * 200) * 0.004) * l.roughness)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fill()
      })
      break
    }

    case 'forest-nature': {
      // Deep pine tree rows
      ctx.fillStyle = '#041812'
      const baseY = height * 0.75
      for (let x = -20; x < width + 40; x += 35) {
        const treeH = 90 + ((x * 17) % 60)
        ctx.beginPath()
        ctx.moveTo(x, baseY)
        ctx.lineTo(x + 18, baseY - treeH)
        ctx.lineTo(x + 36, baseY)
        ctx.closePath()
        ctx.fill()
      }
      ctx.fillRect(0, baseY, width, height - baseY)
      break
    }

    case 'galaxy-stars': {
      // Deep space nebula clouds
      const nebulae = [
        { x: width * 0.35, y: height * 0.4, r: width * 0.4, col: 'rgba(192, 132, 252, 0.25)' },
        { x: width * 0.7, y: height * 0.6, r: width * 0.35, col: 'rgba(56, 189, 248, 0.2)' },
      ]
      for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        g.addColorStop(0, n.col)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Procedural static starfield
      ctx.fillStyle = '#FFFFFF'
      for (let i = 0; i < 90; i++) {
        const sx = ((i * 137) % width)
        const sy = ((i * 269) % height)
        const sa = 0.2 + ((i * 7) % 8) / 10
        ctx.globalAlpha = sa
        ctx.fillRect(sx, sy, (i % 5 === 0) ? 2 : 1, (i % 5 === 0) ? 2 : 1)
      }
      ctx.globalAlpha = 1.0
      break
    }

    case 'sunset-sunrise': {
      // Sun disk
      const sunX = width * 0.5
      const sunY = height * 0.55
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180)
      sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
      sunGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)')
      sunGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, 180, 0, Math.PI * 2)
      ctx.fill()

      // Horizon line
      ctx.fillStyle = '#100314'
      ctx.fillRect(0, height * 0.68, width, height * 0.32)
      break
    }

    case 'abstract-neon': {
      // Perspective synthwave grid
      const gridHorizon = height * 0.55
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)'
      ctx.lineWidth = 1.5

      // Sun
      const gSun = ctx.createRadialGradient(width / 2, gridHorizon, 0, width / 2, gridHorizon, 120)
      gSun.addColorStop(0, '#F43F5E')
      gSun.addColorStop(1, 'transparent')
      ctx.fillStyle = gSun
      ctx.beginPath()
      ctx.arc(width / 2, gridHorizon, 120, Math.PI, 0)
      ctx.fill()

      // Converging perspective lines
      for (let x = -width; x <= width * 2; x += 120) {
        ctx.beginPath()
        ctx.moveTo(width / 2, gridHorizon)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal lines with exponential perspective spacing
      for (let y = gridHorizon + 10; y <= height; y += (y - gridHorizon) * 0.35 + 8) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      break
    }

    case 'minimal-dark': {
      // Radial rim spotlight
      const radG = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.6)
      radG.addColorStop(0, '#1E2330')
      radG.addColorStop(0.6, '#11141C')
      radG.addColorStop(1, '#07080B')
      ctx.fillStyle = radG
      ctx.fillRect(0, 0, width, height)
      break
    }

    case 'dreamy-bokeh': {
      const orbs = [
        { x: 0.25, y: 0.35, r: 80, col: 'rgba(244, 114, 182, 0.35)' },
        { x: 0.68, y: 0.28, r: 110, col: 'rgba(192, 132, 252, 0.3)' },
        { x: 0.45, y: 0.72, r: 95, col: 'rgba(251, 191, 36, 0.28)' },
        { x: 0.82, y: 0.65, r: 70, col: 'rgba(56, 189, 248, 0.25)' },
      ]
      for (const o of orbs) {
        const ox = width * o.x
        const oy = height * o.y
        const or = o.r * (1 + Math.sin(time + o.x * 5) * 0.1)
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, or)
        g.addColorStop(0, o.col)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(ox, oy, or, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case 'cinematic-light': {
      // Dual stage volumetric spotlights
      const spots = [
        { x: width * 0.2, topX: width * 0.1, col: 'rgba(34, 211, 238, 0.22)' },
        { x: width * 0.8, topX: width * 0.9, col: 'rgba(168, 85, 247, 0.22)' },
      ]
      for (const s of spots) {
        ctx.fillStyle = s.col
        ctx.beginPath()
        ctx.moveTo(s.topX, 0)
        ctx.lineTo(s.x - 160, height)
        ctx.lineTo(s.x + 160, height)
        ctx.closePath()
        ctx.fill()
      }
      break
    }
  }

  // Brightness modifier
  if (brightness !== 100) {
    const factor = (brightness - 100) / 100
    if (factor < 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(factor)})`
      ctx.fillRect(0, 0, width, height)
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${factor * 0.4})`
      ctx.fillRect(0, 0, width, height)
    }
  }

  ctx.restore()
}
