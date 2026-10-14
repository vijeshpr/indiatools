import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface BotanicalHero3DProps {
  scrollProgress?: number
  className?: string
}

export const BotanicalHero3D: React.FC<BotanicalHero3DProps> = ({
  scrollProgress = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGL, setHasWebGL] = useState(true)
  const isReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verify WebGL availability
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
        return
      }
    } catch {
      setHasWebGL(false)
      return
    }

    let width = container.clientWidth
    let height = container.clientHeight
    if (width === 0 || height === 0) {
      width = window.innerWidth
      height = Math.min(window.innerHeight * 0.85, 750)
    }

    // 1. Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x07130e, 0.038)

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 5.2)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x163628, 1.4)
    scene.add(ambientLight)

    // Main golden-sun botanical spotlight
    const sunSpotlight = new THREE.DirectionalLight(0xd8b879, 3.2)
    sunSpotlight.position.set(3, 6, 4)
    sunSpotlight.castShadow = true
    sunSpotlight.shadow.mapSize.width = 1024
    sunSpotlight.shadow.mapSize.height = 1024
    scene.add(sunSpotlight)

    // Emerald back-rim light for cinematic depth
    const rimLight = new THREE.PointLight(0x16865d, 4.5, 12)
    rimLight.position.set(-3, 2, -2.5)
    scene.add(rimLight)

    // Center bloom glow light
    const flowerCoreLight = new THREE.PointLight(0xf3f0e5, 2.5, 4.5)
    flowerCoreLight.position.set(0, 0.8, 0.2)
    scene.add(flowerCoreLight)

    // 5. Materials
    const petalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3f0e5,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x16865d,
      emissiveIntensity: 0.12,
    })

    const innerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8b879,
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide,
      emissive: 0xd8b879,
      emissiveIntensity: 0.28,
    })

    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x16865d,
      roughness: 0.5,
      metalness: 0.1,
    })

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x226b48,
      roughness: 0.4,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x10271c,
      emissiveIntensity: 0.15,
    })

    // 6. Sculptural Central Botanical Flower Construction
    const plantGroup = new THREE.Group()
    plantGroup.position.set(0, -1.2, 0)
    scene.add(plantGroup)

    // Stem: Curved tube
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.12, 0.7, 0.05),
      new THREE.Vector3(-0.08, 1.4, -0.05),
      new THREE.Vector3(0, 2.1, 0),
    ])
    const stemGeometry = new THREE.TubeGeometry(stemCurve, 32, 0.055, 12, false)
    const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial)
    stemMesh.castShadow = true
    stemMesh.receiveShadow = true
    plantGroup.add(stemMesh)

    // Leaves attached along stem
    const createLeafGeometry = () => {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.quadraticCurveTo(0.28, 0.35, 0.35, 0.75)
      shape.quadraticCurveTo(0.15, 1.1, 0, 1.35)
      shape.quadraticCurveTo(-0.15, 1.1, -0.35, 0.75)
      shape.quadraticCurveTo(-0.28, 0.35, 0, 0)

      const extrudeSettings = {
        depth: 0.015,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      }
      return new THREE.ExtrudeGeometry(shape, extrudeSettings)
    }

    const leafGeo = createLeafGeometry()
    const leaf1 = new THREE.Mesh(leafGeo, leafMaterial)
    leaf1.position.set(0.12, 0.75, 0.05)
    leaf1.rotation.set(0.4, 0.2, -0.85)
    leaf1.scale.set(0.85, 0.85, 0.85)
    leaf1.castShadow = true
    plantGroup.add(leaf1)

    const leaf2 = new THREE.Mesh(leafGeo, leafMaterial)
    leaf2.position.set(-0.08, 1.25, -0.02)
    leaf2.rotation.set(-0.35, -0.4, 0.95)
    leaf2.scale.set(0.75, 0.75, 0.75)
    leaf2.castShadow = true
    plantGroup.add(leaf2)

    const leaf3 = new THREE.Mesh(leafGeo, leafMaterial)
    leaf3.position.set(0.04, 1.65, 0.08)
    leaf3.rotation.set(0.5, 0.7, -0.7)
    leaf3.scale.set(0.65, 0.65, 0.65)
    leaf3.castShadow = true
    plantGroup.add(leaf3)

    // Flower Head & Petals
    const flowerHeadGroup = new THREE.Group()
    flowerHeadGroup.position.set(0, 2.1, 0)
    plantGroup.add(flowerHeadGroup)

    // Center Pistil / Core
    const coreGeo = new THREE.SphereGeometry(0.18, 24, 24)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd8b879,
      emissive: 0xd8b879,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    })
    const flowerCore = new THREE.Mesh(coreGeo, coreMat)
    flowerHeadGroup.add(flowerCore)

    // Stamens around core
    const stamenCount = 14
    for (let s = 0; s < stamenCount; s++) {
      const angle = (s / stamenCount) * Math.PI * 2
      const stamenStemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6)
      const stamenStem = new THREE.Mesh(stamenStemGeo, coreMat)
      const r = 0.14
      stamenStem.position.set(Math.cos(angle) * r, 0.08, Math.sin(angle) * r)
      stamenStem.rotation.x = Math.sin(angle) * 0.35
      stamenStem.rotation.z = -Math.cos(angle) * 0.35

      const tipGeo = new THREE.SphereGeometry(0.022, 8, 8)
      const tipMesh = new THREE.Mesh(tipGeo, innerPetalMaterial)
      tipMesh.position.y = 0.08
      stamenStem.add(tipMesh)
      flowerHeadGroup.add(stamenStem)
    }

    // Petal Creation with 3 Concentric Layers (Inner, Middle, Outer)
    const createPetalGeometry = () => {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.quadraticCurveTo(0.22, 0.28, 0.28, 0.65)
      shape.quadraticCurveTo(0.18, 0.95, 0, 1.25)
      shape.quadraticCurveTo(-0.18, 0.95, -0.28, 0.65)
      shape.quadraticCurveTo(-0.22, 0.28, 0, 0)

      const extrudeSettings = {
        depth: 0.012,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.007,
        bevelThickness: 0.007,
      }
      return new THREE.ExtrudeGeometry(shape, extrudeSettings)
    }

    const petalGeo = createPetalGeometry()
    interface PetalData {
      mesh: THREE.Mesh
      baseRotation: THREE.Euler
      openRotation: THREE.Euler
      layerIndex: number
    }
    const petals: PetalData[] = []

    // Layer 1: Inner Petals (6 petals)
    const innerCount = 6
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2
      const petalMesh = new THREE.Mesh(petalGeo, innerPetalMaterial)
      petalMesh.scale.set(0.68, 0.68, 0.68)
      petalMesh.castShadow = true

      const baseRot = new THREE.Euler(0.25, angle, 0.15)
      const openRot = new THREE.Euler(0.75, angle, 0.45)
      petalMesh.rotation.copy(baseRot)

      flowerHeadGroup.add(petalMesh)
      petals.push({ mesh: petalMesh, baseRotation: baseRot, openRotation: openRot, layerIndex: 1 })
    }

    // Layer 2: Middle Petals (8 petals)
    const midCount = 8
    for (let i = 0; i < midCount; i++) {
      const angle = (i / midCount) * Math.PI * 2 + Math.PI / midCount
      const petalMesh = new THREE.Mesh(petalGeo, petalMaterial)
      petalMesh.scale.set(0.85, 0.85, 0.85)
      petalMesh.castShadow = true

      const baseRot = new THREE.Euler(0.35, angle, 0.2)
      const openRot = new THREE.Euler(1.15, angle, 0.65)
      petalMesh.rotation.copy(baseRot)

      flowerHeadGroup.add(petalMesh)
      petals.push({ mesh: petalMesh, baseRotation: baseRot, openRotation: openRot, layerIndex: 2 })
    }

    // Layer 3: Outer Large Petals (10 petals)
    const outerCount = 10
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + Math.PI / outerCount / 2
      const petalMesh = new THREE.Mesh(petalGeo, petalMaterial)
      petalMesh.scale.set(1.05, 1.05, 1.05)
      petalMesh.castShadow = true

      const baseRot = new THREE.Euler(0.45, angle, 0.25)
      const openRot = new THREE.Euler(1.55, angle, 0.85)
      petalMesh.rotation.copy(baseRot)

      flowerHeadGroup.add(petalMesh)
      petals.push({ mesh: petalMesh, baseRotation: baseRot, openRotation: openRot, layerIndex: 3 })
    }

    // 7. Background Layered Botanical Elements (Ferns & Grasses)
    const grassGroup = new THREE.Group()
    scene.add(grassGroup)

    const grassBladeCount = 45
    for (let g = 0; g < grassBladeCount; g++) {
      const height = 1.2 + Math.random() * 1.6
      const grassGeo = new THREE.CylinderGeometry(0.005, 0.025, height, 5)
      const grassMat = new THREE.MeshStandardMaterial({
        color: g % 2 === 0 ? 0x163628 : 0x16865d,
        roughness: 0.6,
      })
      const blade = new THREE.Mesh(grassGeo, grassMat)
      const gx = (Math.random() - 0.5) * 6
      const gz = (Math.random() - 0.5) * 4 - 1.2
      blade.position.set(gx, -1.2 + height / 2, gz)
      blade.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3)
      grassGroup.add(blade)
    }

    // 8. Floating Golden Pollen Particles
    const pollenCount = 120
    const pollenGeometry = new THREE.BufferGeometry()
    const pollenPositions = new Float32Array(pollenCount * 3)
    const pollenVelocities: { x: number; y: number; z: number }[] = []

    for (let p = 0; p < pollenCount; p++) {
      pollenPositions[p * 3] = (Math.random() - 0.5) * 7
      pollenPositions[p * 3 + 1] = Math.random() * 4 - 1
      pollenPositions[p * 3 + 2] = (Math.random() - 0.5) * 6
      pollenVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.003 + Math.random() * 0.006,
        z: (Math.random() - 0.5) * 0.003,
      })
    }
    pollenGeometry.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3))

    // Canvas particle texture
    const createPollenTexture = () => {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(243, 240, 229, 1)')
        gradient.addColorStop(0.3, 'rgba(216, 184, 121, 0.75)')
        gradient.addColorStop(0.7, 'rgba(22, 134, 93, 0.25)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 64, 64)
      }
      return new THREE.CanvasTexture(c)
    }

    const pollenMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: createPollenTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pollenSystem = new THREE.Points(pollenGeometry, pollenMaterial)
    scene.add(pollenSystem)

    // 9. Mouse Parallax Tracking
    let targetMouseX = 0
    let targetMouseY = 0
    let currentMouseX = 0
    let currentMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 10. Animation Loop & Blooming Sequence
    let animationFrameId: number
    let clock = new THREE.Clock()
    let bloomProgress = 0 // 0 = closed bud, 1 = fully open
    let isTabVisible = true

    const handleVisibility = () => {
      isTabVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isTabVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Bloom entrance transition on initial load
      if (bloomProgress < 1) {
        bloomProgress = Math.min(1, bloomProgress + delta * 0.45)
      }

      // Smooth mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05
      currentMouseY += (targetMouseY - currentMouseY) * 0.05
      camera.position.x = currentMouseX * 0.9
      camera.position.y = 1.2 - currentMouseY * 0.6
      camera.lookAt(0, 0.9, 0)

      // Wind sway simulation across botanical elements
      const windSway = Math.sin(time * 1.4) * 0.045
      const windSwaySecondary = Math.cos(time * 0.8) * 0.035
      plantGroup.rotation.z = windSway
      plantGroup.rotation.x = windSwaySecondary * 0.5

      // Leaves dynamic curvature
      leaf1.rotation.z = -0.85 + Math.sin(time * 1.8) * 0.06
      leaf2.rotation.z = 0.95 + Math.cos(time * 1.5) * 0.05
      leaf3.rotation.z = -0.7 + Math.sin(time * 2.1) * 0.04

      // Petals bloom opening & breathing
      petals.forEach((p, idx) => {
        const offset = idx * 0.08
        const dynamicBloom = Math.min(1, Math.max(0, bloomProgress * 1.15 - offset * 0.3))
        const breath = Math.sin(time * 1.8 + idx) * 0.02

        // Interpolate base bud rotation to fully blooming rotation
        p.mesh.rotation.x =
          p.baseRotation.x + (p.openRotation.x - p.baseRotation.x) * dynamicBloom + breath
      })

      // Flower core pulsating glow
      flowerCoreLight.intensity = 2.2 + Math.sin(time * 2.2) * 0.8

      // Pollen particles floating
      const positions = pollenGeometry.attributes.position.array as Float32Array
      for (let p = 0; p < pollenCount; p++) {
        positions[p * 3 + 1] += pollenVelocities[p].y
        positions[p * 3] += Math.sin(time + p) * 0.002
        positions[p * 3 + 2] += Math.cos(time + p) * 0.002

        // Wrap around when rising past ceiling
        if (positions[p * 3 + 1] > 3.2) {
          positions[p * 3 + 1] = -1.2
          positions[p * 3] = (Math.random() - 0.5) * 6
        }
      }
      pollenGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // 11. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth || window.innerWidth
      const newHeight = container.clientHeight || Math.min(window.innerHeight * 0.85, 750)

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)

      stemGeometry.dispose()
      leafGeo.dispose()
      coreGeo.dispose()
      petalGeo.dispose()
      pollenGeometry.dispose()
      pollenMaterial.dispose()
      petalMaterial.dispose()
      innerPetalMaterial.dispose()
      stemMaterial.dispose()
      leafMaterial.dispose()
      renderer.dispose()

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  if (!hasWebGL) {
    // Beautiful lightweight fallback for devices without WebGL
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#10271C] via-[#07130E] to-[#07130E] opacity-90" />
        <div className="relative z-10 w-48 h-48 rounded-full border border-emerald-500/30 flex items-center justify-center shadow-2xl shadow-emerald-500/20 bg-emerald-950/40">
          <div className="w-32 h-32 rounded-full border border-amber-300/40 flex items-center justify-center bg-emerald-900/40 animate-pulse">
            <span className="text-3xl">🌸</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[700px] pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  )
}
