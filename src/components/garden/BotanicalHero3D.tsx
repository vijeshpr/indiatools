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
  const scrollRef = useRef(scrollProgress)
  scrollRef.current = scrollProgress

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Verify WebGL availability
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
      height = Math.min(window.innerHeight * 0.9, 780)
    }

    // 2. Scene setup with midnight forest fog
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x07130e, 0.042)

    // 3. Cinematic Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80)
    camera.position.set(0.6, 0.9, 5.8)

    // 4. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 5. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x0f291e, 1.6)
    scene.add(ambientLight)

    // Directional Indian Sunlight (warm golden morning light)
    const sunLight = new THREE.DirectionalLight(0xfef08a, 3.4)
    sunLight.position.set(4, 7, 3.5)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    scene.add(sunLight)

    // Emerald back-rim light for botanical depth
    const emeraldRim = new THREE.PointLight(0x10b981, 4.2, 14)
    emeraldRim.position.set(-3.5, 2, -2)
    scene.add(emeraldRim)

    // Warm saffron accent fill for marigolds
    const saffronFill = new THREE.PointLight(0xf59e0b, 2.8, 8)
    saffronFill.position.set(2, 0.5, 1)
    scene.add(saffronFill)

    // 6. Shared Materials
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x166534, // Lush Indian green
      roughness: 0.35,
      metalness: 0.06,
      side: THREE.DoubleSide,
      emissive: 0x072719,
      emissiveIntensity: 0.15,
    })

    const vineWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.6,
      metalness: 0.04,
    })

    const sepalMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.45,
      side: THREE.DoubleSide,
    })

    const jasmineWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.05,
      side: THREE.DoubleSide,
      emissive: 0xf3f0e5,
      emissiveIntensity: 0.18,
    })

    const jasmineCenterMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    })

    // Animation tracking nodes
    interface AnimatedNode {
      group: THREE.Object3D
      baseRotX: number
      baseRotZ: number
      speed: number
      phase: number
      amp: number
    }
    const animatedNodes: AnimatedNode[] = []

    // -------------------------------------------------------------
    // BUILDER A: REALISTIC ROSE BLOSSOM
    // Multi-layered overlapping Fibonacci curved petals, sepals, core
    // -------------------------------------------------------------
    const createRose = (colorHex: number, scale = 1.0): THREE.Group => {
      const roseGroup = new THREE.Group()

      const rosePetalMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.28,
        metalness: 0.06,
        side: THREE.DoubleSide,
        emissive: colorHex,
        emissiveIntensity: 0.1,
      })

      // Sepals (5 calyx leaves under flower)
      for (let s = 0; s < 5; s++) {
        const sepalAngle = (s / 5) * Math.PI * 2
        const sepalShape = new THREE.Shape()
        sepalShape.moveTo(0, 0)
        sepalShape.quadraticCurveTo(0.04, 0.12, 0, 0.28)
        sepalShape.quadraticCurveTo(-0.04, 0.12, 0, 0)
        const sepalGeo = new THREE.ExtrudeGeometry(sepalShape, { depth: 0.005, bevelEnabled: false })
        const sepalMesh = new THREE.Mesh(sepalGeo, sepalMaterial)
        sepalMesh.rotation.z = sepalAngle
        sepalMesh.rotation.x = 0.55
        sepalMesh.position.y = -0.05
        roseGroup.add(sepalMesh)
      }

      // Petal Shape Generator with natural curvature
      const makePetalGeometry = (w: number, h: number) => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.quadraticCurveTo(w * 0.7, h * 0.35, w * 0.6, h * 0.8)
        shape.quadraticCurveTo(0, h * 1.1, -w * 0.6, h * 0.8)
        shape.quadraticCurveTo(-w * 0.7, h * 0.35, 0, 0)
        return new THREE.ExtrudeGeometry(shape, {
          depth: 0.008,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.005,
          bevelThickness: 0.005,
        })
      }

      // Layer 1: Inner tight bud core (5 petals)
      const innerPetalGeo = makePetalGeometry(0.12, 0.22)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.2
        const mesh = new THREE.Mesh(innerPetalGeo, rosePetalMat)
        mesh.rotation.y = angle
        mesh.rotation.x = 0.35
        mesh.position.set(Math.cos(angle) * 0.03, 0.04, Math.sin(angle) * 0.03)
        roseGroup.add(mesh)
      }

      // Layer 2: Middle whorl (7 opening petals)
      const midPetalGeo = makePetalGeometry(0.18, 0.3)
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2
        const mesh = new THREE.Mesh(midPetalGeo, rosePetalMat)
        mesh.rotation.y = angle
        mesh.rotation.x = 0.65
        mesh.position.set(Math.cos(angle) * 0.07, 0.02, Math.sin(angle) * 0.07)
        roseGroup.add(mesh)
      }

      // Layer 3: Outer fully flared petals (9 reflexed petals)
      const outerPetalGeo = makePetalGeometry(0.24, 0.38)
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2 + 0.35
        const mesh = new THREE.Mesh(outerPetalGeo, rosePetalMat)
        mesh.rotation.y = angle
        mesh.rotation.x = 0.95 // Reflexed outward
        mesh.position.set(Math.cos(angle) * 0.12, 0, Math.sin(angle) * 0.12)
        roseGroup.add(mesh)
      }

      roseGroup.scale.set(scale, scale, scale)
      return roseGroup
    }

    // -------------------------------------------------------------
    // BUILDER B: REALISTIC CHENDUMALLI / INDIAN MARIGOLD
    // Dense spherical/domed head with 6 concentric ruffled floret rings
    // -------------------------------------------------------------
    const createMarigold = (colorHex: number, scale = 1.0): THREE.Group => {
      const marigoldGroup = new THREE.Group()

      const marigoldMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.32,
        metalness: 0.08,
        side: THREE.DoubleSide,
        emissive: colorHex,
        emissiveIntensity: 0.16,
      })

      // Dense ruffled floret petal geometry
      const floretShape = new THREE.Shape()
      floretShape.moveTo(0, 0)
      floretShape.lineTo(0.04, 0.1)
      floretShape.lineTo(0.02, 0.16) // Ruffled tip notch
      floretShape.lineTo(0, 0.18)
      floretShape.lineTo(-0.02, 0.16)
      floretShape.lineTo(-0.04, 0.1)
      floretShape.closePath()
      const floretGeo = new THREE.ExtrudeGeometry(floretShape, { depth: 0.005, bevelEnabled: false })

      // 6 concentric rings forming the spherical pom-pom marigold head
      const rings = [
        { count: 6, radius: 0.04, pitch: 0.2, y: 0.14 },
        { count: 10, radius: 0.08, pitch: 0.45, y: 0.11 },
        { count: 14, radius: 0.13, pitch: 0.75, y: 0.07 },
        { count: 18, radius: 0.18, pitch: 1.05, y: 0.02 },
        { count: 20, radius: 0.22, pitch: 1.35, y: -0.04 },
        { count: 16, radius: 0.19, pitch: 1.6, y: -0.09 },
      ]

      rings.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2
          const mesh = new THREE.Mesh(floretGeo, marigoldMat)
          mesh.position.set(Math.cos(angle) * ring.radius, ring.y, Math.sin(angle) * ring.radius)
          mesh.rotation.y = angle
          mesh.rotation.x = ring.pitch
          mesh.rotation.z = (Math.random() - 0.5) * 0.25 // Natural ruffled randomness
          marigoldGroup.add(mesh)
        }
      })

      marigoldGroup.scale.set(scale, scale, scale)
      return marigoldGroup
    }

    // -------------------------------------------------------------
    // BUILDER C: REALISTIC JASMINE / MULLA CLUSTER
    // Delicate 5-petaled star blossoms, slender floral tube, glossy leaves
    // -------------------------------------------------------------
    const createJasmineCluster = (scale = 1.0): THREE.Group => {
      const clusterGroup = new THREE.Group()

      // Single star flower
      const makeStarFlower = () => {
        const flower = new THREE.Group()

        // Slender green floral tube
        const tubeGeo = new THREE.CylinderGeometry(0.01, 0.014, 0.1, 6)
        const tube = new THREE.Mesh(tubeGeo, sepalMaterial)
        tube.position.y = -0.05
        flower.add(tube)

        // 5 star petals
        const petalShape = new THREE.Shape()
        petalShape.moveTo(0, 0)
        petalShape.quadraticCurveTo(0.02, 0.05, 0, 0.11)
        petalShape.quadraticCurveTo(-0.02, 0.05, 0, 0)
        const petalGeo = new THREE.ExtrudeGeometry(petalShape, { depth: 0.003, bevelEnabled: false })

        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2
          const petalMesh = new THREE.Mesh(petalGeo, jasmineWhiteMaterial)
          petalMesh.rotation.z = angle
          petalMesh.rotation.x = 0.12
          flower.add(petalMesh)
        }

        // Center golden pistil
        const centerGeo = new THREE.SphereGeometry(0.014, 8, 8)
        const center = new THREE.Mesh(centerGeo, jasmineCenterMaterial)
        center.position.y = 0.005
        flower.add(center)

        return flower
      }

      // Cluster of 4 blossoms + 2 closed buds
      const blossomPositions = [
        { pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0.2, 0, 0.1) },
        { pos: new THREE.Vector3(0.12, 0.08, 0.04), rot: new THREE.Euler(0.4, 0.3, -0.2) },
        { pos: new THREE.Vector3(-0.1, 0.07, 0.02), rot: new THREE.Euler(-0.3, -0.4, 0.3) },
        { pos: new THREE.Vector3(0.02, 0.15, -0.05), rot: new THREE.Euler(0.5, 0.1, 0.4) },
      ]

      blossomPositions.forEach(({ pos, rot }) => {
        const fl = makeStarFlower()
        fl.position.copy(pos)
        fl.rotation.copy(rot)
        clusterGroup.add(fl)
      })

      clusterGroup.scale.set(scale, scale, scale)
      return clusterGroup
    }

    // -------------------------------------------------------------
    // BUILDER D: CLIMBING FLOWERING VINE
    // Catmull-Rom spline with leaves, branching, and embedded blooms
    // -------------------------------------------------------------
    const createClimbingVine = (
      points: THREE.Vector3[],
      radius = 0.038,
      addBlooms = true
    ): THREE.Group => {
      const vineGroup = new THREE.Group()

      const curve = new THREE.CatmullRomCurve3(points)
      const tubeGeo = new THREE.TubeGeometry(curve, 48, radius, 8, false)
      const vineMesh = new THREE.Mesh(tubeGeo, vineWoodMaterial)
      vineMesh.castShadow = true
      vineGroup.add(vineMesh)

      // Leaf Shape
      const leafShape = new THREE.Shape()
      leafShape.moveTo(0, 0)
      leafShape.quadraticCurveTo(0.12, 0.16, 0.15, 0.35)
      leafShape.quadraticCurveTo(0.06, 0.5, 0, 0.6)
      leafShape.quadraticCurveTo(-0.06, 0.5, -0.15, 0.35)
      leafShape.quadraticCurveTo(-0.12, 0.16, 0, 0)
      const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.008, bevelEnabled: false })

      // Place foliage and blooms along curve
      const steps = 12
      for (let i = 1; i < steps; i++) {
        const u = i / steps
        const pos = curve.getPointAt(u)
        const tangent = curve.getTangentAt(u)

        // Alternate leaves
        const leafMesh = new THREE.Mesh(leafGeo, leafMaterial)
        leafMesh.position.copy(pos)
        const side = i % 2 === 0 ? 1 : -1
        leafMesh.rotation.set(
          tangent.y + 0.3,
          tangent.x + side * 0.8,
          side * 0.6
        )
        const leafScale = 0.45 + (1 - u * 0.4) * 0.3
        leafMesh.scale.set(leafScale, leafScale, leafScale)
        leafMesh.castShadow = true
        vineGroup.add(leafMesh)

        // Attach blooms occasionally along vine
        if (addBlooms && i % 4 === 1) {
          const jasmine = createJasmineCluster(0.65)
          jasmine.position.copy(pos)
          jasmine.position.x += side * 0.08
          jasmine.rotation.set(0.3, side * 0.5, 0)
          vineGroup.add(jasmine)
        }
      }

      return vineGroup
    }

    // -------------------------------------------------------------
    // SCENE ASSEMBLY: 3 DEPTH LAYERS
    // -------------------------------------------------------------
    const gardenMasterGroup = new THREE.Group()
    scene.add(gardenMasterGroup)

    // === LAYER 1: CLIMBING VINES (Starting from bottom corners toward top) ===
    // Left Vine climbing and arching inward
    const leftVine = createClimbingVine(
      [
        new THREE.Vector3(-3.2, -3.2, 0.5),
        new THREE.Vector3(-2.8, -1.5, 0.2),
        new THREE.Vector3(-3.1, 0.2, -0.2),
        new THREE.Vector3(-2.4, 1.8, -0.5),
        new THREE.Vector3(-1.2, 2.9, -1.0),
      ],
      0.042,
      true
    )
    gardenMasterGroup.add(leftVine)
    animatedNodes.push({
      group: leftVine,
      baseRotX: 0,
      baseRotZ: 0,
      speed: 0.8,
      phase: 0.2,
      amp: 0.02,
    })

    // Right Vine climbing gracefully up the right frame
    const rightVine = createClimbingVine(
      [
        new THREE.Vector3(3.2, -3.0, 0.8),
        new THREE.Vector3(2.7, -1.2, 0.4),
        new THREE.Vector3(2.9, 0.8, 0.0),
        new THREE.Vector3(2.2, 2.2, -0.6),
        new THREE.Vector3(0.8, 3.2, -1.2),
      ],
      0.045,
      true
    )
    gardenMasterGroup.add(rightVine)
    animatedNodes.push({
      group: rightVine,
      baseRotX: 0,
      baseRotZ: 0,
      speed: 0.9,
      phase: 1.1,
      amp: 0.02,
    })

    // === LAYER 2: MIDDLE GROUND BOTANICAL FLOWER BEDS (Roses, Chendumalli, Jasmine) ===
    const flowerBed = new THREE.Group()
    flowerBed.position.set(1.4, -0.9, -0.2) // Right-weighted to keep text negative space clear
    gardenMasterGroup.add(flowerBed)

    // Rose 1: Velvet Crimson Red
    const redRose = createRose(0xb91c1c, 1.15)
    redRose.position.set(0.2, 0.7, 0.4)
    redRose.rotation.set(0.25, -0.4, 0.1)
    flowerBed.add(redRose)
    animatedNodes.push({
      group: redRose,
      baseRotX: 0.25,
      baseRotZ: 0.1,
      speed: 1.2,
      phase: 0.5,
      amp: 0.035,
    })

    // Rose 2: Soft Rose Pink
    const pinkRose = createRose(0xf472b6, 0.92)
    pinkRose.position.set(-0.7, 0.4, 0.2)
    pinkRose.rotation.set(0.4, 0.3, -0.15)
    flowerBed.add(pinkRose)
    animatedNodes.push({
      group: pinkRose,
      baseRotX: 0.4,
      baseRotZ: -0.15,
      speed: 1.4,
      phase: 1.8,
      amp: 0.04,
    })

    // Rose 3: Pale Ivory Cream
    const creamRose = createRose(0xfdfbf7, 0.85)
    creamRose.position.set(0.9, 0.3, 0.1)
    creamRose.rotation.set(0.3, -0.6, 0.2)
    flowerBed.add(creamRose)
    animatedNodes.push({
      group: creamRose,
      baseRotX: 0.3,
      baseRotZ: 0.2,
      speed: 1.1,
      phase: 2.4,
      amp: 0.03,
    })

    // Chendumalli / Marigold 1: Saffron Gold
    const saffronMarigold = createMarigold(0xf59e0b, 1.2)
    saffronMarigold.position.set(-0.1, 0.15, 0.6)
    saffronMarigold.rotation.set(0.2, 0.1, 0)
    flowerBed.add(saffronMarigold)
    animatedNodes.push({
      group: saffronMarigold,
      baseRotX: 0.2,
      baseRotZ: 0,
      speed: 1.6,
      phase: 0.9,
      amp: 0.045,
    })

    // Chendumalli / Marigold 2: Deep Orange
    const orangeMarigold = createMarigold(0xea580c, 1.05)
    orangeMarigold.position.set(0.65, -0.1, 0.5)
    orangeMarigold.rotation.set(0.35, -0.3, 0.1)
    flowerBed.add(orangeMarigold)
    animatedNodes.push({
      group: orangeMarigold,
      baseRotX: 0.35,
      baseRotZ: 0.1,
      speed: 1.7,
      phase: 2.1,
      amp: 0.04,
    })

    // Jasmine Cascades around the flower bed
    const jasmineBush1 = createJasmineCluster(1.1)
    jasmineBush1.position.set(-0.4, 1.1, 0.2)
    jasmineBush1.rotation.set(0.3, 0.2, 0.1)
    flowerBed.add(jasmineBush1)
    animatedNodes.push({
      group: jasmineBush1,
      baseRotX: 0.3,
      baseRotZ: 0.1,
      speed: 2.2,
      phase: 3.1,
      amp: 0.06,
    })

    const jasmineBush2 = createJasmineCluster(0.95)
    jasmineBush2.position.set(0.5, 0.95, -0.1)
    jasmineBush2.rotation.set(-0.2, 0.4, -0.2)
    flowerBed.add(jasmineBush2)
    animatedNodes.push({
      group: jasmineBush2,
      baseRotX: -0.2,
      baseRotZ: -0.2,
      speed: 2.4,
      phase: 1.4,
      amp: 0.06,
    })

    // === LAYER 3: FOREGROUND CINEMATIC BLURRED PETAL & VINE ACCENTS ===
    const fgRose = createRose(0xf472b6, 1.4)
    fgRose.position.set(2.4, -1.8, 2.2)
    fgRose.rotation.set(0.6, -0.5, 0.2)
    scene.add(fgRose)

    // === DRIFTING ORGANIC PETALS SYSTEM ===
    const petalCount = 45
    const petalData: Array<{
      mesh: THREE.Mesh
      vx: number
      vy: number
      vz: number
      rotSpeedX: number
      rotSpeedY: number
    }> = []

    const driftPetalGeo = new THREE.PlaneGeometry(0.08, 0.11)
    const driftColors = [0xb91c1c, 0xf59e0b, 0xffffff, 0xf472b6]

    for (let p = 0; p < petalCount; p++) {
      const pColor = driftColors[p % driftColors.length]
      const pMat = new THREE.MeshStandardMaterial({
        color: pColor,
        side: THREE.DoubleSide,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      })
      const pMesh = new THREE.Mesh(driftPetalGeo, pMat)
      pMesh.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 5 - 1.5,
        (Math.random() - 0.5) * 4 + 1
      )
      scene.add(pMesh)

      petalData.push({
        mesh: pMesh,
        vx: (Math.random() - 0.5) * 0.008 + 0.003,
        vy: -Math.random() * 0.006 - 0.003,
        vz: (Math.random() - 0.5) * 0.005,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
      })
    }

    // 7. Mouse Parallax
    let mouseX = 0
    let mouseY = 0
    let targetCameraX = 0.6
    let targetCameraY = 0.9

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
      targetCameraX = 0.6 + mouseX * 0.35
      targetCameraY = 0.9 + mouseY * 0.25
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 8. Animation & Render Loop
    let animId: number
    let isTabVisible = true
    let clock = new THREE.Clock()

    const handleVisibility = () => {
      isTabVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isTabVisible) return

      const elapsed = clock.getElapsedTime()
      const scroll = scrollRef.current

      // Continuous Environmental Wind with distinct plant phases
      if (!isReducedMotion.current) {
        animatedNodes.forEach((node) => {
          const windSway = Math.sin(elapsed * node.speed + node.phase) * node.amp
          node.group.rotation.x = node.baseRotX + windSway
          node.group.rotation.z = node.baseRotZ + windSway * 0.7
        })

        // Drifting Petals movement
        petalData.forEach((p) => {
          p.mesh.position.x += p.vx
          p.mesh.position.y += p.vy
          p.mesh.position.z += p.vz
          p.mesh.rotation.x += p.rotSpeedX
          p.mesh.rotation.y += p.rotSpeedY

          // Wrap around viewport boundaries
          if (p.mesh.position.y < -3) p.mesh.position.y = 3.5
          if (p.mesh.position.x > 5) p.mesh.position.x = -4
          if (p.mesh.position.x < -4) p.mesh.position.x = 5
        })
      }

      // Smooth Camera Parallax & Scroll Reactivity
      camera.position.x += (targetCameraX - camera.position.x) * 0.04
      camera.position.y += (targetCameraY - camera.position.y) * 0.04
      camera.position.z = 5.8 - scroll * 1.5 // Dolly in with scroll

      // Scroll-linked garden reveal & lighting shift
      gardenMasterGroup.rotation.y = (mouseX * 0.06) + scroll * 0.18
      sunLight.intensity = 3.4 + scroll * 0.8

      camera.lookAt(0.3, 0.2, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth || window.innerWidth
      const newHeight = container.clientHeight || Math.min(window.innerHeight * 0.9, 780)
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // 10. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelAnimationFrame(animId)

      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div className={`relative w-full h-[600px] flex items-center justify-center bg-[#07130E] ${className}`}>
        <div className="text-center p-6 rounded-2xl bg-[#10271C] border border-emerald-500/20 max-w-md">
          <p className="text-xs text-[#A8C5AC]">
            Living Indian Botanical Garden • Optimized Fallback View
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[640px] sm:h-[720px] lg:h-[780px] overflow-hidden select-none pointer-events-none ${className}`}
      aria-label="3D Indian Flower Garden with Roses, Chendumalli Marigolds, Jasmine, and Climbing Vines"
    />
  )
}
