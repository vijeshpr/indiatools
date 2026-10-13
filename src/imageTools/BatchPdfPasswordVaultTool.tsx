import React, { useState, useId } from 'react'
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  FileCheck2,
  AlertCircle,
  FileArchive,
  RefreshCw,
  Cpu,
  BookOpen,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  VaultMode,
  EncryptOptions,
  UnlockOptions,
  DEFAULT_PERMISSIONS,
} from '../lib/pdfVault/types'
import { usePdfBatch } from '../lib/pdfVault/usePdfBatch'
import { createBatchZipBundle, triggerFileDownload } from '../lib/pdfVault/zipService'

import { ModeSwitcher } from './pdfVault/ModeSwitcher'
import { PdfDropZone } from './pdfVault/PdfDropZone'
import { EncryptionControls } from './pdfVault/EncryptionControls'
import { PermissionControls } from './pdfVault/PermissionControls'
import { UnlockControls } from './pdfVault/UnlockControls'
import { PdfQueueList } from './pdfVault/PdfQueueList'
import { ProgressModal } from './pdfVault/ProgressModal'
import { SecurityNotice } from './pdfVault/SecurityNotice'

export const BatchPdfPasswordVaultTool: React.FC = () => {
  const tool = getToolBySlug('batch-pdf-password-vault')
  const { showToast } = useToast()

  const [mode, setMode] = useState<VaultMode>('encrypt')
  const [encryptOptions, setEncryptOptions] = useState<EncryptOptions>({
    userPassword: '',
    ownerPassword: '',
    keyLength: 256,
    permissions: DEFAULT_PERMISSIONS,
  })
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [unlockOptions, setUnlockOptions] = useState<UnlockOptions>({
    password: '',
  })
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isPackagingZip, setIsPackagingZip] = useState<boolean>(false)

  const {
    queue,
    isProcessing,
    summary,
    addFiles,
    removeItem,
    clearQueue,
    startBatch,
    cancelProcessing,
    downloadSingle,
  } = usePdfBatch()

  // Handle batch processing invocation
  const handleStartBatch = async () => {
    if (queue.length === 0) {
      showToast('Please upload or generate at least one PDF file.', 'error')
      return
    }

    if (mode === 'encrypt') {
      if (!encryptOptions.userPassword) {
        showToast('Please enter a document open password.', 'error')
        return
      }
      if (encryptOptions.userPassword !== confirmPassword) {
        showToast('Open passwords do not match. Please verify confirmation.', 'error')
        return
      }
    } else {
      if (!unlockOptions.password) {
        showToast('Please enter the password to decrypt queued files.', 'error')
        return
      }
    }

    setIsModalOpen(true)
    try {
      const options = mode === 'encrypt' ? encryptOptions : unlockOptions
      await startBatch(mode, options)
      showToast(
        `Batch ${mode === 'encrypt' ? 'encryption' : 'decryption'} completed!`,
        'success'
      )
    } catch (err: any) {
      showToast(err?.message || 'Batch execution encountered an error.', 'error')
    }
  }

  // Handle batch ZIP download
  const handleDownloadAllZip = async () => {
    if (summary.success === 0) {
      showToast('No successfully processed documents available to bundle.', 'error')
      return
    }

    try {
      setIsPackagingZip(true)
      const zipBlob = await createBatchZipBundle(queue, mode)
      const zipName =
        mode === 'encrypt'
          ? `IndiaTools_Encrypted_PDFs_${Date.now()}.zip`
          : `IndiaTools_Decrypted_PDFs_${Date.now()}.zip`
      triggerFileDownload(zipBlob, zipName)
      showToast(`Downloaded ZIP bundle containing ${summary.success} files.`, 'success')
    } catch (err: any) {
      showToast(`Failed to create ZIP: ${err?.message || 'Unknown error'}`, 'error')
    } finally {
      setIsPackagingZip(false)
    }
  }

  // Validation rules for CTA button
  const isEncryptValid =
    mode === 'encrypt' &&
    encryptOptions.userPassword.length > 0 &&
    encryptOptions.userPassword === confirmPassword &&
    queue.length > 0
  const isUnlockValid =
    mode === 'unlock' && unlockOptions.password.length > 0 && queue.length > 0
  const canExecute = (isEncryptValid || isUnlockValid) && !isProcessing

  if (!tool) {
    return null
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-8">
        {/* HERO BADGE & OVERVIEW */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                <Cpu className="h-3.5 w-3.5" />
                <span>QPDF 12.3.2 WebAssembly Engine</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Batch PDF Password Vault & Permissions Manager
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
                Protect sensitive business contracts, financial statements, and personal records with genuine <strong>AES-256 / AES-128</strong> PDF encryption. Enforce granular printing, copying, and annotation permissions, or batch-decrypt files locally with zero file uploads.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">100% Client-Side Cryptography</div>
                <div className="text-[11px] text-slate-400">0 KB sent over the network</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ModeSwitcher mode={mode} onChange={setMode} disabled={isProcessing} />
          </div>
        </div>

        {/* DRAG AND DROP ZONE */}
        <PdfDropZone onFilesSelected={addFiles} disabled={isProcessing} fileCount={queue.length} />

        {/* SECURITY & PERMISSIONS CONTROLS */}
        <div className="grid grid-cols-1 gap-6">
          {mode === 'encrypt' ? (
            <>
              <EncryptionControls
                options={encryptOptions}
                onChange={setEncryptOptions}
                confirmPassword={confirmPassword}
                onConfirmPasswordChange={setConfirmPassword}
                disabled={isProcessing}
              />
              <PermissionControls
                permissions={encryptOptions.permissions}
                onChange={(perms) =>
                  setEncryptOptions((prev) => ({ ...prev, permissions: perms }))
                }
                disabled={isProcessing}
              />
            </>
          ) : (
            <UnlockControls
              options={unlockOptions}
              onChange={setUnlockOptions}
              disabled={isProcessing}
            />
          )}
        </div>

        {/* MAIN BATCH ACTION BAR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>
                    Ready to Encrypt {queue.length} PDF{queue.length === 1 ? '' : 's'}
                  </span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 text-emerald-400" />
                  <span>
                    Ready to Decrypt {queue.length} PDF{queue.length === 1 ? '' : 's'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {queue.length === 0
                ? 'Add PDF files above to begin batch processing.'
                : mode === 'encrypt'
                ? !encryptOptions.userPassword
                  ? 'Enter document open password above.'
                  : encryptOptions.userPassword !== confirmPassword
                  ? 'Passwords must match to enable processing.'
                  : `Using AES-${encryptOptions.keyLength} cryptographic cipher with active permission rules.`
                : !unlockOptions.password
                ? 'Enter decryption password above.'
                : 'Ready to strip password and permission restrictions.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canExecute}
              onClick={handleStartBatch}
              className={`inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                mode === 'encrypt'
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-500/20'
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-emerald-500/20'
              }`}
            >
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Encrypt Batch (AES-{encryptOptions.keyLength})</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Unlock & Decrypt Batch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QUEUE LIST & STATUS */}
        <PdfQueueList
          queue={queue}
          onRemove={removeItem}
          onClear={clearQueue}
          onDownloadSingle={downloadSingle}
          onDownloadZip={handleDownloadAllZip}
          isProcessing={isProcessing}
          isPackagingZip={isPackagingZip}
        />

        {/* PROGRESS MODAL */}
        <ProgressModal
          isOpen={isModalOpen}
          mode={mode}
          summary={summary}
          onCancel={cancelProcessing}
          onClose={() => setIsModalOpen(false)}
          onDownloadZip={handleDownloadAllZip}
        />

        {/* ZERO-KNOWLEDGE ARCHITECTURE NOTICE */}
        <SecurityNotice />

        {/* IN-DEPTH EDUCATIONAL GUIDE & TECHNICAL DOCUMENTATION */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-8 backdrop-blur-xl">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Comprehensive Technical & Security Guide
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Everything you need to know about standard PDF encryption, permissions, and client-side cryptography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                <Shield className="h-4 w-4" />
                <span>AES-256 vs. AES-128</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>AES-256 (ISO 32000-2)</strong> is the global benchmark for sensitive document security. It uses a 256-bit symmetric key derived via SHA-256 with 32-byte salt and iterative key stretching. AES-128 is maintained for legacy backwards compatibility with PDF readers released prior to Adobe Acrobat 9.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                <Key className="h-4 w-4" />
                <span>User vs. Owner Password</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The <strong>User Password</strong> (Open Password) is required whenever anyone opens the document. The <strong>Owner Password</strong> (Permissions Password) controls access to security settings, allowing the owner to modify permissions or remove protection later without knowing the recipient's open password.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                <Cpu className="h-4 w-4" />
                <span>WebAssembly Sandbox</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike online converters that transmit confidential files to remote cloud servers, IndiaTools uses <strong>QPDF WebAssembly</strong>. The cryptographic operations run completely within your local device's CPU and RAM. No byte is ever transmitted across the internet.
              </p>
            </div>
          </div>

          {/* Compliance & Regulatory Use Cases */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-400" />
              Enterprise Privacy & Legal Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-200">Information Technology Act 2000</h4>
                <p className="text-slate-400 leading-relaxed">
                  Meets Indian statutory standards for data protection and secure handling of confidential digital records and sensitive personal data.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-200">Zero-Data Retention (GDPR)</h4>
                <p className="text-slate-400 leading-relaxed">
                  Because files are never uploaded to servers, no personal data processing, storage, or transmission occurs, guaranteeing compliance with Article 25.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-200">Banking & Financial Records</h4>
                <p className="text-slate-400 leading-relaxed">
                  Ideal for chartered accountants, businesses, and individuals locking or unlocking income tax returns (ITR), salary slips, and bank statements.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Step-by-Step Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong>Select Mode:</strong> Choose <em>“Encrypt & Protect”</em> to apply passwords and restrictions, or <em>“Unlock & Remove Password”</em> to decrypt protected PDFs.
              </li>
              <li>
                <strong>Add PDF Documents:</strong> Drag and drop single or multiple PDF files into the dropzone, or click the <em>“Generate Sample PDF”</em> button to test functionality immediately.
              </li>
              <li>
                <strong>Configure Security Parameters:</strong> In Encrypt mode, set a strong Open Password (or click <em>Auto-Generate</em>), select AES-256, and toggle printing, copying, or annotation permissions.
              </li>
              <li>
                <strong>Execute Batch Operation:</strong> Click the batch button. The in-browser WebAssembly engine processes files in an asynchronous worker pipeline.
              </li>
              <li>
                <strong>Save Output:</strong> Download documents individually or export all processed files together as a single ZIP bundle with a complete processing manifest.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
