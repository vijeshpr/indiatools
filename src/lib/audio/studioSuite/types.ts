/**
 * Studio Master & Spatial Suite - Core Audio & DSP Type Definitions
 */

export type MasteringPresetId =
  | 'streaming-clean'
  | 'warm-analog'
  | 'club-punch'
  | 'punchy-vocal'

export interface AutoMasterConfig {
  enabled: boolean
  preset: MasteringPresetId
  intensity: number // 0.0 to 1.0 (0% - 100%)
  targetLufs: number // e.g. -14 LUFS for streaming
  subsonicCut: boolean // 30Hz high-pass filter
  warmSaturation: boolean // Analog tape saturation curve
  highAirBoost: boolean // 12kHz airy sheen
  inputGainDb: number // -12dB to +12dB
  outputGainDb: number // -12dB to +12dB
}

export interface BandDynamicsConfig {
  threshold: number // -60 to 0 dB
  ratio: number // 1 to 20
  attackMs: number // 1 to 100 ms
  releaseMs: number // 10 to 500 ms
  gainDb: number // -12 to +12 dB
  enabled: boolean
  solo: boolean
  mute: boolean
}

export interface MultibandConfig {
  enabled: boolean
  lowCrossoverHz: number // 60 to 350 Hz (default 200)
  highCrossoverHz: number // 1500 to 8000 Hz (default 3500)
  low: BandDynamicsConfig
  mid: BandDynamicsConfig
  high: BandDynamicsConfig
}

export type LfoShape = 'sine' | 'triangle' | 'square' | 'random'
export type BeatSubdivision = '1/4' | '1/8' | '1/16'

export interface OrbitMotionConfig {
  enabled: boolean
  shape: LfoShape
  rateHz: number // 0.1 to 15 Hz
  tempoSync: boolean
  subdivision: BeatSubdivision
  bpm: number // 40 to 240
  depth: number // 0% to 200% (stereo panning amplitude)
  tremoloDepth: number // 0% to 100%
  tremoloRateHz: number // 0.5 to 20 Hz
  subLock: boolean // Keep sub-bass locked in mono center
  subLockCrossoverHz: number // 80 to 180 Hz (default 120)
}

export interface LoudnessMetrics {
  inputRmsDb: number
  inputPeakDb: number
  estimatedLufs: number
  crestFactorDb: number
  outputRmsDb: number
  outputPeakDb: number
  gainReductionDb: {
    low: number
    mid: number
    high: number
    master: number
  }
}

export interface StudioMasterState {
  autoMaster: AutoMasterConfig
  multiband: MultibandConfig
  orbitMotion: OrbitMotionConfig
  masterVolume: number // 0.0 to 1.5
  isMuted: boolean
  isLooping: boolean
  isBypassed: boolean // Global A/B Raw vs Processed
  activeModuleCount: number
}

export const DEFAULT_AUTO_MASTER: AutoMasterConfig = {
  enabled: true,
  preset: 'streaming-clean',
  intensity: 0.85,
  targetLufs: -14.0,
  subsonicCut: true,
  warmSaturation: true,
  highAirBoost: true,
  inputGainDb: 0.0,
  outputGainDb: 0.0,
}

export const DEFAULT_MULTIBAND: MultibandConfig = {
  enabled: true,
  lowCrossoverHz: 200,
  highCrossoverHz: 3500,
  low: {
    threshold: -22,
    ratio: 3.5,
    attackMs: 25,
    releaseMs: 120,
    gainDb: 1.5,
    enabled: true,
    solo: false,
    mute: false,
  },
  mid: {
    threshold: -18,
    ratio: 2.8,
    attackMs: 15,
    releaseMs: 80,
    gainDb: 0.5,
    enabled: true,
    solo: false,
    mute: false,
  },
  high: {
    threshold: -24,
    ratio: 2.2,
    attackMs: 8,
    releaseMs: 60,
    gainDb: 1.0,
    enabled: true,
    solo: false,
    mute: false,
  },
}

export const DEFAULT_ORBIT_MOTION: OrbitMotionConfig = {
  enabled: false,
  shape: 'sine',
  rateHz: 0.65,
  tempoSync: false,
  subdivision: '1/4',
  bpm: 124,
  depth: 0.85, // 85% stereo spread
  tremoloDepth: 0.0,
  tremoloRateHz: 4.0,
  subLock: true,
  subLockCrossoverHz: 120,
}
