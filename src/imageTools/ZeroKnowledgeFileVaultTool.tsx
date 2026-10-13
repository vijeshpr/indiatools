import React, { useState } from 'react'
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  FileCheck2,
  AlertCircle,
  FileArchive,
  Cpu,
  BookOpen,
  HelpCircle,
  Sparkles,
  Zap,
  HardDrive,
  EyeOff,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  VaultMode,
  EncryptConfig,
  DecryptConfig,
} from '../lib/fileVault/types'
import { useVaultQueue } from '../lib/fileVault/useVaultQueue'

import { VaultModeSwitcher } from './fileVault/VaultModeSwitcher'
import { VaultDropZone } from './fileVault/VaultDropZone'
import { VaultConfigPanel } from './fileVault/VaultConfigPanel'
import { VaultProcessingHUD } from './fileVault/VaultProcessingHUD'
import { VaultQueueList } from './fileVault/VaultQueueList'
import { VaultSecurityAudit } from './fileVault/VaultSecurityAudit'

export const ZeroKnowledgeFileVaultTool: React.FC = () => {
  const tool = getToolBySlug('zero-knowledge-file-vault')
  const { showToast } = useToast()

  const [mode, setMode] = useState<VaultMode>('encrypt')
  const [encryptConfig, setEncryptConfig] = useState<EncryptConfig>({
    password: '',
    confirmPassword: '',
    hint: '',
  })
  const [decryptConfig, setDecryptConfig] = useState<DecryptConfig>({
    password: '',
  })

  const {
    queue,
    isProcessing,
    currentProgress,
    summary,
    addFiles,
    removeItem,
    clearQueue,
    startBatch,
    cancelProcessing,
    downloadItem,
    downloadAllZip,
  } = useVaultQueue()

  // Handle batch trigger
  const handleStartBatch = async () => {
    if (queue.length === 0) {
      showToast('Please select or generate at least one file to process.', 'error')
      return
    }

    if (mode === 'encrypt') {
      if (!encryptConfig.password) {
        showToast('Please specify a master passphrase to armor your files.', 'error')
        return
      }
      if (encryptConfig.password !== encryptConfig.confirmPassword) {
        showToast('Passphrases do not match. Please verify confirmation.', 'error')
        return
      }
    } else {
      if (!decryptConfig.password) {
        showToast('Please enter the decryption passphrase to unlock the container.', 'error')
        return
      }
    }

    try {
      const config = mode === 'encrypt' ? encryptConfig : decryptConfig
      await startBatch(mode, config)
      showToast(
        `Batch ${mode === 'encrypt' ? 'encryption' : 'decryption'} sequence completed!`,
        'success'
      )
    } catch (err: any) {
      showToast(err?.message || 'Batch execution encountered an error.', 'error')
    }
  }

  // Validation rules for Action Button
  const isEncryptValid =
    mode === 'encrypt' &&
    encryptConfig.password.length > 0 &&
    encryptConfig.password === encryptConfig.confirmPassword &&
    queue.length > 0
  const isDecryptValid =
    mode === 'decrypt' && decryptConfig.password.length > 0 && queue.length > 0
  const canExecute = (isEncryptValid || isDecryptValid) && !isProcessing

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
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                <Cpu className="h-3.5 w-3.5" />
                <span>Native Web Crypto AES-256-GCM Pipeline</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Zero-Knowledge Military File Encrypter & Decrypter
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
                Armor arbitrary documents, photos, databases, archives, and binaries with genuine{' '}
                <strong>AES-256-GCM authenticated encryption</strong> and PBKDF2-HMAC-SHA256 (250,000 rounds).
                Executed 100% locally in your browser memory with zero file uploads or cloud exposure.
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">Zero-Knowledge Guarantee</div>
                <div className="text-[11px] text-slate-400 font-mono">0 KB sent over internet</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <VaultModeSwitcher mode={mode} onChange={setMode} disabled={isProcessing} />
          </div>
        </div>

        {/* DRAG AND DROP ZONE */}
        <VaultDropZone
          mode={mode}
          onFilesSelected={addFiles}
          disabled={isProcessing}
          fileCount={queue.length}
        />

        {/* CONFIGURATION PANEL */}
        <VaultConfigPanel
          mode={mode}
          encryptConfig={encryptConfig}
          decryptConfig={decryptConfig}
          onEncryptConfigChange={setEncryptConfig}
          onDecryptConfigChange={setDecryptConfig}
          disabled={isProcessing}
        />

        {/* MAIN BATCH ACTION CTA BAR */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-4 w-4 text-cyan-400" />
                  <span>
                    Ready to Armor {queue.length} File{queue.length === 1 ? '' : 's'} with AES-256-GCM
                  </span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 text-emerald-400" />
                  <span>
                    Ready to Authenticate & Decrypt {queue.length} Container{queue.length === 1 ? '' : 's'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {queue.length === 0
                ? 'Drop files above to stage them for cryptographic processing.'
                : mode === 'encrypt'
                ? !encryptConfig.password
                  ? 'Enter master passphrase above.'
                  : encryptConfig.password !== encryptConfig.confirmPassword
                  ? 'Passphrases must match before encryption.'
                  : 'Derived 256-bit AES key will authenticate every 4 MiB streaming chunk.'
                : !decryptConfig.password
                ? 'Enter container passphrase above.'
                : 'All chunks and cumulative manifest will be verified before releasing output.'}
            </p>
          </div>

          <div>
            <button
              type="button"
              disabled={!canExecute}
              onClick={handleStartBatch}
              className={`inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer ${
                mode === 'encrypt'
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-cyan-500/25'
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-emerald-500/25'
              }`}
            >
              {mode === 'encrypt' ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Encrypt & Armor Batch</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Authenticate & Decrypt Batch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* REAL-TIME TELEMETRY HUD */}
        <VaultProcessingHUD
          mode={mode}
          isProcessing={isProcessing}
          currentProgress={currentProgress}
          onCancel={cancelProcessing}
        />

        {/* QUEUE LIST & DOWNLOADS */}
        <VaultQueueList
          queue={queue}
          mode={mode}
          onRemoveItem={removeItem}
          onClearQueue={clearQueue}
          onDownloadItem={downloadItem}
          onDownloadAllZip={downloadAllZip}
          isProcessing={isProcessing}
        />

        {/* ZERO-KNOWLEDGE SECURITY & PRIVACY SPECIFICATION */}
        <VaultSecurityAudit />

        {/* COMPREHENSIVE TECHNICAL DOCUMENTATION & SEO GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-8 backdrop-blur-xl">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Comprehensive Technical & Cryptographic Architecture Guide
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              An exhaustive architectural review of AES-256-GCM, chunked container streaming, and browser zero-trust privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                <Shield className="h-4 w-4" />
                <span>AES-256-GCM Authenticated Cipher</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Galois/Counter Mode (GCM) provides simultaneous confidentiality and cryptographic integrity verification. Every encrypted block produces a 128-bit authentication tag. If even a single bit is modified, flipped, or truncated, the entire block is rejected before decryption.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                <Key className="h-4 w-4" />
                <span>PBKDF2-HMAC-SHA256 (250,000 Rounds)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Passwords are never used directly as encryption keys. Instead, PBKDF2 iterates 250,000 rounds of HMAC-SHA256 combined with a fresh 16-byte cryptographic salt. This computationally intensive stretching defends against brute-force and GPU rainbow table attacks.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                <Cpu className="h-4 w-4" />
                <span>Chunked Streaming Architecture</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standard Web Crypto does not support streaming unlimited multi-gigabyte files in a single AES-GCM call. Our tool partitions large files into bounded 4 MiB chunks with unique sequential nonces and domain-separated AAD, ensuring stable browser memory consumption.
              </p>
            </div>
          </div>

          {/* Technical Container Specification */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-4 font-mono text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-cyan-400" />
              Binary .vault Container Frame Layout
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 pr-4">Byte Offset</th>
                    <th className="py-2 pr-4">Field Name</th>
                    <th className="py-2 pr-4">Type / Width</th>
                    <th className="py-2">Cryptographic Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">0x00 .. 0x07</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Magic Identifier</td>
                    <td className="py-2 pr-4">8 Bytes ASCII</td>
                    <td className="py-2">Fixed magic bytes (`ZKVAULT1`) verifying authentic file format</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">0x08 .. 0x09</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Format Version</td>
                    <td className="py-2 pr-4">uint16 (Big-Endian)</td>
                    <td className="py-2">Specifies format version (Version 1) for forward compatibility</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">0x0A .. 0x0E</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">KDF Algorithm & Rounds</td>
                    <td className="py-2 pr-4">uint8 + uint32 BE</td>
                    <td className="py-2">PBKDF2-HMAC-SHA256 with 250,000 iterative key-stretching rounds</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">0x0F .. 0x27</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Salt & Nonce Prefix</td>
                    <td className="py-2 pr-4">16B Salt + 8B Nonce</td>
                    <td className="py-2">CSPRNG randomness ensuring unique derived keys and per-chunk nonces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">0x28 .. 0x2F</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Chunk Size & Meta Len</td>
                    <td className="py-2 pr-4">2x uint32 (Big-Endian)</td>
                    <td className="py-2">Specifies 4 MiB chunk boundary and length of JSON metadata header</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">Payload Records</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Authenticated Chunks</td>
                    <td className="py-2 pr-4">Sequential Frames</td>
                    <td className="py-2">Chunk Index + Ciphertext Length + AES-GCM Ciphertext + 16B Tag</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400">Final Record</td>
                    <td className="py-2 pr-4 font-bold text-slate-200">Final Manifest Record</td>
                    <td className="py-2 pr-4">Index 0xFFFFFFFF</td>
                    <td className="py-2">Authenticated total chunk count, byte size, and cumulative SHA-256</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Step-by-Step Operating Workflow</h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong>Select Vault Mode:</strong> Choose <em>“Encrypt & Armor”</em> to lock arbitrary files into a `.vault` container, or <em>“Authenticate & Decrypt”</em> to restore original files from `.vault` or `.enc` archives.
              </li>
              <li>
                <strong>Supply Master Passphrase:</strong> In Encrypt mode, set a strong passphrase (or click <em>Auto-Generate</em> for a 20-character CSPRNG key) and re-enter to confirm.
              </li>
              <li>
                <strong>Stage Your Files:</strong> Drag and drop any document, image, database, video, or archive into the workspace, or click <em>Load Sample Test File</em> to verify the pipeline immediately.
              </li>
              <li>
                <strong>Execute In-Browser Encryption:</strong> Click the batch button. The Web Crypto worker stream-encrypts each 4 MiB chunk, assigns unique nonces, and binds cryptographic metadata.
              </li>
              <li>
                <strong>Download Secure Outputs:</strong> Download armored `.vault` containers individually or export all processed files together as a single ZIP archive.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
