"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { AnimationUtils } from "@/lib/animation-utils"

interface PageTransitionWrapperProps {
  children: React.ReactNode
  namespace?: string
}

export default function PageTransitionWrapper({ children, namespace = "default" }: PageTransitionWrapperProps) {
  useEffect(() => {
    // Initialize page animations
    const timer = setTimeout(() => {
      AnimationUtils.fadeIn(".page-content", { delay: 200 })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="page-content"
      data-namespace={namespace}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}
