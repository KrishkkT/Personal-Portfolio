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
    AnimationUtils.pulse(".back-to-top-button", {
      scale: [1, 1.2, 1],
      duration: 600,
      loop: false,
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <div className={`back-to-top ${isVisible ? "visible" : ""}`}>
      <Button
        onClick={scrollToTop}
        size="icon"
        className="back-to-top-button h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5 text-background" />
      </Button>
    </div>
  )
}
