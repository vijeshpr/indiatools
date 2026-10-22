/**
 * IndiaTools — Hybrid Video Studio Music Intelligence Engine
 * 100% Client-Side Web Audio API Signal Processing & Structure Analysis
 *
 * Estimates:
 * - BPM / Tempo and beat onsets with confidence rating
 * - Energy and Loudness Envelope
 * - Discrete Musical Event Map (Downbeats, Beats, Phrase Boundaries, Accents)
 * - Structural regions (Intro, Calm, Melody, Build-up, Climax, Outro)
 * - Melody Profile vs Rhythm Dominance
 * - Vocal / Mid-Band Melody Activity Estimation
 * - Suggested Cut Points with diagnostic reasoning
 */

export type MelodyProfileType =
  | 'soft-melody'
  | 'vocal-like'
  | 'sustained-instrumental'
  | 'piano-strings'
  | 'beat-driven'
  | 'bass-heavy'
  | 'high-energy-mixed'
  | 'uncertain'

export type EmotionalMood =
  | 'calm'
  | 'gentle'
  | 'romantic'
  | 'dramatic'
  | 'energetic'
  | 'intense'

export interface MusicEvent {
  id: string
  timeSec: number
  type:
    | 'downbeat'
    | 'beat'
    | 'onset'
    | 'phrase_boundary'
    | 'section_change'
    | 'climax_onset'
    | 'vocal_onset'
  confidence: number // 0 to 1
  energy: number // 0 to 1
  description: string
}

export interface MusicSection {
  id: string
  name: string
  startSec: number
  endSec: number
  type: 'intro' | 'melody' | 'buildup' | 'climax' | 'outro' | 'energetic' | 'calm'
  energyLevel: number // 0 to 1
  isMelodyDominant: boolean
  melodyProfile: MelodyProfileType
}

export interface MusicAnalysisResult {
  assetId: string
  assetName: string
  durationSec: number
  bpm: number
  bpmConfidence: number // 0 to 1
  beats: number[] // timestamps of detected beats in seconds
  onsets: number[] // all transient timestamps
  downbeats: number[] // primary musical bar downbeats
  phraseBoundaries: number[] // timestamps of structural phrase transitions
  events: MusicEvent[] // comprehensive discrete musical events
  energyEnvelope: number[] // normalized 0-1 for visualization (20 samples per second)
  bassEnvelope?: number[] // low-pass filtered sub-bass RMS envelope (20 samples per second)
  sections: MusicSection[]
  dominantMood: EmotionalMood
  overallMelodyScore: number // 0 (pure rhythm/bass) to 1 (pure melody)
  vocalActivityConfidence: number // 0 to 1 estimated confidence of vocal/melodic presence
  climaxStartSec: number
  climaxEndSec: number
  suggestedCutPoints: number[]
}

