import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dices,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Copy,
  Download,
  Share2,
  Printer,
  Trash2,
  Shuffle,
  Plus,
  Edit2,
  Check,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  UserPlus,
  Sliders,
  Shield,
  Info,
  Layers,
  ChevronDown,
  X
} from 'lucide-react'
import {
  parseParticipants,
  deduplicateParticipants,
  shuffleParticipants,
  calculateWheelSpin,
  getSegmentAtAngle,
  splitIntoTeams,
  TEAM_COLORS,
  WHEEL_PALETTE,
  SAMPLE_PRESETS,
  TeamGroup,
  WinnerHistoryItem
} from '../lib/luckyDrawTeamCalc'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  LUCKY_LOCALES,
  ALL_LUCKY_LANG_CODES,
  LuckyLangCode,
  isLuckyLocale,
  getLuckyToolTranslation
} from '../i18n/luckyDrawTeamI18n'

const STORAGE_PARTICIPANTS_KEY = 'indiatools_lucky_draw_participants'
const STORAGE_PREFS_KEY = 'indiatools_lucky_draw_prefs'

export const LuckyDrawTeamSplitterTool: React.FC = () => {
  const tool = getToolBySlug('lucky-draw-team-splitter')!
  const { langCode } = useParams<{ langCode?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 1. Locale resolution
  const activeLocale: LuckyLangCode = useMemo(() => {
    if (langCode && isLuckyLocale(langCode)) {
      return langCode as LuckyLangCode
    }
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && isLuckyLocale(pathSegments[0])) {
      return pathSegments[0] as LuckyLangCode
    }
    return 'en'
  }, [langCode, location.pathname])

  const t = useMemo(() => getLuckyToolTranslation(activeLocale), [activeLocale])
  const isRtl = t.dir === 'rtl'

  // Canonical & hreflangs
  const canonicalPath =
    activeLocale === 'en'
      ? '/tools/lucky-draw-team-splitter'
      : `/${activeLocale}/tools/lucky-draw-team-splitter`

  const hreflangs = useMemo(() => {
    const list = ALL_LUCKY_LANG_CODES.map((code) => ({
      lang: LUCKY_LOCALES[code].bcp47,
      href:
        code === 'en'
          ? 'https://indiatools-rho.vercel.app/tools/lucky-draw-team-splitter'
          : `https://indiatools-rho.vercel.app/${code}/tools/lucky-draw-team-splitter`,
    }))
    list.push({
      lang: 'x-default',
      href: 'https://indiatools-rho.vercel.app/tools/lucky-draw-team-splitter',
    })
    return list
  }, [])

  // 2. State
  const [activeMode, setActiveMode] = useState<'wheel' | 'teams'>('wheel')
  const [rawText, setRawText] = useState<string>(
    SAMPLE_PRESETS.cricket_squad.participants.join('\n')
  )
  const [singleNameInput, setSingleNameInput] = useState<string>('')
  const [rememberList, setRememberList] = useState<boolean>(false)

  // Wheel State
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [currentWheelRotation, setCurrentWheelRotation] = useState<number>(0)
  const [spinDurationSeconds, setSpinDurationSeconds] = useState<number>(5)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false)
  const [removeWinnerOnDraw, setRemoveWinnerOnDraw] = useState<boolean>(false)
  const [activeWinner, setActiveWinner] = useState<string | null>(null)
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false)
  const [winnerHistory, setWinnerHistory] = useState<WinnerHistoryItem[]>([])
  const [spinCount, setSpinCount] = useState<number>(0)

  // Team Splitter State
  const [splitMode, setSplitMode] = useState<'by_teams' | 'by_size'>('by_teams')
  const [splitValue, setSplitValue] = useState<number>(3)
  const [teams, setTeams] = useState<TeamGroup[]>([])
  const [customTeamNames, setCustomTeamNames] = useState<Record<number, string>>({})
  const [movingMember, setMovingMember] = useState<{ member: string; fromTeamId: string } | null>(null)
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null)
  const [editNameText, setEditNameText] = useState<string>('')

  // Canvas Refs
  const wheelCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // 3. Parsed participants
  const participants = useMemo(() => parseParticipants(rawText), [rawText])

  // Load saved preferences and participants on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY)
      if (savedPrefs) {
        const p = JSON.parse(savedPrefs)
        if (p.remember) {
          setRememberList(true)
          const savedNames = localStorage.getItem(STORAGE_PARTICIPANTS_KEY)
          if (savedNames) setRawText(savedNames)
        }
        if (typeof p.sound === 'boolean') setSoundEnabled(p.sound)
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist if enabled
  useEffect(() => {
    try {
      if (rememberList) {
        localStorage.setItem(STORAGE_PARTICIPANTS_KEY, rawText)
        localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify({ remember: true, sound: soundEnabled }))
      } else {
        localStorage.removeItem(STORAGE_PARTICIPANTS_KEY)
        localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify({ remember: false, sound: soundEnabled }))
      }
    } catch {
      // ignore
    }
  }, [rememberList, rawText, soundEnabled])

  // Saved roster snapshot for resetting the game after elimination
  const savedRosterRef = useRef<string>(rawText)

  // Backup roster whenever user updates names, but only if no winners have been drawn yet
  useEffect(() => {
    if (winnerHistory.length === 0 && rawText.trim().length > 0) {
      savedRosterRef.current = rawText
    }
  }, [rawText, winnerHistory.length])

  // Game Over Condition: When removeWinnerOnDraw is active and only 1 participant remains after previous draws
  const isGameOver = useMemo(() => {
    return Boolean(
      removeWinnerOnDraw &&
      winnerHistory.length > 0 &&
      participants.length <= 1
    )
  }, [removeWinnerOnDraw, winnerHistory.length, participants.length])

  // Identify the sole remaining participant when isGameOver or when participants.length === 1
  const finalParticipant = useMemo(() => {
    if (participants.length === 1) return participants[0]
    return null
  }, [participants])

  // When drawing between the last 2 people, identify the other person who will remain
  const otherRemainingParticipant = useMemo(() => {
    if (participants.length === 2 && activeWinner) {
      const winnerIdx = participants.findIndex(
        p => p.trim().toLowerCase() === activeWinner.trim().toLowerCase()
      )
      if (winnerIdx !== -1) {
        const otherIdx = winnerIdx === 0 ? 1 : 0
        return participants[otherIdx]
      }
    }
    return null
  }, [participants, activeWinner])

  // Is this the penultimate draw (drawing between 2 remaining people with remove-winner active)?
  const isPenultimateDraw = Boolean(
    removeWinnerOnDraw && participants.length === 2 && activeWinner
  )

  // Audio synthesizer using Web Audio API
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // audio context not allowed
    }
  }, [soundEnabled])

  const playFanfareSound = useCallback(() => {
    if (!soundEnabled) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09)

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + idx * 0.09)
        osc.stop(ctx.currentTime + idx * 0.09 + 0.35)
      })
    } catch {
      // ignore
    }
  }, [soundEnabled])

  // Draw Wheel on Canvas
  const drawWheel = useCallback((rotationDeg: number) => {
    const canvas = wheelCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 480
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size / 2 - 16

    ctx.clearRect(0, 0, size, size)

    const count = participants.length
    if (count === 0) {
      // Draw empty wheel
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#1E293B'
      ctx.fill()
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.fillStyle = '#94A3B8'
      ctx.font = 'bold 16px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Add participants to begin', center, center)
      return
    }

    const segmentArc = (Math.PI * 2) / count
    const rotationRad = (rotationDeg * Math.PI) / 180

    ctx.save()
    ctx.translate(center, center)
    ctx.rotate(rotationRad)

    // Draw Segments
    for (let i = 0; i < count; i++) {
      const startAngle = i * segmentArc
      const endAngle = (i + 1) * segmentArc
      const color = WHEEL_PALETTE[i % WHEEL_PALETTE.length]

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = count === 1 && isGameOver ? '#F59E0B' : color
      ctx.fill()

      // Segment Border
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)'
      ctx.lineWidth = count > 60 ? 1 : 2
      ctx.stroke()

      // Text along the radius
      ctx.save()
      const textAngle = startAngle + segmentArc / 2
      ctx.rotate(textAngle)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#FFFFFF'

      let fontSize = 14
      if (count > 25) fontSize = 12
      if (count > 50) fontSize = 10
      if (count > 100) fontSize = 8

      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`

      // Shadow for crisp text contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4

      let name = participants[i]
      if (count === 1 && isGameOver) {
        name = `🏆 ${name} (Final)`
      } else if (count > 30 && name.length > 14) {
        name = name.substring(0, 12) + '…'
      } else if (name.length > 20) {
        name = name.substring(0, 18) + '…'
      }

      ctx.fillText(name, radius - 20, 0)
      ctx.restore()
    }

    ctx.restore()

    // Outer Ring
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, Math.PI * 2)
    ctx.strokeStyle = isGameOver ? '#F59E0B' : '#0F172A'
    ctx.lineWidth = 8
    ctx.stroke()

    // Center Hub
    ctx.beginPath()
    ctx.arc(center, center, 36, 0, Math.PI * 2)
    ctx.fillStyle = '#0F172A'
    ctx.fill()
    ctx.strokeStyle = isGameOver ? '#F59E0B' : '#8B5CF6'
    ctx.lineWidth = 4
    ctx.stroke()

    // Inner Center Dot
    ctx.beginPath()
    ctx.arc(center, center, 14, 0, Math.PI * 2)
    ctx.fillStyle = isGameOver ? '#FDE68A' : '#C084FC'
    ctx.fill()
  }, [participants, isGameOver])

  // Redraw when participants or rotation change
  useEffect(() => {
    drawWheel(currentWheelRotation)
  }, [drawWheel, currentWheelRotation])

  // Handle Wheel Spin Action
  const handleSpinWheel = () => {
    if (isSpinning || participants.length === 0) return

    // Guard: When remove winner is enabled, do NOT spin when only 1 or 0 participants remain
    if (removeWinnerOnDraw && participants.length <= 1) {
      if (winnerHistory.length > 0) {
        showToast(
          activeLocale === 'ml'
            ? 'ഗെയിം ഓവർ! എല്ലാ നറുക്കെടുപ്പുകളും പൂർത്തിയായി.'
            : 'Game Over! All participants have been drawn.',
          'info'
        )
      } else {
        showToast(
          activeLocale === 'ml'
            ? 'വിജയിയെ ഒഴിവാക്കി കറക്കാൻ കുറഞ്ഞത് 2 പേരുകൾ ചേർക്കുക.'
            : 'Add at least 2 participants for Lucky Draw with winner removal.',
          'info'
        )
      }
      return
    }

    const spinResult = calculateWheelSpin(participants, currentWheelRotation, 6)
    if (!spinResult) return

    setIsSpinning(true)
    const startAngle = currentWheelRotation
    const targetAngle = spinResult.targetAngleDegrees
    const duration = spinDurationSeconds * 1000
    const startTime = performance.now()

    let lastTickAngle = startAngle
    const tickInterval = 360 / participants.length

    // Easing: Quartic ease-out for dramatic deceleration
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easedProgress = easeOutQuart(progress)

      const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress
      setCurrentWheelRotation(currentAngle)

      // Audio ticks
      if (Math.abs(currentAngle - lastTickAngle) >= tickInterval) {
        playClickSound()
        lastTickAngle = currentAngle
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Spin finished
        setIsSpinning(false)
        setCurrentWheelRotation(targetAngle)

        // Verify winner under needle
        const verified = getSegmentAtAngle(targetAngle, participants)
        const finalWinner = verified ? verified.name : spinResult.winnerName

        setActiveWinner(finalWinner)
        setShowWinnerModal(true)
        playFanfareSound()

        const newSpin = spinCount + 1
        setSpinCount(newSpin)
        const historyItem: WinnerHistoryItem = {
          id: Date.now().toString(),
          name: finalWinner,
          timestamp: Date.now(),
          timeFormatted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          spinNumber: newSpin
        }
        setWinnerHistory(prev => [historyItem, ...prev].slice(0, 50))
      }
    }

    requestAnimationFrame(animate)
  }

  // Confetti Particle Effect in Winner Modal
  useEffect(() => {
    if (!showWinnerModal) return
    const canvas = confettiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      color: string
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotSpeed: number
    }> = []

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        color: WHEEL_PALETTE[Math.floor(Math.random() * WHEEL_PALETTE.length)],
        size: Math.random() * 8 + 5,
        speedX: (Math.random() - 0.5) * 12,
        speedY: (Math.random() - 1.2) * 10,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      })
    }

    let animId: number
    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = false

      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.speedY += 0.25 // Gravity
        p.rotation += p.rotSpeed

        if (p.y < canvas.height + 20) active = true

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      if (active) {
        animId = requestAnimationFrame(renderConfetti)
      }
    }

    animId = requestAnimationFrame(renderConfetti)
    return () => cancelAnimationFrame(animId)
  }, [showWinnerModal])

  // Remove winner after modal close if option is set
  const handleCloseWinnerModal = (forceRemove = false) => {
    setShowWinnerModal(false)
    if ((removeWinnerOnDraw || forceRemove) && activeWinner) {
      setRawText(prev => {
        const lines = prev.split(/\r?\n/)
        const idx = lines.findIndex(l => l.trim().toLowerCase() === activeWinner.toLowerCase())
        if (idx !== -1) {
          lines.splice(idx, 1)
          return lines.join('\n')
        }
        return prev
      })
      showToast(`${activeWinner} removed from wheel`, 'info')
    }
    setActiveWinner(null)
  }

  // Reset roster to the initial participant list before removals started
  const handleResetRoster = () => {
    const fallbackText = SAMPLE_PRESETS.cricket_squad.participants.join('\n')
    const textToRestore = savedRosterRef.current.trim().length > 0 ? savedRosterRef.current : fallbackText
    setRawText(textToRestore)
    setWinnerHistory([])
    setActiveWinner(null)
    setShowWinnerModal(false)
    showToast(
      activeLocale === 'ml'
        ? 'ലിസ്റ്റ് പുനഃസ്ഥാപിച്ചു! പുതിയ കളി തുടങ്ങാം.'
        : 'Roster reset! Ready for a new lucky draw.',
      'success'
    )
  }

  // Copy full Game Over results to clipboard
  const handleCopyGameResults = async () => {
    let text = `🏆 IndiaTools Lucky Draw Results\n\n`
    winnerHistory.forEach(w => {
      text += `Round #${w.spinNumber}: ${w.name} (${w.timeFormatted})\n`
    })
    if (participants.length === 1) {
      text += `🏆 Final Remaining Participant: ${participants[0]}\n`
    }
    text += `\nDraw completed with IndiaTools: https://indiatools-rho.vercel.app${canonicalPath}`
    try {
      await navigator.clipboard.writeText(text)
      showToast('Game results copied to clipboard!', 'success')
    } catch {
      showToast('Could not copy results', 'info')
    }
  }

  // Participant Management Handlers
  const handleAddSingleName = () => {
    const trimmed = singleNameInput.trim()
    if (!trimmed) return
    setRawText(prev => (prev ? `${prev}\n${trimmed}` : trimmed))
    setSingleNameInput('')
    showToast(`Added ${trimmed}`, 'info')
  }

  const handleRemoveSingleName = (nameToRemove: string) => {
    setRawText(prev => {
      const lines = prev.split(/\r?\n/)
      const idx = lines.findIndex(l => l.trim() === nameToRemove.trim())
      if (idx !== -1) {
        lines.splice(idx, 1)
        return lines.join('\n')
      }
      return prev
    })
  }

  const handleDeduplicate = () => {
    const deduped = deduplicateParticipants(participants)
    const removedCount = participants.length - deduped.length
    setRawText(deduped.join('\n'))
    showToast(removedCount > 0 ? `Removed ${removedCount} duplicates` : 'No duplicates found', 'info')
  }

  const handleShuffleParticipants = () => {
    const shuffled = shuffleParticipants(participants)
    setRawText(shuffled.join('\n'))
    showToast('Participant order shuffled', 'info')
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all participant names?')) {
      setRawText('')
      setWinnerHistory([])
      setTeams([])
      showToast('All names cleared', 'info')
    }
  }

  const handleLoadSample = (key: string) => {
    const sample = SAMPLE_PRESETS[key]
    if (sample) {
      setRawText(sample.participants.join('\n'))
      showToast(`${sample.name} loaded`, 'info')
    }
  }

  // Team Splitter Action
  const handleGenerateTeams = () => {
    if (participants.length < 2) {
      showToast('Add at least 2 participants to split teams', 'info')
      return
    }
    const res = splitIntoTeams(participants, splitMode, splitValue, customTeamNames)
    setTeams(res.teams)
    showToast(`Created ${res.teams.length} balanced teams!`, 'success')
  }

  // Update team splits automatically when splitValue or splitMode changes and teams already generated
  useEffect(() => {
    if (teams.length > 0 && participants.length >= 2) {
      const res = splitIntoTeams(participants, splitMode, splitValue, customTeamNames)
      setTeams(res.teams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitMode, splitValue])

  // Move member from one team to another
  const handleExecuteMove = (targetTeamId: string) => {
    if (!movingMember) return
    const { member, fromTeamId } = movingMember
    if (targetTeamId === fromTeamId) {
      setMovingMember(null)
      return
    }

    setTeams(prev =>
      prev.map(team => {
        if (team.id === fromTeamId) {
          return { ...team, members: team.members.filter(m => m !== member) }
        }
        if (team.id === targetTeamId) {
          return { ...team, members: [...team.members, member] }
        }
        return team
      })
    )

    setMovingMember(null)
    showToast(`Moved ${member}`, 'info')
  }

  // Rename team
  const handleSaveTeamName = (teamIndex: number) => {
    if (!editNameText.trim()) {
      setEditingTeamIndex(null)
      return
    }
    setCustomTeamNames(prev => ({ ...prev, [teamIndex]: editNameText.trim() }))
    setTeams(prev =>
      prev.map((t, idx) => (idx === teamIndex ? { ...t, name: editNameText.trim() } : t))
    )
    setEditingTeamIndex(null)
    setEditNameText('')
  }

  // Copy teams formatted text
  const handleCopyTeamsText = async () => {
    if (teams.length === 0) return
    let text = `👥 Random Team Assignments (${participants.length} Participants)\n\n`
    teams.forEach(team => {
      text += `🏆 ${team.name} (${team.members.length} members):\n`
      team.members.forEach((m, i) => {
        text += `  ${i + 1}. ${m}\n`
      })
      text += '\n'
    })
    text += `Generated with IndiaTools Lucky Draw: https://indiatools-rho.vercel.app${canonicalPath}`

    try {
      await navigator.clipboard.writeText(text)
      showToast('Teams copied to clipboard!', 'success')
    } catch {
      showToast('Could not copy to clipboard', 'info')
    }
  }

  // Export Teams as PNG Card
  const handleExportTeamsPng = () => {
    if (teams.length === 0) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 900
    const rowHeight = 40
    const maxMembers = Math.max(...teams.map(t => t.members.length), 1)
    const cardHeight = Math.max(300, maxMembers * rowHeight + 160)
    const cols = Math.min(3, teams.length)
    const rows = Math.ceil(teams.length / cols)
    const height = 180 + rows * (cardHeight + 24)

    const dpr = 2
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Background
    ctx.fillStyle = '#090D14'
    ctx.fillRect(0, 0, width, height)

    // Header
    ctx.fillStyle = '#8B5CF6'
    ctx.font = 'bold 12px system-ui, sans-serif'
    ctx.fillText('INDIATOOLS • RANDOM TEAM SPLITTER', 40, 50)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '900 24px system-ui, sans-serif'
    ctx.fillText('Official Team Roster', 40, 84)

    ctx.fillStyle = '#94A3B8'
    ctx.font = '500 13px system-ui, sans-serif'
    ctx.fillText(
      `${participants.length} Total Participants • ${teams.length} Balanced Teams • ${new Date().toLocaleDateString('en-IN')}`,
      40,
      108
    )

    // Draw Team Columns
    const gap = 20
    const colWidth = (width - 80 - (cols - 1) * gap) / cols

    teams.forEach((team, idx) => {
      const c = idx % cols
      const r = Math.floor(idx / cols)
      const x = 40 + c * (colWidth + gap)
      const y = 140 + r * (cardHeight + 24)

      // Card Background
      ctx.fillStyle = '#0F172A'
      ctx.fillRect(x, y, colWidth, cardHeight)
      ctx.strokeStyle = team.color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, colWidth, cardHeight)

      // Card Header
      ctx.fillStyle = team.color
      ctx.font = 'bold 16px system-ui, sans-serif'
      ctx.fillText(team.name, x + 16, y + 36)

      ctx.fillStyle = '#94A3B8'
      ctx.font = '500 11px system-ui, sans-serif'
      ctx.fillText(`${team.members.length} Members`, x + 16, y + 54)

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.moveTo(x + 16, y + 66)
      ctx.lineTo(x + colWidth - 16, y + 66)
      ctx.stroke()

      // Members list
      team.members.forEach((member, mIdx) => {
        const my = y + 96 + mIdx * 28
        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 12px system-ui, sans-serif'
        ctx.fillText(`${mIdx + 1}.`, x + 18, my)

        ctx.fillStyle = '#F8FAFC'
        ctx.font = '500 12px system-ui, sans-serif'
        ctx.fillText(member, x + 40, my)
      })
    })

    // Footer
    ctx.fillStyle = '#64748B'
    ctx.font = '500 11px system-ui, sans-serif'
    ctx.fillText('100% In-Browser Cryptographic Round-Robin Shuffle • indiatools-rho.vercel.app', 40, height - 30)

    const link = document.createElement('a')
    link.download = `teams-roster-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('Team roster PNG downloaded!', 'success')
  }

  // Print teams
  const handlePrint = () => {
    window.print()
  }

  // Language switch
  const handleLanguageChange = (targetLocale: LuckyLangCode) => {
    const targetPath =
      targetLocale === 'en'
        ? '/tools/lucky-draw-team-splitter'
        : `/${targetLocale}/tools/lucky-draw-team-splitter`
    navigate(targetPath)
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="max-w-6xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Header: Language Switcher & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              {t.localeName} ({LUCKY_LOCALES[activeLocale]?.nativeName})
            </span>
            <span className="text-xs text-slate-500">• 23 Indian Languages</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={activeLocale}
              onChange={(e) => handleLanguageChange(e.target.value as LuckyLangCode)}
              aria-label="Select language"
              className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {ALL_LUCKY_LANG_CODES.map((code) => (
                <option key={code} value={code}>
                  {LUCKY_LOCALES[code].nativeName} ({LUCKY_LOCALES[code].name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8 print:hidden">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {t.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-8 max-w-md print:hidden">
          <button
            onClick={() => setActiveMode('wheel')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition ${
              activeMode === 'wheel'
                ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-950/40'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4 text-purple-400" />
            <span>{t.modes.wheel}</span>
          </button>

          <button
            onClick={() => setActiveMode('teams')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition ${
              activeMode === 'teams'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{t.modes.teams}</span>
          </button>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Participant Manager (5 cols on lg) */}
          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 print:hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{t.participantLabels.title}</span>
              </h2>
              <span className="text-xs font-semibold bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                {participants.length} {t.participantLabels.totalCount}
              </span>
            </div>

            {/* Quick Presets Pills */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">
                {t.participantLabels.sampleData}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(SAMPLE_PRESETS).map(([k, s]) => (
                  <button
                    key={k}
                    onClick={() => handleLoadSample(k)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Add single name input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={singleNameInput}
                onChange={(e) => setSingleNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSingleName()}
                placeholder={t.participantLabels.addPlaceholder}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleAddSingleName}
                disabled={!singleNameInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.participantLabels.addName}</span>
              </button>
            </div>

            {/* Large Textarea */}
            <div className="mb-4">
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={t.participantLabels.placeholder}
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-purple-500 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-mono leading-relaxed"
              />
            </div>

            {/* Action Bar for Participants */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-800 text-[11px]">
              <button
                onClick={handleShuffleParticipants}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <Shuffle className="w-3 h-3 text-emerald-400" />
                <span>{t.participantLabels.shuffle}</span>
              </button>
              <button
                onClick={handleDeduplicate}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <Layers className="w-3 h-3 text-blue-400" />
                <span>{t.participantLabels.removeDuplicates}</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 px-2 py-1.5 transition ml-auto"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.participantLabels.clearAll}</span>
              </button>
            </div>

            {/* Interactive Participant Chips List */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-2">
                Active Roster ({participants.length}):
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {participants.length === 0 ? (
                  <div className="text-center py-6 text-slate-600 text-xs">
                    No participants yet. Paste names or load a sample above.
                  </div>
                ) : (
                  participants.map((person, idx) => (
                    <div
                      key={`${person}_${idx}`}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 group"
                    >
                      <span className="truncate pr-2 font-medium">
                        <span className="text-slate-500 font-mono text-[10px] mr-1.5">
                          {idx + 1}.
                        </span>
                        {person}
                      </span>
                      <button
                        onClick={() => handleRemoveSingleName(person)}
                        className="text-slate-500 hover:text-rose-400 transition p-0.5"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Remember list local storage toggle */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberList}
                  onChange={(e) => setRememberList(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-[11px]">Remember roster on this device</span>
              </label>
              {rememberList && (
                <button
                  onClick={() => {
                    localStorage.removeItem(STORAGE_PARTICIPANTS_KEY)
                    setRememberList(false)
                    showToast('Saved list cleared', 'info')
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                >
                  Clear Storage
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Active Mode Content (7 cols on lg) */}
          <div className="lg:col-span-7">
            {/* MODE 1: LUCKY DRAW WHEEL */}
            {activeMode === 'wheel' && (
              <div className="space-y-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center">
                  {/* Game Over Banner when only 1 participant remains in elimination mode */}
                  {isGameOver && (
                    <div className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-slate-900 border-2 border-amber-500/60 text-center shadow-2xl relative overflow-hidden">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black tracking-wider uppercase mb-2 border border-amber-500/30">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.wheelLabels.gameOver || 'GAME OVER'} • ALL DRAWS COMPLETE</span>
                      </div>

                      {finalParticipant && (
                        <div className="my-2">
                          <span className="text-[11px] text-slate-300 uppercase tracking-widest font-semibold block mb-0.5">
                            {t.wheelLabels.lastRemaining || 'Final Remaining Participant'}
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-md">
                            🎉 {finalParticipant}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 max-w-md mx-auto my-3 leading-relaxed">
                        {activeLocale === 'ml'
                          ? 'എല്ലാ നറുക്കെടുപ്പുകളും കഴിഞ്ഞു! വീലിൽ അവസാനമായി 1 വ്യക്തി മാത്രമാണ് അവശേഷിക്കുന്നത്. പുതിയ കളി ആരംഭിക്കാൻ ലിസ്റ്റ് പുനഃസ്ഥാപിക്കുക.'
                          : 'All lucky draw rounds have concluded! Only 1 participant remains on the wheel. Spin is disabled. Reset the roster to start a new game.'}
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                        <button
                          onClick={handleResetRoster}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-purple-950/60 transition hover:scale-105 active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t.wheelLabels.resetRoster || 'Play Again (Reset Roster)'}</span>
                        </button>

                        <button
                          onClick={handleCopyGameResults}
                          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Full Results</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wheel Pointer Arrow */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
                  </div>

                  {/* Wheel Canvas */}
                  <div className="relative my-4 flex items-center justify-center">
                    <canvas
                      ref={wheelCanvasRef}
                      className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] max-w-full drop-shadow-2xl"
                    />

                    {/* Central Spin Button Overlay */}
                    <button
                      onClick={handleSpinWheel}
                      disabled={isSpinning || participants.length === 0 || (removeWinnerOnDraw && participants.length <= 1)}
                      className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl border-4 border-slate-900 flex flex-col items-center justify-center transition-all z-10 ${
                        isGameOver
                          ? 'bg-gradient-to-tr from-amber-700 via-rose-700 to-amber-600 shadow-amber-950/80 cursor-not-allowed opacity-90'
                          : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 shadow-purple-950/80 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isGameOver ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mb-0.5 text-amber-300" />
                          <span className="text-[10px] sm:text-xs leading-tight font-black text-center text-amber-200">
                            GAME<br />OVER
                          </span>
                        </>
                      ) : isSpinning ? (
                        <>
                          <Sparkles className="w-4 h-4 mb-0.5 text-amber-300 animate-pulse" />
                          <span>SPIN...</span>
                        </>
                      ) : removeWinnerOnDraw && participants.length === 1 && winnerHistory.length === 0 ? (
                        <>
                          <Users className="w-4 h-4 mb-0.5 text-amber-300" />
                          <span className="text-[10px] font-bold">NEED 2+</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mb-0.5 text-amber-300 animate-pulse" />
                          <span>SPIN</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Large participants hint */}
                  {participants.length > 40 && (
                    <p className="text-[11px] text-slate-500 text-center max-w-sm mb-4">
                      {t.wheelLabels.tooManyWarning}
                    </p>
                  )}

                  {/* Settings Bar under wheel */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
                    {/* Spin Duration */}
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                        {t.wheelLabels.spinDuration}
                      </span>
                      <select
                        value={spinDurationSeconds}
                        onChange={(e) => setSpinDurationSeconds(Number(e.target.value))}
                        disabled={isSpinning}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value={3}>3 {t.wheelLabels.seconds} (Quick)</option>
                        <option value={5}>5 {t.wheelLabels.seconds} (Standard)</option>
                        <option value={8}>8 {t.wheelLabels.seconds} (Suspense)</option>
                        <option value={10}>10 {t.wheelLabels.seconds} (Dramatic)</option>
                      </select>
                    </div>

                    {/* Sound Toggle */}
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                        {t.wheelLabels.soundToggle}
                      </span>
                      <button
                        onClick={() => setSoundEnabled(prev => !prev)}
                        className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg border text-xs font-semibold transition ${
                          soundEnabled
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{soundEnabled ? t.wheelLabels.soundOn : t.wheelLabels.soundOff}</span>
                      </button>
                    </div>

                    {/* Remove Winner Checkbox */}
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                        <input
                          type="checkbox"
                          checked={removeWinnerOnDraw}
                          onChange={(e) => setRemoveWinnerOnDraw(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                        />
                        <span>{t.wheelLabels.removeWinner}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Winner History Drawer / Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.wheelLabels.winnerHistory}</span>
                      {winnerHistory.length > 0 && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {winnerHistory.length}
                        </span>
                      )}
                    </h3>

                    {winnerHistory.length > 0 && (
                      <button
                        onClick={() => setWinnerHistory([])}
                        className="text-[11px] text-slate-500 hover:text-rose-400 transition"
                      >
                        {t.wheelLabels.clearHistory}
                      </button>
                    )}
                  </div>

                  {winnerHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">
                      {t.wheelLabels.noWinnersYet}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {winnerHistory.map((w, idx) => (
                        <div
                          key={w.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs"
                        >
                          <span className="text-amber-400 font-bold">#{w.spinNumber}</span>
                          <span className="text-white font-semibold">{w.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {w.timeFormatted}
                          </span>
                        </div>
                      ))}

                      {/* Final Remaining Participant Tag in History */}
                      {isGameOver && finalParticipant && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-slate-950 border border-amber-400/50 text-xs shadow-md">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-300 font-bold">
                            {t.wheelLabels.lastRemaining || 'Remaining'}:
                          </span>
                          <span className="text-white font-black">{finalParticipant}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODE 2: RANDOM TEAM SPLITTER */}
            {activeMode === 'teams' && (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 print:hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{t.teamLabels.splitBy}</span>
                    </h2>

                    {/* Mode Toggle: By Teams vs By Size */}
                    <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                      <button
                        onClick={() => setSplitMode('by_teams')}
                        className={`px-3 py-1.5 rounded-lg transition font-medium ${
                          splitMode === 'by_teams'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.teamLabels.byTeams}
                      </button>
                      <button
                        onClick={() => setSplitMode('by_size')}
                        className={`px-3 py-1.5 rounded-lg transition font-medium ${
                          splitMode === 'by_size'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.teamLabels.bySize}
                      </button>
                    </div>
                  </div>

                  {/* Stepper Input & Generate Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {splitMode === 'by_teams'
                          ? t.teamLabels.numTeamsLabel
                          : t.teamLabels.teamSizeLabel}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSplitValue(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-slate-700"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={Math.max(1, participants.length)}
                          value={splitValue}
                          onChange={(e) => setSplitValue(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center bg-slate-950 border border-slate-700 rounded-xl py-2 text-base font-bold text-white focus:outline-none"
                        />
                        <button
                          onClick={() => setSplitValue(prev => Math.min(participants.length || 100, prev + 1))}
                          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleGenerateTeams}
                        disabled={participants.length < 2}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition"
                      >
                        <Shuffle className="w-4 h-4" />
                        <span>{teams.length > 0 ? t.teamLabels.reshuffle : t.teamLabels.splitButton}</span>
                      </button>
                    </div>
                  </div>

                  {/* Balance / Distribution Math Explanation Banner */}
                  {participants.length >= 2 && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {splitIntoTeams(participants, splitMode, splitValue).explanation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Teams Display Grid */}
                {teams.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center text-slate-500 text-xs">
                    {t.teamLabels.noParticipants}
                  </div>
                ) : (
                  <div>
                    {/* Team Export Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden">
                      <span className="text-xs font-bold text-white">
                        {teams.length} Teams Generated ({participants.length} Members)
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyTeamsText}
                          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.teamLabels.copyTeams}</span>
                        </button>
                        <button
                          onClick={handleExportTeamsPng}
                          className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.teamLabels.exportPng}</span>
                        </button>
                        <button
                          onClick={handlePrint}
                          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t.teamLabels.printTeams}</span>
                        </button>
                      </div>
                    </div>

                    {/* Team Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams.map((team, idx) => (
                        <div
                          key={team.id}
                          className="bg-slate-900/80 border rounded-2xl p-4 transition shadow-lg"
                          style={{ borderColor: team.color }}
                        >
                          {/* Team Card Header */}
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                            {editingTeamIndex === idx ? (
                              <div className="flex items-center gap-1.5 flex-1 mr-2">
                                <input
                                  type="text"
                                  value={editNameText}
                                  onChange={(e) => setEditNameText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTeamName(idx)}
                                  className="w-full bg-slate-950 border border-purple-500 rounded-lg px-2 py-1 text-xs text-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveTeamName(idx)}
                                  className="p-1 text-emerald-400 hover:text-emerald-300"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingTeamIndex(idx)
                                  setEditNameText(team.name)
                                }}
                                className="group flex items-center gap-1.5 text-left text-xs font-bold text-white hover:text-purple-300 transition"
                                title={t.teamLabels.editTeamName}
                              >
                                <span className="truncate">{team.name}</span>
                                <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                              </button>
                            )}

                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${team.color}20`,
                                color: team.color,
                              }}
                            >
                              {team.members.length}
                            </span>
                          </div>

                          {/* Member List */}
                          <div className="space-y-1.5 min-h-[90px]">
                            {team.members.length === 0 ? (
                              <div className="text-center py-4 text-slate-600 text-[11px]">
                                Empty Team
                              </div>
                            ) : (
                              team.members.map((member, mIdx) => (
                                <div
                                  key={`${member}_${mIdx}`}
                                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
                                >
                                  <span className="truncate">
                                    <span className="text-slate-500 font-mono text-[10px] mr-1">
                                      {mIdx + 1}.
                                    </span>
                                    {member}
                                  </span>

                                  {/* Move to another team popup */}
                                  <div className="relative print:hidden">
                                    {movingMember?.member === member && movingMember.fromTeamId === team.id ? (
                                      <div className="absolute right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-44 text-[11px]">
                                        <div className="font-semibold text-slate-300 mb-1 px-1">
                                          {t.teamLabels.moveToTeam}:
                                        </div>
                                        {teams.map(targetTeam => (
                                          <button
                                            key={targetTeam.id}
                                            onClick={() => handleExecuteMove(targetTeam.id)}
                                            className={`w-full text-left px-2 py-1 rounded-lg text-xs truncate transition ${
                                              targetTeam.id === team.id
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'hover:bg-purple-600/20 text-slate-200 hover:text-white'
                                            }`}
                                          >
                                            {targetTeam.name}
                                          </button>
                                        ))}
                                        <button
                                          onClick={() => setMovingMember(null)}
                                          className="w-full text-center mt-1 pt-1 border-t border-slate-800 text-[10px] text-slate-400 hover:text-white"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setMovingMember({ member, fromTeamId: team.id })}
                                        className="text-slate-500 hover:text-purple-400 transition text-[10px] px-1 py-0.5 rounded bg-slate-900 hover:bg-slate-800"
                                        title="Move to another team"
                                      >
                                        Move
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal: Winner Announcement with Confetti */}
        <AnimatePresence>
          {showWinnerModal && activeWinner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <canvas
                ref={confettiCanvasRef}
                className="absolute inset-0 pointer-events-none z-10 w-full h-full"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative z-20 text-center"
              >
                <button
                  onClick={() => handleCloseWinnerModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1">
                  {t.wheelLabels.winnerLabel}
                </div>

                {/* ARIA Live Region for screen readers */}
                <h3
                  aria-live="polite"
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 break-words"
                >
                  {activeWinner}
                </h3>

                {/* Penultimate Round Notification */}
                {isPenultimateDraw && otherRemainingParticipant && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 mb-4 text-xs text-amber-200 text-left flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-bold mb-0.5">
                        {t.wheelLabels.finalRoundComplete || 'Final Round Complete!'}
                      </strong>
                      <span className="text-slate-300 text-[11px]">
                        {activeLocale === 'ml'
                          ? 'ഈ വിജയിയെ ഒഴിവാക്കിയാൽ അവസാനമായി അവശേഷിക്കുന്നത്:'
                          : 'Excluding this winner leaves the last remaining participant:'}
                      </span>
                      <span className="block text-white font-bold text-xs mt-0.5">
                        🏆 {otherRemainingParticipant}
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Drawn using browser cryptographically strong randomness.
                </p>

                <div className="space-y-2">
                  {isPenultimateDraw ? (
                    <button
                      onClick={() => handleCloseWinnerModal(true)}
                      className="w-full bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{t.wheelLabels.viewResults || 'Finish Game & View Standings'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleCloseWinnerModal(false)
                        setTimeout(handleSpinWheel, 200)
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t.wheelLabels.spinAgain}</span>
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(`🎉 Winner: ${activeWinner} (IndiaTools Lucky Draw)`)
                        showToast(t.wheelLabels.copyWinner, 'success')
                      } catch {
                        showToast('Failed to copy', 'info')
                      }
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{t.wheelLabels.copyWinner}</span>
                  </button>

                  {removeWinnerOnDraw && !isPenultimateDraw && (
                    <button
                      onClick={() => handleCloseWinnerModal(true)}
                      className="w-full text-rose-400 hover:text-rose-300 text-xs py-2 transition"
                    >
                      Remove Winner & Close
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Informational SEO Content & FAQs */}
        <div className="mt-12 space-y-8 border-t border-slate-800 pt-8 print:hidden">
          {/* How It Works Explainer */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              How the Lucky Draw Wheel & Team Splitter Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Whether you are organizing a classroom contest, picking giveaway winners, forming balanced sports teams, or planning hackathon squads, this tool delivers transparent, mathematically fair randomization right in your browser.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-purple-400 font-semibold mb-1">
                  1. Cryptographic Randomness
                </strong>
                Winners and team shuffling utilize the browser&apos;s native <code>crypto.getRandomValues</code> API, delivering uniform entropy without seed bias.
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-emerald-400 font-semibold mb-1">
                  2. Balanced Group Division
                </strong>
                Our round-robin algorithm ensures team counts never differ by more than one person, preventing severely unbalanced matches.
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-cyan-400 font-semibold mb-1">
                  3. 100% Client-Side Privacy
                </strong>
                Zero participant names, emails, or results leave your device. All physics, audio, and PNG generation happen locally in browser RAM.
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {t.faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-800/80 pb-3 last:border-b-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Disclaimer Notice */}
          <div className="text-center text-[11px] text-slate-500 py-4 space-y-1">
            <p>{t.privacyNotice}</p>
            <p>{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

export default LuckyDrawTeamSplitterTool
