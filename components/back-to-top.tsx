"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { AnimationUtils } from "@/lib/animation-utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

    // Add a pulse animation when clicked
    try {
      AnimationUtils.pulse(".back-to-top-button", {
        scale: [1, 1.2, 1],
        duration: 600,
        loop: false,
      })
    } catch (error) {
      console.log("Animation not available:", error)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="back-to-top-button h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5 text-primary-foreground" />
      </Button>
    </div>
  )
}
