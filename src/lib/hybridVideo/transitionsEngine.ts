/**
 * IndiaTools — Hybrid Video Transitions Engine
 * Computes transition opacity, transform offsets, and wipes
 */

import type { ClipTransition } from './types.ts'

export interface TransitionState {
  opacityMultiplier: number
  scaleMultiplier: number
  offsetX: number
  offsetY: number
  wipeProgress: number // 0 (hidden) to 1 (fully revealed)
  isGlitch: boolean
}

export function computeClipTransition(
  transitionIn: ClipTransition,
  transitionOut: ClipTransition,
  relTimeSec: number,
  durationSec: number,
  canvasWidth: number
): TransitionState {
  const result: TransitionState = {
    opacityMultiplier: 1,
    scaleMultiplier: 1,
    offsetX: 0,
    offsetY: 0,
    wipeProgress: 1,
    isGlitch: false,
  }

  // 1. In-Transition
  if (transitionIn.type !== 'none' && transitionIn.durationSec > 0 && relTimeSec < transitionIn.durationSec) {
    const t = Math.max(0, Math.min(1, relTimeSec / transitionIn.durationSec))
    applyTransitionType(transitionIn.type, t, true, result, canvasWidth)
  }

  // 2. Out-Transition
  const outStart = durationSec - transitionOut.durationSec
  if (transitionOut.type !== 'none' && transitionOut.durationSec > 0 && relTimeSec > outStart) {
    const t = Math.max(0, Math.min(1, (durationSec - relTimeSec) / transitionOut.durationSec))
    applyTransitionType(transitionOut.type, t, false, result, canvasWidth)
  }

  return result
}

function applyTransitionType(
  type: string,
  progress: number, // 0 = start of intro / end of outro; 1 = fully settled
  isIntro: boolean,
  state: TransitionState,
  canvasWidth: number
): void {
  switch (type) {
    case 'crossfade':
    case 'fade-black':
    case 'fade-white':
      state.opacityMultiplier *= progress
      break

    case 'scale-punch':
      // Starts slightly zoomed (1.15) and settles to 1.0 (or shrinks on outro)
      const scaleDelta = (1 - progress) * 0.18
      state.scaleMultiplier *= 1 + scaleDelta
      state.opacityMultiplier *= progress
      break

    case 'whip-pan-left':
      // Pans in from right to center, or exits towards left
      const panOffsetIn = (1 - progress) * canvasWidth
      state.offsetX += isIntro ? panOffsetIn : -((1 - progress) * canvasWidth)
      state.opacityMultiplier *= Math.min(1, progress * 1.5)
      break

    case 'whip-pan-right':
      const panOffsetR = (1 - progress) * canvasWidth
      state.offsetX += isIntro ? -panOffsetR : (1 - progress) * canvasWidth
      state.opacityMultiplier *= Math.min(1, progress * 1.5)
      break

    case 'fade-wipe-left':
    case 'fade-wipe-right':
      state.wipeProgress = progress
      state.opacityMultiplier *= progress
      break

    case 'glitch-split':
      if (progress < 0.85) {
        state.isGlitch = true
        state.offsetX += (Math.random() - 0.5) * 16 * (1 - progress)
      }
      break
  }
}
