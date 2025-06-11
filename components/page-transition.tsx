"use client"

import type React from "react"
import { useEffect } from "react"
import { simpleAnimationManager } from "@/lib/simple-animations"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    simpleAnimationManager.init()
  }, [])

  return (
    <div className="page-transition-wrapper">
      <div className="animate-on-load opacity-0">{children}</div>
    </div>
  )
}