export async function analyzeAudioBuffer(
  audioBuffer: AudioBuffer,
  assetId: string,
  assetName: string,
  sensitivity = 1.0
): Promise<MusicAnalysisResult> {
  const sampleRate = audioBuffer.sampleRate
  const durationSec = audioBuffer.duration
  const channelData = audioBuffer.getChannelData(0)

  // 1. Compute frame-by-frame RMS energy and spectral sub-band approximations
  const frameRate = 20 // 20 frames per second (50ms per frame)
  const frameSize = Math.floor(sampleRate / frameRate)
  const totalFrames = Math.floor(channelData.length / frameSize)

  const energyEnvelope: number[] = new Array(totalFrames)
  const bassEnvelope: number[] = new Array(totalFrames)
  const midHighEnvelope: number[] = new Array(totalFrames)
  const spectralFlux: number[] = new Array(totalFrames).fill(0)

  let maxEnergy = 0.0001
  let maxBass = 0.0001
  let maxMid = 0.0001

  // Simple IIR low-pass and mid-pass filters for sub-band energy
  let lowPrev = 0
  let highPrev = 0
  const lowAlpha = 0.15 // approximates ~250 Hz cut at 44.1kHz
  const highAlpha = 0.75 // separates mid band ~300Hz-3.4kHz

  for (let f = 0; f < totalFrames; f++) {
    const offset = f * frameSize
    let sumSq = 0
    let bassSumSq = 0
    let midSumSq = 0

    for (let i = 0; i < frameSize; i++) {
      const sample = channelData[offset + i]
      sumSq += sample * sample

      // Low band (bass/kick)
      lowPrev += lowAlpha * (sample - lowPrev)
      bassSumSq += lowPrev * lowPrev

      // Mid-high band
      highPrev += highAlpha * (sample - highPrev)
      const midSample = highPrev - lowPrev
      midSumSq += midSample * midSample
    }

    const rms = Math.sqrt(sumSq / frameSize)
    const bassRms = Math.sqrt(bassSumSq / frameSize)
    const midRms = Math.sqrt(midSumSq / frameSize)

    energyEnvelope[f] = rms
    bassEnvelope[f] = bassRms
    midHighEnvelope[f] = midRms

    if (rms > maxEnergy) maxEnergy = rms
    if (bassRms > maxBass) maxBass = bassRms
    if (midRms > maxMid) maxMid = midRms

    if (f > 0) {
      spectralFlux[f] = Math.max(0, rms - energyEnvelope[f - 1])
    }
  }

  // Normalize envelopes to 0.0 - 1.0
  for (let f = 0; f < totalFrames; f++) {
    energyEnvelope[f] = Math.min(1, energyEnvelope[f] / maxEnergy)
    bassEnvelope[f] = Math.min(1, bassEnvelope[f] / maxBass)
    midHighEnvelope[f] = Math.min(1, midHighEnvelope[f] / maxMid)
  }

  // 2. Onset & Beat Detection with adaptive thresholding
  const onsets: number[] = []
  const beats: number[] = []
  const windowHalf = 6 // ~300ms window for local threshold
  const debounceFrames = Math.max(3, Math.floor(0.22 * frameRate)) // ~220ms debounce
  let lastBeatFrame = -debounceFrames

  const thresholdMultiplier = 1.25 / Math.max(0.5, Math.min(2.0, sensitivity))

  for (let f = windowHalf; f < totalFrames - windowHalf; f++) {
    let localSum = 0
    for (let w = -windowHalf; w <= windowHalf; w++) {
      localSum += spectralFlux[f + w]
    }
    const localMean = localSum / (windowHalf * 2 + 1)
    const threshold = localMean * thresholdMultiplier + 0.02

    const isPeak =
      spectralFlux[f] > threshold &&
      spectralFlux[f] > spectralFlux[f - 1] &&
      spectralFlux[f] >= spectralFlux[f + 1]

    if (isPeak) {
      const timeSec = Number((f / frameRate).toFixed(3))
      onsets.push(timeSec)

      // Candidate beat: prominent bass/kick energy or high energy pulse and debounced
      if (
        f - lastBeatFrame >= debounceFrames &&
        (bassEnvelope[f] > 0.25 || energyEnvelope[f] > 0.4)
      ) {
        beats.push(timeSec)
        lastBeatFrame = f
      }
    }
  }

  // 3. Tempo / BPM Estimation via autocorrelation of beat intervals
  const { bpm, confidence: bpmConfidence } = estimateBpmFromBeats(beats, durationSec)

  // 4. Extract Primary Downbeats (Beat 1 of musical measures in 4/4 time)
  const downbeats = extractDownbeats(beats, energyEnvelope, bassEnvelope, bpm, frameRate)

  // 5. Structure Segmentation (Intro, Calm, Melody, Build-up, Climax, Outro)
  const { sections, climaxStartSec, climaxEndSec, overallMelodyScore, dominantMood } =
    segmentMusicalStructure(energyEnvelope, bassEnvelope, midHighEnvelope, frameRate, durationSec)

  // 6. Detect Musical Phrase Boundaries (transitions between 4/8-bar phrases or section shifts)
  const phraseBoundaries = detectPhraseBoundaries(
    sections,
    energyEnvelope,
    midHighEnvelope,
    frameRate,
    durationSec,
    bpm
  )

  // 7. Estimate Vocal / Mid-Band Melody Activity Confidence
  const vocalActivityConfidence = estimateVocalActivityConfidence(midHighEnvelope, energyEnvelope)

  // 8. Compile Comprehensive Discrete Musical Events Map
  const events = buildMusicalEventMap(
    downbeats,
    beats,
    phraseBoundaries,
    sections,
    climaxStartSec,
    climaxEndSec,
    bpmConfidence
  )

  // 9. Generate suggested cut points aligned to actual musical events
  const suggestedCutPoints = generateSuggestedCutPoints(sections, downbeats, beats, phraseBoundaries)

  return {
    assetId,
    assetName,
    durationSec,
    bpm,
    bpmConfidence,
    beats,
    onsets,
    downbeats,
    phraseBoundaries,
    events,
    energyEnvelope,
    bassEnvelope,
    sections,
    dominantMood,
    overallMelodyScore,
    vocalActivityConfidence,
    climaxStartSec,
    climaxEndSec,
    suggestedCutPoints,
  }
}

