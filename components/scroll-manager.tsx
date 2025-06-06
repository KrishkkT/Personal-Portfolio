"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Immediate scroll to top on any route change
    const scrollToTop = () => {
      if (typeof window !== "undefined") {
        // Multiple methods to ensure scroll to top works
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // Force using requestAnimationFrame for better reliability
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        })
      }
    }

    scrollToTop()
  }, [pathname])

  useEffect(() => {
    // Global scroll restoration settings
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual"

      // Override any existing scroll behavior
      const originalScrollTo = window.scrollTo
      window.scrollTo = function (x, y) {
        if (arguments.length === 1 && typeof x === "object") {
          originalScrollTo.call(this, { ...x, behavior: "auto" })
        } else {
          originalScrollTo.call(this, x || 0, y || 0)
        }
      }
    }
  }, [])

  return null
}
