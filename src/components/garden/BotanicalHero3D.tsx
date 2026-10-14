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
  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Verify WebGL support
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGL(false)
        return
      }
    } catch {
      setHasWebGL(false)
      return
    }

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || 760

    // 2. Scene with deep botanical atmospheric fog
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x06140D, 0.038)

    // 3. Camera with wide natural perspective
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50)
    camera.position.set(0, 0.05, 4.3)

    // 4. WebGL Renderer with ACES tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 5. Cinematic Lighting
    // Soft forest ambient
    const ambientLight = new THREE.AmbientLight(0x0f2b1d, 2.2)
    scene.add(ambientLight)

    // Main warm Indian morning sunlight
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.8)
    sunLight.position.set(4, 6, 4)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.bias = -0.0005
    scene.add(sunLight)

    // Emerald chlorophyll back-rim light
    const emeraldRim = new THREE.PointLight(0x10b981, 4.5, 12)
    emeraldRim.position.set(-3.5, 2.5, -1)
    scene.add(emeraldRim)

    // Warm saffron accent light for marigolds
    const saffronFill = new THREE.PointLight(0xf59e0b, 3.5, 9)
    saffronFill.position.set(2.5, -0.5, 1.5)
    scene.add(saffronFill)

    // Gentle top fill for jasmine blossoms
    const topGlow = new THREE.PointLight(0xffedd5, 2.0, 7)
    topGlow.position.set(0, 3, 2)
    scene.add(topGlow)

    // 6. Master Groups
    const masterGarden = new THREE.Group()
    scene.add(masterGarden)

    // Dynamic wind sway tracking nodes
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
    // SHARED BOTANICAL MATERIALS
    // -------------------------------------------------------------
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Lush Indian green
      roughness: 0.28,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x052e16,
      emissiveIntensity: 0.18,
    })

    const vineBarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.65,
      metalness: 0.05,
    })

    const sepalMaterial = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.4,
      side: THREE.DoubleSide,
    })

    const jasminePetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.04,
      side: THREE.DoubleSide,
      emissive: 0xfef9c3,
      emissiveIntensity: 0.15,
    })

    const jasmineCenterMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    })

    // -------------------------------------------------------------
    // BUILDER 1: REALISTIC MULTI-LAYERED ROSE BLOSSOM
    // Large, identifiable layered petals with Fibonacci curving
    // -------------------------------------------------------------
    const createRose = (colorHex: number, scale = 1.0): THREE.Group => {
      const rose = new THREE.Group()

      const petalMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.08,
        side: THREE.DoubleSide,
        emissive: colorHex,
        emissiveIntensity: 0.14,
      })

      // Curved Petal Geometry Generator
      const makeCurvedPetal = (w: number, h: number, curl: number) => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.quadraticCurveTo(w * 0.75, h * 0.4, w * 0.65, h * 0.85)
        shape.quadraticCurveTo(w * 0.2, h * 1.05, 0, h * 1.08)
        shape.quadraticCurveTo(-w * 0.2, h * 1.05, -w * 0.65, h * 0.85)
        shape.quadraticCurveTo(-w * 0.75, h * 0.4, 0, 0)

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.008,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.006,
          bevelThickness: 0.006,
        })
        // Apply curl to vertices
        const pos = geo.attributes.position
        for (let v = 0; v < pos.count; v++) {
          const yVal = pos.getY(v)
          const zVal = pos.getZ(v)
          pos.setZ(v, zVal + Math.pow(yVal / h, 2) * curl)
        }
        geo.computeVertexNormals()
        return geo
      }

      // 5 Sepals under the flower
      for (let s = 0; s < 5; s++) {
        const sepalAngle = (s / 5) * Math.PI * 2
        const sShape = new THREE.Shape()
        sShape.moveTo(0, 0)
        sShape.quadraticCurveTo(0.06, 0.16, 0, 0.42)
        sShape.quadraticCurveTo(-0.06, 0.16, 0, 0)
        const sGeo = new THREE.ExtrudeGeometry(sShape, { depth: 0.006, bevelEnabled: false })
        const sMesh = new THREE.Mesh(sGeo, sepalMaterial)
        sMesh.rotation.z = sepalAngle
        sMesh.rotation.x = 0.65
        sMesh.position.y = -0.06
        rose.add(sMesh)
      }

      // Stem connector
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.35, 8)
      const stemMesh = new THREE.Mesh(stemGeo, vineBarkMaterial)
      stemMesh.position.y = -0.2
      rose.add(stemMesh)

      // Ring 1: Tight Inner Bud (5 petals)
      const r1Geo = makeCurvedPetal(0.18, 0.32, 0.08)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + 0.1
        const pMesh = new THREE.Mesh(r1Geo, petalMat)
        pMesh.position.set(Math.cos(angle) * 0.04, 0.06, Math.sin(angle) * 0.04)
        pMesh.rotation.y = angle
        pMesh.rotation.x = 0.4
        rose.add(pMesh)
      }

      // Ring 2: Intermediate Whorl (7 petals)
      const r2Geo = makeCurvedPetal(0.28, 0.44, 0.12)
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2 + 0.35
        const pMesh = new THREE.Mesh(r2Geo, petalMat)
        pMesh.position.set(Math.cos(angle) * 0.1, 0.03, Math.sin(angle) * 0.1)
        pMesh.rotation.y = angle
        pMesh.rotation.x = 0.72
        rose.add(pMesh)
      }

      // Ring 3: Fully Flared Outer Petals (9 large petals)
      const r3Geo = makeCurvedPetal(0.38, 0.55, 0.18)
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2 + 0.6
        const pMesh = new THREE.Mesh(r3Geo, petalMat)
        pMesh.position.set(Math.cos(angle) * 0.18, -0.01, Math.sin(angle) * 0.18)
        pMesh.rotation.y = angle
        pMesh.rotation.x = 1.05
        pMesh.castShadow = true
        rose.add(pMesh)
      }

      rose.scale.set(scale, scale, scale)
      return rose
    }

    // -------------------------------------------------------------
    // BUILDER 2: REALISTIC CHENDUMALLI / INDIAN MARIGOLD
    // Dense spherical/domed pom-pom head with ~100 ruffled florets
    // -------------------------------------------------------------
    const createMarigold = (colorHex: number, scale = 1.0): THREE.Group => {
      const marigold = new THREE.Group()

      const floretMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.32,
        metalness: 0.06,
        side: THREE.DoubleSide,
        emissive: colorHex,
        emissiveIntensity: 0.18,
      })

      // Ruffled scalloped floret petal shape
      const floretShape = new THREE.Shape()
      floretShape.moveTo(0, 0)
      floretShape.lineTo(0.06, 0.14)
      floretShape.lineTo(0.03, 0.22) // Notched ruffle tip
      floretShape.lineTo(0, 0.25)
      floretShape.lineTo(-0.03, 0.22)
      floretShape.lineTo(-0.06, 0.14)
      floretShape.closePath()
      const floretGeo = new THREE.ExtrudeGeometry(floretShape, { depth: 0.006, bevelEnabled: false })

      // 6 concentric domed tiers creating dense spherical head
      const tiers = [
        { count: 6, radius: 0.05, pitch: 0.25, y: 0.2 },
        { count: 12, radius: 0.12, pitch: 0.55, y: 0.16 },
        { count: 18, radius: 0.19, pitch: 0.85, y: 0.1 },
        { count: 24, radius: 0.27, pitch: 1.15, y: 0.02 },
        { count: 26, radius: 0.32, pitch: 1.45, y: -0.07 },
        { count: 20, radius: 0.26, pitch: 1.75, y: -0.15 },
      ]

      tiers.forEach((tier) => {
        for (let i = 0; i < tier.count; i++) {
          const angle = (i / tier.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1
          const mesh = new THREE.Mesh(floretGeo, floretMat)
          mesh.position.set(Math.cos(angle) * tier.radius, tier.y, Math.sin(angle) * tier.radius)
          mesh.rotation.y = angle
          mesh.rotation.x = tier.pitch
          mesh.rotation.z = (Math.random() - 0.5) * 0.3
          mesh.castShadow = true
          marigold.add(mesh)
        }
      })

      // Dark core calyx
      const calyxGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.18, 8)
      const calyxMesh = new THREE.Mesh(calyxGeo, sepalMaterial)
      calyxMesh.position.y = -0.16
      marigold.add(calyxMesh)

      marigold.scale.set(scale, scale, scale)
      return marigold
    }

    // -------------------------------------------------------------
    // BUILDER 3: REALISTIC JASMINE / MULLA CLUSTERS
    // 5-petal star blossoms with slender floral tube & yellow pistil
    // -------------------------------------------------------------
    const createJasmineSpray = (scale = 1.0): THREE.Group => {
      const spray = new THREE.Group()

      const makeStarFlower = () => {
        const flower = new THREE.Group()

        // Slender floral tube
        const tubeGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.14, 6)
        const tube = new THREE.Mesh(tubeGeo, sepalMaterial)
        tube.position.y = -0.07
        flower.add(tube)

        // 5 Star petals
        const pShape = new THREE.Shape()
        pShape.moveTo(0, 0)
        pShape.quadraticCurveTo(0.03, 0.08, 0, 0.16)
        pShape.quadraticCurveTo(-0.03, 0.08, 0, 0)
        const pGeo = new THREE.ExtrudeGeometry(pShape, { depth: 0.004, bevelEnabled: false })

        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2
          const pMesh = new THREE.Mesh(pGeo, jasminePetalMaterial)
          pMesh.rotation.z = angle
          pMesh.rotation.x = 0.15
          flower.add(pMesh)
        }

        // Golden center pistil
        const centerGeo = new THREE.SphereGeometry(0.02, 8, 8)
        const center = new THREE.Mesh(centerGeo, jasmineCenterMaterial)
        center.position.y = 0.01
        flower.add(center)

        return flower
      }

      // Blossom cluster (5 open blossoms + 2 pink-tinged buds)
      const blossomSlots = [
        { pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0.2, 0, 0.1) },
        { pos: new THREE.Vector3(0.18, 0.12, 0.06), rot: new THREE.Euler(0.4, 0.3, -0.2) },
        { pos: new THREE.Vector3(-0.16, 0.1, 0.04), rot: new THREE.Euler(-0.3, -0.4, 0.3) },
        { pos: new THREE.Vector3(0.04, 0.22, -0.08), rot: new THREE.Euler(0.5, 0.1, 0.4) },
        { pos: new THREE.Vector3(-0.08, -0.12, 0.08), rot: new THREE.Euler(-0.2, 0.5, -0.1) },
      ]

      blossomSlots.forEach(({ pos, rot }) => {
        const fl = makeStarFlower()
        fl.position.copy(pos)
        fl.rotation.copy(rot)
        spray.add(fl)
      })

      // Delicate Jasmine Leaves
      const leafShape = new THREE.Shape()
      leafShape.moveTo(0, 0)
      leafShape.quadraticCurveTo(0.1, 0.15, 0.08, 0.32)
      leafShape.quadraticCurveTo(0, 0.42, 0, 0.45)
      leafShape.quadraticCurveTo(-0.08, 0.32, -0.1, 0.15)
      leafShape.quadraticCurveTo(0, 0, 0, 0)
      const jLeafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.005, bevelEnabled: false })

      for (let l = 0; l < 4; l++) {
        const lMesh = new THREE.Mesh(jLeafGeo, leafMaterial)
        const lAngle = (l / 4) * Math.PI * 2
        lMesh.position.set(Math.cos(lAngle) * 0.15, -0.08, Math.sin(lAngle) * 0.15)
        lMesh.rotation.z = lAngle
        lMesh.rotation.x = 0.8
        lMesh.scale.set(0.65, 0.65, 0.65)
        spray.add(lMesh)
      }

      spray.scale.set(scale, scale, scale)
      return spray
    }

    // -------------------------------------------------------------
    // BUILDER 4: REALISTIC CLIMBING GREEN VINE
    // 3D Catmull-Rom spline with branching, leaves, and jasmine blooms
    // -------------------------------------------------------------
    const createClimbingVine = (
      points: THREE.Vector3[],
      tubeRadius = 0.05,
      addBlooms = true
    ): THREE.Group => {
      const vineGroup = new THREE.Group()

      const curve = new THREE.CatmullRomCurve3(points)
      const tubeGeo = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false)
      const vineMesh = new THREE.Mesh(tubeGeo, vineBarkMaterial)
      vineMesh.castShadow = true
      vineGroup.add(vineMesh)

      // Leaf Shape
      const leafShape = new THREE.Shape()
      leafShape.moveTo(0, 0)
      leafShape.quadraticCurveTo(0.16, 0.22, 0.18, 0.48)
      leafShape.quadraticCurveTo(0.08, 0.68, 0, 0.78)
      leafShape.quadraticCurveTo(-0.08, 0.68, -0.18, 0.48)
      leafShape.quadraticCurveTo(-0.16, 0.22, 0, 0)
      const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.008, bevelEnabled: false })

      // Foliage along the vine curve
      const steps = 14
      for (let i = 1; i < steps; i++) {
        const u = i / steps
        const pos = curve.getPointAt(u)
        const tangent = curve.getTangentAt(u)

        // Alternating leaf pair
        const side = i % 2 === 0 ? 1 : -1
        const leafMesh = new THREE.Mesh(leafGeo, leafMaterial)
        leafMesh.position.copy(pos)
        leafMesh.rotation.set(
          tangent.y + 0.2,
          tangent.x + side * 0.8,
          side * 0.5
        )
        const lScale = 0.55 + (1 - u * 0.3) * 0.45
        leafMesh.scale.set(lScale, lScale, lScale)
        leafMesh.castShadow = true
        vineGroup.add(leafMesh)

        // Add Jasmine blooms on vine nodes
        if (addBlooms && (i === 4 || i === 8 || i === 11)) {
          const vineBloom = createJasmineSpray(0.9)
          vineBloom.position.set(pos.x + side * 0.12, pos.y, pos.z + 0.08)
          vineBloom.rotation.set(0.3, side * 0.5, 0.2)
          vineGroup.add(vineBloom)
        }
      }

      return vineGroup
    }

    // =============================================================
    // MASTER COMPOSITION: FRAMING HERO WITH GLORIOUS 3D GARDEN
    // =============================================================

    // --- LEFT BOTANICAL FLANK ---
    const leftFlank = new THREE.Group()
    leftFlank.position.set(-1.95, -0.3, 0.4)
    masterGarden.add(leftFlank)

    // 1. Giant Velvet Crimson Red Rose
    const redRose = createRose(0xBE123C, 2.05) // Large identifiable size
    redRose.position.set(-0.1, 0.5, 0.4)
    redRose.rotation.set(0.25, 0.5, -0.15)
    leftFlank.add(redRose)
    animatedNodes.push({
      group: redRose,
      baseRotX: 0.25,
      baseRotZ: -0.15,
      speed: 1.2,
      phase: 0.2,
      amp: 0.04,
    })

    // 2. Bright Saffron Orange Indian Marigold
    const saffronMarigold = createMarigold(0xEA580C, 1.85)
    saffronMarigold.position.set(0.4, -0.35, 0.6)
    saffronMarigold.rotation.set(0.35, 0.2, 0)
    leftFlank.add(saffronMarigold)
    animatedNodes.push({
      group: saffronMarigold,
      baseRotX: 0.35,
      baseRotZ: 0,
      speed: 1.5,
      phase: 1.1,
      amp: 0.045,
    })

    // 3. Pale Ivory Cream Rose
    const creamRose = createRose(0xFFFBEB, 1.6)
    creamRose.position.set(-0.55, -0.2, 0.2)
    creamRose.rotation.set(0.2, 0.8, -0.25)
    leftFlank.add(creamRose)
    animatedNodes.push({
      group: creamRose,
      baseRotX: 0.2,
      baseRotZ: -0.25,
      speed: 1.1,
      phase: 2.3,
      amp: 0.035,
    })

    // 4. White Jasmine Spray clustering under red rose
    const leftJasmine = createJasmineSpray(1.5)
    leftJasmine.position.set(0.2, 0.95, 0.3)
    leftJasmine.rotation.set(0.4, 0.2, 0.1)
    leftFlank.add(leftJasmine)
    animatedNodes.push({
      group: leftJasmine,
      baseRotX: 0.4,
      baseRotZ: 0.1,
      speed: 2.1,
      phase: 3.1,
      amp: 0.06,
    })

    // 5. Left Climbing Vine climbing from bottom left toward top
    const leftVine = createClimbingVine(
      [
        new THREE.Vector3(-3.2, -3.2, 0.6),
        new THREE.Vector3(-2.6, -1.6, 0.3),
        new THREE.Vector3(-2.9, 0.2, -0.1),
        new THREE.Vector3(-2.3, 1.8, -0.5),
        new THREE.Vector3(-1.1, 2.8, -1.0),
      ],
      0.052,
      true
    )
    masterGarden.add(leftVine)
    animatedNodes.push({
      group: leftVine,
      baseRotX: 0,
      baseRotZ: 0,
      speed: 0.8,
      phase: 0.4,
      amp: 0.02,
    })

    // --- RIGHT BOTANICAL FLANK ---
    const rightFlank = new THREE.Group()
    rightFlank.position.set(1.95, -0.3, 0.4)
    masterGarden.add(rightFlank)

    // 6. Large Indian Rose Pink Blossom
    const pinkRose = createRose(0xF43F5E, 2.0)
    pinkRose.position.set(0.1, 0.5, 0.4)
    pinkRose.rotation.set(0.3, -0.5, 0.15)
    rightFlank.add(pinkRose)
    animatedNodes.push({
      group: pinkRose,
      baseRotX: 0.3,
      baseRotZ: 0.15,
      speed: 1.3,
      phase: 1.6,
      amp: 0.04,
    })

    // 7. Radiant Golden Temple Marigold
    const goldenMarigold = createMarigold(0xFBBF24, 1.9)
    goldenMarigold.position.set(-0.35, -0.35, 0.6)
    goldenMarigold.rotation.set(0.3, -0.2, 0.1)
    rightFlank.add(goldenMarigold)
    animatedNodes.push({
      group: goldenMarigold,
      baseRotX: 0.3,
      baseRotZ: 0.1,
      speed: 1.6,
      phase: 2.6,
      amp: 0.045,
    })

    // 8. Warm Amber Chendumalli Marigold
    const amberMarigold = createMarigold(0xD97706, 1.55)
    amberMarigold.position.set(0.6, -0.2, 0.2)
    amberMarigold.rotation.set(0.2, -0.7, 0.2)
    rightFlank.add(amberMarigold)
    animatedNodes.push({
      group: amberMarigold,
      baseRotX: 0.2,
      baseRotZ: 0.2,
      speed: 1.4,
      phase: 0.8,
      amp: 0.035,
    })

    // 9. Right Star Jasmine Spray
    const rightJasmine = createJasmineSpray(1.5)
    rightJasmine.position.set(-0.2, 0.95, 0.3)
    rightJasmine.rotation.set(0.35, -0.2, -0.1)
    rightFlank.add(rightJasmine)
    animatedNodes.push({
      group: rightJasmine,
      baseRotX: 0.35,
      baseRotZ: -0.1,
      speed: 2.3,
      phase: 1.8,
      amp: 0.06,
    })

    // 10. Right Climbing Vine
    const rightVine = createClimbingVine(
      [
        new THREE.Vector3(3.2, -3.2, 0.6),
        new THREE.Vector3(2.6, -1.5, 0.3),
        new THREE.Vector3(2.9, 0.4, 0.0),
        new THREE.Vector3(2.3, 1.9, -0.5),
        new THREE.Vector3(1.1, 2.9, -1.0),
      ],
      0.052,
      true
    )
    masterGarden.add(rightVine)
    animatedNodes.push({
      group: rightVine,
      baseRotX: 0,
      baseRotZ: 0,
      speed: 0.85,
      phase: 1.4,
      amp: 0.02,
    })

    // --- BOTTOM FOREGROUND FLOWER BED (Anchoring the base) ---
    const bottomBed = new THREE.Group()
    bottomBed.position.set(0, -1.65, 0.8)
    masterGarden.add(bottomBed)

    // Center-left Marigold
    const centerMarigold1 = createMarigold(0xF59E0B, 1.4)
    centerMarigold1.position.set(-0.9, 0, 0.3)
    centerMarigold1.rotation.set(0.5, 0.2, 0)
    bottomBed.add(centerMarigold1)

    // Center-right Rose
    const centerRose = createRose(0xE11D48, 1.35)
    centerRose.position.set(0.85, 0.05, 0.3)
    centerRose.rotation.set(0.45, -0.3, 0)
    bottomBed.add(centerRose)

    // Central low Jasmine cluster
    const centerJasmine = createJasmineSpray(1.2)
    centerJasmine.position.set(0, -0.05, 0.4)
    bottomBed.add(centerJasmine)

    // --- 3D DRIFTING ORGANIC PETALS SYSTEM ---
    const petalCount = 40
    const petalData: Array<{
      mesh: THREE.Mesh
      vx: number
      vy: number
      vz: number
      rotSpeedX: number
      rotSpeedY: number
    }> = []

    const driftPetalShape = new THREE.Shape()
    driftPetalShape.moveTo(0, 0)
    driftPetalShape.quadraticCurveTo(0.06, 0.08, 0.05, 0.15)
    driftPetalShape.quadraticCurveTo(0, 0.2, 0, 0.22)
    driftPetalShape.quadraticCurveTo(-0.05, 0.15, -0.06, 0.08)
    driftPetalShape.quadraticCurveTo(0, 0, 0, 0)
    const driftPetalGeo = new THREE.ExtrudeGeometry(driftPetalShape, { depth: 0.004, bevelEnabled: false })

    const petalColors = [0xBE123C, 0xF59E0B, 0xFFFFFF, 0xF43F5E, 0xFBBF24]

    for (let p = 0; p < petalCount; p++) {
      const color = petalColors[p % petalColors.length]
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        emissive: color,
        emissiveIntensity: 0.1,
      })
      const mesh = new THREE.Mesh(driftPetalGeo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 7.5,
        Math.random() * 4.5 - 1.5,
        (Math.random() - 0.5) * 3 + 1.2
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      const pScale = 0.7 + Math.random() * 0.7
      mesh.scale.set(pScale, pScale, pScale)
      scene.add(mesh)

      petalData.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.006 + 0.002,
        vy: -Math.random() * 0.005 - 0.002,
        vz: (Math.random() - 0.5) * 0.004,
        rotSpeedX: (Math.random() - 0.5) * 0.025,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
      })
    }

    // 7. Interactive Parallax & Mouse Tracking
    let mouseX = 0
    let mouseY = 0
    let targetCameraX = 0
    let targetCameraY = 0.05

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
      targetCameraX = mouseX * 0.28
      targetCameraY = 0.05 + mouseY * 0.2
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 8. 60 FPS Render Loop
    let animId: number
    let isTabVisible = true
    const clock = new THREE.Clock()

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
          node.group.rotation.z = node.baseRotZ + windSway * 0.75
        })

        // Drifting Petals movement
        petalData.forEach((p) => {
          p.mesh.position.x += p.vx
          p.mesh.position.y += p.vy
          p.mesh.position.z += p.vz
          p.mesh.rotation.x += p.rotSpeedX
          p.mesh.rotation.y += p.rotSpeedY

          // Wrap bounds
          if (p.mesh.position.y < -2.6) p.mesh.position.y = 2.8
          if (p.mesh.position.x > 4.2) p.mesh.position.x = -4.2
          if (p.mesh.position.x < -4.2) p.mesh.position.x = 4.2
        })
      }

      // Smooth Camera Parallax & Scroll Reactivity
      camera.position.x += (targetCameraX - camera.position.x) * 0.04
      camera.position.y += (targetCameraY - camera.position.y) * 0.04
      // Dolly in slightly with scroll, tilt down into garden
      camera.position.z = 4.3 - scroll * 1.2

      masterGarden.rotation.y = mouseX * 0.05 + scroll * 0.15
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth || window.innerWidth
      const newHeight = container.clientHeight || 760
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
      <div className={`relative w-full h-[680px] flex items-center justify-center bg-[#07130E] ${className}`}>
        <div className="text-center p-6 rounded-2xl bg-[#10271C] border border-emerald-500/20 max-w-md">
          <p className="text-xs text-[#A8C5AC]">
            Living Indian Botanical Garden • Optimized View
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-label="Realistic 3D Indian Flower Garden with Roses, Chendumalli Marigolds, Jasmine, and Climbing Vines"
    />
  )
}
