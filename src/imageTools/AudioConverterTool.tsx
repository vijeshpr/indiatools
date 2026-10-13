import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Music,
  Volume2,
  FileAudio,
  Download,
  RefreshCw,
  Play,
  Pause,
  ShieldCheck,
  Cpu,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  Upload,
  Radio,
  Zap,
  SlidersHorizontal,
  Layers,
  Lock,
  ArrowLeftRight,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  AudioChannelsOption,
  AudioConversionOptions,
  AudioFormat,
  AudioMetadata,
  AudioQualityPreset,
  ConversionProgress,
  ConversionResult,
} from '../lib/audio/types'
import {
  detectAudioFormat,
  getAvailableFormatCapabilities,
  estimateOutputSize,
} from '../lib/audio/formatCapabilities'
import {
  decodeAudioFile,
  convertAudioFile,
  generateSampleAudioFile,
} from '../lib/audio/audioProcessor'

const BITRATE_OPTIONS: Array<64 | 96 | 128 | 160 | 192 | 256 | 320> = [
  64, 96, 128, 160, 192, 256, 320,
]

const SAMPLE_RATE_OPTIONS = [
  { label: 'Original Sample Rate', value: 0 },
  { label: '48,000 Hz (Studio HD)', value: 48000 },
  { label: '44,100 Hz (CD Standard)', value: 44100 },
  { label: '32,000 Hz (Broadcast)', value: 32000 },
  { label: '22,050 Hz (Low Bandwidth)', value: 22050 },
]

