/**
 * IndiaTools — Hybrid Video Studio Music Intelligence Engine
 * 100% Client-Side Web Audio API Signal Processing & Structure Analysis
 *
 * Estimates:
 * - BPM / Tempo and beat onsets
 * - Energy and Loudness Envelope
 * - Structural regions (Intro, Calm, Melody, Build-up, Climax, Outro)
 * - Melody Profile vs Rhythm Dominance
 * - Emotional Energy & Suggested Cut Points
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
  energyEnvelope: number[] // normalized 0-1 for visualization (20 samples per second)
  sections: MusicSection[]
  dominantMood: EmotionalMood
  overallMelodyScore: number // 0 (pure rhythm/bass) to 1 (pure melody)
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

  // 1. Compute frame-by-frame RMS energy and spectral approximations
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

  // Simple IIR low-pass and high-pass filters for sub-band energy
  let lowPrev = 0
  let highPrev = 0
  const lowAlpha = 0.15 // approximates ~250 Hz cut at 44.1kHz
  const highAlpha = 0.75

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

      // Check if candidate beat (prominent bass/kick energy and debounced)
      if (f - lastBeatFrame >= debounceFrames && (bassEnvelope[f] > 0.25 || energyEnvelope[f] > 0.4)) {
        beats.push(timeSec)
        lastBeatFrame = f
      }
    }
  }

  // 3. Tempo / BPM Estimation via autocorrelation of beat intervals
  const { bpm, confidence: bpmConfidence } = estimateBpmFromBeats(beats, durationSec)

  // 4. Structure Segmentation (Intro, Calm, Melody, Build-up, Climax, Outro)
  const { sections, climaxStartSec, climaxEndSec, overallMelodyScore, dominantMood } =
    segmentMusicalStructure(energyEnvelope, bassEnvelope, midHighEnvelope, frameRate, durationSec)

  // 5. Generate suggested cut points aligned to musical accents
  const suggestedCutPoints = generateSuggestedCutPoints(sections, beats, durationSec)

  return {
    assetId,
    assetName,
    durationSec,
    bpm,
    bpmConfidence,
    beats,
    onsets,
    energyEnvelope,
    sections,
    dominantMood,
    overallMelodyScore,
    climaxStartSec,
    climaxEndSec,
    suggestedCutPoints,
  }
}

function estimateBpmFromBeats(beats: number[], durationSec: number): { bpm: number; confidence: number } {
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

  // Normalize BPM to standard 70 - 160 range
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

  // Find peak climax chunk window (1 or 2 highest consecutive chunks)
  let maxEnergySum = 0
  let climaxChunkIndex = Math.min(chunkCount - 1, Math.floor(chunkCount * 0.65))

  for (let c = 0; c < chunkCount - 1; c++) {
    const sum2 = chunkEnergies[c] + chunkEnergies[c + 1]
    if (sum2 > maxEnergySum) {
      maxEnergySum = sum2
      climaxChunkIndex = c
    }
  }

  const climaxStartSec = Number((climaxChunkIndex * windowSec).toFixed(2))
  const climaxEndSec = Number(Math.min(durationSec, (climaxChunkIndex + 2) * windowSec).toFixed(2))

  // Construct Sections
  const sections: MusicSection[] = []

  for (let c = 0; c < chunkCount; c++) {
    const startSec = Number((c * windowSec).toFixed(2))
    const endSec = Number(Math.min(durationSec, (c + 1) * windowSec).toFixed(2))
    const avgE = chunkEnergies[c]
    const avgB = chunkBass[c]
    const avgM = chunkMid[c]

    const melodyRatio = avgM / Math.max(0.01, avgB + 0.1)
    const isMelodyDominant = melodyRatio > 0.85 && avgB < 0.65

    // Section classification
    let type: MusicSection['type'] = 'melody'
    let name = 'Melodic Passage'

    if (c === 0 && avgE < 0.5) {
      type = 'intro'
      name = 'Intro Opening'
    } else if (c >= chunkCount - 1 && avgE < 0.4) {
      type = 'outro'
      name = 'Ending Fade'
    } else if (c === climaxChunkIndex || c === climaxChunkIndex + 1) {
      type = 'climax'
      name = 'Climax Peak'
    } else if (c === climaxChunkIndex - 1 && avgE > chunkEnergies[Math.max(0, c - 1)]) {
      type = 'buildup'
      name = 'Build-up Momentum'
    } else if (avgE < 0.32) {
      type = 'calm'
      name = 'Calm Rest'
    } else if (avgE > 0.65 && avgB > 0.5) {
      type = 'energetic'
      name = 'High Energy Beat'
    }

    // Melody profile estimation
    let melodyProfile: MelodyProfileType = 'uncertain'
    if (avgE < 0.28) {
      melodyProfile = 'soft-melody'
    } else if (isMelodyDominant && avgM > 0.55 && avgB < 0.35) {
      melodyProfile = 'vocal-like'
    } else if (isMelodyDominant && avgE > 0.4) {
      melodyProfile = 'sustained-instrumental'
    } else if (avgB > 0.65 && avgE > 0.6) {
      melodyProfile = 'bass-heavy'
    } else if (avgB > 0.45 && avgM < 0.45) {
      melodyProfile = 'beat-driven'
    } else if (avgE > 0.7 && avgM > 0.5 && avgB > 0.5) {
      melodyProfile = 'high-energy-mixed'
    } else if (isMelodyDominant) {
      melodyProfile = 'piano-strings'
    }

    sections.push({
      id: `sec-${c}`,
      name,
      startSec,
      endSec,
      type,
      energyLevel: Number(avgE.toFixed(2)),
      isMelodyDominant,
      melodyProfile,
    })
  }

  // Calculate Overall Melody Score (0 to 1)
  const melodySections = sections.filter((s) => s.isMelodyDominant).length
  const overallMelodyScore = Number((melodySections / sections.length).toFixed(2))

  // Dominant Mood estimation
  let dominantMood: EmotionalMood = 'gentle'
  const avgTrackEnergy = chunkEnergies.reduce((a, b) => a + b, 0) / chunkEnergies.length

  if (avgTrackEnergy < 0.3) {
    dominantMood = overallMelodyScore > 0.6 ? 'calm' : 'gentle'
  } else if (avgTrackEnergy > 0.65) {
    dominantMood = overallMelodyScore > 0.5 ? 'dramatic' : 'intense'
  } else {
    dominantMood = overallMelodyScore > 0.55 ? 'romantic' : 'energetic'
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
  beats: number[],
  durationSec: number
): number[] {
  const cutPoints: number[] = [0]
  const beatsSet = new Set(beats.map((b) => Math.round(b * 10) / 10))

  for (const sec of sections) {
    const secSpan = sec.endSec - sec.startSec

    // In melody/calm sections: longer shot intervals (3.5s - 5.0s)
    // In energetic/beat sections: 1.2s - 2.0s
    // In climax: 0.3s - 0.8s
    let targetInterval = 3.0
    if (sec.type === 'climax') targetInterval = 0.5
    else if (sec.type === 'buildup') targetInterval = 1.2
    else if (sec.type === 'energetic') targetInterval = 1.5
    else if (sec.isMelodyDominant || sec.type === 'calm') targetInterval = 4.0

    let cursor = sec.startSec + targetInterval
    while (cursor < sec.endSec - 0.4) {
      // Find nearest detected beat within 0.3s if available
      const roundedCursor = Math.round(cursor * 10) / 10
      let alignedCut = cursor

      for (let offset = -0.3; offset <= 0.3; offset += 0.1) {
        const testT = Math.round((cursor + offset) * 10) / 10
        if (beatsSet.has(testT)) {
          alignedCut = testT
          break
        }
      }

      cutPoints.push(Number(alignedCut.toFixed(2)))
      cursor += targetInterval
    }
  }

  // Deduplicate and sort
  const unique = Array.from(new Set(cutPoints.filter((t) => t >= 0 && t < durationSec))).sort(
    (a, b) => a - b
  )
  return unique
}
