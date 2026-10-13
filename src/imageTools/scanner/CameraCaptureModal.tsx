import React, { useRef, useState, useEffect } from 'react'
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react'

interface CameraCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Stop stream if closing
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      return
    }

    let activeStream: MediaStream | null = null

    async function startCamera() {
      setCameraError(null)
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })
        activeStream = s
        setStream(s)
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
      } catch (err: any) {
        setCameraError(
          err?.message || 'Camera permission denied or camera device not accessible.'
        )
      }
    }

    startCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, facingMode])

  if (!isOpen) return null

  const handleCapture = () => {
    if (!videoRef.current) return
    setIsCapturing(true)

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `scan_${Date.now()}.jpg`, {
              type: 'image/jpeg',
            })
            // Stop camera
            if (stream) {
              stream.getTracks().forEach((track) => track.stop())
              setStream(null)
            }
            onCapture(file)
            onClose()
          }
          setIsCapturing(false)
        },
        'image/jpeg',
        0.95
      )
    }
  }

  const toggleFacingMode = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Direct Camera Scan</h3>
              <p className="text-[11px] text-slate-400">
                Align document inside the frame and capture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 my-4 relative rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px]">
          {cameraError ? (
            <div className="p-6 text-center text-slate-400 max-w-sm">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-xs text-rose-300 font-semibold mb-1">Camera Access Error</p>
              <p className="text-[11px] text-slate-500">{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Document Alignment Frame Box */}
              <div className="absolute inset-8 md:inset-12 border-2 border-emerald-400/80 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-mono text-emerald-300/80 bg-slate-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                    Align Document Borders
                  </span>
                </div>
              </div>

              {/* Shutter Flash Animation */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-out fade-out duration-300" />
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 shrink-0">
          <button
            onClick={toggleFacingMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip Camera</span>
          </button>

          <button
            onClick={handleCapture}
            disabled={!stream || isCapturing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>{isCapturing ? 'Capturing...' : 'Capture Page'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
