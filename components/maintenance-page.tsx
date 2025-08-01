"use client"

import { useState, useEffect } from "react"
import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Wrench className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
          <div className="absolute top-1/2 -left-4 w-1 h-1 bg-white rounded-full animate-ping opacity-50 animation-delay-500"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Reboot in progress...</h1>

          <div className="text-xl md:text-2xl text-blue-200 mb-8">Loading Something better{dots}</div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Contact me at{" "}
            <a
              href="mailto:kjthakker8@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              kjthakker8@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-ping"></div>
      </div>
    </div>
  )
}
