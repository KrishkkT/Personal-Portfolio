"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimationUtils } from "@/lib/animation-utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    try {
      // Animate the button
      AnimationUtils.pulse(".back-to-top-button", {
        scale: [1, 1.2, 1],
        duration: 600,
        loop: false,
      }).catch(console.warn)

      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      console.warn("Scroll to top error:", error)
      // Fallback scroll
      window.scrollTo(0, 0)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      className="back-to-top-button fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
