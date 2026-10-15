import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Upload,
  Printer,
  Download,
  Copy,
  Plus,
  Trash2,
  Scissors,
  Check,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Eye,
  Layers,
  Palette,
  Shield,
  HelpCircle,
  X,
  FileText,
  User,
  GraduationCap,
  School,
  Phone,
  Heart,
  BookOpen,
  Tag,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  ZoomIn,
  Move,
  RefreshCw,
  Share2
} from 'lucide-react'
import {
  StudentProfile,
  StudentPhoto,
  SlipTemplate,
  SlipCustomization,
  SlipSizeId,
  PhotoShape,
  PhotoPosition,
  BackgroundPattern,
  SLIP_TEMPLATES,
  SLIP_SIZE_SPECS,
  calculateA4Layout,
  generateFlattenedSlips,
  SAMPLE_STUDENTS,
  generateSvgKidAvatar,
  performClientBgRemoval
} from '../lib/nameSlipEngine'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  NAME_SLIP_LOCALES,
  ALL_NAME_SLIP_LANG_CODES,
  NameSlipLangCode,
  isNameSlipLocale,
  getNameSlipTranslation
} from '../i18n/nameSlipI18n'
import { PDFDocument } from 'pdf-lib'

const STORAGE_KEY = 'indiatools_name_slip_data'