export const AudioConverterTool: React.FC = () => {
  const tool = getToolBySlug('audio-converter')!
  const { showToast } = useToast()

  // Format capabilities in active browser
  const capabilities = useMemo(() => getAvailableFormatCapabilities(), [])

  // Input audio state
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceMetadata, setSourceMetadata] = useState<AudioMetadata | null>(null)
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null)

  // Target conversion settings
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3')
  const [preset, setPreset] = useState<AudioQualityPreset>('balanced')
  const [mp3Bitrate, setMp3Bitrate] = useState<64 | 96 | 128 | 160 | 192 | 256 | 320>(192)
  const [sampleRate, setSampleRate] = useState<number>(0)
  const [channels, setChannels] = useState<AudioChannelsOption>('original')
  const [volume, setVolume] = useState<number>(1.0)
  const [normalize, setNormalize] = useState<boolean>(false)
  const [customFilename, setCustomFilename] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  // Conversion execution states
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [conversionProgress, setConversionProgress] = useState<ConversionProgress>({
    stage: 'idle',
    stageLabel: 'Ready to convert',
    percent: 0,
  })
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
  const [conversionError, setConversionError] = useState<string | null>(null)

  // Cancellation ref
  const isCancelledRef = useRef<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl)
      if (conversionResult?.url) URL.revokeObjectURL(conversionResult.url)
    }
  }, [sourcePreviewUrl, conversionResult])

  // Handle Preset Changes
  const handlePresetSelect = (newPreset: AudioQualityPreset) => {
    setPreset(newPreset)
    if (newPreset === 'small') {
      setMp3Bitrate(96)
      setSampleRate(32000)
    } else if (newPreset === 'balanced') {
      setMp3Bitrate(192)
      setSampleRate(44100)
    } else if (newPreset === 'high') {
      setMp3Bitrate(320)
      setSampleRate(48000)
    }
  }

  // Handle Loading Audio File
  const handleAudioFileSelect = async (file: File) => {
    setConversionError(null)
    setConversionResult(null)

    // Revoke previous preview
    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl)
      setSourcePreviewUrl(null)
    }

    if (file.size === 0) {
      setConversionError('Selected audio file is empty (0 bytes).')
      showToast('Empty audio file selected.', 'error')
      return
    }

    setIsAnalyzingFile(true)
    setSourceFile(file)
    setCustomFilename(file.name.replace(/\.[^/.]+$/, ''))

    const previewUrl = URL.createObjectURL(file)
    setSourcePreviewUrl(previewUrl)

    try {
      const { metadata } = await decodeAudioFile(file)
      setSourceMetadata(metadata)

      // Auto-switch output format if input matches output
      if (metadata.format === 'mp3') {
        setOutputFormat('wav')
      } else {
        setOutputFormat('mp3')
      }

      showToast(`Loaded ${metadata.fileName} (${formatBytes(metadata.fileSize)})`, 'success')
    } catch (err: any) {
      console.warn('Decode inspection warning:', err)
      const detected = detectAudioFormat(file)
      setSourceMetadata({
        format: detected,
        fileName: file.name,
        fileSize: file.size,
        duration: 0,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
    } finally {
      setIsAnalyzingFile(false)
    }
  }

  // Load Built-in Sample Melody Demo
  const handleLoadSampleAudio = async () => {
    try {
      setIsAnalyzingFile(true)
      const sampleFile = await generateSampleAudioFile()
      await handleAudioFileSelect(sampleFile)
    } catch (err: any) {
      setConversionError('Could not generate sample audio demo.')
      showToast('Sample generation error.', 'error')
    } finally {
      setIsAnalyzingFile(false)
    }
  }

  // Handle Format Swap
  const handleSwapFormat = () => {
    if (!sourceMetadata) return
    const currentFrom = sourceMetadata.format
    const currentTo = outputFormat

    // Check if target is encodable
    const targetCap = capabilities.find((c) => c.format === currentFrom)
    if (targetCap && targetCap.canEncode) {
      setOutputFormat(currentFrom)
      showToast(`Output set to ${currentFrom.toUpperCase()}`, 'info')
    } else {
      showToast(`Browser cannot encode directly into ${currentFrom.toUpperCase()}.`, 'info')
    }
  }

  // Execute Conversion
  const handleStartConversion = async () => {
    if (!sourceFile) return

    setIsConverting(true)
    setConversionError(null)
    setConversionResult(null)
    isCancelledRef.current = false

    const options: AudioConversionOptions = {
      outputFormat,
      preset,
      mp3Bitrate,
      sampleRate,
      channels,
      volume,
      normalize,
      customFilename: customFilename.trim() || undefined,
    }

    try {
      const result = await convertAudioFile(
        sourceFile,
        options,
        (progress) => {
          setConversionProgress(progress)
        },
        () => isCancelledRef.current
      )

      setConversionResult(result)
      showToast(`Converted to ${outputFormat.toUpperCase()} successfully!`, 'success')
    } catch (err: any) {
      if (isCancelledRef.current) {
        showToast('Conversion cancelled.', 'info')
      } else {
        console.error('Audio conversion failure:', err)
        const msg =
          err?.message ||
          'Audio conversion failed. Please try a different output format or check file integrity.'
        setConversionError(msg)
        showToast(msg, 'error')
      }
    } finally {
      setIsConverting(false)
      setConversionProgress({
        stage: 'idle',
        stageLabel: 'Ready',
        percent: 0,
      })
    }
  }

  // Cancel ongoing conversion
  const handleCancelConversion = () => {
    isCancelledRef.current = true
    setIsConverting(false)
    showToast('Cancelling conversion...', 'info')
  }

  // Calculate estimated output size
  const estimatedSize = useMemo(() => {
    if (!sourceMetadata || sourceMetadata.duration <= 0) return 0
    const effChannels =
      channels === 'mono' ? 1 : channels === 'stereo' ? 2 : sourceMetadata.numberOfChannels
    const effRate = sampleRate > 0 ? sampleRate : sourceMetadata.sampleRate
    return estimateOutputSize(
      sourceMetadata.duration,
      outputFormat,
      effRate,
      effChannels,
      mp3Bitrate
    )
  }, [sourceMetadata, outputFormat, sampleRate, channels, mp3Bitrate])

  return (
    <ToolPageLayout
      tool={tool}
      maxWidthClass="max-w-7xl"
      customTitle="100% Free Audio Converter Online — Zero Upload | IndiaTools"
      customDescription="Convert MP3, WAV, M4A, AAC, OGG and FLAC audio formats for free. Zero uploads, private browser-based processing and instant downloads. No registration required."
      customH1="100% FREE & ZERO UPLOAD — Audio Converter"
      customSubtitle="Convert MP3, WAV, M4A, AAC, OGG, FLAC and WebM audio files privately in your browser. No uploads. No subscriptions. No server processing."
    >
      <div className="space-y-8">
        {/* Hero Atmospheric Header with Privacy Shield & Audio Waveform Visual */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Equalizer Waveform Decorative Graphics */}
          <div className="absolute right-6 bottom-4 opacity-15 hidden lg:flex items-end gap-1.5 pointer-events-none h-24">
            {[40, 65, 85, 30, 95, 70, 50, 90, 60, 75, 45, 80, 100, 35, 70, 55, 85, 60].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-emerald-400"
                  style={{ height: `${h}%` }}
                />
              )
            )}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% FREE • ZERO UPLOAD • PROCESSED ON YOUR DEVICE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Music className="w-8 h-8 text-emerald-400 shrink-0" />
                <span>Audio Converter — Convert Any Supported Audio Format</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Your audio stays on your device. Convert privately without uploading files to any
                server or cloud API. Compatible with MP3, WAV, M4A, AAC, OGG, FLAC and WebM.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {sourceFile ? (
                <button
                  type="button"
                  onClick={() => {
                    setSourceFile(null)
                    setSourceMetadata(null)
                    setConversionResult(null)
                    setConversionError(null)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Choose Another Audio</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadSampleAudio}
                  disabled={isAnalyzingFile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Try Sample Audio Demo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.oga,.flac,.m4a,.aac,.webm,.aif,.aiff"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleAudioFileSelect(f)
          }}
          className="hidden"
        />

        {/* Upload Dropzone */}
        {!sourceFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingOver(true)
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDraggingOver(false)
              const f = e.dataTransfer.files?.[0]
              if (f) handleAudioFileSelect(f)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-5 bg-slate-900/40 dark:bg-slate-950/40 ${
              isDraggingOver
                ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/20">
              <Upload className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Drag & drop your audio file here to convert
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Or click to browse from your device. Converts MP3, WAV, M4A, AAC, OGG, FLAC and WebM
                with zero uploads.
              </p>
            </div>

            {/* Supported Format Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-w-xl">
              {['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC', 'WebM', 'AIFF'].map((fmt) => (
                <span
                  key={fmt}
                  className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  {fmt}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full max-w-xs mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadSampleAudio()
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Load Sample Melody Specimen</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Conversion Studio */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Audio Inspection & Conversion Controls */}
            <div className="lg:col-span-8 space-y-6">
              {/* Selected Source Audio Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-[380px]">
                          {sourceFile.name}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          {sourceMetadata?.format || 'AUDIO'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        <span>{formatBytes(sourceFile.size)}</span>
                        {sourceMetadata && sourceMetadata.duration > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(sourceMetadata.duration)}</span>
                            <span>•</span>
                            <span>{sourceMetadata.sampleRate} Hz</span>
                            <span>•</span>
                            <span>{sourceMetadata.numberOfChannels === 1 ? 'Mono' : 'Stereo'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 underline cursor-pointer"
                  >
                    Replace
                  </button>
                </div>

                {/* Source Audio Player Preview */}
                {sourcePreviewUrl && (
                  <div className="pt-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                      Source Audio Preview:
                    </span>
                    <audio
                      controls
                      src={sourcePreviewUrl}
                      className="w-full h-10 rounded-xl"
                      preload="metadata"
                    />
                  </div>
                )}

                {/* Large File Notice (>100MB) */}
                {sourceFile.size > 100 * 1024 * 1024 && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Large Audio File Notice:</strong> Processing files over 100 MB requires
                      extra browser memory. Processing runs in chunked background slices.
                    </span>
                  </div>
                )}
              </div>

              {/* Bidirectional Format Conversion Deck */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Format Selector & Quality Presets
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    100% In-Browser Encoding
                  </span>
                </div>

                {/* FROM & TO Selector Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                  {/* FROM Box */}
                  <div className="sm:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      FROM (Input)
                    </span>
                    <div className="text-base font-bold text-slate-900 dark:text-white uppercase flex items-center justify-between">
                      <span>{sourceMetadata?.format || 'Detected Audio'}</span>
                      <span className="text-xs font-mono font-normal text-slate-500">
                        {sourceMetadata ? `${sourceMetadata.sampleRate} Hz` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleSwapFormat}
                      title="Swap Format Direction"
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* TO Box */}
                  <div className="sm:col-span-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                      TO (Target Output)
                    </span>
                    <div className="text-base font-bold text-slate-900 dark:text-white uppercase flex items-center justify-between">
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
                        className="bg-transparent font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none w-full"
                      >
                        {capabilities.map((c) => (
                          <option
                            key={c.format}
                            value={c.format}
                            disabled={!c.canEncode}
                            className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white"
                          >
                            {c.format.toUpperCase()} {c.canEncode ? '' : '(Not supported in this browser)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Target Output Format Pills */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Quick Choose Target Format:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {capabilities.map((cap) => {
                      const isSelected = outputFormat === cap.format
                      const isSupported = cap.canEncode
                      return (
                        <button
                          key={cap.format}
                          type="button"
                          onClick={() => isSupported && setOutputFormat(cap.format)}
                          disabled={!isSupported}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white'
                              : isSupported
                              ? 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
                              : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-45 cursor-not-allowed text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm uppercase">{cap.format}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                            {isSupported ? (cap.format === 'wav' ? 'Lossless PCM' : cap.format === 'mp3' ? 'Universal LAME' : 'Web Audio') : 'Unsupported'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Quality Presets: Small File, Balanced, High Quality */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Audio Quality Presets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'small', label: 'Small File', sub: '96 kbps • 32 kHz' },
                      { id: 'balanced', label: 'Balanced', sub: '192 kbps • 44.1 kHz' },
                      { id: 'high', label: 'High Quality', sub: '320 kbps / Studio PCM' },
                    ].map((p) => {
                      const isSelected = preset === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePresetSelect(p.id as AudioQualityPreset)}
                          className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-xs font-bold">{p.label}</span>
                          <span
                            className={`block text-[10px] mt-0.5 ${
                              isSelected ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {p.sub}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Expandable Advanced Settings Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                      <span>Advanced Audio Parameters (Bitrate, Channels, Resampling, Normalization)</span>
                    </span>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expandable Panel */}
                  {showAdvanced && (
                    <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
                      {/* MP3 Bitrate */}
                      {outputFormat === 'mp3' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>MP3 Encoding Bitrate:</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              {mp3Bitrate} kbps
                            </span>
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                            {BITRATE_OPTIONS.map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => setMp3Bitrate(rate)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                  mp3Bitrate === rate
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {rate}k
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Notice: Converting lower-bitrate audio to 320 kbps preserves audio fidelity
                            losslessly, but cannot mathematically recreate frequencies already discarded
                            by lossy compression.
                          </span>
                        </div>
                      )}

                      {/* Sample Rate */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          Resample Audio Frequency:
                        </label>
                        <select
                          value={sampleRate}
                          onChange={(e) => setSampleRate(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white cursor-pointer"
                        >
                          {SAMPLE_RATE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Audio Channels */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          Channel Configuration:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'original', label: 'Original Channels' },
                            { value: 'stereo', label: 'Stereo (2 Channels)' },
                            { value: 'mono', label: 'Mono (1 Channel)' },
                          ].map((ch) => (
                            <button
                              key={ch.value}
                              type="button"
                              onClick={() => setChannels(ch.value as AudioChannelsOption)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                channels === ch.value
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {ch.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Volume Slider & Peak Normalization */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Volume Gain:</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              {Math.round(volume * 100)}%
                            </span>
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">
                              Safe Peak Normalization
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Normalizes audio peak to -0.3 dBFS without clipping.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={normalize}
                            onChange={(e) => setNormalize(e.target.checked)}
                            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Output Filename Customization */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          Output Filename:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={customFilename}
                            onChange={(e) => setCustomFilename(e.target.value)}
                            placeholder="converted_audio"
                            className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-xs font-mono font-bold text-slate-500">
                            .{outputFormat}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversion Trigger Deck */}
                <div className="pt-2">
                  {!isConverting ? (
                    <button
                      type="button"
                      onClick={handleStartConversion}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Convert Audio to {outputFormat.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-emerald-400">
                            {conversionProgress.stageLabel}
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {conversionProgress.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${conversionProgress.percent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCancelConversion}
                        className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel Conversion</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversion Result Card */}
              {conversionResult && (
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-md space-y-5 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Conversion Complete!
                          </h4>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                            {conversionResult.outputFormat}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {conversionResult.filename} • {formatBytes(conversionResult.fileSize)}
                        </span>
                      </div>
                    </div>

                    <a
                      href={conversionResult.url}
                      download={conversionResult.filename}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Converted Audio</span>
                    </a>
                  </div>

                  {/* Playable In-Browser Player Preview */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      Preview Converted Output Audio:
                    </span>
                    <audio
                      controls
                      src={conversionResult.url}
                      className="w-full h-10 rounded-xl"
                      preload="auto"
                    />
                  </div>

                  {/* Audio Specs Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Duration</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatDuration(conversionResult.duration)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Sample Rate</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {conversionResult.sampleRate} Hz
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Channels</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {conversionResult.numberOfChannels === 1 ? 'Mono' : 'Stereo'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">File Size</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatBytes(conversionResult.fileSize)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {conversionError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-start gap-3 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Conversion Error</h5>
                    <p className="mt-0.5">{conversionError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (4 cols): Privacy Highlights, Specs & Output Estimate */}
            <div className="lg:col-span-4 space-y-6">
              {/* Output File Estimation Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                  Conversion Summary
                </span>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Target Container:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      .{outputFormat}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Audio Codec:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {outputFormat === 'wav'
                        ? 'Linear PCM 16-bit'
                        : outputFormat === 'mp3'
                        ? 'LAME MPEG-1 Layer 3'
                        : outputFormat === 'webm' || outputFormat === 'ogg'
                        ? 'Opus Audio Codec'
                        : 'MPEG-4 AAC'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Est. Output Size:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {estimatedSize > 0 ? formatBytes(estimatedSize) : 'Calculated on load'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Privacy Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero Cloud Upload
                    </span>
                  </div>
                </div>
              </div>

              {/* In-Browser Privacy Guarantee Card */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-3.5 shadow-md">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Absolute Privacy Guarantee
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike traditional online converters that upload your audio files, voice recordings,
                  or musical stems to remote cloud servers, IndiaTools Audio Converter performs 100% of
                  its decoding and re-encoding locally inside your browser using Web Audio and LAME.
                </p>
                <div className="space-y-1.5 pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No file size tracking or audio telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Works entirely in your local browser sandbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Memory automatically purged on page close</span>
                  </div>
                </div>
              </div>

              {/* Supported Audio Codecs Cheat Sheet */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                  Format Support Guide
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">MP3 ↔ WAV</span>
                      <span className="text-[10px] text-slate-500">Universal bidirectional encoding</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                      100% Supported
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">M4A / AAC → MP3/WAV</span>
                      <span className="text-[10px] text-slate-500">Apple voice memos & iTunes</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Instant Decode
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">FLAC → MP3 / WAV</span>
                      <span className="text-[10px] text-slate-500">Lossless audio decodes to studio PCM</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Lossless
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content & Comprehensive Format Compatibility Guide (SEO Optimized) */}
        <div className="mt-12 space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          {/* Section 1: In-Depth Audio Compatibility Matrix */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-500" />
              <span>Supported Audio Format Compatibility Matrix</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              IndiaTools leverages standard W3C Web Audio APIs and client-side encoders to deliver
              genuine bidirectional format transcoding. Here is how each major format performs directly
              within your browser:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Audio Format</th>
                    <th className="p-3.5">MIME Type</th>
                    <th className="p-3.5">Client Decoding</th>
                    <th className="p-3.5">Client Encoding</th>
                    <th className="p-3.5">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">MP3 (.mp3)</td>
                    <td className="p-3.5">audio/mp3</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Bundled LAME JS</td>
                    <td className="p-3.5 font-sans">Music sharing, smartphones, car audio, general playback</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">WAV (.wav)</td>
                    <td className="p-3.5">audio/wav</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">16-bit Linear PCM</td>
                    <td className="p-3.5 font-sans">Music production, podcast mastering, video editing stems</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">M4A (.m4a)</td>
                    <td className="p-3.5">audio/mp4</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-slate-500">MediaRecorder (MP4)</td>
                    <td className="p-3.5 font-sans">iPhone Voice Memos, Apple Music, podcasts</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">AAC (.aac)</td>
                    <td className="p-3.5">audio/aac</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-slate-500">Browser MediaRecorder</td>
                    <td className="p-3.5 font-sans">Broadcast streaming, high-efficiency compressed audio</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">OGG (.ogg)</td>
                    <td className="p-3.5">audio/ogg</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Opus / Vorbis stream</td>
                    <td className="p-3.5 font-sans">Open-source game engines (Unity, Godot), streaming radio</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">WebM (.webm)</td>
                    <td className="p-3.5">audio/webm</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Opus WebCodecs</td>
                    <td className="p-3.5 font-sans">Web voice recorders, browser telephony, YouTube audio</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">FLAC (.flac)</td>
                    <td className="p-3.5">audio/flac</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">100% Native</td>
                    <td className="p-3.5 text-slate-500">Lossless Studio WAV Export</td>
                    <td className="p-3.5 font-sans">Audiophile archives, lossless disc ripping, studio masters</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Bitrate and Acoustic Quality Realities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-500" />
                <span>Does Upscaling Bitrate Restore Audio Quality?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. In digital acoustic signal processing, lossy encoders (like MP3 at 128 kbps) discard
                high-frequency spectral data and subtle harmonics that human hearing barely notices
                (psychoacoustic masking).
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Converting a 128 kbps MP3 into 320 kbps or uncompressed WAV ensures that no further
                degradation occurs, but it cannot mathematically recreate acoustic frequencies that were
                already removed during the original compression.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-500" />
                <span>Lossless vs Lossy Audio Formats</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Lossless Formats (WAV, FLAC, AIFF):</strong> Store 100% of the raw acoustic sample
                amplitudes without discarding any harmonics. Best suited for audio editing, music
                production stems, and long-term mastering archives.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Lossy Formats (MP3, AAC, OGG Opus):</strong> Compress audio by 70% to 90% in file
                size while maintaining superb listening transparency. Ideal for everyday mobile listening,
                car stereos, and web distribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
