"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "Enter image URL or upload a file",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)")
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
      setUrlInput(data.url)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleUrlChange = (url: string) => {
    setUrlInput(url)
    onChange(url)
  }

  const clearImage = () => {
    onChange("")
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-gray-300">{label}</Label>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="bg-gray-800/50 border-gray-700 text-white flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
            className="border-red-400/30 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-yellow-400 bg-yellow-400/5" : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <CardContent className="p-6">
          <div className="text-center" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
                  <p className="text-gray-300">Uploading image...</p>
                </motion.div>
              ) : value ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-4"
                >
                  <div className="relative w-full max-w-sm mx-auto">
                    <Image
                      src={value || "/placeholder.svg"}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </div>
                  <p className="text-sm text-gray-400">Image loaded successfully</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-800/50 rounded-full">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300">Drag and drop an image here, or click to select</p>
                    <p className="text-sm text-gray-500">Supports JPEG, PNG, WebP, GIF (max 5MB)</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