function estimateBpmFromBeats(
  beats: number[],
  _durationSec: number
): { bpm: number; confidence: number } {
  if (beats.length < 4) {
    return { bpm: 120, confidence: 0.3 }
  }

  const intervals: number[] = []
  for (let i = 1; i < beats.length; i++) {
    const diff = beats[i] - beats[i - 1]
    if (diff >= 0.28 && diff <= 1.2) {
      intervals.push(diff)
    }
  }

  if (intervals.length === 0) {
    return { bpm: 120, confidence: 0.3 }
  }

  // Sort intervals and find median
  intervals.sort((a, b) => a - b)
  const medianInterval = intervals[Math.floor(intervals.length / 2)]
  let rawBpm = Math.round(60 / medianInterval)

  // Normalize BPM to standard 70 - 165 range
  while (rawBpm < 70) rawBpm *= 2
  while (rawBpm > 165) rawBpm = Math.round(rawBpm / 2)

  // Calculate consistency of intervals around median
  let inliers = 0
  for (const interval of intervals) {
    if (Math.abs(interval - medianInterval) < 0.08) inliers++
  }
  const confidence = Math.min(0.95, Math.max(0.4, inliers / intervals.length))

  return { bpm: rawBpm, confidence: Number(confidence.toFixed(2)) }
}

function extractDownbeats(
  beats: number[],
  energy: number[],
  bass: number[],
  bpm: number,
  frameRate: number
): number[] {
  if (beats.length === 0) return []

  const beatSec = 60 / Math.max(60, bpm)
  const barSec = beatSec * 4 // standard 4/4 measure duration

  const downbeats: number[] = []
  let nextExpectedTime = beats[0]

  for (const b of beats) {
    if (b >= nextExpectedTime - 0.15) {
      const f = Math.min(energy.length - 1, Math.max(0, Math.floor(b * frameRate)))
      const score = (bass[f] || 0) * 0.6 + (energy[f] || 0) * 0.4

      if (score > 0.25 || downbeats.length === 0) {
        downbeats.push(b)
        nextExpectedTime = b + barSec
      }
    }
  }

  return downbeats
}

function detectPhraseBoundaries(
  sections: MusicSection[],
  energy: number[],
  midHigh: number[],
  frameRate: number,
  durationSec: number,
  bpm: number
): number[] {
  const boundariesSet = new Set<number>()

  // 1. Add all section boundaries
  for (const sec of sections) {
    if (sec.startSec > 0.5 && sec.startSec < durationSec - 1.0) {
      boundariesSet.add(Number(sec.startSec.toFixed(2)))
    }
  }

  // 2. Identify 8-bar musical phrase shifts
  const beatSec = 60 / Math.max(60, bpm)
  const phraseSec = beatSec * 8 // 8-bar phrase interval (typically 3.5s - 6s)

  let cursor = phraseSec
  while (cursor < durationSec - 1.5) {
    const f = Math.min(energy.length - 1, Math.floor(cursor * frameRate))
    // If there is significant energy or a local drop/rise, anchor phrase boundary
    const isDipOrPeak =
      f > 1 && f < energy.length - 2 && (energy[f] < energy[f - 1] || midHigh[f] > 0.5)

    if (isDipOrPeak) {
      boundariesSet.add(Number(cursor.toFixed(2)))
    }
    cursor += phraseSec
  }

  return Array.from(boundariesSet).sort((a, b) => a - b)
}

function estimateVocalActivityConfidence(midHigh: number[], energy: number[]): number {
  if (midHigh.length === 0) return 0.5

  let vocalFrames = 0
  let stableFrames = 0

  for (let f = 1; f < midHigh.length; f++) {
    const midRatio = midHigh[f] / Math.max(0.01, energy[f])
    if (midRatio > 0.45 && midHigh[f] > 0.2) {
      vocalFrames++
      if (Math.abs(midHigh[f] - midHigh[f - 1]) < 0.15) {
        stableFrames++
      }
    }
  }

  const ratio = vocalFrames / midHigh.length
  const stability = vocalFrames > 0 ? stableFrames / vocalFrames : 0.5
  const confidence = Math.min(0.92, Math.max(0.3, ratio * 0.6 + stability * 0.4))

  return Number(confidence.toFixed(2))
}

