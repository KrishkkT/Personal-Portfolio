"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Preloader from "@/components/preloader"
import CustomCursor from "@/components/custom-cursor"
import ErrorBoundary from "@/components/error-boundary"
import BackToTop from "@/components/back-to-top"
import ScrollManager from "@/components/scroll-manager"

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Immediate scroll to top before anything else
    if (typeof window !== "undefined") {
      // Disable scroll restoration
      window.history.scrollRestoration = "manual"

      // Force scroll to top immediately
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Set CSS to prevent any scrolling during load
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
    }

    setMounted(true)

    const timer = setTimeout(() => {
      setLoading(false)

      // Re-enable scrolling after loading
      if (typeof window !== "undefined") {
        document.documentElement.style.overflow = ""
        document.body.style.overflow = ""

        // Final scroll to top
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
    }, 2500)

    return () => {
      clearTimeout(timer)
      // Clean up overflow styles
      if (typeof window !== "undefined") {
        document.documentElement.style.overflow = ""
        document.body.style.overflow = ""
      }
    }
  }, [])

  // Prevent any hash-based scrolling
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      // Remove any hash from URL
      if (window.location.hash) {
        const newUrl = window.location.pathname + window.location.search
        window.history.replaceState(null, "", newUrl)
      }

      // Override hash change behavior
      const handleHashChange = (e: HashChangeEvent) => {
        e.preventDefault()
        window.scrollTo(0, 0)
        return false
      }

      window.addEventListener("hashchange", handleHashChange)
      return () => window.removeEventListener("hashchange", handleHashChange)
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return <Preloader />
  }

  return (
    <ErrorBoundary>
      <ScrollManager />
      <main className="min-h-screen">
        <CustomCursor />
        {children}
        <BackToTop />
      </main>
    </ErrorBoundary>
  )
}
