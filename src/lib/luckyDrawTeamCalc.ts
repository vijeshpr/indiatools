/**
 * Lucky Draw Wheel & Random Team Splitter - Pure Core Logic
 * 100% deterministic, unbiased, client-side algorithms using browser crypto API.
 */

export interface TeamGroup {
  id: string
  name: string
  color: string
  members: string[]
}

export interface TeamSplitResult {
  totalParticipants: number
  numTeams: number
  teams: TeamGroup[]
  remainder: number
  explanation: string
  evenDistribution: boolean
}

export interface WheelWinnerResult {
  winnerIndex: number
  winnerName: string
  targetAngleDegrees: number
  segmentArcDegrees: number
  pointerAngleDegrees: number
  timestamp: number
}

export interface WinnerHistoryItem {
  id: string
  name: string
  timestamp: number
  timeFormatted: string
  spinNumber: number
}

export const TEAM_COLORS = [
  { name: 'Violet', bg: 'bg-purple-600/20', border: 'border-purple-500', text: 'text-purple-300', hex: '#8B5CF6' },
  { name: 'Emerald', bg: 'bg-emerald-600/20', border: 'border-emerald-500', text: 'text-emerald-300', hex: '#10B981' },
  { name: 'Amber', bg: 'bg-amber-600/20', border: 'border-amber-500', text: 'text-amber-300', hex: '#F59E0B' },
  { name: 'Cyan', bg: 'bg-cyan-600/20', border: 'border-cyan-500', text: 'text-cyan-300', hex: '#06B6D4' },
  { name: 'Rose', bg: 'bg-rose-600/20', border: 'border-rose-500', text: 'text-rose-300', hex: '#F43F5E' },
  { name: 'Blue', bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-300', hex: '#3B82F6' },
  { name: 'Orange', bg: 'bg-orange-600/20', border: 'border-orange-500', text: 'text-orange-300', hex: '#F97316' },
  { name: 'Indigo', bg: 'bg-indigo-600/20', border: 'border-indigo-500', text: 'text-indigo-300', hex: '#6366F1' },
  { name: 'Teal', bg: 'bg-teal-600/20', border: 'border-teal-500', text: 'text-teal-300', hex: '#14B8A6' },
  { name: 'Pink', bg: 'bg-pink-600/20', border: 'border-pink-500', text: 'text-pink-300', hex: '#EC4899' },
  { name: 'Yellow', bg: 'bg-yellow-600/20', border: 'border-yellow-500', text: 'text-yellow-300', hex: '#EAB308' },
  { name: 'Fuchsia', bg: 'bg-fuchsia-600/20', border: 'border-fuchsia-500', text: 'text-fuchsia-300', hex: '#D946EF' },
]

export const WHEEL_PALETTE = [
  '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4',
  '#F43F5E', '#3B82F6', '#F97316', '#6366F1',
  '#14B8A6', '#EC4899', '#EAB308', '#D946EF',
  '#059669', '#2563EB', '#D97706', '#7C3AED'
]

export const SAMPLE_PRESETS: Record<string, { name: string; participants: string[] }> = {
  cricket_squad: {
    name: 'IPL Cricket Squad (15 Players)',
    participants: [
      'Virat Kohli',
      'Rohit Sharma',
      'Jasprit Bumrah',
      'Ravindra Jadeja',
      'Hardik Pandya',
      'KL Rahul',
      'Shubman Gill',
      'Mohammed Siraj',
      'Suryakumar Yadav',
      'Rishabh Pant',
      'Kuldeep Yadav',
      'Axar Patel',
      'Shreyas Iyer',
      'Arshdeep Singh',
      'Yuzvendra Chahal'
    ]
  },
  office_team: {
    name: 'Tech Office Squad (12 Members)',
    participants: [
      'Aarav Sharma',
      'Ananya Iyer',
      'Rohan Kulkarni',
      'Priya Nair',
      'Vikram Reddy',
      'Sneha Patel',
      'Aditya Verma',
      'Meera Sen',
      'Arjun Gupta',
      'Divya Krishnan',
      'Kabir Joshi',
      'Pooja Choudhury'
    ]
  },
  classroom_roll: {
    name: 'Classroom Roll Call (20 Students)',
    participants: [
      '01. Aarav',
      '02. Bhavna',
      '03. Chirag',
      '04. Deepa',
      '05. Eshan',
      '06. Fatima',
      '07. Gaurav',
      '08. Harini',
      '09. Ishaan',
      '10. Jhanvi',
      '11. Karthik',
      '12. Lavanya',
      '13. Manan',
      '14. Nidhi',
      '15. Ojas',
      '16. Pallavi',
      '17. Qasim',
      '18. Riya',
      '19. Sahil',
      '20. Tanvi'
    ]
  },
  party_games: {
    name: 'Weekend Party Games (10 Friends)',
    participants: [
      'Rahul',
      'Neha',
      'Amit',
      'Shreya',
      'Varun',
      'Ritu',
      'Siddharth',
      'Kavita',
      'Kunal',
      'Tanvi'
    ]
  }
}

/**
 * Parses raw multiline text into clean, trimmed participant names.
 * Strips dangerous HTML tags and filters out empty lines.
 */
export function parseParticipants(rawText: string): string[] {
  if (!rawText || typeof rawText !== 'string') return []

  return rawText
    .split(/\r?\n/)
    .map(line => line.replace(/<[^>]*>?/gm, '').trim())
    .filter(line => line.length > 0 && line.length <= 80)
}

/**
 * Deduplicates participant names while preserving first-occurrence order.
 */
export function deduplicateParticipants(names: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const name of names) {
    const key = name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(name)
    }
  }

  return result
}