function buildMusicalEventMap(
  downbeats: number[],
  beats: number[],
  phraseBoundaries: number[],
  sections: MusicSection[],
  climaxStartSec: number,
  climaxEndSec: number,
  bpmConfidence: number
): MusicEvent[] {
  const events: MusicEvent[] = []

  // Add Climax Entry Event
  if (climaxStartSec > 0) {
    events.push({
      id: `evt-climax-${climaxStartSec.toFixed(2)}`,
      timeSec: Number(climaxStartSec.toFixed(3)),
      type: 'climax_onset',
      confidence: 0.95,
      energy: 0.98,
      description: 'Peak Climax Acceleration Entry',
    })
  }

  // Add Section Changes
  for (const sec of sections) {
    events.push({
      id: `evt-sec-${sec.id}`,
      timeSec: Number(sec.startSec.toFixed(3)),
      type: 'section_change',
      confidence: 0.9,
      energy: sec.energyLevel,
      description: `Transition into ${sec.name} (${sec.type})`,
    })
  }

  // Add Phrase Boundaries
  for (let i = 0; i < phraseBoundaries.length; i++) {
    const t = phraseBoundaries[i]
    events.push({
      id: `evt-phrase-${i}-${t.toFixed(2)}`,
      timeSec: Number(t.toFixed(3)),
      type: 'phrase_boundary',
      confidence: 0.85,
      energy: 0.6,
      description: `Musical Phrase Boundary ~${t.toFixed(1)}s`,
    })
  }

  // Add Primary Downbeats
  for (let i = 0; i < downbeats.length; i++) {
    const t = downbeats[i]
    events.push({
      id: `evt-downbeat-${i}-${t.toFixed(2)}`,
      timeSec: Number(t.toFixed(3)),
      type: 'downbeat',
      confidence: bpmConfidence,
      energy: 0.8,
      description: `Bar Downbeat (Measure ${i + 1})`,
    })
  }

  // Add Selected Strong Beats
  for (let i = 0; i < beats.length; i++) {
    const t = beats[i]
    const isAlreadyDownbeat = downbeats.some((db) => Math.abs(db - t) < 0.05)
    if (!isAlreadyDownbeat) {
      events.push({
        id: `evt-beat-${i}-${t.toFixed(2)}`,
        timeSec: Number(t.toFixed(3)),
        type: 'beat',
        confidence: bpmConfidence * 0.9,
        energy: 0.65,
        description: `Rhythmic Beat Pulse ~${t.toFixed(2)}s`,
      })
    }
  }

  // Sort events chronologically
  return events.sort((a, b) => a.timeSec - b.timeSec)
}

