/**
/**
 * Studio Bass Enhancer & Sub-Harmonic Generator — Type Definitions
 * Ultra-modern pro audio DSP types, parameters, and telemetry metrics.
 */

export interface BassEnhancerParams {
  /** Sub-Harmonic Octave Level (0% to 100%) */
  subLevel: number
  /** Linkwitz-Riley 4th-order crossover frequency in Hz (40 to 160 Hz) */
  crossoverHz: number
  /** Non-linear tape/tube saturation drive for harmonic presence (0% to 100%) */
  drive: number
  /** Transient impact and punch envelope accentuation (0% to 100%) */
  punch: number
  /** Force all content below 120Hz to mono to eliminate club phase cancellation */
  monoLock: boolean
  /** Parallel wet/dry crossfade (0% to 100%) */
  mix: number
  /** Master A/B instant bypass comparison */
  bypassed: boolean
}

export const DEFAULT_BASS_PARAMS: BassEnhancerParams = {
  subLevel: 55,
  crossoverHz: 85,
  drive: 40,
  punch: 45,
  monoLock: true,
  mix: 85,
  bypassed: false,
}

export interface BassTelemetryMetrics {
  subEnergyDb: number
  fundamentalHz: number
  subOctaveEnergyDb: number
  harmonicEnergyDb: number
  peakLimitingDb: number
  isLimiting: boolean
}

export type BassExportFormat = '24bit-wav' | '16bit-wav' | '320kbps-mp3'

export type BassExportStage =
  | 'idle'
  | 'analyzing'
  | 'synthesizing'
  | 'waveshaping'
  | 'limiting'
  | 'encoding'
  | 'done'
  | 'error'

export interface BassExportProgress {
  stage: BassExportStage
  percentage: number
  stageMessage: string
}