/**
 * Cryptographically random integer in [0, max - 1] using window.crypto / Web Crypto
 */
export function getRandomInt(max: number): number {
  if (max <= 1) return 0

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }

  // Fallback for non-crypto environments
  return Math.floor(Math.random() * max)
}

/**
 * Fisher-Yates shuffle using cryptographically sound randomness.
 */
export function shuffleParticipants(names: string[]): string[] {
  const arr = [...names]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

/**
 * Computes wheel geometry, picks a winner, and calculates exact stopping angle.
 * 
 * Pointer position convention:
 * The pointer is placed at the TOP of the wheel: angle = 270 degrees (or -90 deg).
 * In canvas space:
 * 0 deg is 3 o'clock (Right), 90 deg is 6 o'clock (Bottom),
 * 180 deg is 9 o'clock (Left), 270 deg is 12 o'clock (Top).
 * 
 * Each segment i spans [i * arc, (i + 1) * arc].
 * When wheel rotates clockwise by angle phi:
 * A point at original angle theta rotates to (theta + phi) mod 360.
 * For segment i center theta_i to land under pointer P (270 deg):
 * (theta_i + phi) = 270 mod 360
 * phi = (270 - theta_i) mod 360.
 */
export function calculateWheelSpin(
  participants: string[],
  currentRotationDegrees = 0,
  minFullRevolutions = 5
): WheelWinnerResult | null {
  if (!participants || participants.length === 0) return null

  const n = participants.length
  const segmentArc = 360 / n
  const pointerAngle = 270 // Top of wheel

  // Select winner randomly
  const winnerIndex = getRandomInt(n)
  const winnerName = participants[winnerIndex]

  // Center angle of winner's segment in unrotated wheel
  const segmentCenterAngle = (winnerIndex + 0.5) * segmentArc

  // Micro jitter within the segment (-30% to +30% of segment half-width)
  // Ensures it never lands directly on the divider boundary
  const jitterRange = segmentArc * 0.25
  const randomJitter = (getRandomInt(100) / 100 - 0.5) * jitterRange

  // Calculate destination modulo angle where winner segment aligns with pointer
  let targetNormalized = (pointerAngle - segmentCenterAngle + randomJitter) % 360
  if (targetNormalized < 0) targetNormalized += 360

  // Total rotation includes current angle + minFullRevolutions + difference
  const currentNormalized = ((currentRotationDegrees % 360) + 360) % 360
  let forwardDelta = targetNormalized - currentNormalized
  if (forwardDelta <= 0) forwardDelta += 360

  const totalTargetDegrees = currentRotationDegrees + (minFullRevolutions * 360) + forwardDelta

  return {
    winnerIndex,
    winnerName,
    targetAngleDegrees: totalTargetDegrees,
    segmentArcDegrees: segmentArc,
    pointerAngleDegrees: pointerAngle,
    timestamp: Date.now()
  }
}

/**
 * Reverse lookup: Given any wheel angle, verifies which participant segment
 * is positioned directly beneath the top pointer (270 deg).
 */
export function getSegmentAtAngle(
  rotationDegrees: number,
  participants: string[],
  pointerAngle = 270
): { index: number; name: string } | null {
  if (!participants || participants.length === 0) return null

  const n = participants.length
  const segmentArc = 360 / n

  const normRot = ((rotationDegrees % 360) + 360) % 360
  let relativeAngle = (pointerAngle - normRot) % 360
  if (relativeAngle < 0) relativeAngle += 360

  const index = Math.floor(relativeAngle / segmentArc) % n
  return {
    index,
    name: participants[index]
  }
}

/**
 * Splits participants into balanced teams.
 * Group sizes differ by no more than 1 participant.
 */
export function splitIntoTeams(
  participants: string[],
  mode: 'by_teams' | 'by_size',
  value: number,
  customTeamNames?: Record<number, string>
): TeamSplitResult {
  const cleanParticipants = [...participants]
  const total = cleanParticipants.length

  if (total === 0) {
    return {
      totalParticipants: 0,
      numTeams: 0,
      teams: [],
      remainder: 0,
      explanation: 'No participants available to split.',
      evenDistribution: true
    }
  }

  // Determine target number of teams
  let k = 1
  if (mode === 'by_teams') {
    k = Math.max(1, Math.min(Math.floor(value) || 2, total))
  } else {
    // by_size: value is target team size
    const targetSize = Math.max(1, Math.floor(value) || 2)
    k = Math.max(1, Math.ceil(total / targetSize))
  }

  // Shuffle order first for random fairness
  const shuffled = shuffleParticipants(cleanParticipants)

  // Initialize team structures
  const teams: TeamGroup[] = []
  for (let i = 0; i < k; i++) {
    const color = TEAM_COLORS[i % TEAM_COLORS.length]
    const customName = customTeamNames && customTeamNames[i]
    teams.push({
      id: `team_${i + 1}`,
      name: customName || `Team ${i + 1}`,
      color: color.hex,
      members: []
    })
  }

  // Distribute in round-robin fashion for balanced sizes (difference <= 1)
  shuffled.forEach((person, idx) => {
    teams[idx % k].members.push(person)
  })

  // Explain distribution
  const minSize = Math.min(...teams.map(t => t.members.length))
  const maxSize = Math.max(...teams.map(t => t.members.length))
  const isEven = minSize === maxSize
  const largerTeamsCount = teams.filter(t => t.members.length === maxSize).length
  const smallerTeamsCount = teams.length - largerTeamsCount

  let explanation = ''
  if (isEven) {
    explanation = `${total} participants divided evenly into ${k} teams of ${maxSize} members.`
  } else {
    explanation = `${total} participants divided into ${k} teams: ${largerTeamsCount} team${largerTeamsCount > 1 ? 's' : ''} of ${maxSize}, and ${smallerTeamsCount} team${smallerTeamsCount > 1 ? 's' : ''} of ${minSize}.`
  }

  return {
    totalParticipants: total,
    numTeams: k,
    teams,
    remainder: total % k,
    explanation,
    evenDistribution: isEven
  }
}