function segmentMusicalStructure(
  energy: number[],
  bass: number[],
  midHigh: number[],
  frameRate: number,
  durationSec: number
): {
  sections: MusicSection[]
  climaxStartSec: number
  climaxEndSec: number
  overallMelodyScore: number
  dominantMood: EmotionalMood
} {
  const windowSec = 4.0 // 4-second chunking
  const framesPerChunk = Math.floor(windowSec * frameRate)
  const chunkCount = Math.max(1, Math.floor(energy.length / framesPerChunk))

  const chunkEnergies: number[] = []
  const chunkBass: number[] = []
  const chunkMid: number[] = []

  for (let c = 0; c < chunkCount; c++) {
    let sumE = 0
    let sumB = 0
    let sumM = 0
    const startF = c * framesPerChunk
    const endF = Math.min(energy.length, startF + framesPerChunk)
    const len = endF - startF

    for (let f = startF; f < endF; f++) {
      sumE += energy[f]
      sumB += bass[f]
      sumM += midHigh[f]
    }

    chunkEnergies.push(sumE / len)
    chunkBass.push(sumB / len)
    chunkMid.push(sumM / len)
  }

  // Find peak energy chunk (climax candidate)
  let peakChunk = 0
  let maxChunkE = 0
  for (let c = 0; c < chunkCount; c++) {
    if (chunkEnergies[c] > maxChunkE) {
      maxChunkE = chunkEnergies[c]
      peakChunk = c
    }
  }

  // Climax window spans around peak chunk (at least 6-10s duration)
  const climaxStartChunk = Math.max(0, peakChunk - 1)
  const climaxEndChunk = Math.min(chunkCount - 1, peakChunk + 1)
  const climaxStartSec = Number((climaxStartChunk * windowSec).toFixed(2))
  const climaxEndSec = Number(Math.min(durationSec, (climaxEndChunk + 1) * windowSec).toFixed(2))

  // Compute overall melody vs rhythm ratio
  const avgBass = chunkBass.reduce((a, b) => a + b, 0) / chunkCount
  const avgMid = chunkMid.reduce((a, b) => a + b, 0) / chunkCount
  const overallMelodyScore = Number(Math.min(1, Math.max(0, avgMid / (avgMid + avgBass + 0.001))).toFixed(2))

  // Emotional mood
  let dominantMood: EmotionalMood = 'energetic'
  if (overallMelodyScore > 0.65 && maxChunkE < 0.6) dominantMood = 'calm'
  else if (overallMelodyScore > 0.6) dominantMood = 'romantic'
  else if (maxChunkE > 0.85 && avgBass > 0.4) dominantMood = 'intense'
  else if (maxChunkE > 0.75) dominantMood = 'dramatic'
  else if (overallMelodyScore > 0.5) dominantMood = 'gentle'

  // Construct standard narrative sections
  const sections: MusicSection[] = []

  // Section 1: Intro / Exposition
  const introEndSec = Math.min(6.0, durationSec * 0.2)
  sections.push({
    id: 'sec-intro',
    name: 'Intro / Exposition',
    startSec: 0,
    endSec: Number(introEndSec.toFixed(2)),
    type: 'intro',
    energyLevel: Number((chunkEnergies[0] || 0.3).toFixed(2)),
    isMelodyDominant: overallMelodyScore > 0.45,
    melodyProfile: overallMelodyScore > 0.55 ? 'soft-melody' : 'uncertain',
  })

  // Section 2: Main Melody / Verse
  const melodyEndSec = climaxStartSec > introEndSec ? climaxStartSec : durationSec * 0.7
  sections.push({
    id: 'sec-melody',
    name: 'Soulful Melody / Verse',
    startSec: Number(introEndSec.toFixed(2)),
    endSec: Number(melodyEndSec.toFixed(2)),
    type: 'melody',
    energyLevel: Number(((chunkEnergies[1] || 0.5) * 0.9).toFixed(2)),
    isMelodyDominant: true,
    melodyProfile: overallMelodyScore > 0.6 ? 'vocal-like' : 'piano-strings',
  })

  // Section 3: Climax Section
  sections.push({
    id: 'sec-climax',
    name: 'Climax / Peak Energy',
    startSec: Number(climaxStartSec.toFixed(2)),
    endSec: Number(climaxEndSec.toFixed(2)),
    type: 'climax',
    energyLevel: Number(maxChunkE.toFixed(2)),
    isMelodyDominant: false,
    melodyProfile: avgBass > 0.45 ? 'beat-driven' : 'high-energy-mixed',
  })

  // Section 4: Outro / Resolution
  if (climaxEndSec < durationSec - 1.0) {
    sections.push({
      id: 'sec-outro',
      name: 'Outro / Resolution',
      startSec: Number(climaxEndSec.toFixed(2)),
      endSec: Number(durationSec.toFixed(2)),
      type: 'outro',
      energyLevel: Number((chunkEnergies[chunkCount - 1] || 0.25).toFixed(2)),
      isMelodyDominant: true,
      melodyProfile: 'soft-melody',
    })
  }

  return {
    sections,
    climaxStartSec,
    climaxEndSec,
    overallMelodyScore,
    dominantMood,
  }
}

function generateSuggestedCutPoints(
  sections: MusicSection[],
  downbeats: number[],
  beats: number[],
  phraseBoundaries: number[]
): number[] {
  const cuts = new Set<number>()

  for (const s of sections) {
    if (s.startSec > 0) cuts.add(s.startSec)
  }

  for (const p of phraseBoundaries) {
    cuts.add(p)
  }

  for (const db of downbeats) {
    cuts.add(db)
  }

  // Fill in any long gaps > 5.0s with beats
  const sorted = Array.from(cuts).sort((a, b) => a - b)
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] > 5.0) {
      const mid = (sorted[i] + sorted[i + 1]) / 2
      const candidateBeat = beats.find((b) => Math.abs(b - mid) < 1.0)
      if (candidateBeat) cuts.add(candidateBeat)
    }
  }

  return Array.from(cuts).sort((a, b) => a - b)
}
