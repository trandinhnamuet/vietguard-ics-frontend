"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import { useLanguage } from "./language-provider"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onScan: () => void
}

export function FileUpload({ onFileSelect, onScan }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { t } = useLanguage()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith(".apk")) {
      setFile(droppedFile)
      onFileSelect(droppedFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith(".apk")) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  const handleRemove = () => {
    setFile(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragging ? "border-primary bg-primary/20" : "border-white/30 hover:border-primary/70 bg-white/5"
          }`}
        >
          <input type="file" accept=".apk" onChange={handleFileInput} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2 text-white">{t("home.upload")}</h3>
            <p className="text-white/80">{t("home.dragdrop")}</p>
          </label>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{file.name}</p>
                <p className="text-xs text-white/70">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={handleRemove} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onScan}
            className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/80 hover:shadow-lg transition-all"
          >
            {t("home.scan")}
          </button>
        </div>
      )}
    </div>
  )
}
