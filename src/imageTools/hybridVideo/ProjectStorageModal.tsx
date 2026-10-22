import React, { useRef } from 'react'
import { X, Save, Upload, Trash2, FolderOpen } from 'lucide-react'
import type { HybridVideoProject } from '../../lib/hybridVideo/types.ts'
import { saveProjectToJson, parseProjectJson } from '../../lib/hybridVideo/projectState.ts'

interface ProjectStorageModalProps {
  isOpen: boolean
  onClose: () => void
  project: HybridVideoProject
  onLoadProject: (loadedProject: HybridVideoProject) => void
  onNewProject: () => void
}

export const ProjectStorageModal: React.FC<ProjectStorageModalProps> = ({
  isOpen,
  onClose,
  project,
  onLoadProject,
  onNewProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDownloadProjectJson = () => {
    const jsonStr = saveProjectToJson(project)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const cleanName = project.settings.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    a.download = `${cleanName || 'video_project'}.indiatools-project.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = parseProjectJson(text)
        onLoadProject(parsed)
        onClose()
      } catch (err) {
        alert(`Failed to load project file: ${(err as Error).message}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0F131D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Project Manager</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {/* Save / Export JSON */}
          <button
            type="button"
            onClick={handleDownloadProjectJson}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Save Project File</div>
              <div className="text-[10px] text-white/50">Download project schema as .json to disk</div>
            </div>
          </button>

          {/* Load / Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImportFile(e.target.files[0])
                }
              }}
            />
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Open Project File</div>
              <div className="text-[10px] text-white/50">Restore timeline, tracks, and text from .json</div>
            </div>
          </button>

          {/* New / Reset Project */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Create a new project? Any unsaved edits will be cleared.')) {
                onNewProject()
                onClose()
              }
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-left transition-all group"
          >
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-red-300">
                New Blank Project
              </div>
              <div className="text-[10px] text-white/50">Clear timeline and create fresh project</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