export const NameSlipMakerTool: React.FC = () => {
  const tool = getToolBySlug('name-slip-maker')!

  const { langCode } = useParams<{ langCode?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 1. Language Resolution
  const activeLocale: NameSlipLangCode = useMemo(() => {
    if (langCode && isNameSlipLocale(langCode)) {
      return langCode as NameSlipLangCode
    }
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments.length > 0 && isNameSlipLocale(segments[0])) {
      return segments[0] as NameSlipLangCode
    }
    return 'en'
  }, [langCode, location.pathname])

  const t = useMemo(() => getNameSlipTranslation(activeLocale), [activeLocale])
  const isRtl = t.dir === 'rtl'

  const canonicalPath =
    activeLocale === 'en'
      ? '/tools/name-slip-maker'
      : `/${activeLocale}/tools/name-slip-maker`

  // 2. Main Wizard Step State (1: Info & Photos, 2: Design & Theme, 3: A4 Layout & Arrange, 4: Print & Download)
  const [activeStep, setActiveStep] = useState<number>(1)

  // 3. Students Data State
  const [students, setStudents] = useState<StudentProfile[]>([
    {
      id: 'student_1',
      fullName: 'Aarav Sharma',
      className: 'Class 4',
      section: 'B',
      schoolName: 'Delhi Public School',
      rollNumber: '24',
      bloodGroup: 'B +ve',
      parentPhone: '+91 98765 43210',
      subject: 'Mathematics',
      customLabel: 'House',
      customValue: 'Ashoka House',
      copiesCount: 10,
      photoId: 'photo_demo_1'
    }
  ])
  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(0)

  // 4. Photos Gallery State
  const [photos, setPhotos] = useState<StudentPhoto[]>([
    {
      id: 'photo_demo_1',
      originalDataUrl: generateSvgKidAvatar('Aarav Sharma', '#4F46E5'),
      processedDataUrl: generateSvgKidAvatar('Aarav Sharma', '#4F46E5'),
      isProcessingBg: false,
      useBgRemoved: false,
      bgRemovalFailed: false,
      cropZoom: 1,
      cropPanX: 0,
      cropPanY: 0,
      shape: 'circle',
      fileName: 'aarav-avatar.svg'
    }
  ])
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)

  // 5. Customization State
  const [customization, setCustomization] = useState<SlipCustomization>({
    templateId: 'space_astronaut',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    textColor: '#1E1B4B',
    borderColor: '#6366F1',
    borderWidth: 2,
    bgPattern: 'stars',
    photoPosition: 'left',
    nameFontSize: 'lg',
    detailsFontSize: 'normal',
    showTextStroke: false,
    showBloodGroup: true,
    showPhone: true,
    showSchool: true,
    showRollNo: true,
    showSubject: true,
    showCustomField: false,
    slipSize: 'medium',
    showCutGuides: true
  })

  // 6. Active Preview & Printing State
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1)
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false)
  const [rememberData, setRememberData] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const printAreaRef = useRef<HTMLDivElement | null>(null)

  // Active student reference
  const currentStudent = students[activeStudentIndex] || students[0]

  // Active template reference
  const currentTemplate = useMemo(() => {
    return (
      SLIP_TEMPLATES.find((tmpl) => tmpl.id === customization.templateId) ||
      SLIP_TEMPLATES[0]
    )
  }, [customization.templateId])

  // A4 layout calculations
  const a4Layout = useMemo(() => {
    return calculateA4Layout(students, customization.slipSize)
  }, [students, customization.slipSize])

  // Flattened slips list for A4 rendering
  const flattenedSlips = useMemo(() => {
    return generateFlattenedSlips(students)
  }, [students])

  // Slips on the active preview page
  const pageSlips = useMemo(() => {
    const startIndex = (activePreviewPage - 1) * a4Layout.slipsPerPage
    return flattenedSlips.slice(startIndex, startIndex + a4Layout.slipsPerPage)
  }, [flattenedSlips, activePreviewPage, a4Layout.slipsPerPage])

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.students && parsed.students.length > 0) {
          setStudents(parsed.students)
          setRememberData(true)
        }
        if (parsed.customization) {
          setCustomization((prev) => ({ ...prev, ...parsed.customization }))
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist if rememberData is true
  useEffect(() => {
    try {
      if (rememberData) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ students, customization })
        )
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [rememberData, students, customization])

  // Ensure activePreviewPage is within bounds when totalPages changes
  useEffect(() => {
    if (activePreviewPage > a4Layout.totalPages) {
      setActivePreviewPage(Math.max(1, a4Layout.totalPages))
    }
  }, [a4Layout.totalPages, activePreviewPage])

  // --- Student Management Actions ---
  const handleUpdateStudent = (field: keyof StudentProfile, value: string | number) => {
    setStudents((prev) =>
      prev.map((s, idx) => (idx === activeStudentIndex ? { ...s, [field]: value } : s))
    )
  }

  const handleAddStudent = () => {
    const newId = `student_${Date.now()}`
    const newStudent: StudentProfile = {
      id: newId,
      fullName: `Student ${students.length + 1}`,
      className: currentStudent?.className || 'Class 1',
      section: 'A',
      schoolName: currentStudent?.schoolName || 'School Name',
      rollNumber: '',
      bloodGroup: 'O +ve',
      parentPhone: currentStudent?.parentPhone || '',
      subject: 'All Subjects',
      customLabel: 'House',
      customValue: '',
      copiesCount: 10
    }
    setStudents((prev) => [...prev, newStudent])
    setActiveStudentIndex(students.length)
    showToast('New student added!', 'success')
  }

  const handleRemoveStudent = (index: number) => {
    if (students.length <= 1) {
      showToast('At least one student is required', 'info')
      return
    }
    setStudents((prev) => prev.filter((_, i) => i !== index))
    setActiveStudentIndex((prev) => Math.max(0, prev >= index ? prev - 1 : prev))
    showToast('Student removed', 'info')
  }

  const handleLoadSampleData = () => {
    setStudents(SAMPLE_STUDENTS)
    setActiveStudentIndex(0)

    // Load sample avatars
    const samplePhotos: StudentPhoto[] = [
      {
        id: 'sample_photo_aarav',
        originalDataUrl: generateSvgKidAvatar('Aarav Sharma', '#4F46E5'),
        processedDataUrl: generateSvgKidAvatar('Aarav Sharma', '#4F46E5'),
        isProcessingBg: false,
        useBgRemoved: false,
        bgRemovalFailed: false,
        cropZoom: 1,
        cropPanX: 0,
        cropPanY: 0,
        shape: 'circle',
        fileName: 'aarav-avatar.svg'
      },
      {
        id: 'sample_photo_ananya',
        originalDataUrl: generateSvgKidAvatar('Ananya Nair', '#EC4899'),
        processedDataUrl: generateSvgKidAvatar('Ananya Nair', '#EC4899'),
        isProcessingBg: false,
        useBgRemoved: false,
        bgRemovalFailed: false,
        cropZoom: 1,
        cropPanX: 0,
        cropPanY: 0,
        shape: 'rounded',
        fileName: 'ananya-avatar.svg'
      }
    ]
    setPhotos(samplePhotos)
    showToast('Sample student data loaded!', 'success')
  }

  // --- Photo Upload & Processing Actions ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: StudentPhoto[] = []
    Array.from(files).slice(0, 30).forEach((file) => {
      const reader = new FileReader()
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string
        const photoObj: StudentPhoto = {
          id: photoId,
          originalDataUrl: dataUrl,
          isProcessingBg: false,
          useBgRemoved: false,
          bgRemovalFailed: false,
          cropZoom: 1,
          cropPanX: 0,
          cropPanY: 0,
          shape: 'circle',
          fileName: file.name
        }

        setPhotos((prev) => [...prev, photoObj])

        // Auto-assign to current student if student has no photo
        if (!currentStudent.photoId || currentStudent.photoId.startsWith('photo_demo')) {
          handleUpdateStudent('photoId', photoId)
        }
      }
      reader.readAsDataURL(file)
    })

    showToast(`Uploaded ${files.length} photo(s)!`, 'success')
  }

  // Remove photo from gallery
  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    setStudents((prev) =>
      prev.map((s) => (s.photoId === photoId ? { ...s, photoId: undefined } : s))
    )
    showToast('Photo removed', 'info')
  }

  // Trigger client-side background removal for an individual photo
  const handleRemoveBackground = async (photoId: string) => {
    const targetPhoto = photos.find((p) => p.id === photoId)
    if (!targetPhoto) return

    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isProcessingBg: true } : p))
    )
    showToast('Removing background in browser...', 'info')

    const result = await performClientBgRemoval(targetPhoto.originalDataUrl)

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId) return p
        return {
          ...p,
          isProcessingBg: false,
          processedDataUrl: result.dataUrl,
          useBgRemoved: result.success,
          bgRemovalFailed: !result.success
        }
      })
    )

    if (result.success) {
      showToast('Background removed successfully!', 'success')
    } else {
      showToast('Kept original photo (transparent fallback applied)', 'info')
    }
  }

  // Toggle between original photo and removed background
  const handleToggleBgVersion = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId && p.processedDataUrl
          ? { ...p, useBgRemoved: !p.useBgRemoved }
          : p
      )
    )
  }

  // Apply template defaults
  const handleSelectTemplate = (template: SlipTemplate) => {
    setCustomization((prev) => ({
      ...prev,
      templateId: template.id,
      primaryColor: template.defaultPrimary,
      secondaryColor: template.defaultSecondary,
      textColor: template.defaultText,
      borderColor: template.defaultBorderColor,
      bgPattern: template.defaultBgPattern
    }))
    showToast(`Applied ${template.name} theme!`, 'info')
  }

  // Direct native A4 print
  const handleDirectPrint = () => {
    window.print()
  }

  // High-Resolution PDF Download using pdf-lib & HTML5 Canvas
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true)
    showToast('Generating high-resolution printable PDF...', 'info')

    try {
      const pdfDoc = await PDFDocument.create()

      // A4 dimensions in points: 595.28 x 841.89
      const pageWidthPt = 595.28
      const pageHeightPt = 841.89

      for (let p = 1; p <= a4Layout.totalPages; p++) {
        const page = pdfDoc.addPage([pageWidthPt, pageHeightPt])

        // Render high-res canvas (approx 300 DPI: 2480 x 3508)
        const canvas = document.createElement('canvas')
        const widthPx = 2480
        const heightPx = 3508
        canvas.width = widthPx
        canvas.height = heightPx
        const ctx = canvas.getContext('2d')

        if (ctx) {
          // White page background
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, widthPx, heightPx)

          // Header watermark / cutting notice
          ctx.fillStyle = '#64748B'
          ctx.font = 'bold 24px system-ui, sans-serif'
          ctx.fillText(
            `INDIATOOLS SCHOOL NAME SLIP MAKER • PAGE ${p} OF ${a4Layout.totalPages} • 100% PRIVATE PRINT`,
            80,
            60
          )

          // Calculate slip dimensions in px on 300 DPI canvas
          // 1 mm ≈ 11.811 px at 300 DPI
          const mmToPx = 11.811
          const marginPx = a4Layout.marginMm * mmToPx
          const gapXPx = a4Layout.gapXMm * mmToPx
          const gapYPx = a4Layout.gapYMm * mmToPx
          const slipWPx = a4Layout.slipWidthMm * mmToPx
          const slipHPx = a4Layout.slipHeightMm * mmToPx

          const startIdx = (p - 1) * a4Layout.slipsPerPage
          const slipsOnThisPage = flattenedSlips.slice(startIdx, startIdx + a4Layout.slipsPerPage)

          slipsOnThisPage.forEach((item, indexOnPage) => {
            const col = indexOnPage % a4Layout.columnsPerPage
            const row = Math.floor(indexOnPage / a4Layout.columnsPerPage)

            const x = marginPx + col * (slipWPx + gapXPx)
            const y = 90 + marginPx + row * (slipHPx + gapYPx)

            // Draw slip card
            ctx.save()

            // Card background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(x, y, slipWPx, slipHPx)

            // Border
            ctx.strokeStyle = customization.borderColor
            ctx.lineWidth = customization.borderWidth * 3
            ctx.strokeRect(x, y, slipWPx, slipHPx)

            // Header Banner
            const bannerHeight = slipHPx * 0.28
            ctx.fillStyle = customization.primaryColor
            ctx.fillRect(x, y, slipWPx, bannerHeight)

            // Header Title
            ctx.fillStyle = '#FFFFFF'
            ctx.font = `bold ${Math.round(slipHPx * 0.11)}px system-ui, sans-serif`
            ctx.fillText(item.student.schoolName || 'SCHOOL NAME', x + 16, y + bannerHeight * 0.65)

            // Body Details
            const bodyY = y + bannerHeight + 20
            const textX = x + 24

            // Student Full Name
            ctx.fillStyle = customization.textColor
            ctx.font = `bold ${Math.round(slipHPx * 0.13)}px system-ui, sans-serif`
            ctx.fillText(`Name: ${item.student.fullName}`, textX, bodyY + 24)

            // Class & Roll No
            ctx.font = `600 ${Math.round(slipHPx * 0.085)}px system-ui, sans-serif`
            ctx.fillStyle = '#334155'
            ctx.fillText(
              `Class: ${item.student.className} - ${item.student.section}     Roll No: ${item.student.rollNumber || '-'}`,
              textX,
              bodyY + 60
            )

            // Subject / Phone / Blood Group
            let extraText = ''
            if (customization.showSubject && item.student.subject) {
              extraText += `Sub: ${item.student.subject}   `
            }
            if (customization.showBloodGroup && item.student.bloodGroup) {
              extraText += `Blood: ${item.student.bloodGroup}   `
            }
            if (customization.showPhone && item.student.parentPhone) {
              extraText += `Ph: ${item.student.parentPhone}`
            }

            if (extraText.trim()) {
              ctx.font = `500 ${Math.round(slipHPx * 0.07)}px system-ui, sans-serif`
              ctx.fillStyle = '#64748B'
              ctx.fillText(extraText, textX, bodyY + 92)
            }

            // Cut guidelines around slip
            if (customization.showCutGuides) {
              ctx.strokeStyle = '#CBD5E1'
              ctx.lineWidth = 1.5
              ctx.setLineDash([8, 8])
              ctx.strokeRect(x - 2, y - 2, slipWPx + 4, slipHPx + 4)
            }

            ctx.restore()
          })

          // Embed rendered canvas page into PDF
          const pageDataUrl = canvas.toDataURL('image/jpeg', 0.92)
          const imgBytes = await fetch(pageDataUrl).then((r) => r.arrayBuffer())
          const pdfImage = await pdfDoc.embedJpg(imgBytes)

          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: pageWidthPt,
            height: pageHeightPt
          })
        }
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `School-Name-Slips-A4-${Date.now()}.pdf`
      link.click()
      showToast('PDF downloaded successfully! Ready to print on A4.', 'success')
    } catch (err) {
      console.error('PDF generation error:', err)
      showToast('Could not generate PDF. Please use the Direct Print button.', 'info')
    } finally {
      setIsExportingPdf(false)
    }
  }

  // Download high-resolution PNG Sheet
  const handleDownloadPng = () => {
    showToast('Exporting high-resolution PNG sheet...', 'info')
    const canvas = document.createElement('canvas')
    const widthPx = 2480
    const heightPx = 3508
    canvas.width = widthPx
    canvas.height = heightPx
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, widthPx, heightPx)

    // Render title
    ctx.fillStyle = '#0F172A'
    ctx.font = 'bold 36px system-ui, sans-serif'
    ctx.fillText('INDIATOOLS • SCHOOL NAME SLIP A4 SHEET', 80, 80)

    const mmToPx = 11.811
    const marginPx = a4Layout.marginMm * mmToPx
    const gapXPx = a4Layout.gapXMm * mmToPx
    const gapYPx = a4Layout.gapYMm * mmToPx
    const slipWPx = a4Layout.slipWidthMm * mmToPx
    const slipHPx = a4Layout.slipHeightMm * mmToPx

    pageSlips.forEach((item, indexOnPage) => {
      const col = indexOnPage % a4Layout.columnsPerPage
      const row = Math.floor(indexOnPage / a4Layout.columnsPerPage)

      const x = marginPx + col * (slipWPx + gapXPx)
      const y = 120 + marginPx + row * (slipHPx + gapYPx)

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(x, y, slipWPx, slipHPx)

      ctx.strokeStyle = customization.borderColor
      ctx.lineWidth = customization.borderWidth * 3
      ctx.strokeRect(x, y, slipWPx, slipHPx)

      const bannerH = slipHPx * 0.28
      ctx.fillStyle = customization.primaryColor
      ctx.fillRect(x, y, slipWPx, bannerH)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${Math.round(slipHPx * 0.11)}px system-ui, sans-serif`
      ctx.fillText(item.student.schoolName || 'SCHOOL NAME', x + 16, y + bannerH * 0.65)

      const bodyY = y + bannerH + 20
      ctx.fillStyle = customization.textColor
      ctx.font = `bold ${Math.round(slipHPx * 0.13)}px system-ui, sans-serif`
      ctx.fillText(`Name: ${item.student.fullName}`, x + 24, bodyY + 24)

      ctx.font = `600 ${Math.round(slipHPx * 0.085)}px system-ui, sans-serif`
      ctx.fillStyle = '#334155'
      ctx.fillText(
        `Class: ${item.student.className} - ${item.student.section}   Roll: ${item.student.rollNumber || '-'}`,
        x + 24,
        bodyY + 60
      )

      if (customization.showCutGuides) {
        ctx.strokeStyle = '#CBD5E1'
        ctx.lineWidth = 1.5
        ctx.setLineDash([8, 8])
        ctx.strokeRect(x - 2, y - 2, slipWPx + 4, slipHPx + 4)
      }
    })

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `name-slips-a4-sheet-${Date.now()}.png`
    link.click()
    showToast('PNG sheet downloaded!', 'success')
  }

  // Language switch
  const handleLanguageChange = (targetLocale: NameSlipLangCode) => {
    const targetPath =
      targetLocale === 'en'
        ? '/tools/name-slip-maker'
        : `/${targetLocale}/tools/name-slip-maker`
    navigate(targetPath)
  }

  // Helper to render cute SVG icon for template
  const renderTemplateIcon = (iconType: string, className = 'w-6 h-6') => {
    switch (iconType) {
      case 'rocket':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        )
      case 'dino':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19c0-4 3-8 8-8h3l4-5h2v3l-2 3v4c0 3-2 5-5 5H6a2 2 0 0 1-2-2z" />
            <circle cx="18" cy="8" r="1" fill="currentColor" />
          </svg>
        )
      case 'unicorn':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2 5h-4l2-5z" fill="currentColor" />
            <path d="M6 18c0-5 4-9 9-9h2l3 4v4c0 2-2 4-4 4H8a2 2 0 0 1-2-2z" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
          </svg>
        )
      case 'superhero':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4z" fill="none" />
            <path d="M12 6l2 4 4.5.5-3.5 3 1 4.5-4-2.5-4 2.5 1-4.5-3.5-3 4.5-.5L12 6z" fill="currentColor" />
          </svg>
        )
      case 'ocean':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            <circle cx="17" cy="7" r="3" />
          </svg>
        )
      case 'flower':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
            <path d="M12 17a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0-3-3z" />
            <path d="M3 12a3 3 0 0 0 3-3h1a3 3 0 0 0 0 6H6a3 3 0 0 0-3-3z" />
            <path d="M17 12a3 3 0 0 0 3-3h1a3 3 0 0 0 0 6h-1a3 3 0 0 0-3-3z" />
          </svg>
        )
      case 'robot':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <line x1="12" y1="2" x2="12" y2="8" />
            <circle cx="12" cy="2" r="1.5" fill="currentColor" />
            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
            <circle cx="16" cy="13" r="1.5" fill="currentColor" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        )
      case 'sports':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
            <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
        )
      case 'teddy':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="14" r="7" />
            <circle cx="6" cy="7" r="3" />
            <circle cx="18" cy="7" r="3" />
            <circle cx="10" cy="12" r="1" fill="currentColor" />
            <circle cx="14" cy="12" r="1" fill="currentColor" />
            <path d="M11 15h2" />
          </svg>
        )
      case 'doodle':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m14 2 8 8L7 25l-5 1 1-5L14 2z" />
            <line x1="12" y1="20" x2="20" y2="20" />
          </svg>
        )
      case 'heritage':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2 6.5 5 8l5-3 5 3c3-1.5 5-4.5 5-8 0-5.5-4.5-10-10-10z" />
            <circle cx="12" cy="10" r="3" fill="currentColor" />
          </svg>
        )
      case 'book':
      default:
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )
    }
  }

  // Active student's photo object
  const currentStudentPhoto = useMemo(() => {
    return photos.find((p) => p.id === currentStudent?.photoId) || null
  }, [photos, currentStudent?.photoId])

  // Single Name Slip Renderer (Reusable for Preview and A4 grid)
  const renderSingleSlip = (
    student: StudentProfile,
    isPrint = false,
    keySuffix = '0'
  ) => {
    const photo = photos.find((p) => p.id === student.photoId)
    const photoUrl = photo
      ? photo.useBgRemoved && photo.processedDataUrl
        ? photo.processedDataUrl
        : photo.originalDataUrl
      : null

    // Determine font size classes
    const nameSizeClass =
      customization.nameFontSize === 'xl'
        ? 'text-base sm:text-lg md:text-xl font-black'
        : customization.nameFontSize === 'lg'
        ? 'text-sm sm:text-base font-extrabold'
        : customization.nameFontSize === 'md'
        ? 'text-xs sm:text-sm font-bold'
        : 'text-xs font-bold'

    const detailSizeClass =
      customization.detailsFontSize === 'relaxed'
        ? 'text-xs sm:text-sm leading-relaxed'
        : customization.detailsFontSize === 'compact'
        ? 'text-[10px] sm:text-xs leading-tight'
        : 'text-[11px] sm:text-xs leading-normal'

    // Determine photo shape
    const shapeClass =
      photo?.shape === 'circle'
        ? 'rounded-full'
        : photo?.shape === 'rounded'
        ? 'rounded-xl'
        : 'rounded-md'

    return (
      <div
        key={`${student.id}_${keySuffix}`}
        className="relative bg-white text-slate-800 rounded-xl overflow-hidden shadow-sm transition flex flex-col justify-between border"
        style={{
          borderColor: customization.borderColor,
          borderWidth: `${customization.borderWidth}px`,
          backgroundColor: '#FFFFFF',
          minHeight: isPrint ? 'auto' : '150px'
        }}
      >
        {/* Header Ribbon / School Name Banner */}
        <div
          className="px-3 py-1.5 flex items-center justify-between text-white relative overflow-hidden"
          style={{ background: customization.primaryColor }}
        >
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <span className="shrink-0 text-amber-300">
              {renderTemplateIcon(currentTemplate.iconType, 'w-3.5 h-3.5')}
            </span>
            <span className="font-extrabold text-[11px] sm:text-xs uppercase tracking-wider truncate">
              {student.schoolName || 'SCHOOL NAME'}
            </span>
          </div>

          <span
            className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 shadow-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.22)',
              color: '#FFFFFF'
            }}
          >
            {currentTemplate.badgeLabel}
          </span>
        </div>

        {/* Slip Body Content */}
        <div className="p-3 flex items-center gap-3 flex-1 relative">
          {/* Left Photo Position */}
          {customization.photoPosition === 'left' && photoUrl && (
            <div className="shrink-0 flex flex-col items-center">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border-2 bg-slate-100 ${shapeClass}`}
                style={{ borderColor: customization.primaryColor }}
              >
                <img
                  src={photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${photo?.cropZoom ?? 1}) translate(${photo?.cropPanX ?? 0}%, ${photo?.cropPanY ?? 0}%)`
                  }}
                />
              </div>
            </div>
          )}

          {/* Student Text Fields */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Student Name */}
            <div
              className={`truncate tracking-tight ${nameSizeClass}`}
              style={{
                color: customization.textColor,
                textShadow: customization.showTextStroke ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {student.fullName || 'Student Name'}
            </div>

            {/* Class, Section & Roll Number */}
            <div className={`font-semibold text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-0.5 ${detailSizeClass}`}>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 border border-slate-200">
                {student.className || 'Class 1'} {student.section ? `• Sec: ${student.section}` : ''}
              </span>
              {customization.showRollNo && student.rollNumber && (
                <span className="text-slate-600">
                  Roll: <strong className="text-slate-900">{student.rollNumber}</strong>
                </span>
              )}
            </div>

            {/* Subject / Blood Group / Phone */}
            <div className={`text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-medium ${detailSizeClass}`}>
              {customization.showSubject && student.subject && (
                <span className="text-slate-700">
                  Sub: <span className="font-semibold">{student.subject}</span>
                </span>
              )}

              {customization.showBloodGroup && student.bloodGroup && (
                <span className="inline-flex items-center text-rose-700 font-bold bg-rose-50 px-1 rounded border border-rose-200 text-[10px]">
                  🩸 {student.bloodGroup}
                </span>
              )}

              {customization.showPhone && student.parentPhone && (
                <span className="text-slate-500 text-[10px]">
                  📞 {student.parentPhone}
                </span>
              )}

              {customization.showCustomField && student.customValue && (
                <span className="text-purple-700 bg-purple-50 px-1 rounded border border-purple-200 text-[10px]">
                  {student.customLabel || 'Note'}: {student.customValue}
                </span>
              )}
            </div>
          </div>

          {/* Right Photo Position */}
          {customization.photoPosition === 'right' && photoUrl && (
            <div className="shrink-0 flex flex-col items-center">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border-2 bg-slate-100 ${shapeClass}`}
                style={{ borderColor: customization.primaryColor }}
              >
                <img
                  src={photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${photo?.cropZoom ?? 1}) translate(${photo?.cropPanX ?? 0}%, ${photo?.cropPanY ?? 0}%)`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Accent Line */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${customization.primaryColor} 0%, ${customization.secondaryColor} 100%)`
          }}
        />
      </div>
    )
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="max-w-6xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Bar: 23 Languages Switcher & Privacy Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t.localeName} ({NAME_SLIP_LOCALES[activeLocale]?.nativeName})
            </span>
            <span className="text-xs text-slate-500">• 23 Indian Languages Supported</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={activeLocale}
              onChange={(e) => handleLanguageChange(e.target.value as NameSlipLangCode)}
              aria-label="Select language"
              className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {ALL_NAME_SLIP_LANG_CODES.map((code) => (
                <option key={code} value={code}>
                  {NAME_SLIP_LOCALES[code].nativeName} ({NAME_SLIP_LOCALES[code].name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-6 print:hidden">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wider uppercase border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free • No Login • No Watermark</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>100% Private In-Browser</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            {t.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 print:hidden">
          {[
            { step: 1, label: t.steps.details, icon: User },
            { step: 2, label: t.steps.template, icon: Palette },
            { step: 3, label: t.steps.arrange, icon: Layers },
            { step: 4, label: t.steps.print, icon: Printer }
          ].map(({ step, label, icon: IconComponent }) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs sm:text-sm font-bold transition ${
                activeStep === step
                  ? 'bg-emerald-600/25 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${activeStep === step ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: STUDENT DETAILS & PHOTOS */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
            {/* Left 7 Cols: Student Profiles & Form */}
            <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              {/* Student Profiles Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {students.map((st, sIdx) => (
                    <button
                      key={st.id}
                      onClick={() => setActiveStudentIndex(sIdx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        activeStudentIndex === sIdx
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{st.fullName || `Student ${sIdx + 1}`}</span>
                      {students.length > 1 && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveStudent(sIdx)
                          }}
                          className="hover:text-rose-300 ml-1 p-0.5"
                          title="Remove student"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  ))}

                  <button
                    onClick={handleAddStudent}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.labels.addStudent}</span>
                  </button>
                </div>

                <button
                  onClick={handleLoadSampleData}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline transition ml-auto"
                >
                  {t.labels.loadSample}
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.studentName} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentStudent.fullName}
                    onChange={(e) => handleUpdateStudent('fullName', e.target.value)}
                    placeholder="e.g. Aarav Sharma / ആര്യൻ / राहुल"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* School Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.schoolName}
                  </label>
                  <input
                    type="text"
                    value={currentStudent.schoolName}
                    onChange={(e) => handleUpdateStudent('schoolName', e.target.value)}
                    placeholder="e.g. Delhi Public School / Kendriya Vidyalaya"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.classSection}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentStudent.className}
                      onChange={(e) => handleUpdateStudent('className', e.target.value)}
                      placeholder="Class (e.g. 4)"
                      className="w-2/3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={currentStudent.section}
                      onChange={(e) => handleUpdateStudent('section', e.target.value)}
                      placeholder="Sec (e.g. B)"
                      className="w-1/3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.rollNo}
                  </label>
                  <input
                    type="text"
                    value={currentStudent.rollNumber}
                    onChange={(e) => handleUpdateStudent('rollNumber', e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.bloodGroup}
                  </label>
                  <input
                    type="text"
                    value={currentStudent.bloodGroup}
                    onChange={(e) => handleUpdateStudent('bloodGroup', e.target.value)}
                    placeholder="e.g. O +ve / B +ve"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Parent Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.phone}
                  </label>
                  <input
                    type="text"
                    value={currentStudent.parentPhone}
                    onChange={(e) => handleUpdateStudent('parentPhone', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Subject Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.subject}
                  </label>
                  <input
                    type="text"
                    value={currentStudent.subject}
                    onChange={(e) => handleUpdateStudent('subject', e.target.value)}
                    placeholder="e.g. Mathematics / Science / All"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Number of Slips for this student */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.labels.copies}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStudent('copiesCount', Math.max(1, currentStudent.copiesCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={currentStudent.copiesCount}
                      onChange={(e) => handleUpdateStudent('copiesCount', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-xs text-white font-bold"
                    />
                    <button
                      onClick={() => handleUpdateStudent('copiesCount', currentStudent.copiesCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Upload & Gallery Section */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{t.labels.photoUpload}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">{photos.length} uploaded</span>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/70 transition group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition" />
                  <p className="text-xs font-semibold text-slate-300">
                    Click to browse or drag & drop student photos (1 to 30)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP. Instant in-browser background removal available.
                  </p>
                </div>

                {/* Uploaded Photos Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {photos.map((photo) => {
                    const isAssigned = currentStudent.photoId === photo.id
                    return (
                      <div
                        key={photo.id}
                        className={`p-2.5 rounded-xl border relative transition ${
                          isAssigned
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/30'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center relative mb-2">
                          <img
                            src={
                              photo.useBgRemoved && photo.processedDataUrl
                                ? photo.processedDataUrl
                                : photo.originalDataUrl
                            }
                            alt={photo.fileName}
                            className="w-full h-full object-cover"
                            style={{
                              transform: `scale(${photo.cropZoom}) translate(${photo.cropPanX}%, ${photo.cropPanY}%)`
                            }}
                          />
                          {photo.isProcessingBg && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-[10px] text-emerald-300 font-bold">
                              <RefreshCw className="w-4 h-4 animate-spin mb-1 text-emerald-400" />
                              <span>AI Removing...</span>
                            </div>
                          )}
                        </div>

                        {/* Assign Button */}
                        <button
                          onClick={() => handleUpdateStudent('photoId', photo.id)}
                          className={`w-full text-[10px] font-bold py-1 px-2 rounded-lg transition mb-1.5 ${
                            isAssigned
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isAssigned ? '✓ Assigned' : 'Assign'}
                        </button>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => handleRemoveBackground(photo.id)}
                            disabled={photo.isProcessingBg}
                            className="text-emerald-400 hover:text-emerald-300 transition"
                            title="Remove background"
                          >
                            AI BG
                          </button>

                          {photo.processedDataUrl && (
                            <button
                              onClick={() => handleToggleBgVersion(photo.id)}
                              className="text-cyan-400 hover:text-cyan-300 transition"
                              title="Toggle Original vs Removed"
                            >
                              {photo.useBgRemoved ? 'Orig' : 'Cut'}
                            </button>
                          )}

                          <button
                            onClick={() => setEditingPhotoId(photo.id)}
                            className="text-amber-400 hover:text-amber-300 transition"
                            title="Crop & Zoom"
                          >
                            <Sliders className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="text-rose-400 hover:text-rose-300 transition"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Real-Time Card Preview */}
            <div className="lg:col-span-5 sticky top-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Live Name Slip Preview</span>
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    {customization.slipSize.toUpperCase()}
                  </span>
                </div>

                {/* Rendered Live Card Preview */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                  {renderSingleSlip(currentStudent)}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Total Slips across all students:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {a4Layout.totalSlips} slips ({a4Layout.totalPages} A4 Sheet{a4Layout.totalPages > 1 ? 's' : ''})
                  </span>
                </div>

                <button
                  onClick={() => setActiveStep(2)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition"
                >
                  <span>Next: Choose Cute Template</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TEMPLATE & THEME CUSTOMIZATION */}
        {activeStep === 2 && (
          <div className="space-y-8 print:hidden">
            {/* 12 Ready-Made Templates Grid */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.labels.templates}</span>
                </h2>
                <span className="text-xs text-slate-400">12 Ready-Made Styles</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {SLIP_TEMPLATES.map((tmpl) => {
                  const isSelected = customization.templateId === tmpl.id
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                          style={{ background: tmpl.headerBg }}
                        >
                          {renderTemplateIcon(tmpl.iconType, 'w-4 h-4')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{tmpl.name}</h4>
                          <span className="text-[10px] text-slate-400 block truncate">{tmpl.badgeLabel}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {tmpl.themeDescription}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <div className="flex gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: tmpl.defaultPrimary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: tmpl.defaultSecondary }}
                          />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Custom Theme Colors & Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Fine-Tune Design Options</span>
                </h3>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Header / Primary
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, primaryColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-200 uppercase">
                        {customization.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Badge / Secondary
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={customization.secondaryColor}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, secondaryColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-200 uppercase">
                        {customization.secondaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={customization.borderColor}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, borderColor: e.target.value }))
                        }
                        className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-200 uppercase">
                        {customization.borderColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Photo Position & Shape */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                      Photo Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['left', 'right'] as PhotoPosition[]).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setCustomization((prev) => ({ ...prev, photoPosition: pos }))}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition capitalize ${
                            customization.photoPosition === pos
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                      Name Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['sm', 'md', 'lg', 'xl'] as Array<'sm' | 'md' | 'lg' | 'xl'>).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setCustomization((prev) => ({ ...prev, nameFontSize: sz }))}
                          className={`py-2 rounded-xl text-xs font-bold transition uppercase ${
                            customization.nameFontSize === sz
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Field Visibility Checkboxes */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-2">
                    Fields to Display on Label
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                    {[
                      { key: 'showRollNo', label: 'Roll Number' },
                      { key: 'showBloodGroup', label: 'Blood Group' },
                      { key: 'showPhone', label: 'Parent Phone' },
                      { key: 'showSubject', label: 'Subject Note' },
                      { key: 'showCustomField', label: 'Custom Line (House)' },
                      { key: 'showTextStroke', label: 'Text Shadow Stroke' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(customization[key as keyof SlipCustomization])}
                          onChange={(e) =>
                            setCustomization((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                          className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-[11px]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition"
                  >
                    ← Back to Details
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-950/40"
                  >
                    Next: Arrange on A4 →
                  </button>
                </div>
              </div>

              {/* Right 5 Cols: Live Preview */}
              <div className="lg:col-span-5 sticky top-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Style Preview</span>
                  </h3>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                    {renderSingleSlip(currentStudent)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: A4 PAGE LAYOUT & ARRANGEMENT */}
        {activeStep === 3 && (
          <div className="space-y-6 print:hidden">
            {/* Size Selector Cards */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Select Label Slip Size on A4 Sheet</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['small', 'medium', 'large'] as SlipSizeId[]).map((szKey) => {
                  const spec = SLIP_SIZE_SPECS[szKey]
                  const isSelected = customization.slipSize === szKey
                  return (
                    <div
                      key={szKey}
                      onClick={() => setCustomization((prev) => ({ ...prev, slipSize: szKey }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-white">{spec.name}</h4>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{spec.subtitle}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300">
                        {spec.cols} cols × {spec.rows} rows
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Cutting Guidelines Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showCutGuides}
                    onChange={(e) =>
                      setCustomization((prev) => ({ ...prev, showCutGuides: e.target.checked }))
                    }
                    className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Show dashed scissors cutting guidelines</span>
                </label>
                <Scissors className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Layout Overview Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>A4 Print Layout:</strong> {a4Layout.slipsPerPage} slips per sheet • {a4Layout.totalSlips} total slips • {a4Layout.totalPages} page(s)
                </span>
              </div>
              <button
                onClick={() => setActiveStep(4)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Proceed to Print / Download</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRINT & DOWNLOAD (Also used as the actual print target) */}
        {(activeStep === 4 || activeStep === 3) && (
          <div className="space-y-6">
            {/* Action Bar (Hidden during print) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>A4 Print & Export Engine</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Page {activePreviewPage} of {a4Layout.totalPages} ({a4Layout.totalSlips} total slips)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleDirectPrint}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition hover:scale-105 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.labels.printButton}</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-950/50 transition hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Exporting...' : t.labels.downloadPdf}</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{t.labels.downloadPng}</span>
                </button>
              </div>
            </div>

            {/* Pagination Controls (if multiple pages) */}
            {a4Layout.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 print:hidden">
                <button
                  onClick={() => setActivePreviewPage((prev) => Math.max(1, prev - 1))}
                  disabled={activePreviewPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition"
                >
                  ← Previous Page
                </button>
                <span className="text-xs font-semibold text-slate-300">
                  Page {activePreviewPage} of {a4Layout.totalPages}
                </span>
                <button
                  onClick={() => setActivePreviewPage((prev) => Math.min(a4Layout.totalPages, prev + 1))}
                  disabled={activePreviewPage === a4Layout.totalPages}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition"
                >
                  Next Page →
                </button>
              </div>
            )}

            {/* A4 Sheet Container (Interactive preview on screen + exact A4 print target) */}
            <div
              ref={printAreaRef}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl mx-auto print:p-0 print:m-0 print:shadow-none print:w-full print:rounded-none max-w-[850px]"
              style={{
                aspectRatio: '210 / 297',
                minHeight: '840px'
              }}
            >
              {/* Cutting Header (Hidden during final print or optional) */}
              <div className="text-center text-[10px] text-slate-400 font-mono tracking-widest pb-3 border-b border-dashed border-slate-300 print:hidden flex items-center justify-between">
                <span>✂ CUT ALONG DASHED MARGINS</span>
                <span>INDIATOOLS NAME SLIP MAKER • 300 DPI READY</span>
                <span>A4 SHEET</span>
              </div>

              {/* Dynamic Grid Layout */}
              <div
                className="grid gap-3 pt-4"
                style={{
                  gridTemplateColumns: `repeat(${a4Layout.columnsPerPage}, minmax(0, 1fr))`
                }}
              >
                {pageSlips.map((item) => (
                  <div key={item.globalIndex} className="relative group">
                    {/* Rendered Slip Card */}
                    {renderSingleSlip(item.student, true, String(item.globalIndex))}

                    {/* Cutting guideline box */}
                    {customization.showCutGuides && (
                      <div className="absolute inset-0 pointer-events-none border border-dashed border-slate-300 rounded-xl m-[-2px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CROP & ZOOM MODAL */}
        <AnimatePresence>
          {editingPhotoId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-emerald-400" />
                    <span>{t.labels.cropZoom}</span>
                  </h3>
                  <button
                    onClick={() => setEditingPhotoId(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {(() => {
                  const targetPhoto = photos.find((p) => p.id === editingPhotoId)
                  if (!targetPhoto) return null

                  return (
                    <div className="space-y-4">
                      {/* Interactive Preview Container */}
                      <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 relative flex items-center justify-center">
                        <img
                          src={
                            targetPhoto.useBgRemoved && targetPhoto.processedDataUrl
                              ? targetPhoto.processedDataUrl
                              : targetPhoto.originalDataUrl
                          }
                          alt="Crop preview"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scale(${targetPhoto.cropZoom}) translate(${targetPhoto.cropPanX}%, ${targetPhoto.cropPanY}%)`
                          }}
                        />
                      </div>

                      {/* Zoom Slider */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Zoom: {Math.round(targetPhoto.cropZoom * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={targetPhoto.cropZoom}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value)
                            setPhotos((prev) =>
                              prev.map((p) => (p.id === editingPhotoId ? { ...p, cropZoom: val } : p))
                            )
                          }}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      {/* Pan X Slider */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Pan Horizontal: {targetPhoto.cropPanX}%</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          step="1"
                          value={targetPhoto.cropPanX}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            setPhotos((prev) =>
                              prev.map((p) => (p.id === editingPhotoId ? { ...p, cropPanX: val } : p))
                            )
                          }}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      {/* Pan Y Slider */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Pan Vertical: {targetPhoto.cropPanY}%</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          step="1"
                          value={targetPhoto.cropPanY}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            setPhotos((prev) =>
                              prev.map((p) => (p.id === editingPhotoId ? { ...p, cropPanY: val } : p))
                            )
                          }}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      {/* Shape Option */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          {t.labels.shape}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['circle', 'rounded', 'square'] as PhotoShape[]).map((shp) => (
                            <button
                              key={shp}
                              onClick={() => {
                                setPhotos((prev) =>
                                  prev.map((p) => (p.id === editingPhotoId ? { ...p, shape: shp } : p))
                                )
                              }}
                              className={`py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                                targetPhoto.shape === shp
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {shp}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingPhotoId(null)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition mt-2"
                      >
                        Done & Apply
                      </button>
                    </div>
                  )
                })()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Informational SEO Content & FAQs */}
        <div className="mt-12 space-y-8 border-t border-slate-800 pt-8 print:hidden">
          {/* How It Works Explainer */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              How to Create and Print School Name Slips in 4 Easy Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-slate-400">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-emerald-400 font-semibold mb-1">
                  1. Enter Student Data
                </strong>
                Type student name, class, school, roll number, and blood group in English or any of the 22 Indian regional languages.
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-purple-400 font-semibold mb-1">
                  2. Upload & Cut Photo
                </strong>
                Upload child photos and click &quot;AI BG&quot; for instant transparent background cutouts done privately in your browser.
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-cyan-400 font-semibold mb-1">
                  3. Pick 12+ Themes
                </strong>
                Choose cute space, dino, rainbow unicorn, superhero, sports, or academic styles with custom color palettes.
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <strong className="block text-amber-400 font-semibold mb-1">
                  4. Direct A4 Print
                </strong>
                Click Direct Print or Download PDF to generate clean sheets with scissor cut guides ready for notebooks.
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-4">
              {t.faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-800/80 pb-3 last:border-b-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Disclaimer Notice */}
          <div className="text-center text-[11px] text-slate-500 py-4 space-y-1">
            <p>{t.labels.privacyBadge}</p>
            <p>{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

export default NameSlipMakerTool
