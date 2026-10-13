import React from 'react'
import {
  Printer,
  Copy,
  Edit3,
  MessageSquare,
  ShieldAlert,
  Check,
  X,
  FileCheck2,
} from 'lucide-react'
import { PdfPermissionsConfig } from '../../lib/pdfVault/types'

interface PermissionControlsProps {
  permissions: PdfPermissionsConfig
  onChange: (permissions: PdfPermissionsConfig) => void
  disabled?: boolean
}

export const PermissionControls: React.FC<PermissionControlsProps> = ({
  permissions,
  onChange,
  disabled = false,
}) => {
  const updatePermission = <K extends keyof PdfPermissionsConfig>(
    key: K,
    val: PdfPermissionsConfig[K]
  ) => {
    onChange({
      ...permissions,
      [key]: val,
    })
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Granular Document Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Enforce standard PDF permission flags encoded into document metadata dictionary
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Printing Control */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">Printing Permissions</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Control whether users and PDF viewers can output this document to physical or virtual printers.
          </p>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowPrinting', 'none')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowPrinting === 'none'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Block Printing
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowPrinting', 'low')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowPrinting === 'low'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Low-Res Only
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowPrinting', 'full')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowPrinting === 'full'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Full Quality
            </button>
          </div>
        </div>

        {/* Content Modification Control */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">Modification Permissions</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Prevent page reordering, text extraction, watermark tampering, or unauthorized editing.
          </p>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowModifying', 'none')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowModifying === 'none'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Read-Only
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowModifying', 'annotate')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowModifying === 'annotate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Fill / Annotate
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => updatePermission('allowModifying', 'all')}
              className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                permissions.allowModifying === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Full Editing
            </button>
          </div>
        </div>

        {/* Copying & Text Extraction Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Allow Copying & Extraction
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Permit copying text, images, and content to clipboard or third-party OCR tools.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={permissions.allowCopying}
            disabled={disabled}
            onClick={() => updatePermission('allowCopying', !permissions.allowCopying)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              permissions.allowCopying ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                permissions.allowCopying ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Annotations & Form Signing Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Allow Comments & Forms
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Permit recipients to highlight text, place digital signatures, and fill form fields.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={permissions.allowAnnotations}
            disabled={disabled}
            onClick={() => updatePermission('allowAnnotations', !permissions.allowAnnotations)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              permissions.allowAnnotations ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                permissions.allowAnnotations ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Permissions Summary Badge Strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-[11px]">
        <FileCheck2 className="h-4 w-4 text-slate-400" />
        <span className="font-medium text-slate-300">Effective Security Policy:</span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
            permissions.allowPrinting === 'none'
              ? 'bg-rose-500/10 text-rose-400'
              : 'bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {permissions.allowPrinting === 'none' ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          Printing: {permissions.allowPrinting}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
            !permissions.allowCopying
              ? 'bg-rose-500/10 text-rose-400'
              : 'bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {!permissions.allowCopying ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          Copying: {permissions.allowCopying ? 'Allowed' : 'Blocked'}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
            permissions.allowModifying === 'none'
              ? 'bg-rose-500/10 text-rose-400'
              : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          Modifying: {permissions.allowModifying}
        </span>
      </div>
    </div>
  )
}
