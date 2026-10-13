import React, { useState, useRef } from 'react'
import { DocumentCorners, Point, CornerKey } from '../../lib/scanner/types'

interface CornerOverlayProps {
  corners: DocumentCorners
  imageWidth: number
  imageHeight: number
  containerWidth: number
  containerHeight: number
  onCornersChange: (newCorners: DocumentCorners) => void
  onDragStart?: (key: CornerKey, clientPos: { x: number; y: number }, imgPos: Point) => void
  onDragMove?: (key: CornerKey, clientPos: { x: number; y: number }, imgPos: Point) => void
  onDragEnd?: () => void
}

export const CornerOverlay: React.FC<CornerOverlayProps> = ({
  corners,
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight,
  onCornersChange,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const [activeCorner, setActiveCorner] = useState<CornerKey | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Scale factors between natural image coordinates and rendered container pixels
  const scaleX = containerWidth / imageWidth
  const scaleY = containerHeight / imageHeight

  const toScreen = (p: Point): Point => ({
    x: p.x * scaleX,
    y: p.y * scaleY,
  })

  const toImage = (p: Point): Point => ({
    x: Math.max(0, Math.min(imageWidth, p.x / scaleX)),
    y: Math.max(0, Math.min(imageHeight, p.y / scaleY)),
  })

  const screenTL = toScreen(corners.tl)
  const screenTR = toScreen(corners.tr)
  const screenBR = toScreen(corners.br)
  const screenBL = toScreen(corners.bl)

  const handlePointerDown = (key: CornerKey, e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setActiveCorner(key)

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const clientPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      onDragStart?.(key, clientPos, corners[key])
    }
  }

  const handlePointerMove = (key: CornerKey, e: React.PointerEvent) => {
    if (activeCorner !== key || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const screenPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    const imgPos = toImage(screenPos)
    const updated = {
      ...corners,
      [key]: imgPos,
    }

    onCornersChange(updated)
    onDragMove?.(key, screenPos, imgPos)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeCorner) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Pointer capture might have been lost
      }
      setActiveCorner(null)
      onDragEnd?.()
    }
  }

  const cornerLabels: Record<CornerKey, string> = {
    tl: 'Top-Left',
    tr: 'Top-Right',
    br: 'Bottom-Right',
    bl: 'Bottom-Left',
  }

  const cornerPoints: { key: CornerKey; point: Point; screen: Point }[] = [
    { key: 'tl', point: corners.tl, screen: screenTL },
    { key: 'tr', point: corners.tr, screen: screenTR },
    { key: 'br', point: corners.br, screen: screenBR },
    { key: 'bl', point: corners.bl, screen: screenBL },
  ]

  const polygonPath = `M ${screenTL.x} ${screenTL.y} L ${screenTR.x} ${screenTR.y} L ${screenBR.x} ${screenBR.y} L ${screenBL.x} ${screenBL.y} Z`

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-auto select-none"
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
    >
      <defs>
        <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Shaded Semi-Transparent Backdrop outside selection can be indicated with polygon fill */}
      <path
        d={polygonPath}
        fill="rgba(16, 185, 129, 0.08)"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        className="transition-all"
        filter="url(#emerald-glow)"
      />

      {/* Connected polygon perimeter lines */}
      <line
        x1={screenTL.x}
        y1={screenTL.y}
        x2={screenTR.x}
        y2={screenTR.y}
        stroke="#34D399"
        strokeWidth="2"
      />
      <line
        x1={screenTR.x}
        y1={screenTR.y}
        x2={screenBR.x}
        y2={screenBR.y}
        stroke="#34D399"
        strokeWidth="2"
      />
      <line
        x1={screenBR.x}
        y1={screenBR.y}
        x2={screenBL.x}
        y2={screenBL.y}
        stroke="#34D399"
        strokeWidth="2"
      />
      <line
        x1={screenBL.x}
        y1={screenBL.y}
        x2={screenTL.x}
        y2={screenTL.y}
        stroke="#34D399"
        strokeWidth="2"
      />

      {/* 4 Interactive Magnetic Corner Handles */}
      {cornerPoints.map(({ key, screen }) => {
        const isActive = activeCorner === key
        return (
          <g
            key={key}
            className="cursor-grab active:cursor-grabbing transition-transform"
            onPointerDown={(e) => handlePointerDown(key, e)}
            onPointerMove={(e) => handlePointerMove(key, e)}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Outer touch hit target (larger for mobile fingers) */}
            <circle
              cx={screen.x}
              cy={screen.y}
              r={24}
              fill="transparent"
              className="touch-none"
            />

            {/* Glowing active ring */}
            {isActive && (
              <circle
                cx={screen.x}
                cy={screen.y}
                r={16}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2"
                className="animate-ping opacity-75"
              />
            )}

            {/* Outer visible ring */}
            <circle
              cx={screen.x}
              cy={screen.y}
              r={isActive ? 12 : 9}
              fill="#0F172A"
              stroke={isActive ? '#06B6D4' : '#10B981'}
              strokeWidth="2.5"
              className="transition-all duration-150"
            />

            {/* Inner solid center dot */}
            <circle
              cx={screen.x}
              cy={screen.y}
              r={isActive ? 5 : 3.5}
              fill={isActive ? '#22D3EE' : '#34D399'}
            />

            {/* Corner label tooltip */}
            <text
              x={screen.x}
              y={screen.y - (isActive ? 16 : 13)}
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-emerald-300 pointer-events-none select-none drop-shadow"
            >
              {key.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
