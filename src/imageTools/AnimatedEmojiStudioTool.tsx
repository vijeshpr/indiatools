/**
 * IndiaTools — Animated Emoji Studio
 * Premium Animated Emoji Browser, Preview Player & Individual Asset Downloader
 * 100% Client-Side, Transparent Backgrounds, GIF, WebP & WhatsApp Animated Stickers
 */

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Download,
  Search,
  Smile,
  Heart,
  ThumbsUp,
  PartyPopper,
  Cat,
  Flower2,
  Coffee,
  Rocket,
  Flame,
  CheckCircle2,
  X,
  Play,
  Pause,
  Copy,
  Check,
  Info,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Smartphone,
  Share2,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  ANIMATED_EMOJIS,
  EMOJI_CATEGORIES,
  AnimatedEmojiItem,
} from '../data/emojisData'

export const AnimatedEmojiStudioTool: React.FC = () => {
  const tool = getToolBySlug('animated-emoji-studio')
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('category') || 'all'
  })
  const [formatFilter, setFormatFilter] = useState<'all' | 'sticker' | 'gif' | 'webp'>('all')
  const [selectedEmoji, setSelectedEmoji] = useState<AnimatedEmojiItem | null>(null)
  const [previewBg, setPreviewBg] = useState<'checker-dark' | 'checker-light' | 'dark' | 'white'>('checker-dark')
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [isPaused, setIsPaused] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  // Sync category param with URL for indexable search/links
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    if (catId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams, { replace: true })
  }

  // Filtered Emojis
  const filteredEmojis = useMemo(() => {
    return ANIMATED_EMOJIS.filter((emoji) => {
      // Category filter
      if (selectedCategory !== 'all' && emoji.category !== selectedCategory) {
        return false
      }

      // Format filter
      if (formatFilter === 'sticker' && !emoji.isWhatsAppReady) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = emoji.name.toLowerCase().includes(q)
        const matchesShort = emoji.shortName.toLowerCase().includes(q)
        const matchesTags = emoji.tags.some((t) => t.toLowerCase().includes(q))
        const matchesChar = emoji.unicodeChar === q
        return matchesName || matchesShort || matchesTags || matchesChar
      }

      return true
    })
  }, [selectedCategory, formatFilter, searchQuery])

  // Download Handler (One Selected Emoji at a Time)
  const handleDownload = async (
    emoji: AnimatedEmojiItem,
    format: 'gif' | 'webp' | 'sticker',
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()

    let fileUrl = emoji.webpUrl
    let fileName = `${emoji.slug}.webp`

    if (format === 'gif') {
      fileUrl = emoji.gifUrl
      fileName = `${emoji.slug}.gif`
    } else if (format === 'sticker') {
      if (!emoji.stickerUrl) {
        showToast('This emoji exceeds the 500 KB WhatsApp sticker limit. Downloading as standard WebP.', 'info')
        fileUrl = emoji.webpUrl
        fileName = `${emoji.slug}.webp`
      } else {
        fileUrl = emoji.stickerUrl
        fileName = `${emoji.slug}-whatsapp-sticker.webp`
      }
    }

    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)

      showToast(`Downloaded ${fileName}! 🎉`, 'success')
    } catch (err) {
      // Fallback direct link download
      const a = document.createElement('a')
      a.href = fileUrl
      a.download = fileName
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showToast(`Download started for ${fileName}`, 'success')
    }
  }

  // Copy Direct Link
  const handleCopyLink = (emoji: AnimatedEmojiItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const url = `${window.location.origin}${emoji.webpUrl}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(emoji.slug)
    showToast(`Copied image link for ${emoji.shortName}!`, 'info')
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  return (
    <ToolPageLayout tool={tool!}>
      <div className="space-y-10 pb-16">
        {/* 1. HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B1120] to-slate-900 border border-white/10 shadow-2xl p-6 sm:p-10">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>100% FREE TRANSPARENT ANIMATED EMOJIS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Animated Emoji Studio & Sticker Downloader
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Browse, preview, and download authentic high-definition 3D animated emojis with transparent backgrounds.
                Download lightweight <strong className="text-white">Animated GIFs</strong>, crystal-clear <strong className="text-white">WebPs</strong>, and verified <strong className="text-emerald-400">WhatsApp 512×512 Stickers</strong> for chats, videos, and social media.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-gray-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>32+ Handcrafted Emojis</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-gray-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transparent Alpha Layer</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-gray-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>WhatsApp 512×512 Compatible</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-gray-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Apache 2.0 Open License</span>
                </span>
              </div>
            </div>

            {/* Hero Visual Preview */}
            <div className="shrink-0 relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-slate-900/60 border border-white/10 p-4 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 [background-image:linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px] opacity-25" />
              <img
                src="/emojis/animated-partying-face-emoji.webp"
                alt="Animated partying face emoji with confetti and horn"
                className="w-44 h-44 object-contain relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] animate-bounce"
                style={{ animationDuration: '3s' }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2 text-center text-[11px] text-gray-300 border border-white/10">
                ✨ Live 512×512 Transparent Render
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search animated emojis by name, feeling, or keyword (e.g. smile, love, clap, party, cat)..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
              {(
                [
                  { id: 'all', label: 'All Formats' },
                  { id: 'sticker', label: 'WhatsApp Stickers' },
                  { id: 'gif', label: 'GIFs' },
                  { id: 'webp', label: 'WebP' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormatFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    formatFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {EMOJI_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-amber-500/25 text-amber-200' : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. EMOJI GALLERY GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>
              Showing <strong className="text-white">{filteredEmojis.length}</strong> animated emojis
            </span>
            <span className="hidden sm:inline">Click any emoji for full-screen inspection & sticker details</span>
          </div>

          {filteredEmojis.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-gray-400 space-y-3">
              <Smile className="w-10 h-10 mx-auto text-gray-500 opacity-60" />
              <p className="text-sm font-medium text-white">No animated emojis match your search</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try searching for another keyword like &quot;heart&quot;, &quot;clap&quot;, &quot;laugh&quot;, or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setFormatFilter('all')
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredEmojis.map((emoji) => (
                <div
                  key={emoji.id}
                  onClick={() => setSelectedEmoji(emoji)}
                  className="group relative bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3 flex flex-col items-center justify-between transition-all hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer"
                >
                  {/* WhatsApp Sticker Badge */}
                  {emoji.isWhatsAppReady && (
                    <div
                      title="Verified WhatsApp Sticker Format (512x512, <500KB)"
                      className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px]"
                    >
                      ✓
                    </div>
                  )}

                  {/* Emoji Animation Preview on Transparency Grid */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center mb-2 p-2">
                    {/* Checkerboard Pattern */}
                    <div className="absolute inset-0 [background-image:linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] opacity-35" />

                    <img
                      src={emoji.webpUrl}
                      alt={emoji.alt}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="w-full text-center space-y-1 mb-2.5">
                    <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                      {emoji.shortName}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate capitalize">
                      {emoji.categoryName}
                    </div>
                  </div>

                  {/* Quick Action Download Buttons */}
                  <div className="w-full grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => handleDownload(emoji, 'gif', e)}
                      title={`Download ${emoji.shortName} as Animated GIF (${(emoji.gifSizeBytes / 1024).toFixed(0)} KB)`}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-gray-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>GIF</span>
                    </button>

                    <button
                      onClick={(e) => handleDownload(emoji, emoji.isWhatsAppReady ? 'sticker' : 'webp', e)}
                      title={emoji.isWhatsAppReady ? 'Download WhatsApp Sticker (.webp)' : 'Download Animated WebP'}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-gray-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>{emoji.isWhatsAppReady ? 'Sticker' : 'WebP'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. LARGE PREVIEW & INSPECTION MODAL */}
        {selectedEmoji && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div
              className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedEmoji.unicodeChar}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{selectedEmoji.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 capitalize">
                      Category: {selectedEmoji.categoryName} • Unicode: U+{selectedEmoji.codepoint.toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmoji(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Large Checkerboard Interactive Preview Area */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
                  {/* Background mode switcher */}
                  {previewBg === 'checker-dark' && (
                    <div className="absolute inset-0 bg-slate-950 [background-image:linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] [background-size:24px_24px] [background-position:0_0,0_12px,12px_-12px,-12px_0px]" />
                  )}
                  {previewBg === 'checker-light' && (
                    <div className="absolute inset-0 bg-gray-200 [background-image:linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] [background-size:24px_24px] [background-position:0_0,0_12px,12px_-12px,-12px_0px]" />
                  )}
                  {previewBg === 'dark' && <div className="absolute inset-0 bg-slate-950" />}
                  {previewBg === 'white' && <div className="absolute inset-0 bg-white" />}

                  {/* Render the selected image */}
                  <img
                    src={selectedEmoji.webpUrl}
                    alt={selectedEmoji.alt}
                    width={512}
                    height={512}
                    className="w-52 h-52 object-contain relative z-10 drop-shadow-2xl"
                    style={{
                      animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                  />

                  {/* Checkerboard Backdrop Mode Switcher Pills */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-[10px]">
                    <span className="text-gray-400 px-1.5">Backdrop:</span>
                    <button
                      onClick={() => setPreviewBg('checker-dark')}
                      className={`px-2 py-1 rounded-lg ${previewBg === 'checker-dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-300'}`}
                    >
                      Dark Grid
                    </button>
                    <button
                      onClick={() => setPreviewBg('checker-light')}
                      className={`px-2 py-1 rounded-lg ${previewBg === 'checker-light' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-300'}`}
                    >
                      Light Grid
                    </button>
                    <button
                      onClick={() => setPreviewBg('dark')}
                      className={`px-2 py-1 rounded-lg ${previewBg === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-300'}`}
                    >
                      Black
                    </button>
                    <button
                      onClick={() => setPreviewBg('white')}
                      className={`px-2 py-1 rounded-lg ${previewBg === 'white' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-300'}`}
                    >
                      White
                    </button>
                  </div>
                </div>

                {/* Technical Asset Specifications Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Dimensions</span>
                    <strong className="text-white">512 × 512 px</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Animated WebP Size</span>
                    <strong className="text-white">{(selectedEmoji.webpSizeBytes / 1024).toFixed(1)} KB</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Animated GIF Size</span>
                    <strong className="text-white">{(selectedEmoji.gifSizeBytes / 1024).toFixed(1)} KB</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">WhatsApp Ready</span>
                    <strong className={selectedEmoji.isWhatsAppReady ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedEmoji.isWhatsAppReady ? 'Yes (<= 500 KB)' : 'High Res (> 500 KB)'}
                    </strong>
                  </div>
                </div>

                {/* Download Actions Bar */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-300 block">
                    Download Individual Format (No Bulk ZIP):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 1. Download GIF */}
                    <button
                      onClick={() => handleDownload(selectedEmoji, 'gif')}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <Download className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                      <span>Download GIF</span>
                    </button>

                    {/* 2. Download Animated WebP */}
                    <button
                      onClick={() => handleDownload(selectedEmoji, 'webp')}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <Download className="w-4 h-4 text-cyan-400 group-hover:text-slate-950" />
                      <span>Download WebP</span>
                    </button>

                    {/* 3. Download WhatsApp Sticker */}
                    <button
                      onClick={() => handleDownload(selectedEmoji, 'sticker')}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>WhatsApp Sticker</span>
                    </button>
                  </div>
                </div>

                {/* Direct Link & License Attribution */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>License: Apache 2.0 (Google Noto Animated Emoji)</span>
                  </div>

                  <button
                    onClick={() => handleCopyLink(selectedEmoji)}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
                  >
                    {copiedSlug === selectedEmoji.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. POPULAR & TRENDING EMOJI SHOWCASE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Popular & Trending Animated Emojis
              </h2>
            </div>
            <span className="text-xs text-gray-400">Most downloaded across social chats</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ANIMATED_EMOJIS.slice(0, 6).map((emoji) => (
              <div
                key={emoji.id}
                onClick={() => setSelectedEmoji(emoji)}
                className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105"
              >
                <img
                  src={emoji.webpUrl}
                  alt={emoji.alt}
                  width={512}
                  height={512}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-xs font-semibold text-white truncate w-full">{emoji.shortName}</span>
                <span className="text-[10px] text-amber-400 mt-0.5">Free Download</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. WHATSAPP STICKER GUIDE & HOW TO USE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Smartphone className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">How to Use WhatsApp Animated Stickers</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              WhatsApp requires animated stickers to be formatted as <strong className="text-white">512×512 pixel animated WebP files under 500 KB</strong> with transparent backgrounds.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
              <li><strong>Mobile (Android & iOS):</strong> Download the sticker file and import it using companion sticker pack apps like <em>Sticker.ly</em> or <em>Personal Stickers</em>.</li>
              <li><strong>WhatsApp Web / Desktop:</strong> Drag and drop the downloaded <code>.webp</code> or <code>.gif</code> file directly into any WhatsApp chat window as a sticker or media attachment.</li>
              <li><strong>Telegram & Discord:</strong> Fully compatible with Telegram custom animated sticker bots and Discord custom animated server emojis.</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Licensing, Rights & Attribution</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              The animated emoji collection provided on IndiaTools is sourced from the official <strong className="text-white">Google Noto Color Emoji Animation</strong> project, distributed under the liberal <strong className="text-white">Apache License, Version 2.0</strong>.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
              <li><strong>Free Personal & Commercial Use:</strong> You are free to download, use, and share these animated emojis in personal chats, websites, apps, and video productions.</li>
              <li><strong>100% Client-Side Privacy:</strong> Previews and downloads execute directly from your web browser with zero telemetry or file tracking.</li>
            </ul>
          </div>
        </div>

        {/* 7. FREQUENTLY ASKED QUESTIONS (SEO FAQ SECTION) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-bold text-lg text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <h4 className="text-xs font-bold text-white">Are these animated emojis truly transparent?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Yes! Every emoji is rendered with a 32-bit RGBA alpha channel. When placed over dark mode chats, videos, presentations, or websites, there are zero white borders or backgrounds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <h4 className="text-xs font-bold text-white">How do I download a single emoji instead of a ZIP?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                IndiaTools is strictly designed for individual asset downloading. Click the &quot;GIF&quot;, &quot;WebP&quot;, or &quot;Sticker&quot; button on any emoji card to immediately save that specific emoji to your device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <h4 className="text-xs font-bold text-white">Can I use these emojis in video editing software?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Absolutely. Most video editors (Adobe Premiere Pro, DaVinci Resolve, CapCut, Final Cut Pro) natively support animated GIFs and WebP overlays for title sequences and reaction videos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <h4 className="text-xs font-bold text-white">Why are some emojis labeled &quot;High Res (&gt;500 KB)&quot;?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                WhatsApp strictly enforces a maximum 500 KB file limit for animated stickers. High-complexity emojis with multi-colored confetti or liquid tears are larger than 500 KB and are offered as full-resolution GIFs and WebPs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
