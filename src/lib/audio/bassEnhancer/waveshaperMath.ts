/**
 * WaveShaper & Saturation Transfer Math for Studio Bass Enhancer
 * Implements hyperbolic tangent (tanh) and asymmetric polynomial transfer curves
 * tailored specifically for low-frequency harmonics (2nd and 3rd order overtones).
 */

/**
 * Generate asymmetric soft-clipping wave-shaping curve for Web Audio WaveShaperNode
 * Produces audible even and odd harmonic overtones from sub-bass fundamental.
 */
export function createSubBassWaveShaperCurve(drivePct: number, n = 4096): Float32Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(n * Float32Array.BYTES_PER_ELEMENT)
  const curve = new Float32Array(buffer)
  const drive = Math.max(0.01, Math.min(1.0, drivePct / 100))
  
  // Saturation coefficient: ranges from mild tape warming to aggressive saturation
  const k = 1.0 + drive * 6.0
  const asymFactor = 0.22 * drive // Injects even 2nd-order harmonics (tube/transformer character)

  for (let i = 0; i < n; i++) {
    // Input range from -1.0 to +1.0
    const x = (i * 2) / (n - 1) - 1.0

    // 1. Hyperbolic tangent base transfer
    const tanhVal = Math.tanh(k * x) / Math.tanh(k)

    // 2. Subtle quadratic asymmetric offset for even-order warmth
    const evenOffset = asymFactor * (x * x - Math.abs(x))

    // 3. Combine and clamp strictly to [-1, 1]
    const combined = tanhVal + evenOffset
    curve[i] = Math.max(-1.0, Math.min(1.0, combined))
  }

  return curve
}

/**
 * Fast in-place sample saturation for offline rendering and Web Worker DSP
 */
export function processSampleSaturation(x: number, drivePct: number): number {
  if (drivePct <= 0) return x
  const drive = drivePct / 100
  const k = 1.0 + drive * 5.0
  const tanhVal = Math.tanh(k * x) / Math.tanh(k)
  const evenOffset = 0.2 * drive * (x * x - Math.abs(x))
  const out = tanhVal + evenOffset
  return out > 1.0 ? 1.0 : out < -1.0 ? -1.0 : out
}

/**
 * Brickwall Bass Soft-Clipper transfer function
 * Smooth polynomial rounding above -0.5 dBFS (threshold ~0.944)
 */
export function applySoftClipLimiter(x: number): number {
  const threshold = 0.94
  const absX = Math.abs(x)
  if (absX <= threshold) {
    return x
  }
  const excess = absX - threshold
  const sign = x < 0 ? -1 : 1
  // Smooth cubic saturation knee
  const compressed = threshold + (1 - threshold) * Math.tanh(excess / (1 - threshold))
  return sign * Math.min(0.999, compressed)
}
