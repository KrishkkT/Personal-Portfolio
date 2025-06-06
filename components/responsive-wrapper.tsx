"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveWrapper({ children, className = "" }: ResponsiveWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <div className={`w-full overflow-x-hidden ${className}`}>{children}</div>
}
